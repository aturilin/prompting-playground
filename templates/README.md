# Prompt Templates

Шаблоны промптов для тестирования разных техник.

## Использование

Переменные в шаблонах:
- `{{task}}` - основная задача
- `{{role}}` - роль эксперта (для role-expert)

## Шаблоны

| Файл | Название | Описание |
|------|----------|----------|
| `baseline.yaml` | BASELINE | Простой промпт без техник |
| `chain-of-thought.yaml` | COT | Пошаговое рассуждение |
| `role-expert.yaml` | ROLE_COT | Роль эксперта + рассуждение |
| `structured-json.yaml` | STRUCTURED | JSON формат вывода |

## Пример

```yaml
# tests/my-test.yaml
prompt: |
  You are an expert business writer with years of experience.

  Task: Write a professional email declining a job offer politely.

  Approach this systematically:
  1. Draw on your expertise to understand the context
  2. Consider best practices in your field
  3. Think through the implications
  4. Provide a well-reasoned response

models:
  - anthropic/claude-3.5-sonnet
  - openai/gpt-4o
```

## Добавление новых шаблонов

Создай YAML файл:
```yaml
name: MY_TEMPLATE
description: What this template does

template: |
  {{task}}

  Your specific instructions here...
```
