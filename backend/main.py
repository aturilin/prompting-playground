"""
Prompting Playground - FastAPI Backend
"""

import os
import json
import httpx
import yaml
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="Prompting Playground")

# Serve static files (built React app)
STATIC_DIR = Path(__file__).parent.parent / "static"
if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# --- Models ---

class RunRequest(BaseModel):
    prompt: str
    models: list[str]


class SavedTest(BaseModel):
    id: str
    name: str
    prompt: str
    models: list[str]
    results: list[dict]
    created_at: str


class Evaluation(BaseModel):
    id: str
    test_id: str
    test_name: str
    prompt: str
    model: str
    response: str
    rating: int  # 1-5
    comment: str
    input_tokens: int
    output_tokens: int
    created_at: str  # ISO timestamp


# --- OpenRouter ---

def call_openrouter(model: str, prompt: str, max_tokens: int = 4096) -> dict:
    """Call OpenRouter API."""
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prompting-playground",
        "X-Title": "Prompting Playground"
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens
    }

    try:
        with httpx.Client(timeout=120.0) as client:
            response = client.post(url, headers=headers, json=payload)

            if response.status_code != 200:
                return {
                    "model": model,
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text[:200]}"
                }

            data = response.json()
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})

            return {
                "model": model,
                "success": True,
                "content": content,
                "input_tokens": usage.get("prompt_tokens", 0),
                "output_tokens": usage.get("completion_tokens", 0)
            }
    except Exception as e:
        return {
            "model": model,
            "success": False,
            "error": str(e)
        }


# --- Endpoints ---

@app.get("/api/models")
def list_models():
    """Get available models from OpenRouter."""
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.get(
                "https://openrouter.ai/api/v1/models",
                headers={"Authorization": f"Bearer {API_KEY}"}
            )
            data = response.json()
            models = []
            for m in data.get("data", [])[:50]:
                models.append({
                    "id": m["id"],
                    "context_length": m.get("context_length", 0),
                    "pricing": m.get("pricing", {})
                })
            return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/run")
def run_prompt(req: RunRequest):
    """Run prompt on multiple models."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    results = []
    for model in req.models:
        result = call_openrouter(model, req.prompt)
        results.append(result)

    return {"results": results}


@app.post("/api/run-stream")
def run_prompt_stream(req: RunRequest):
    """Run prompt on multiple models with streaming status updates."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    def generate():
        total = len(req.models)
        for i, model in enumerate(req.models):
            # Send status update
            status = {
                "type": "status",
                "current": i + 1,
                "total": total,
                "model": model,
                "message": f"Processing {model}..."
            }
            yield f"data: {json.dumps(status)}\n\n"

            # Call API
            result = call_openrouter(model, req.prompt)

            # Send result
            result["type"] = "result"
            yield f"data: {json.dumps(result)}\n\n"

        # Send done
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.get("/api/tests")
def get_tests():
    """Get saved tests from Supabase."""
    try:
        response = supabase.table("prompt_tests").select("*").order("created_at", desc=True).execute()
        return {"tests": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tests")
def save_test(test: SavedTest):
    """Save a test to Supabase."""
    try:
        data = {
            "id": test.id,
            "name": test.name,
            "prompt": test.prompt,
            "models": test.models,
            "results": test.results,
            "created_at": test.created_at
        }
        # Upsert - insert or update
        supabase.table("prompt_tests").upsert(data).execute()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/tests/{test_id}")
def delete_test(test_id: str):
    """Delete a test from Supabase."""
    try:
        supabase.table("prompt_tests").delete().eq("id", test_id).execute()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
def health():
    return {"status": "ok", "api_key_configured": bool(API_KEY), "supabase_configured": bool(SUPABASE_URL)}


# --- Templates ---

@app.get("/api/templates")
def get_templates():
    """Get all prompt templates."""
    templates = []
    if TEMPLATES_DIR.exists():
        for f in TEMPLATES_DIR.glob("*.yaml"):
            try:
                data = yaml.safe_load(f.read_text())
                templates.append({
                    "id": f.stem,
                    "name": data.get("name", f.stem),
                    "description": data.get("description", ""),
                    "template": data.get("template", "")
                })
            except Exception:
                pass
    return {"templates": templates}


# --- Evaluations ---

@app.get("/api/evaluations")
def get_evaluations():
    """Get all evaluations from Supabase."""
    try:
        response = supabase.table("prompt_evaluations").select("*").order("created_at", desc=True).execute()
        return {"evaluations": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/evaluations")
def save_evaluation(evaluation: Evaluation):
    """Save an evaluation to Supabase."""
    try:
        data = {
            "id": evaluation.id,
            "test_id": evaluation.test_id,
            "test_name": evaluation.test_name,
            "prompt": evaluation.prompt,
            "model": evaluation.model,
            "response": evaluation.response,
            "rating": evaluation.rating,
            "comment": evaluation.comment,
            "input_tokens": evaluation.input_tokens,
            "output_tokens": evaluation.output_tokens,
            "created_at": evaluation.created_at
        }
        # Upsert - insert or update
        supabase.table("prompt_evaluations").upsert(data).execute()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/evaluations/{evaluation_id}")
def delete_evaluation(evaluation_id: str):
    """Delete an evaluation from Supabase."""
    try:
        supabase.table("prompt_evaluations").delete().eq("id", evaluation_id).execute()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Handle favicon
@app.get("/favicon.ico")
def favicon():
    """Serve favicon."""
    favicon_file = STATIC_DIR / "favicon.jpg"
    if favicon_file.exists():
        return FileResponse(favicon_file, media_type="image/jpeg")
    from fastapi.responses import Response
    return Response(status_code=204)


# Serve React app for all non-API routes
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    """Serve React SPA."""
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"error": "Frontend not built. Run 'npm run build' in frontend/"}
