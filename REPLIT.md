# Replit Deployment

## Архитектура зависимостей

```
replit.nix      → СИСТЕМНЫЕ пакеты (python, nodejs, poetry)
pyproject.toml  → PYTHON пакеты (fastapi, supabase, etc)
poetry.lock     → ОБЯЗАТЕЛЕН для deployment
```

## replit.nix — минимальный

```nix
{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.poetry
    pkgs.nodejs_20
  ];
}
```

⚠️ **НЕ добавлять** `pkgs.python311Packages.xxx` — многих пакетов нет в nixpkgs.

## pyproject.toml — Poetry формат

```toml
[tool.poetry]
name = "my-app"
version = "1.0.0"

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "*"
uvicorn = "*"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

## .replit deployment

```toml
[deployment]
deploymentTarget = "cloudrun"
run = "poetry install --no-root && cd backend && poetry run python -m uvicorn main:app --host 0.0.0.0 --port 8000"
```

⚠️ **build команда НЕ работает** — ставь `poetry install` прямо в run!

## Генерация poetry.lock

```bash
poetry lock
git add poetry.lock && git commit -m "Add poetry.lock" && git push
```

## Ссылки

- [Configuration](https://docs.replit.com/replit-app/configuration)
- [Dependency Management](https://docs.replit.com/replit-workspace/dependency-management)
