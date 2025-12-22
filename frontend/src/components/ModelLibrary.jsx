import React, { useMemo, useState } from 'react'
import { Zap, Plus, Trash2, X, Search, Cpu, Brain, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n'

export function ModelLibrary({ availableModels, selectedModels, onAdd, onRemove }) {
  const { t } = useLanguage()
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedIds = selectedModels.map((m) => m.id)
  const unselectedModels = availableModels.filter((m) => !selectedIds.includes(m.id))

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return unselectedModels
    const query = searchQuery.toLowerCase()
    return unselectedModels.filter((m) =>
      m.id.toLowerCase().includes(query) || (m.provider || '').toLowerCase().includes(query)
    )
  }, [searchQuery, unselectedModels])

  const handleAddModel = (model) => {
    onAdd(model)
    setShowAddModal(false)
    setSearchQuery('')
  }

  const getProviderIcon = (modelId) => {
    if (modelId.includes('gpt') || modelId.includes('openai')) return Sparkles
    if (modelId.includes('claude') || modelId.includes('anthropic')) return Brain
    if (modelId.includes('gemini') || modelId.includes('google')) return Cpu
    return Zap
  }

  const getProvider = (modelId) => {
    if (modelId.includes('gpt') || modelId.includes('openai')) return 'OpenAI'
    if (modelId.includes('claude') || modelId.includes('anthropic')) return 'Anthropic'
    if (modelId.includes('gemini') || modelId.includes('google')) return 'Google'
    if (modelId.includes('llama') || modelId.includes('meta')) return 'Meta'
    if (modelId.includes('mistral')) return 'Mistral'
    if (modelId.includes('deepseek')) return 'DeepSeek'
    return 'Other'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">{t('models')}</h3>
        </div>
        {unselectedModels.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('addModel')}
          </button>
        )}
      </div>

      {/* Add Model Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-b from-neutral-50 to-white flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900">{t('addModelTitle')}</h2>
                      <p className="text-sm text-neutral-500 mt-0.5">{t('selectModel')}</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchModels')}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-2">
                    {filteredModels.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500 text-sm">
                        {searchQuery ? t('noModelsFound') : t('allModelsAdded')}
                      </div>
                    ) : (
                      filteredModels.map((model, index) => {
                        const Icon = getProviderIcon(model.id)
                        return (
                          <motion.button
                            key={model.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleAddModel(model)}
                            className="w-full p-3 rounded-lg border border-neutral-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900">{model.id}</div>
                                <div className="text-xs text-neutral-500">{getProvider(model.id)}</div>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Selected Models List */}
      <div className="space-y-2">
        {selectedModels.map((model) => {
          const Icon = getProviderIcon(model.id)
          return (
            <div key={model.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-900">{model.id}</span>
                  <div className="text-xs text-neutral-500">{getProvider(model.id)}</div>
                </div>
              </div>
              {selectedModels.length > 1 && (
                <button onClick={() => onRemove(model.id)} className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
