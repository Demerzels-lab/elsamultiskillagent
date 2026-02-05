import { X, Filter } from 'lucide-react'
import type { Category } from '../lib/types'
import { useState } from 'react'

interface CategoryFilterProps {
  categories: Category[]
  selected: string[]
  onChange: (categories: string[]) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const [showMobile, setShowMobile] = useState(false)

  const toggleCategory = (categoryName: string) => {
    if (selected.includes(categoryName)) {
      onChange(selected.filter(c => c !== categoryName))
    } else {
      onChange([...selected, categoryName])
    }
  }

  const clearAll = () => onChange([])

  const sortedCategories = [...categories].sort((a, b) => b.count - a.count)

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobile(true)}
        className="md:hidden flex items-center gap-2 btn-ghost py-2"
      >
        <Filter className="w-4 h-4" />
        Filter
        {selected.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-brand text-black text-xs rounded-full">
            {selected.length}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Categories</h3>
            {selected.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-text-secondary hover:text-brand transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
            {sortedCategories.map(category => (
              <button
                key={category.slug}
                onClick={() => toggleCategory(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  selected.includes(category.name)
                    ? 'bg-brand/10 text-brand border border-brand/30'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <span className="truncate">{category.name}</span>
                <span className="text-text-tertiary text-xs ml-2">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      {showMobile && (
        <div className="md:hidden fixed inset-0 z-50 bg-overlay animate-fade-in">
          <div className="absolute inset-x-0 bottom-0 bg-surface rounded-t-2xl max-h-[80vh] animate-slide-up">
            <div className="sticky top-0 bg-surface p-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Filter by Category</h3>
              <button
                onClick={() => setShowMobile(false)}
                className="p-2 text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {selected.length > 0 && (
                <button
                  onClick={clearAll}
                  className="mb-4 text-sm text-brand hover:underline"
                >
                  Clear all ({selected.length} selected)
                </button>
              )}
              <div className="space-y-2">
                {sortedCategories.map(category => (
                  <button
                    key={category.slug}
                    onClick={() => toggleCategory(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                      selected.includes(category.name)
                        ? 'bg-brand/10 text-brand border border-brand/30'
                        : 'bg-surface-hover text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-text-tertiary">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="sticky bottom-0 bg-surface p-4 border-t border-border-subtle">
              <button
                onClick={() => setShowMobile(false)}
                className="btn-primary w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
