#!/usr/bin/env python3
"""
Prompting Playground - MVP
Test prompts across multiple LLM models via OpenRouter API.

Usage:
    python run.py tests/test.yaml
"""

import sys
import os
import yaml
import httpx
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv


def load_config(config_path: str) -> dict:
    """Load YAML config file."""
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)


def call_openrouter(api_key: str, model: str, prompt: str) -> dict:
    """Call OpenRouter API and return response."""
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
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
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}"
                }

            data = response.json()
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})

            return {
                "success": True,
                "content": content,
                "input_tokens": usage.get("prompt_tokens", 0),
                "output_tokens": usage.get("completion_tokens", 0)
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def generate_markdown(config_name: str, prompt: str, results: list[dict]) -> str:
    """Generate markdown output from results."""
    lines = [
        f"# {config_name}",
        "",
        "## Prompt",
        "```",
        prompt.strip(),
        "```",
        "",
    ]

    for result in results:
        lines.append("---")
        lines.append("")
        lines.append(f"### {result['model']}")
        lines.append("")

        if result["success"]:
            lines.append(result["content"])
            lines.append("")
            lines.append(f"*Tokens: {result['input_tokens']} in / {result['output_tokens']} out*")
        else:
            lines.append(f"**ERROR:** {result['error']}")

        lines.append("")

    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("Usage: python run.py <config.yaml>")
        sys.exit(1)

    config_path = sys.argv[1]

    # Load environment
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        print("Error: OPENROUTER_API_KEY not found in environment")
        sys.exit(1)

    # Load config
    config = load_config(config_path)
    prompt = config["prompt"]
    models = config["models"]

    config_name = Path(config_path).stem

    print(f"Running prompt on {len(models)} models...")
    print()

    # Run prompt on each model
    results = []
    for model in models:
        print(f"  {model}...", end=" ", flush=True)
        result = call_openrouter(api_key, model, prompt)
        result["model"] = model
        results.append(result)

        if result["success"]:
            print(f"OK ({result['output_tokens']} tokens)")
        else:
            print(f"FAILED: {result['error'][:50]}")

    print()

    # Generate markdown
    markdown = generate_markdown(config_name, prompt, results)

    # Save to results folder
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
    output_path = Path(__file__).parent / "results" / f"{config_name}_{timestamp}.md"
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, "w") as f:
        f.write(markdown)

    print(f"Results saved to: {output_path}")


if __name__ == "__main__":
    main()
