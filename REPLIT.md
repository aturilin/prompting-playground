# Replit Deployment - Ноу-хау

## Ключевые принципы

### 1. Poetry по умолчанию, не pip

Replit использует **Poetry** как дефолтный пакетный менеджер для Python. Не борись с системой.

❌ **Не работает:**
```toml
[deployment]
build = "pip install -r requirements.txt"
```

✅ **Работает:**
- Создай `pyproject.toml` с зависимостями
- Replit автоматически установит пакеты

### 2. Формат pyproject.toml

```toml
[project]
name = "my-app"
version = "1.0.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi",
    "uvicorn",
    "httpx",
    "python-dotenv",
    "pydantic",
]
```

### 3. Минимальный .replit для Python + FastAPI

```toml
entrypoint = "backend/main.py"

[nix]
channel = "stable-24_05"

[env]
PYTHONPATH = "${REPL_HOME}/backend"

[deployment]
deploymentTarget = "cloudrun"
run = ["sh", "-c", "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"]

[[ports]]
localPort = 8000
externalPort = 80
```

### 4. Секреты (API ключи)

- НЕ коммить `.env` в репо
- В Replit: Tools → Secrets → добавить `OPENROUTER_API_KEY`
- `python-dotenv` подхватит из environment

## Типичные ошибки

### "Nix package management doesn't allow direct pip installations"

**Причина:** Deployment environment не поддерживает `pip install` напрямую

**Решение:** Используй `pyproject.toml` вместо `requirements.txt`

### "uvicorn: command not found"

**Причина:** uvicorn не в PATH

**Решение:** Используй `python -m uvicorn` вместо просто `uvicorn`

### "ModuleNotFoundError" при deployment

**Причина:** Пакеты установлены интерактивно, но не записаны в зависимости

**Решение:** Все зависимости должны быть в `pyproject.toml`

## Deployment flow

1. Push в GitHub
2. На Replit: Pull from GitHub (или автоматически если подключен)
3. Deploy → Autoscale
4. Replit читает `pyproject.toml`, устанавливает пакеты
5. Запускает команду из `[deployment] run`

## Полезные ссылки

- [Replit Configuration](https://docs.replit.com/replit-app/configuration)
- [FastAPI on Replit](https://docs.replit.com/getting-started/quickstarts/fastapi-service)
- [Dependency Management](https://docs.replit.com/replit-workspace/dependency-management)
- [Replit + pip blog](https://blog.replit.com/pip)

## Структура проекта для Replit

```
project/
├── .replit              # Конфигурация Replit
├── replit.nix           # Nix пакеты (системные)
├── pyproject.toml       # Python зависимости
├── backend/
│   ├── main.py          # FastAPI app
│   └── ...
├── static/              # Собранный frontend (если есть)
└── data/                # Данные приложения
```
