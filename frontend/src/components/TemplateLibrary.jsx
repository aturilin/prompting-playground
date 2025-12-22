import React, { useMemo, useState } from 'react'
import { FileText, Plus, Trash2, Check, X, Search, Sparkles, Code, MessageSquare, Mail, Brain, LayoutTemplate } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n'

export function TemplateLibrary({ templates, selectedId, onSelect, onAdd, onDelete }) {
  const { t } = useLanguage()
  const [showNewModal, setShowNewModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreatingCustom, setIsCreatingCustom] = useState(false)
  const [newName, setNewName] = useState('')

  const STARTER_TEMPLATES = [
    {
      key: 'costar',
      icon: LayoutTemplate,
    },
    {
      key: 'crispe',
      icon: LayoutTemplate,
    },
    {
      key: 'rtf',
      icon: LayoutTemplate,
    },
  ]

  const getStarterData = (key) => {
    const data = t(`starterTemplates.${key}`)
    return {
      name: data?.name || key,
      category: data?.category || '',
      description: data?.description || '',
      content: data?.content || '{{task}}'
    }
  }

  const filteredStarters = useMemo(() => {
    const starters = STARTER_TEMPLATES.map(s => ({
      ...s,
      ...getStarterData(s.key)
    }))
    if (!searchQuery.trim()) return starters
    const query = searchQuery.toLowerCase()
    return starters.filter((t) =>
      t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)
    )
  }, [searchQuery, t])

  const handleCreateBlank = () => {
    setIsCreatingCustom(true)
    setShowNewModal(false)
    setSearchQuery('')
  }

  const handleSelectStarter = (starter) => {
    onAdd(starter.name, starter.content)
    setShowNewModal(false)
    setSearchQuery('')
  }

  const handleSaveCustom = () => {
    if (newName.trim()) {
      onAdd(newName.trim(), '{{task}}')
      setNewName('')
      setIsCreatingCustom(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">{t('templates')}</h3>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('newTemplate')}
        </button>
      </div>

      {/* New Template Modal */}
      <AnimatePresence>
        {showNewModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewModal(false)}
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
                      <h2 className="text-lg font-semibold text-neutral-900">{t('createTemplate')}</h2>
                      <p className="text-sm text-neutral-500 mt-0.5">{t('createTemplateDesc')}</p>
                    </div>
                    <button onClick={() => setShowNewModal(false)} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchTemplates')}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {!searchQuery && (
                    <button
                      onClick={handleCreateBlank}
                      className="w-full mb-4 p-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-neutral-100 to-neutral-200 group-hover:from-blue-100 group-hover:to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Plus className="w-5 h-5 text-neutral-600 group-hover:text-blue-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-semibold text-neutral-900">{t('blankTemplate')}</div>
                          <div className="text-xs text-neutral-500">{t('startFromScratch')}</div>
                        </div>
                      </div>
                    </button>
                  )}
                  <div className="space-y-2">
                    {filteredStarters.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500 text-sm">{t('noTemplatesFound')}</div>
                    ) : (
                      filteredStarters.map((starter, index) => (
                        <motion.button
                          key={starter.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleSelectStarter(starter)}
                          className="w-full p-3 rounded-lg border border-neutral-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <starter.icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-neutral-900">{starter.name}</div>
                              <div className="text-xs text-neutral-500">{starter.description || starter.category}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Template List */}
      <div className="space-y-2">
        {templates.map((template) => {
          const isSelected = selectedId === template.id
          return (
            <div
              key={template.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <button onClick={() => onSelect(template.id)} className="flex-1 text-left">
                <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-neutral-900'}`}>
                  {template.name}
                </span>
              </button>
              {isSelected && <Check className="w-4 h-4 text-blue-600 mr-2" />}
              {templates.length > 1 && (
                <button onClick={() => onDelete(template.id)} className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )
        })}

        {/* Custom Name Input */}
        {isCreatingCustom && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveCustom(); if (e.key === 'Escape') setIsCreatingCustom(false) }}
              placeholder={t('templateName')}
              className="flex-1 px-2 py-1 text-sm bg-white border border-neutral-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />
            <button onClick={handleSaveCustom} className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => setIsCreatingCustom(false)} className="p-1 text-neutral-400 hover:bg-neutral-100 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
