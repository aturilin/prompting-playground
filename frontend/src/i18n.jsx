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
            { bad: '"be creative"', good: '"vivid imagery, metaphors, short sentences"' },
            { bad: '"engaging"', good: '"hook question, short paragraphs, CTA at end"' },
            { bad: '"detailed guide in 100 words"', good: 'conflict! pick one' }
          ],
          insight: '80% of tasks do NOT need complex frameworks. Start with APE.',
          proTip: 'Concrete descriptors > abstract adjectives. "professional tone" → "active voice, concise sentences, industry terms"'
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
            { bad: '"copywriter"', good: '"Apple-style copywriter: minimalism, emotions, short phrases"' },
            { bad: 'no context', good: 'add: who, for whom, why, situation' },
            { bad: '"good text"', good: '"3 points, formal tone, 200 words"' }
          ],
          roleLevels: [
            { level: 'Basic', example: '"You are a copywriter"', effect: 'almost no effect' },
            { level: 'Detailed', example: '"Senior copywriter, 10 years in fintech"', effect: 'affects style' },
            { level: 'Stylistic', example: '"Apple-style: minimalism, emotions"', effect: 'affects tone' }
          ],
          insight: '⚠️ Research (Zheng 2023): Persona prompting does NOT improve accuracy for factual tasks. Works only for creative/subjective tasks.',
          proTip: 'Role MUST be specific. "Expert" = useless. "Senior fintech copywriter who worked with Stripe" = useful.'
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
          exampleBefore: 'Write a marketing email',
          exampleAfter: `Context: B2B SaaS startup selling HR automation. Target: HR directors of 100-500 employee companies. Goal: invite to demo.
Objective: Write email that gets demo signups
Style: Light and vivid, with real-life examples (like lifestyle magazines)
Tone: Friendly and inspiring, no lecturing
Audience: HR directors, no technical background, value time savings
Response: Subject line + 150 words body + clear CTA`,
          errors: [
            { bad: '"friendly" as Style', good: '"friendly" is TONE, not style!' },
            { bad: '"don\'t be boring"', good: '"avoid: \'it\'s important to note\', \'in conclusion\', \'it should be emphasized\'"' },
            { bad: '"detailed article" + "100 words"', good: 'conflicting parameters!' }
          ],
          styleTone: [
            { style: 'Business', tone: 'Empathetic', use: 'apology letter to client' },
            { style: 'Conversational', tone: 'Authoritative', use: 'expert social post' },
            { style: 'Academic', tone: 'Friendly', use: 'popular science article' }
          ],
          insight: 'Style = HOW we write (Hemingway, Apple, academic). Tone = emotional color (empathetic, authoritative, humorous).',
          proTip: 'Negative constraints: be SPECIFIC. ❌ "no clichés" → ✅ "never use: \'in today\'s world\', \'game-changer\', \'leverage\'"',
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
Narrowing: 600-800 words, never use "time is money" or "in today's fast-paced world"`,
          errors: [
            { bad: 'skipping Steps', good: 'model gives generic structure without depth' },
            { bad: '"good article"', good: '"convince to try" — concrete goal!' },
            { bad: '"no clichés"', good: '"never use: \'time is money\', \'game-changer\', \'at the end of the day\'"' }
          ],
          insight: 'Steps activates Chain-of-Thought reasoning. Narrowing = negative space (what NOT to do).',
          proTip: '"Let\'s work this out step by step to be sure we have the right answer" beats "Let\'s think step by step" (Zhou et al.)',
          warning: '⚠️ MIT 2025: CoT HURTS creativity — produces "soulless" texts. For creative tasks: fewer steps, more freedom.',
          structure: 'Article structure: Hook → Problem → Solution → Proof → CTA'
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
            { bad: '«будь креативным»', good: '«яркие образы, метафоры, короткие фразы»' },
            { bad: '«вовлекающе»', good: '«вопрос-крючок, короткие абзацы, CTA в конце»' },
            { bad: '«подробный гид на 100 слов»', good: 'конфликт! выбери одно' }
          ],
          insight: '80% задач НЕ требуют сложных фреймворков. Начни с APE.',
          proTip: 'Конкретные дескрипторы > абстракции. «профессиональный тон» → «активный залог, короткие предложения, термины индустрии»'
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
            { bad: '«копирайтер»', good: '«копирайтер в стиле Apple: минимализм, эмоции, короткие фразы»' },
            { bad: 'без контекста', good: 'добавь: кто, для кого, зачем, ситуация' },
            { bad: '«хороший текст»', good: '«3 пункта, формальный тон, 200 слов»' }
          ],
          roleLevels: [
            { level: 'Базовый', example: '«Ты копирайтер»', effect: 'почти не влияет' },
            { level: 'Детальный', example: '«Senior копирайтер, 10 лет в fintech»', effect: 'влияет на стиль' },
            { level: 'Стилистический', example: '«В стиле Apple: минимализм, эмоции»', effect: 'влияет на тон' }
          ],
          insight: '⚠️ Исследование (Zheng 2023): Persona prompting НЕ улучшает точность для фактических задач. Работает только для креативных/субъективных.',
          proTip: 'Роль ДОЛЖНА быть конкретной. «Эксперт» = бесполезно. «Senior fintech копирайтер, работавший со Stripe» = полезно.'
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
          exampleBefore: 'Напиши маркетинговый email',
          exampleAfter: `Context: B2B SaaS стартап, автоматизация HR. ЦА: HR-директора компаний 100-500 чел. Цель: пригласить на демо.
Objective: Email, который приводит на демо
Style: Лёгкий и образный, с примерами из жизни
Tone: Дружелюбный и вдохновляющий, без менторства
Audience: HR-директора без технического бэкграунда, ценят экономию времени
Response: Тема письма + 150 слов тело + чёткий CTA`,
          errors: [
            { bad: '«дружелюбный» как Style', good: '«дружелюбный» — это ТОН, не стиль!' },
            { bad: '«не пиши скучно»', good: '«избегай: \'важно отметить\', \'в заключение\', \'следует подчеркнуть\'»' },
            { bad: '«развёрнутая статья» + «100 слов»', good: 'конфликт параметров!' }
          ],
          styleTone: [
            { style: 'Деловой', tone: 'Эмпатичный', use: 'письмо с извинениями клиенту' },
            { style: 'Разговорный', tone: 'Авторитетный', use: 'экспертный пост в соцсетях' },
            { style: 'Академический', tone: 'Дружелюбный', use: 'научпоп статья' }
          ],
          insight: 'Style = КАК пишем (Хемингуэй, Apple, академический). Tone = эмоция (эмпатичный, авторитетный, юмор).',
          proTip: 'Негативные ограничения: будь КОНКРЕТЕН. ❌ «без клише» → ✅ «никогда не используй: \'в современном мире\', \'game-changer\'»',
          warning: '⚠️ Context Overload: Сложные фреймворки с 6 компонентами могут УХУДШАТЬ результат на малых моделях (7B-8B).'
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
Narrowing: 600-800 слов, никогда не используй "время — деньги" или "в современном мире"`,
          errors: [
            { bad: 'пропуск Steps', good: 'модель выдаёт общую структуру без глубины' },
            { bad: '«хорошая статья»', good: '«убедить попробовать» — конкретная цель!' },
            { bad: '«без клише»', good: '«никогда не используй: \'время — деньги\', \'в конце концов\'»' }
          ],
          insight: 'Steps активирует Chain-of-Thought reasoning. Narrowing = негативное пространство (что НЕ делать).',
          proTip: '«Давай разберём это пошагово, чтобы получить правильный ответ» лучше чем «Думай пошагово» (Zhou et al.)',
          warning: '⚠️ MIT 2025: CoT ВРЕДИТ креативности — даёт «soulless» тексты. Для креатива: меньше шагов, больше свободы.',
          structure: 'Структура статьи: Крючок → Проблема → Решение → Доказательства → CTA'
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
