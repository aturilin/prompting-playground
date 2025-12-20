# Prompting Playground - Design Brief for Magic Patterns

## Concept: 話 (Hanashi) - The Art of Conversation

A zen, focused interface for testing prompts across LLM models. Japanese minimalism meets powerful functionality.

---

## Design Philosophy

- **Zen aesthetic**: Clean, lots of whitespace, nothing unnecessary
- **Japanese-inspired**: Subtle, muted, purposeful
- **Focus on content**: UI fades into background, prompts shine
- **Color palette**: Slate grays (#1e293b, #334155), soft blue accent (#3b82f6), warm paper (#fafaf9)
- **Typography**: Clean sans-serif (Inter, SF Pro), excellent hierarchy

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  話 Prompting Playground                        [Saved Tests ▾] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ TEMPLATES                                                │   │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │
│  │ │ Baseline │ │   CoT    │ │  Expert  │ │ Struct.  │     │   │
│  │ │ Direct   │ │ Step by  │ │ Role +   │ │ JSON     │     │   │
│  │ │ prompt   │ │ step     │ │ reasoning│ │ output   │     │   │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ TEMPLATE (read-only)                          [Expand ▾]│   │
│  │ ┌───────────────────────────────────────────────────┐   │   │
│  │ │ Think step by step about this task.              │   │   │
│  │ │                                                   │   │   │
│  │ │ {{task}}  ← your task goes here                  │   │   │
│  │ │                                                   │   │   │
│  │ │ Explain your reasoning before giving the answer. │   │   │
│  │ └───────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ YOUR TASK                                               │   │
│  │ ┌───────────────────────────────────────────────────┐   │   │
│  │ │ Write a professional email declining a job offer  │   │   │
│  │ │ politely while keeping the door open for future   │   │   │
│  │ │ opportunities.                                    │   │   │
│  │ │                                                   │   │   │
│  │ └───────────────────────────────────────────────────┘   │   │
│  │                                           142 characters │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ MODELS                                    [Select All]   │   │
│  │                                                          │   │
│  │ ○ gpt-4o  ● claude-3.5  ○ gemini-pro  ● deepseek       │   │
│  │ ○ llama-3  ○ mistral    ○ qwen                          │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│         ┌─────────────────────────────────────────┐            │
│         │              ▶ Run (3 models)            │            │
│         └─────────────────────────────────────────┘            │
│                                                                 │
│         [2/3] Processing claude-3.5-sonnet...                  │
│         ████████████░░░░░░░░                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  RESULTS                              [Save as: ___________]   │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐     │
│  │ gpt-4o                  │  │ claude-3.5-sonnet       │     │
│  │ ─────────────────────── │  │ ─────────────────────── │     │
│  │ Dear Mr. Johnson,       │  │ Dear Mr. Johnson,       │     │
│  │                         │  │                         │     │
│  │ Thank you for the       │  │ I hope this message     │     │
│  │ generous offer...       │  │ finds you well...       │     │
│  │                         │  │                         │     │
│  │ ─────────────────────── │  │ ─────────────────────── │     │
│  │ 234 in / 456 out        │  │ 234 in / 512 out        │     │
│  │                         │  │                         │     │
│  │ ★★★★☆  [___comment___]  │  │ ★★★★★  [___comment___]  │     │
│  │           [Save Rating] │  │           [Save Rating] │     │
│  └─────────────────────────┘  └─────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Header
- Logo: 話 kanji + "Prompting Playground"
- Minimal, just identification
- Saved Tests dropdown on right

### 2. Template Selector
- Horizontal cards/chips
- Each shows: Name + 1-line description
- Selected state: subtle border or background shift
- Hover: slight elevation

### 3. Template Preview (Read-only)
- Monospace or code-like font
- Light gray background (#f8fafc)
- `{{task}}` highlighted in accent color
- Collapsible/expandable
- Shows the selected template content

### 4. Task Input
- Large, comfortable textarea
- Clean border, focus state with accent
- Character count bottom-right
- Placeholder: "Describe your task..."
- This text replaces {{task}} in template

### 5. Model Selection
- Pill/chip style
- Unselected: outline only
- Selected: filled with accent
- Clean grid layout

### 6. Run Button
- Centered, prominent
- Shows model count: "Run (3 models)"
- Disabled state when nothing selected
- Loading state with spinner

### 7. Status Display
- Text: "[2/5] Processing model-name..."
- Progress bar below
- Appears only during execution

### 8. Results Grid
- Responsive: 1-3 columns based on width
- Card per model:
  - Header: model name
  - Body: response (scrollable, max-height)
  - Footer: token counts
  - Rating: 5 stars + comment + save button

### 9. Rating Component
- 5 star rating (click to set)
- Small text input for comment
- "Save" button
- "Saved ✓" indicator after save

---

## Interactions

1. **Select template** → Template preview updates, task stays
2. **Type task** → Only task textarea changes
3. **Click Run** →
   - Button shows loading
   - Status appears with current model
   - Results appear one by one as they complete
4. **Rate result** → Stars fill, can add comment, save
5. **Save test** → Enter name, saves prompt + results

---

## Technical Notes

- React with Tailwind CSS preferred
- Mobile responsive
- API endpoints:
  - GET /api/models
  - GET /api/templates
  - POST /api/run-stream (SSE for progress)
  - POST /api/evaluations
  - GET/POST /api/tests

---

## Inspiration

- Notion's clean aesthetic
- Linear's focused UI
- Japanese design principles: Ma (negative space), Wabi-sabi (simplicity)
- The feeling of a quiet workspace

---

## Copy this to Magic Patterns

Go to magicpatterns.com and paste:

```
Create a React app called "Prompting Playground" with a zen Japanese-inspired design (話 hanashi theme).

Features:
1. Template selector - horizontal cards showing template name + description
2. Template preview box (read-only) - shows selected template with {{task}} placeholder highlighted
3. Task input textarea - user types their task here (replaces {{task}})
4. Model selector - pill chips for selecting multiple LLM models
5. Run button with real-time status: "[2/5] Processing model-name..."
6. Results grid - cards for each model response with star rating (1-5) + comment input

Design: Clean, minimal, lots of whitespace. Colors: slate grays, soft blue accent.
Vibe: Notion meets Japanese tea ceremony - powerful but peaceful.
```
