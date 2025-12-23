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
      },
      ape: {
        name: 'APE',
        category: 'Framework',
        description: 'Simplest. 80% of routine tasks: posts, short emails',
        content: `Action: {{action}}

Purpose: {{purpose}}

Expectation: {{expectation}}

{{additional}}`,
        tips: {
          exampleBefore: 'Write a post about a new product',
          exampleAfter: `Action: Create an Instagram post about the new trainer launch
Purpose: Spark curiosity and desire to learn more
Expectation: 150-200 chars, informal tone, 3-5 hashtags`,
          errors: [
            { bad: '"do something"', good: '"write 5 headline options"' },
            { bad: '"make it good"', good: '"200 words, conversational tone"' },
            { bad: '"detailed guide in 100 words"', good: 'conflict! pick one' }
          ],
          insight: '80% of tasks do NOT need complex frameworks. Start with APE.'
        }
      },
      rtf: {
        name: 'RTF',
        category: 'Framework',
        description: 'Minimalist, for quick tasks',
        content: `Role: {{role}}

Task: {{task}}

Format: {{format}}

{{additional}}`,
        tips: {
          exampleBefore: 'Write product description',
          exampleAfter: `Role: E-commerce copywriter
Task: Write a product card for wireless headphones
Format: Title (5 words max) + 3 bullet points + CTA`,
          errors: [
            { bad: '"expert"', good: '"fintech UX designer with 5 years experience"' },
            { bad: 'no format specified', good: '"markdown with headers"' }
          ],
          insight: 'When you don\'t need context or tone settings — RTF is enough.'
        }
      },
      race: {
        name: 'RACE',
        category: 'Framework',
        description: 'Expert focus. Role is critical',
        content: `Role: {{role}}

Action: {{action}}

Context: {{context}}

Expectation: {{expectation}}

{{additional}}`,
        tips: {
          exampleBefore: 'Write a social media post about a fitness product',
          exampleAfter: `Role: Professional fitness industry marketer with 10 years experience
Action: Create a new trainer presentation post for Instagram
Context: Trainer launches in Moscow premium gyms. Target: men 25-40, mid+ income
Expectation: 3 key benefits, 2-3 variants, relevant hashtags`,
          errors: [
            { bad: '"expert"', good: '"senior UX designer with fintech experience"' },
            { bad: 'no context', good: 'response will be abstract without it' },
            { bad: '"good text"', good: '"3 points, formal tone, 200 words"' }
          ],
          insight: '⚠️ Research (Zheng 2023): Persona prompting does NOT improve accuracy for factual tasks. Works only for creative/subjective tasks.',
          science: 'Studied 162 roles — random effect, sometimes better, sometimes worse. Specific role helps set vocabulary and tone, not accuracy.'
        }
      },
      crispe: {
        name: 'CRISP-E',
        category: 'Framework',
        description: 'When you have an example of desired result',
        content: `Context: {{context}}

Role: {{role}}

Instruction: {{instruction}}

Specificity: {{specificity}}

Purpose: {{purpose}}

Example: {{example}}

{{additional}}`,
        tips: {
          exampleBefore: 'Write product descriptions like our brand',
          exampleAfter: `Context: E-commerce store selling eco-friendly home goods
Role: Brand copywriter who knows our voice
Instruction: Write product description for bamboo utensil set
Specificity: 80-100 words, 3 benefits, eco-angle
Purpose: Convert browsers to buyers
Example: "Transform your kitchen into an eco-haven. Our bamboo cutting board..."`,
          errors: [
            { bad: 'example without explanation', good: 'explain WHY this example is good' },
            { bad: 'too long example', good: 'keep it to 2-3 sentences max' }
          ],
          insight: 'Example is the anchor — model adjusts style, structure and tone to match it.'
        }
      },
      costar: {
        name: 'CO-STAR',
        category: 'Framework',
        description: 'Maximum control of style and tone',
        content: `Context: {{context}}

Objective: {{objective}}

Style: {{style}}

Tone: {{tone}}

Audience: {{audience}}

Response format: {{format}}

{{additional}}`,
        tips: {
          exampleBefore: 'Write an article about yoga benefits',
          exampleAfter: `Context: Fitness trainer with 5 years experience, blog for beginners
Objective: Write motivating article convincing readers to try yoga
Style: Light and vivid, with real-life examples (like lifestyle magazines)
Tone: Friendly and inspiring, no lecturing
Audience: Adults 25-40, beginners, value practical advice
Response: ~500 words, 3-4 sections with subheadings, CTA at the end`,
          errors: [
            { bad: '"friendly" as Style', good: '"friendly" is TONE, not style!' },
            { bad: 'Style = Tone', good: 'Style = HOW we write, Tone = emotional coloring' },
            { bad: '"detailed article" + "100 words"', good: 'conflicting parameters!' }
          ],
          styleTone: [
            { style: 'Business', tone: 'Empathetic', use: 'apology letter to client' },
            { style: 'Conversational', tone: 'Authoritative', use: 'expert social post' },
            { style: 'Academic', tone: 'Friendly', use: 'popular science article' }
          ],
          insight: 'Style = HOW we write (Hemingway, Apple, academic). Tone = emotional color (empathetic, authoritative, humorous).',
          warning: '⚠️ Context Overload: Complex 6-component frameworks can HURT results on small models (7B-8B). Don\'t use full CO-STAR for simple tasks.'
        }
      },
      risen: {
        name: 'RISEN',
        category: 'Framework',
        description: 'Multi-step tasks. Steps activates Chain-of-Thought',
        content: `Role: {{role}}

Instructions: {{instructions}}

Steps:
{{steps}}

End goal: {{end_goal}}

Narrowing: {{narrowing}}

{{additional}}`,
        tips: {
          exampleBefore: 'Write an article about Pomodoro',
          exampleAfter: `Role: Author of popular productivity blog (50k+ subscribers)
Instructions: Article for those who heard about Pomodoro but never tried
Steps:
1. Start with relatable problem (procrastination)
2. Briefly explain the core (25/5 minutes)
3. Give 3 non-obvious tips
4. Break down common beginner mistakes
5. End with call to try today
End goal: Reader wants to try Pomodoro right now
Narrowing: 600-800 words, no clichés like "time is money", conversational, subheadings`,
          errors: [
            { bad: 'skipping Steps', good: 'model gives generic structure without depth' },
            { bad: '"good article"', good: '"convince to try" — concrete goal!' },
            { bad: 'ignoring Narrowing', good: 'text bloats, goes off-track' }
          ],
          insight: 'Steps activates Chain-of-Thought reasoning. Narrowing = negative space (what NOT to do).',
          warning: '⚠️ MIT 2025: CoT HURTS creativity — produces "soulless" texts. For creative tasks: fewer steps, more freedom. Use "Start with X, end with Y" without rigid algorithm between.'
        }
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
      },
      ape: {
        name: 'APE',
        category: 'Фреймворки',
        description: 'Простейший. 80% рутинных задач: посты, письма',
        content: `Action: {{action}}

Purpose: {{purpose}}

Expectation: {{expectation}}

{{additional}}`,
        tips: {
          exampleBefore: 'Напиши пост про новый продукт',
          exampleAfter: `Action: Создай Instagram-пост о запуске нового тренажёра
Purpose: Вызвать любопытство и желание узнать больше
Expectation: 150-200 символов, неформальный тон, 3-5 хештегов`,
          errors: [
            { bad: '«сделай что-нибудь»', good: '«напиши 5 вариантов заголовка»' },
            { bad: '«сделай хорошо»', good: '«200 слов, разговорный тон»' },
            { bad: '«подробный гид на 100 слов»', good: 'конфликт! выбери одно' }
          ],
          insight: '80% задач НЕ требуют сложных фреймворков. Начни с APE.'
        }
      },
      rtf: {
        name: 'RTF',
        category: 'Фреймворки',
        description: 'Минималистичный, для быстрых задач',
        content: `Role: {{role}}

Task: {{task}}

Format: {{format}}

{{additional}}`,
        tips: {
          exampleBefore: 'Напиши описание товара',
          exampleAfter: `Role: Копирайтер интернет-магазина
Task: Напиши карточку товара для беспроводных наушников
Format: Заголовок (макс 5 слов) + 3 буллета + CTA`,
          errors: [
            { bad: '«эксперт»', good: '«UX-дизайнер с 5-летним опытом в fintech»' },
            { bad: 'без формата', good: '«markdown с заголовками»' }
          ],
          insight: 'Когда не нужен контекст и настройки тона — RTF достаточно.'
        }
      },
      race: {
        name: 'RACE',
        category: 'Фреймворки',
        description: 'Экспертный фокус. Роль критически важна',
        content: `Role: {{role}}

Action: {{action}}

Context: {{context}}

Expectation: {{expectation}}

{{additional}}`,
        tips: {
          exampleBefore: 'Напиши пост в соцсетях про фитнес-продукт',
          exampleAfter: `Role: Профессиональный маркетолог фитнес-индустрии с 10-летним опытом
Action: Создай пост-презентацию нового тренажёра для Instagram
Context: Тренажёр выходит на рынок премиум-спортзалов Москвы. ЦА — мужчины 25-40
Expectation: 3 ключевых преимущества, 2-3 варианта, релевантные хештеги`,
          errors: [
            { bad: '«эксперт»', good: '«senior UX-дизайнер с опытом в fintech»' },
            { bad: 'без контекста', good: 'ответ будет абстрактным' },
            { bad: '«хороший текст»', good: '«3 пункта, формальный тон, 200 слов»' }
          ],
          insight: '⚠️ Исследование (Zheng 2023): Persona prompting НЕ улучшает точность для фактических задач. Работает только для креативных/субъективных.',
          science: 'Изучили 162 роли — эффект случайный. Конкретная роль помогает задать словарный запас и тон, не точность.'
        }
      },
      crispe: {
        name: 'CRISP-E',
        category: 'Фреймворки',
        description: 'Когда есть пример желаемого результата',
        content: `Context: {{context}}

Role: {{role}}

Instruction: {{instruction}}

Specificity: {{specificity}}

Purpose: {{purpose}}

Example: {{example}}

{{additional}}`,
        tips: {
          exampleBefore: 'Напиши описания товаров в стиле нашего бренда',
          exampleAfter: `Context: Интернет-магазин эко-товаров для дома
Role: Бренд-копирайтер, знающий наш голос
Instruction: Напиши описание набора бамбуковых приборов
Specificity: 80-100 слов, 3 преимущества, эко-акцент
Purpose: Конвертировать посетителей в покупателей
Example: "Превратите кухню в эко-оазис. Наша бамбуковая доска..."`,
          errors: [
            { bad: 'пример без объяснения', good: 'объясни ПОЧЕМУ этот пример хороший' },
            { bad: 'слишком длинный пример', good: 'держи в 2-3 предложениях макс' }
          ],
          insight: 'Example служит якорем — модель подстраивает стиль, структуру и тон под образец.'
        }
      },
      costar: {
        name: 'CO-STAR',
        category: 'Фреймворки',
        description: 'Максимальный контроль стиля и тона',
        content: `Context: {{context}}

Objective: {{objective}}

Style: {{style}}

Tone: {{tone}}

Audience: {{audience}}

Response format: {{format}}

{{additional}}`,
        tips: {
          exampleBefore: 'Напиши статью о пользе йоги',
          exampleAfter: `Context: Фитнес-тренер с 5-летним опытом, блог для новичков
Objective: Написать мотивирующую статью, которая убедит попробовать йогу
Style: Лёгкий и образный, с примерами из жизни (как в lifestyle-журналах)
Tone: Дружелюбный и вдохновляющий, без менторства
Audience: Взрослые 25-40, новички, ценят практичные советы
Response: ~500 слов, 3-4 раздела с подзаголовками, CTA в конце`,
          errors: [
            { bad: '«дружелюбный» как Style', good: '«дружелюбный» — это ТОН, не стиль!' },
            { bad: 'Style = Tone', good: 'Style = КАК пишем, Tone = эмоциональная окраска' },
            { bad: '«развёрнутая статья» + «100 слов»', good: 'конфликт параметров!' }
          ],
          styleTone: [
            { style: 'Деловой', tone: 'Эмпатичный', use: 'письмо с извинениями клиенту' },
            { style: 'Разговорный', tone: 'Авторитетный', use: 'экспертный пост в соцсетях' },
            { style: 'Академический', tone: 'Дружелюбный', use: 'научпоп статья' }
          ],
          insight: 'Style = КАК пишем (Хемингуэй, Apple, академический). Tone = эмоция (эмпатичный, авторитетный, юмор).',
          warning: '⚠️ Context Overload: Сложные фреймворки с 6 компонентами могут УХУДШАТЬ результат на малых моделях (7B-8B). Не используй полный CO-STAR для простых задач.'
        }
      },
      risen: {
        name: 'RISEN',
        category: 'Фреймворки',
        description: 'Многоэтапные задачи. Steps активирует Chain-of-Thought',
        content: `Role: {{role}}

Instructions: {{instructions}}

Steps:
{{steps}}

End goal: {{end_goal}}

Narrowing: {{narrowing}}

{{additional}}`,
        tips: {
          exampleBefore: 'Напиши статью о Pomodoro',
          exampleAfter: `Role: Автор популярного блога о продуктивности (50k+ подписчиков)
Instructions: Статья для тех, кто слышал о технике, но не пробовал
Steps:
1. Начни с relatable проблемы (прокрастинация)
2. Кратко объясни суть (25/5 минут)
3. Приведи 3 неочевидных совета
4. Разбей частые ошибки новичков
5. Закончи призывом попробовать сегодня
End goal: Читатель захочет попробовать прямо сейчас
Narrowing: 600-800 слов, без банальностей "время — деньги", разговорный стиль`,
          errors: [
            { bad: 'пропуск Steps', good: 'модель выдаёт общую структуру без глубины' },
            { bad: '«хорошая статья»', good: '«убедить попробовать» — конкретная цель!' },
            { bad: 'игнорирование Narrowing', good: 'текст раздувается, уходит не туда' }
          ],
          insight: 'Steps активирует Chain-of-Thought reasoning. Narrowing = негативное пространство (что НЕ делать).',
          warning: '⚠️ MIT 2025: CoT ВРЕДИТ креативности — даёт «soulless» тексты. Для креатива: меньше шагов, больше свободы. Используй «Начни с X, закончи Y» без жёсткого алгоритма между.'
        }
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
