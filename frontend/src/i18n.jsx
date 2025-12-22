import { createContext, useContext, useState } from 'react'

export const translations = {
  en: {
    // Header
    subtitle: 'Compare AI models side-by-side',
    copy: 'Copy Prompt',
    copied: 'Copied',

    // Models
    models: 'Models',
    addModel: 'Add',
    addModelTitle: 'Add Model',
    selectModel: 'Select a model to add',
    searchModels: 'Search models...',
    noModelsFound: 'No models found',
    allModelsAdded: 'All models added',

    // Templates
    templates: 'Templates',
    newTemplate: 'New',
    createTemplate: 'Create New Template',
    createTemplateDesc: 'Start from scratch or use existing',
    searchTemplates: 'Search templates...',
    blankTemplate: 'Blank Template',
    startFromScratch: 'Start from scratch',
    noTemplatesFound: 'No templates found',
    templateName: 'Template name...',

    // Template editor
    promptTemplate: 'Prompt Template',
    editTemplate: 'Edit Template',
    fillVariables: 'Fill in the variables',
    modifyStructure: 'Modify template structure',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    enterTemplate: 'Enter your template with {{variables}}...',
    enterField: 'Enter',

    // Buttons
    runTest: 'Run Test',
    running: 'Running',
    modelsText: 'models',
    saveTest: 'Save Test',

    // Results
    results: 'Results',
    quality: 'Quality:',
    notes: 'Notes:',
    addNotes: 'Add your notes about this response...',
    saved: 'Saved',
    saveReview: 'Save Review',

    // History
    recentTests: 'Recent Tests',
    noTestsYet: 'No tests yet. Run your first test!',

    // Starter templates
    starterTemplates: {
      expertAnalysis: {
        name: 'Expert Analysis',
        category: 'Professional',
        content: `You are an expert {{role}} specializing in {{field}}.

Your task is to {{task}}.

Please ensure your response is:
1. {{tone}}
2. Concise but comprehensive
3. Formatted as {{format}}

Context:
{{context}}`
      },
      simpleTask: {
        name: 'Simple Task',
        category: 'Basic',
        content: '{{task}}'
      },
      codeReview: {
        name: 'Code Review',
        category: 'Technical',
        content: `Review the following {{language}} code:

{{code}}

Focus on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Suggestions for improvement`
      },
      contentWriter: {
        name: 'Content Writer',
        category: 'Creative',
        content: `Write a {{content type}} about {{topic}}.

Tone: {{tone}}
Target audience: {{audience}}
Length: {{length}}

Requirements:
{{requirements}}`
      },
      emailGenerator: {
        name: 'Email Generator',
        category: 'Business',
        content: `Write a {{email type}} email to {{recipient}}.

Purpose: {{purpose}}
Tone: {{tone}}
Key points:
{{key points}}`
      },
      brainstorming: {
        name: 'Brainstorming',
        category: 'Creative',
        content: `Generate {{number}} creative ideas for {{topic}}.

Context: {{context}}
Target audience: {{audience}}
Constraints: {{constraints}}`
      }
    }
  },
  ru: {
    // Header
    subtitle: 'Сравнение AI моделей',
    copy: 'Копировать',
    copied: 'Скопировано',

    // Models
    models: 'Модели',
    addModel: 'Добавить',
    addModelTitle: 'Добавить модель',
    selectModel: 'Выберите модель',
    searchModels: 'Поиск моделей...',
    noModelsFound: 'Модели не найдены',
    allModelsAdded: 'Все модели добавлены',

    // Templates
    templates: 'Шаблоны',
    newTemplate: 'Новый',
    createTemplate: 'Новый шаблон',
    createTemplateDesc: 'С нуля или на основе готового',
    searchTemplates: 'Поиск шаблонов...',
    blankTemplate: 'Пустой шаблон',
    startFromScratch: 'Начать с нуля',
    noTemplatesFound: 'Шаблоны не найдены',
    templateName: 'Название шаблона...',

    // Template editor
    promptTemplate: 'Шаблон промпта',
    editTemplate: 'Редактирование',
    fillVariables: 'Заполните переменные',
    modifyStructure: 'Измените структуру шаблона',
    edit: 'Изменить',
    save: 'Сохранить',
    cancel: 'Отмена',
    enterTemplate: 'Введите шаблон с {{переменными}}...',
    enterField: 'Введите',

    // Buttons
    runTest: 'Запустить',
    running: 'Запуск',
    modelsText: 'моделей',
    saveTest: 'Сохранить',

    // Results
    results: 'Результаты',
    quality: 'Качество:',
    notes: 'Заметки:',
    addNotes: 'Добавьте заметки об этом ответе...',
    saved: 'Сохранено',
    saveReview: 'Сохранить отзыв',

    // History
    recentTests: 'История тестов',
    noTestsYet: 'Пока нет тестов. Запустите первый!',

    // Starter templates
    starterTemplates: {
      expertAnalysis: {
        name: 'Экспертный анализ',
        category: 'Профессиональные',
        content: `Ты эксперт {{роль}} со специализацией в {{область}}.

Твоя задача: {{task}}.

Убедись что твой ответ:
1. {{тон}}
2. Краткий но полный
3. В формате {{формат}}

Контекст:
{{context}}`
      },
      simpleTask: {
        name: 'Простая задача',
        category: 'Базовые',
        content: '{{task}}'
      },
      codeReview: {
        name: 'Код-ревью',
        category: 'Технические',
        content: `Проверь следующий {{язык}} код:

{{код}}

Обрати внимание на:
- Качество кода и лучшие практики
- Потенциальные баги или проблемы
- Производительность
- Предложения по улучшению`
      },
      contentWriter: {
        name: 'Копирайтер',
        category: 'Креативные',
        content: `Напиши {{тип контента}} про {{тему}}.

Тон: {{тон}}
Целевая аудитория: {{аудитория}}
Длина: {{длина}}

Требования:
{{требования}}`
      },
      emailGenerator: {
        name: 'Генератор писем',
        category: 'Бизнес',
        content: `Напиши {{тип письма}} письмо для {{получатель}}.

Цель: {{цель}}
Тон: {{тон}}
Ключевые пункты:
{{ключевые пункты}}`
      },
      brainstorming: {
        name: 'Мозговой штурм',
        category: 'Креативные',
        content: `Сгенерируй {{количество}} креативных идей для {{тема}}.

Контекст: {{context}}
Целевая аудитория: {{аудитория}}
Ограничения: {{ограничения}}`
      }
    }
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ru') // Default to Russian

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
