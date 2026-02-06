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
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filter
        {selected.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-primary text-black text-xs font-bold rounded-full">
            {selected.length}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Categories</h3>
            {selected.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-white/40 hover:text-primary transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-[calc(100vh-150px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {sortedCategories.map(category => (
              <button
                key={category.slug}
                onClick={() => toggleCategory(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all text-left border ${
                  selected.includes(category.name)
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-transparent text-white/60 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="truncate">{category.name}</span>
                <span className={`text-xs ml-2 px-1.5 py-0.5 rounded ${
                   selected.includes(category.name) ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/30'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      {showMobile && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-x-0 bottom-0 bg-[#0a0a0a] border-t border-white/10 rounded-t-2xl max-h-[80vh] animate-slide-up">
            <div className="sticky top-0 bg-[#0a0a0a] p-4 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold text-white">Filter by Category</h3>
              <button
                onClick={() => setShowMobile(false)}
                className="p-2 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {selected.length > 0 && (
                <button
                  onClick={clearAll}
                  className="mb-4 text-sm text-primary hover:underline"
                >
                  Clear all ({selected.length} selected)
                </button>
              )}
              <div className="space-y-2">
                {sortedCategories.map(category => (
                  <button
                    key={category.slug}
                    onClick={() => toggleCategory(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors border ${
                      selected.includes(category.name)
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-white/30">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="sticky bottom-0 bg-[#0a0a0a] p-4 border-t border-white/10">
              <button
                onClick={() => setShowMobile(false)}
                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
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