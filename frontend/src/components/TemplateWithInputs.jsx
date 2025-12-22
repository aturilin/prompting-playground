import React, { useState } from 'react'
import { Code2, Check, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n'

export function TemplateWithInputs({ template, values, onChange, onTemplateChange }) {
  const { t } = useLanguage()
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  const [editedTemplate, setEditedTemplate] = useState(template)
  const [focusedVar, setFocusedVar] = useState(null)

  const handleSaveTemplate = () => {
    onTemplateChange(editedTemplate)
    setIsEditingTemplate(false)
  }

  const handleCancelEdit = () => {
    setEditedTemplate(template)
    setIsEditingTemplate(false)
  }

  const renderTemplateWithInputs = () => {
    if (!template) return null
    const parts = template.split(/(\{\{[\w\s-а-яА-ЯёЁ]+\}\})/g)

    return parts.map((part, i) => {
      if (part.match(/^\{\{[\w\s-а-яА-ЯёЁ]+\}\}$/)) {
        const varName = part.slice(2, -2).trim()
        const value = values[varName] || ''
        const isFocused = focusedVar === varName
        const isLargeText = ['context', 'task'].includes(varName.toLowerCase())

        // Large text field (textarea) for context and task
        if (isLargeText) {
          return (
            <div key={i} className="block w-full my-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5 block">
                {varName}
              </label>
              <textarea
                value={value}
                onChange={(e) => onChange(varName, e.target.value)}
                onFocus={() => setFocusedVar(varName)}
                onBlur={() => setFocusedVar(null)}
                placeholder={`${t('enterField')} ${varName.replace(/_/g, ' ')}...`}
                rows={6}
                className={`
                  w-full px-4 py-3 rounded-xl font-normal text-sm transition-all duration-200 border resize-y
                  ${isFocused
                    ? 'bg-white text-neutral-900 border-neutral-900 ring-4 ring-neutral-900/10'
                    : 'bg-neutral-50 text-neutral-900 border-neutral-200 hover:border-neutral-300'}
                  placeholder:text-neutral-400 focus:outline-none
                `}
              />
            </div>
          )
        }

        // Regular inline input for other variables
        return (
          <span key={i} className="inline-flex items-center relative group my-0.5">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(varName, e.target.value)}
              onFocus={() => setFocusedVar(varName)}
              onBlur={() => setFocusedVar(null)}
              placeholder={varName.replace(/_/g, ' ')}
              className={`
                inline-block min-w-[100px] px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 border
                ${isFocused
                  ? 'bg-neutral-900 text-white border-neutral-900 ring-4 ring-neutral-900/10'
                  : 'bg-neutral-100 text-neutral-900 border-transparent hover:bg-neutral-200'}
                placeholder:text-neutral-400 focus:outline-none
              `}
              style={{ width: `${Math.max(value.length || varName.length, 8)}ch` }}
            />
            <AnimatePresence>
              {isFocused && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute -top-7 left-0 text-[10px] font-semibold text-neutral-900 whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-lg border border-neutral-200"
                >
                  {varName}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        )
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>
    })
  }

  return (
    <motion.div layout className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[calc(100vh-280px)] flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isEditingTemplate ? 'bg-neutral-100' : 'bg-neutral-900'}`}>
            {isEditingTemplate ? (
              <Code2 className="w-4 h-4 text-neutral-700" strokeWidth={2.5} />
            ) : (
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              {isEditingTemplate ? t('editTemplate') : t('promptTemplate')}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isEditingTemplate ? t('modifyStructure') : t('fillVariables')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditingTemplate ? (
            <>
              <button onClick={handleCancelEdit} className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                {t('cancel')}
              </button>
              <button onClick={handleSaveTemplate} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors">
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                {t('save')}
              </button>
            </>
          ) : (
            <button
              onClick={() => { setEditedTemplate(template); setIsEditingTemplate(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" strokeWidth={2.5} />
              {t('edit')}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isEditingTemplate ? (
            <motion.textarea
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              value={editedTemplate}
              onChange={(e) => setEditedTemplate(e.target.value)}
              className="absolute inset-0 w-full h-full p-6 bg-neutral-50 font-mono text-sm leading-relaxed text-neutral-900 resize-none focus:outline-none"
              spellCheck={false}
              placeholder={t('enterTemplate')}
            />
          ) : (
            <motion.div
              key="viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-y-auto p-6"
            >
              <div className="text-[15px] leading-relaxed text-neutral-900">
                {renderTemplateWithInputs()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
