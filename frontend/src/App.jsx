import React, { useState, useEffect } from 'react'

const API = '/api'

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  section: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  button: {
    padding: '10px 20px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  buttonSecondary: {
    padding: '8px 16px',
    background: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  buttonSmall: {
    padding: '4px 8px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  modelList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  modelChip: {
    padding: '6px 12px',
    background: '#e5e7eb',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  modelChipSelected: {
    background: '#2563eb',
    color: 'white',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  resultCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
  },
  resultHeader: {
    fontWeight: '600',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#374151',
  },
  resultContent: {
    whiteSpace: 'pre-wrap',
    fontSize: '13px',
    lineHeight: '1.5',
    maxHeight: '300px',
    overflow: 'auto',
  },
  resultMeta: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#6b7280',
  },
  error: {
    color: '#dc2626',
    padding: '10px',
    background: '#fef2f2',
    borderRadius: '6px',
  },
  savedTests: {
    marginTop: '10px',
  },
  testItem: {
    padding: '10px',
    background: '#f9fafb',
    borderRadius: '6px',
    marginBottom: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  running: {
    color: '#2563eb',
    fontSize: '14px',
  },
  ratingSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  stars: {
    display: 'flex',
    gap: '4px',
    marginBottom: '8px',
  },
  star: {
    cursor: 'pointer',
    fontSize: '20px',
    color: '#d1d5db',
  },
  starActive: {
    color: '#fbbf24',
  },
  commentInput: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    marginBottom: '8px',
  },
  savedBadge: {
    background: '#10b981',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    marginLeft: '8px',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    minWidth: '250px',
    background: 'white',
    cursor: 'pointer',
  },
}

function StarRating({ rating, onRate }) {
  return (
    <div style={styles.stars}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            ...styles.star,
            ...(star <= rating ? styles.starActive : {})
          }}
          onClick={() => onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [models, setModels] = useState([])
  const [selectedModels, setSelectedModels] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [savedTests, setSavedTests] = useState([])
  const [testName, setTestName] = useState('')
  const [ratings, setRatings] = useState({})  // { modelId: { rating, comment, saved } }
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [status, setStatus] = useState('')  // Current processing status

  useEffect(() => {
    fetchModels()
    fetchTests()
    fetchTemplates()
  }, [])

  async function fetchModels() {
    try {
      const res = await fetch(`${API}/models`)
      const data = await res.json()
      setModels(data.models || [])
    } catch (e) {
      console.error('Failed to fetch models:', e)
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

  async function fetchTemplates() {
    try {
      const res = await fetch(`${API}/templates`)
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (e) {
      console.error('Failed to fetch templates:', e)
    }
  }

  function applyTemplate(templateId) {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      // If prompt is empty, set placeholder, otherwise wrap existing prompt
      if (!prompt.trim()) {
        setPrompt(template.template)
      } else {
        // Replace {{task}} with current prompt
        const applied = template.template.replace('{{task}}', prompt)
        setPrompt(applied)
      }
    }
  }

  function toggleModel(modelId) {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(m => m !== modelId))
    } else {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  async function runPrompt() {
    if (!prompt.trim() || selectedModels.length === 0) return

    setLoading(true)
    setResults([])
    setRatings({})
    setStatus('Starting...')

    try {
      const res = await fetch(`${API}/run-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, models: selectedModels })
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
                setStatus(`[${data.current}/${data.total}] ${data.message}`)
              } else if (data.type === 'result') {
                newResults.push(data)
                setResults([...newResults])
              } else if (data.type === 'done') {
                setStatus('')
              }
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to run:', e)
      setStatus('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function saveTest() {
    if (!testName.trim() || results.length === 0) return

    const test = {
      id: crypto.randomUUID(),
      name: testName,
      prompt,
      models: selectedModels,
      results,
      created_at: new Date().toISOString()
    }

    try {
      await fetch(`${API}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      })
      setTestName('')
      fetchTests()
    } catch (e) {
      console.error('Failed to save:', e)
    }
  }

  function loadTest(test) {
    setPrompt(test.prompt)
    setSelectedModels(test.models)
    setResults(test.results)
    setTestName(test.name)
    setRatings({})
  }

  async function deleteTest(id) {
    try {
      await fetch(`${API}/tests/${id}`, { method: 'DELETE' })
      fetchTests()
    } catch (e) {
      console.error('Failed to delete:', e)
    }
  }

  function updateRating(model, field, value) {
    setRatings(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        [field]: value,
        saved: false
      }
    }))
  }

  async function saveEvaluation(result) {
    const r = ratings[result.model] || {}
    if (!r.rating) return

    const evaluation = {
      id: crypto.randomUUID(),
      test_id: testName || 'unnamed',
      test_name: testName || 'Unnamed Test',
      prompt: prompt,
      model: result.model,
      response: result.content || '',
      rating: r.rating,
      comment: r.comment || '',
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
      setRatings(prev => ({
        ...prev,
        [result.model]: { ...prev[result.model], saved: true }
      }))
    } catch (e) {
      console.error('Failed to save evaluation:', e)
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Prompting Playground</h1>
      </header>

      {/* Saved Tests */}
      {savedTests.length > 0 && (
        <div style={styles.section}>
          <label style={styles.label}>Saved Tests</label>
          <div style={styles.savedTests}>
            {savedTests.map(test => (
              <div key={test.id} style={styles.testItem}>
                <span onClick={() => loadTest(test)}>{test.name}</span>
                <button
                  style={styles.buttonSecondary}
                  onClick={() => deleteTest(test.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prompt */}
      <div style={styles.section}>
        <div style={styles.flex}>
          <label style={styles.label}>Prompt</label>
          {templates.length > 0 && (
            <select
              style={styles.select}
              value={selectedTemplate}
              onChange={e => applyTemplate(e.target.value)}
            >
              <option value="">-- Apply Template --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} - {t.description}
                </option>
              ))}
            </select>
          )}
        </div>
        <textarea
          style={styles.textarea}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your prompt here... Use templates above to wrap with prompting techniques."
        />
      </div>

      {/* Models */}
      <div style={styles.section}>
        <label style={styles.label}>Models ({selectedModels.length} selected)</label>
        <div style={styles.modelList}>
          {models.map(model => (
            <span
              key={model.id}
              style={{
                ...styles.modelChip,
                ...(selectedModels.includes(model.id) ? styles.modelChipSelected : {})
              }}
              onClick={() => toggleModel(model.id)}
            >
              {model.id}
            </span>
          ))}
        </div>
      </div>

      {/* Run */}
      <div style={styles.section}>
        <div style={styles.flex}>
          <button
            style={styles.button}
            onClick={runPrompt}
            disabled={loading || !prompt.trim() || selectedModels.length === 0}
          >
            {loading ? 'Running...' : 'Run'}
          </button>
          {loading && <span style={styles.running}>{status || `Processing ${selectedModels.length} models...`}</span>}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={styles.section}>
          <div style={styles.flex}>
            <label style={styles.label}>Results</label>
            <input
              style={{ ...styles.input, width: '200px' }}
              placeholder="Test name to save..."
              value={testName}
              onChange={e => setTestName(e.target.value)}
            />
            <button style={styles.buttonSecondary} onClick={saveTest}>
              Save Test
            </button>
          </div>
          <div style={styles.resultsGrid}>
            {results.map((r, i) => (
              <div key={i} style={styles.resultCard}>
                <div style={styles.resultHeader}>{r.model}</div>
                {r.success ? (
                  <>
                    <div style={styles.resultContent}>{r.content}</div>
                    <div style={styles.resultMeta}>
                      {r.input_tokens} in / {r.output_tokens} out
                    </div>

                    {/* Rating Section */}
                    <div style={styles.ratingSection}>
                      <StarRating
                        rating={ratings[r.model]?.rating || 0}
                        onRate={(rating) => updateRating(r.model, 'rating', rating)}
                      />
                      <input
                        style={styles.commentInput}
                        placeholder="Add comment..."
                        value={ratings[r.model]?.comment || ''}
                        onChange={(e) => updateRating(r.model, 'comment', e.target.value)}
                      />
                      <div style={styles.flex}>
                        <button
                          style={styles.buttonSmall}
                          onClick={() => saveEvaluation(r)}
                          disabled={!ratings[r.model]?.rating}
                        >
                          Save Evaluation
                        </button>
                        {ratings[r.model]?.saved && (
                          <span style={styles.savedBadge}>Saved!</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={styles.error}>{r.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
