import React, { useState, useMemo } from 'react'
import { ChevronDown, Lightbulb, AlertTriangle, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n'

// Map template names to framework keys
const FRAMEWORK_KEYS = {
  'APE': 'ape',
  'RTF': 'rtf',
  'RACE': 'race',
  'CRISP-E': 'crispe',
  'CO-STAR': 'costar',
  'RISEN': 'risen'
}

export function TipsPanel({ templateName }) {
  const { t, language } = useLanguage()
  const [expanded, setExpanded] = useState(true)

  // Get tips for current template
  const tips = useMemo(() => {
    const key = FRAMEWORK_KEYS[templateName]
    if (!key) return null
    const templateData = t(`starterTemplates.${key}`)
    return templateData?.tips || null
  }, [templateName, t])

  if (!tips) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-neutral-900">
            {language === 'ru' ? 'Советы' : 'Tips'}: {templateName}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Before/After Example */}
              <div className="bg-neutral-50 rounded-lg p-3">
                <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                  {language === 'ru' ? 'До / После' : 'Before / After'}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 text-xs shrink-0">❌</span>
                    <code className="text-xs text-neutral-600 bg-red-50 px-1.5 py-0.5 rounded">{tips.exampleBefore}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 text-xs shrink-0">✅</span>
                    <pre className="text-xs text-neutral-700 bg-green-50 px-1.5 py-0.5 rounded whitespace-pre-wrap flex-1">{tips.exampleAfter}</pre>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {tips.errors && tips.errors.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    {language === 'ru' ? 'Ошибки' : 'Mistakes'}
                  </div>
                  <div className="space-y-1">
                    {tips.errors.map((err, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs">
                        <span className="text-red-400 line-through shrink-0">{err.bad}</span>
                        <span className="text-neutral-300">→</span>
                        <span className="text-green-600">{err.good}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Style vs Tone (CO-STAR) */}
              {tips.styleTone && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
                    Style + Tone
                  </div>
                  <div className="space-y-1">
                    {tips.styleTone.map((combo, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium text-neutral-700">{combo.style}</span>
                        <span className="text-neutral-400"> + </span>
                        <span className="font-medium text-neutral-700">{combo.tone}</span>
                        <span className="text-neutral-400"> = </span>
                        <span className="text-blue-600">{combo.use}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insight */}
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">{tips.insight}</p>
              </div>

              {/* Warning (if exists) */}
              {tips.warning && (
                <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{tips.warning}</p>
                </div>
              )}

              {/* Science (if exists) */}
              {tips.science && (
                <div className="text-[11px] text-neutral-500 italic pl-2 border-l-2 border-neutral-200">
                  {tips.science}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
