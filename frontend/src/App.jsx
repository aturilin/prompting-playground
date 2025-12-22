import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { TemplateWithInputs } from './components/TemplateWithInputs'
import { ModelLibrary } from './components/ModelLibrary'
import { ResultsDisplay } from './components/ResultsDisplay'
import { ExperimentHistory } from './components/ExperimentHistory'
import { TemplateLibrary } from './components/TemplateLibrary'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { Toast } from './components/Toast'
import { useLanguage } from './i18n'
import { Sparkles, Copy, Check, Play, ArrowRight, Save } from 'lucide-react'
import { motion } from 'framer-motion'

const API = '/api'

// Generate unique ID (fallback for browsers without crypto.randomUUID)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

const DEFAULT_TEMPLATES = [
  {
    id: 'baseline',
    name: 'Baseline',
    description: 'Direct prompt without techniques',
    template: '{{task}}'
  }
]

export default function App() {
  const { t } = useLanguage()

  // State
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATES[0].id)
  const [variableValues, setVariableValues] = useState({})
  const [availableModels, setAvailableModels] = useState([])
  const [selectedModels, setSelectedModels] = useState([])
  const [results, setResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savedTests, setSavedTests] = useState([])
  const [toast, setToast] = useState({ message: '', type: 'loading', visible: false })
  const resultsRef = useRef(null)

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0]

  // Load data on mount
  useEffect(() => {
    fetchModels()
    // fetchTemplates() - disabled, templates added via UI
    fetchTests()
  }, [])

  async function fetchModels() {
    try {
      const res = await fetch(`${API}/models`)
      const data = await res.json()
      const models = (data.models || []).map(m => ({ id: m.id, name: m.id, provider: getProvider(m.id) }))
      setAvailableModels(models)
      if (models.length > 0 && selectedModels.length === 0) {
        setSelectedModels([models[0]])
      }
    } catch (e) {
      console.error('Failed to fetch models:', e)
    }
  }

  async function fetchTemplates() {
    try {
      const res = await fetch(`${API}/templates`)
      const data = await res.json()
      if (data.templates && data.templates.length > 0) {
        const loaded = data.templates.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          template: t.template
        }))
        setTemplates([...DEFAULT_TEMPLATES, ...loaded])
      }
    } catch (e) {
      console.error('Failed to fetch templates:', e)
    }
  }

  async function fetchTests() {
    try {
      const res = await fetch(`${API}/tests`)
      const data = await res.json()
      setSavedTests(data.tests || [])
    } catch (e) {
      console.error('Failed to fetch tests:', e)
    }
  }

  function getProvider(modelId) {
    if (modelId.includes('gpt') || modelId.includes('openai')) return 'OpenAI'
    if (modelId.includes('claude') || modelId.includes('anthropic')) return 'Anthropic'
    if (modelId.includes('gemini') || modelId.includes('google')) return 'Google'
    if (modelId.includes('llama') || modelId.includes('meta')) return 'Meta'
    if (modelId.includes('mistral')) return 'Mistral'
    if (modelId.includes('deepseek')) return 'DeepSeek'
    return 'Other'
  }

  const showToast = (message, type, duration = 2000) => {
    setToast({ message, type, visible: true })
    if (type === 'success') {
      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), duration)
    }
  }

  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }))

  // Build filled prompt (moved up for use in handlers)
  const filledPrompt = useMemo(() => {
    let result = currentTemplate.template
    const vars = result.match(/\{\{([\w\s-]+)\}\}/g) || []
    vars.forEach((v) => {
      const varName = v.slice(2, -2).trim()
      const value = variableValues[varName] || ''
      result = result.replace(new RegExp(`\\{\\{${varName}\\}\\}`, 'g'), value)
    })
    return result
  }, [currentTemplate.template, variableValues])

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleVariableChange = (name, value) => {
    setVariableValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateChange = (newContent) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === selectedTemplateId ? { ...t, template: newContent } : t))
    )
  }

  const handleTemplateSelect = (id) => {
    setSelectedTemplateId(id)
    setVariableValues({})
  }

  const handleTemplateAdd = (name, content) => {
    const newTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: 'Custom template',
      template: content || '{{task}}'
    }
    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplateId(newTemplate.id)
  }

  const handleTemplateDelete = (id) => {
    if (templates.length <= 1) return
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    if (selectedTemplateId === id) {
      setSelectedTemplateId(templates[0].id)
    }
  }

  const handleModelAdd = (model) => {
    setSelectedModels((prev) => [...prev, model])
  }

  const handleModelRemove = (id) => {
    if (selectedModels.length <= 1) return
    setSelectedModels((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSetModels = (models) => {
    setSelectedModels(models)
  }

  const handleUpdateResult = (id, updates) => {
    setResults((prev) => {
      const newResults = prev.map((r) => {
        if ((r.id || r.model) === id) {
          return { ...r, ...updates }
        }
        return r
      })
      return newResults
    })
  }

  const handleLoadTest = async (testId) => {
    const test = savedTests.find((t) => t.id === testId)
    if (!test) return

    showToast('Loading test...', 'loading')

    // Restore state
    if (test.prompt) {
      setVariableValues({ task: test.prompt })
    }
    if (test.models) {
      const models = availableModels.filter((m) => test.models.includes(m.id))
      if (models.length > 0) setSelectedModels(models)
    }
    if (test.results) {
      setResults(test.results)
    }

    hideToast()
    showToast('Test loaded!', 'success')
    setTimeout(scrollToResults, 600)
  }

  const handleDeleteTest = async (testId) => {
    try {
      await fetch(`${API}/tests/${testId}`, { method: 'DELETE' })
      fetchTests()
    } catch (e) {
      console.error('Failed to delete test:', e)
    }
  }

  const handleSaveTest = async () => {
    if (results.length === 0) return

    const testName = prompt('Enter a name for this test:', `Test ${new Date().toLocaleDateString()}`)
    if (!testName) return

    const test = {
      id: generateId(),
      name: testName,
      prompt: filledPrompt,
      models: selectedModels.map((m) => m.id),
      results: results,
      created_at: new Date().toISOString()
    }

    try {
      showToast('Saving test...', 'loading')
      await fetch(`${API}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      })
      fetchTests()
      hideToast()
      showToast('Test saved!', 'success')
    } catch (e) {
      console.error('Failed to save test:', e)
      showToast('Failed to save test', 'success')
    }
  }

  const handleSaveEvaluation = useCallback(async (result) => {
    if (!result.rating) return

    const evaluation = {
      id: generateId(),
      test_id: 'standalone',
      test_name: 'Quick Test',
      prompt: filledPrompt,
      model: result.model,
      response: result.content || '',
      rating: result.rating,
      comment: result.comment || '',
      input_tokens: result.input_tokens || 0,
      output_tokens: result.output_tokens || 0,
      created_at: new Date().toISOString()
    }

    try {
      await fetch(`${API}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluation)
      })
    } catch (e) {
      console.error('Failed to save evaluation:', e)
    }
  }, [filledPrompt])

  const handleRun = async () => {
    if (isRunning || selectedModels.length === 0) return

    setIsRunning(true)
    setResults([])
    setTimeout(scrollToResults, 300)

    try {
      const res = await fetch(`${API}/run-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: filledPrompt, models: selectedModels.map((m) => m.id) })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      const newResults = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'status') {
                showToast(`[${data.current}/${data.total}] ${data.message}`, 'loading')
              } else if (data.type === 'result') {
                newResults.push({ ...data, id: data.model })
                setResults([...newResults])
              } else if (data.type === 'done') {
                hideToast()
              }
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to run:', e)
      showToast('Error: ' + e.message, 'success')
    } finally {
      setIsRunning(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(filledPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-8 py-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-2xl blur-xl opacity-20" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">Prompt Studio</h1>
              <p className="text-xs text-neutral-500 mt-0.5">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={copyToClipboard}
              className="group flex items-center gap-2.5 px-4 py-2 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-all shadow-sm hover:shadow"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                  <span className="text-emerald-600">{t('copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" strokeWidth={2.5} />
                  {t('copy')}
                </>
              )}
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <TemplateLibrary
              templates={templates}
              selectedId={selectedTemplateId}
              onSelect={handleTemplateSelect}
              onAdd={handleTemplateAdd}
              onDelete={handleTemplateDelete}
            />

            <ModelLibrary
              availableModels={availableModels}
              selectedModels={selectedModels}
              onAdd={handleModelAdd}
              onRemove={handleModelRemove}
              onSetModels={handleSetModels}
            />

            <ExperimentHistory
              experiments={savedTests}
              onSelect={handleLoadTest}
              onDelete={handleDeleteTest}
            />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Template Editor */}
            <TemplateWithInputs
              template={currentTemplate.template}
              values={variableValues}
              onChange={handleVariableChange}
              onTemplateChange={handleTemplateChange}
            />

            {/* Run & Save Buttons */}
            <div className="flex justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRun}
                disabled={isRunning || selectedModels.length === 0}
                className={`
                  group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-semibold text-base transition-all duration-300
                  ${isRunning || selectedModels.length === 0
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/10 hover:shadow-xl hover:shadow-neutral-900/20'}
                `}
              >
                {isRunning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('running')} {selectedModels.length} {t('modelsText')}...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />
                    <span>{t('runTest')}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" strokeWidth={2.5} />
                  </>
                )}
              </motion.button>

              {results.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveTest}
                  className="flex items-center gap-2 px-6 py-3.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded-2xl font-semibold text-base text-neutral-700 hover:text-neutral-900 transition-all shadow-sm hover:shadow"
                >
                  <Save className="w-5 h-5" strokeWidth={2.5} />
                  <span>{t('saveTest')}</span>
                </motion.button>
              )}
            </div>

            {/* Results */}
            <div ref={resultsRef}>
              <ResultsDisplay results={results} onUpdateResult={handleUpdateResult} onSaveEvaluation={handleSaveEvaluation} />
            </div>
          </motion.div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} />
    </div>
  )
}
