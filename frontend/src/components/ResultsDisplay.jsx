import React, { useState } from 'react'
import { Copy, Check, Save } from 'lucide-react'
import { StarRating } from './StarRating'

export function ResultsDisplay({ results, onUpdateResult, onSaveEvaluation }) {
  const [copiedId, setCopiedId] = useState(null)
  const [savedIds, setSavedIds] = useState(new Set())

  const handleSave = (result) => {
    const id = result.id || result.model
    onSaveEvaluation(result)
    setSavedIds(prev => new Set([...prev, id]))
    setTimeout(() => {
      setSavedIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 2000)
  }

  const handleCopy = (result) => {
    navigator.clipboard.writeText(result.content)
    setCopiedId(result.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (results.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
        Results
        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs">
          {results.length}
        </span>
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => (
          <div
            key={result.id || result.model}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${result.completed !== false ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                <span className="font-semibold text-sm text-neutral-900">{result.model}</span>
              </div>
              {result.completed !== false && result.content && (
                <button
                  onClick={() => handleCopy(result)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded hover:bg-neutral-100 transition-colors"
                >
                  {copiedId === (result.id || result.model) ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            <div className="p-4">
              {result.completed === false ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-4 bg-neutral-100 rounded w-full" />
                  <div className="h-4 bg-neutral-100 rounded w-5/6" />
                </div>
              ) : result.success === false ? (
                <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{result.error}</div>
              ) : (
                <>
                  <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {result.content}
                  </div>

                  <div className="text-xs text-neutral-500 mb-4">
                    {result.input_tokens} in / {result.output_tokens} out
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 mb-3">
                    <span className="text-xs font-medium text-neutral-500">Quality:</span>
                    <StarRating
                      rating={result.rating || 0}
                      onChange={(rating) => onUpdateResult(result.id || result.model, { rating })}
                    />
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <label className="block text-xs font-medium text-neutral-500 mb-2">Notes:</label>
                    <textarea
                      value={result.comment || ''}
                      onChange={(e) => onUpdateResult(result.id || result.model, { comment: e.target.value })}
                      placeholder="Add your notes about this response..."
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                      rows={2}
                    />
                    {(result.rating || result.comment) && (
                      <button
                        onClick={() => handleSave(result)}
                        disabled={savedIds.has(result.id || result.model)}
                        className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          savedIds.has(result.id || result.model)
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {savedIds.has(result.id || result.model) ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Review
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
