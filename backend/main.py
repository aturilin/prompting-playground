"""
Prompting Playground - FastAPI Backend
"""

import os
import json
import httpx
import uuid
import yaml
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

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

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

API_KEY = os.getenv("OPENROUTER_API_KEY", "")


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

def call_openrouter(model: str, prompt: str) -> dict:
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
        "messages": [{"role": "user", "content": prompt}]
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


# --- Storage ---

def get_tests_file() -> Path:
    return DATA_DIR / "tests.json"


def load_tests() -> list[dict]:
    f = get_tests_file()
    if f.exists():
        return json.loads(f.read_text())
    return []


def save_tests(tests: list[dict]):
    get_tests_file().write_text(json.dumps(tests, indent=2))


def get_evaluations_file() -> Path:
    return DATA_DIR / "evaluations.json"


def load_evaluations() -> list[dict]:
    f = get_evaluations_file()
    if f.exists():
        return json.loads(f.read_text())
    return []


def save_evaluations(evaluations: list[dict]):
    get_evaluations_file().write_text(json.dumps(evaluations, indent=2, ensure_ascii=False))


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


@app.get("/api/tests")
def get_tests():
    """Get saved tests."""
    return {"tests": load_tests()}


@app.post("/api/tests")
def save_test(test: SavedTest):
    """Save a test."""
    tests = load_tests()

    # Update if exists, otherwise append
    found = False
    for i, t in enumerate(tests):
        if t["id"] == test.id:
            tests[i] = test.model_dump()
            found = True
            break

    if not found:
        tests.insert(0, test.model_dump())

    save_tests(tests)
    return {"ok": True}


@app.delete("/api/tests/{test_id}")
def delete_test(test_id: str):
    """Delete a test."""
    tests = load_tests()
    tests = [t for t in tests if t["id"] != test_id]
    save_tests(tests)
    return {"ok": True}


@app.get("/api/health")
def health():
    return {"status": "ok", "api_key_configured": bool(API_KEY)}


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
    """Get all evaluations."""
    return {"evaluations": load_evaluations()}


@app.post("/api/evaluations")
def save_evaluation(evaluation: Evaluation):
    """Save an evaluation."""
    evaluations = load_evaluations()

    # Update if exists, otherwise append
    found = False
    for i, e in enumerate(evaluations):
        if e["id"] == evaluation.id:
            evaluations[i] = evaluation.model_dump()
            found = True
            break

    if not found:
        evaluations.insert(0, evaluation.model_dump())

    save_evaluations(evaluations)
    return {"ok": True}


@app.delete("/api/evaluations/{evaluation_id}")
def delete_evaluation(evaluation_id: str):
    """Delete an evaluation."""
    evaluations = load_evaluations()
    evaluations = [e for e in evaluations if e["id"] != evaluation_id]
    save_evaluations(evaluations)
    return {"ok": True}


# Handle favicon
@app.get("/favicon.ico")
def favicon():
    """Return 204 No Content for favicon."""
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
