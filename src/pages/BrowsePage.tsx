import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSkills, useFilteredSkills } from '../hooks/useSkills'
import { SkillCard } from '../components/SkillCard'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { Pagination } from '../components/Pagination'
import { SkeletonGrid } from '../components/Loading'
import { Package, SearchX } from 'lucide-react'

const ITEMS_PER_PAGE = 18 

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { skills, categories, loading } = useSkills()

  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [currentPage, setCurrentPage] = useState(1)

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategories.length === 1) params.set('category', selectedCategories[0])
    setSearchParams(params, { replace: true })
  }, [searchQuery, selectedCategories, setSearchParams])

  const filteredSkills = useFilteredSkills(skills, searchQuery, selectedCategories)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategories])

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE)
  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredSkills.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredSkills, currentPage])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Browse Skills</h1>
        <p className="text-white/50 text-lg">
          Discover and install <span className="text-white">{skills.length.toLocaleString()}</span> AI agent skills
        </p>
      </div>

      {/* Search Bar & Mobile Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, description, or author..."
          />
        </div>
        
        {/* Mobile Filter Button Placeholder (Rendered by CategoryFilter) */}
        <div className="md:hidden">
           <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden md:block">
           <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>

        {/* Main Grid Content */}
        <div className="flex-1 min-w-0">
          
          {/* Results Count & Clear */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Package className="w-4 h-4" />
              <span>
                {filteredSkills.length.toLocaleString()} skill
                {filteredSkills.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategories([])
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <SkeletonGrid count={9} />
          ) : filteredSkills.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-xl bg-white/5">
              <SearchX className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">No skills found</h3>
              <p className="text-white/40 mb-6 max-w-sm mx-auto">
                We couldn't find any skills matching your criteria. Try adjusting your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategories([])
                }}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {paginatedSkills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}