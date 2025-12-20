# Plan: Интеграция дизайна Magic Patterns в Prompting Playground

## Философия
**NO SHIT CODING!** Маленькие шаги, max 50 строк за итерацию, тест после каждого шага.

## Цель
Полная замена UI на премиум дизайн из Magic Patterns с Tailwind CSS + Framer Motion.

## Источник дизайна
Magic Patterns: https://www.magicpatterns.com/c/pejbwwj26ckoxynkgbyyhh

---

## Итерации (каждая ≤50 строк, тест после каждой)

### Итерация 1: Настройка Tailwind ✅ DONE
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npm install framer-motion lucide-react
npx tailwindcss init -p
```
**Тест:** `npm run dev` запускается без ошибок

### Итерация 2: tailwind.config.js + postcss.config.js ✅ DONE
Создать конфиги для Tailwind.
**Тест:** Tailwind классы работают

### Итерация 3: index.css ✅ DONE
Заменить стили на Tailwind base + Inter шрифт.
**Тест:** Шрифт применяется

### Итерация 4: Toast.jsx ✅ DONE
Простой компонент уведомлений (~30 строк).
**Тест:** Toast показывается

### Итерация 5: StarRating.jsx ✅ DONE
Компонент звёзд для оценки (~25 строк).
**Тест:** Звёзды кликаются

### Итерация 6: ResultsDisplay.jsx ✅ DONE
Карточки результатов с рейтингом (~80 строк → разбить на 2 части).
**Тест:** Результаты рендерятся

### Итерация 7: ExperimentHistory.jsx ✅ DONE
История экспериментов (~60 строк).
**Тест:** История показывается

### Итерация 8: ModelLibrary.jsx (часть 1) ✅ DONE
Список выбранных моделей (~40 строк).
**Тест:** Модели отображаются

### Итерация 9: ModelLibrary.jsx (часть 2) ✅ DONE
Модалка добавления моделей (~50 строк).
**Тест:** Модалка открывается

### Итерация 10: TemplateLibrary.jsx (часть 1) ✅ DONE
Список шаблонов (~40 строк).
**Тест:** Шаблоны отображаются

### Итерация 11: TemplateLibrary.jsx (часть 2) ✅ DONE
Модалка создания шаблона (~50 строк).
**Тест:** Модалка работает

### Итерация 12: TemplateWithInputs.jsx (часть 1) ✅ DONE
Рендер шаблона с {{переменными}} (~40 строк).
**Тест:** Переменные подсвечиваются

### Итерация 13: TemplateWithInputs.jsx (часть 2) ✅ DONE
Inline inputs для переменных (~40 строк).
**Тест:** Можно вводить значения

### Итерация 14: App.jsx - структура ✅ DONE
Layout: header, sidebar, main area (~50 строк).
**Тест:** Layout рендерится

### Итерация 15: App.jsx - state management ✅ DONE
useState для templates, models, results (~40 строк).
**Тест:** State работает

### Итерация 16: App.jsx - API интеграция ✅ DONE
useEffect для загрузки данных с API (~40 строк).
**Тест:** Данные загружаются

### Итерация 17: App.jsx - Run функция ✅ DONE
SSE streaming для /api/run-stream (~50 строк).
**Тест:** Запросы к моделям работают

### Итерация 18: Финальная сборка ✅ DONE
```bash
npm run build
```
**Тест:** Приложение работает полностью

**Результат сборки:**
- index.html: 0.63 kB
- CSS: 22.61 kB (gzip: 4.73 kB)
- JS: 295.32 kB (gzip: 93.12 kB)

---

## Критические файлы

| Файл | Итерация |
|------|----------|
| `frontend/tailwind.config.js` | 2 |
| `frontend/src/index.css` | 3 |
| `frontend/src/components/Toast.jsx` | 4 |
| `frontend/src/components/StarRating.jsx` | 5 |
| `frontend/src/components/ResultsDisplay.jsx` | 6 |
| `frontend/src/components/ExperimentHistory.jsx` | 7 |
| `frontend/src/components/ModelLibrary.jsx` | 8-9 |
| `frontend/src/components/TemplateLibrary.jsx` | 10-11 |
| `frontend/src/components/TemplateWithInputs.jsx` | 12-13 |
| `frontend/src/App.jsx` | 14-17 |

---

## Сохраняем без изменений
- `backend/main.py` - API работает
- `templates/*.yaml` - шаблоны промптов
- Supabase схема
