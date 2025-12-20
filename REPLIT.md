# Replit Deployment

## Архитектура зависимостей

```
replit.nix      → СИСТЕМНЫЕ пакеты (python, nodejs, poetry)
pyproject.toml  → PYTHON пакеты (fastapi, supabase, etc)
poetry.lock     → ОБЯЗАТЕЛЕН для deployment
```

**Правило:** Python-пакеты ставятся через Poetry, НЕ через nix.

## Минимальный replit.nix

```nix
{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.poetry
    pkgs.nodejs_20
  ];
}
```

⚠️ **НЕ добавлять** `pkgs.python311Packages.xxx` — многих пакетов нет в nixpkgs (например `supabase`).

## pyproject.toml (Poetry формат)

```toml
[tool.poetry]
name = "my-app"
version = "1.0.0"

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "*"
uvicorn = "*"
supabase = "*"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

## Генерация poetry.lock

```bash
poetry lock
git add poetry.lock && git commit -m "Add poetry.lock" && git push
```

## .replit deployment

```toml
[deployment]
deploymentTarget = "cloudrun"
build = "poetry install --no-root"
run = "poetry run python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"
```

⚠️ **build/run — строки**, не массивы!

## Ссылки

- [Configuration](https://docs.replit.com/replit-app/configuration)
- [Dependency Management](https://docs.replit.com/replit-workspace/dependency-management)
