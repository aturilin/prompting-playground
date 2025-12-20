import React from 'react'
import { Clock, ChevronRight, Trash2 } from 'lucide-react'

export function ExperimentHistory({ experiments, onSelect, onDelete }) {
  if (!experiments || experiments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">Recent Tests</h3>
        </div>
        <p className="text-sm text-neutral-500">No tests yet. Run your first test!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-neutral-400" />
        <h3 className="text-sm font-semibold text-neutral-900">Recent Tests</h3>
      </div>

      <div className="space-y-2">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
          >
            <button onClick={() => onSelect(exp.id)} className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-neutral-900 truncate">{exp.name}</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {new Date(exp.created_at).toLocaleDateString()} • {exp.models?.length || 0} models
              </div>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(exp.id) }}
              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onSelect(exp.id)} className="p-1 text-neutral-400 group-hover:text-neutral-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
