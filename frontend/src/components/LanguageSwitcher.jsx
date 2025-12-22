import React from 'react'
import { useLanguage } from '../i18n'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-0.5">
      <button
        onClick={() => setLanguage('ru')}
        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
          language === 'ru'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
          language === 'en'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        EN
      </button>
    </div>
  )
}
