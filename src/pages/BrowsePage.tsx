import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSkills, useFilteredSkills } from '../hooks/useSkills'
import { SkillCard } from '../components/SkillCard'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { Pagination } from '../components/Pagination'
import { SkeletonGrid } from '../components/Loading'
import { Package, SearchX } from 'lucide-react'

const ITEMS_PER_PAGE = 20

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
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Skills</h1>
          <p className="text-text-secondary">
            Discover and install {skills.length.toLocaleString()} AI agent skills
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, description, or author..."
            />
          </div>
          <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>

        <div className="flex gap-8">
          {/* Desktop Category Sidebar - handled by CategoryFilter */}
          <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-text-secondary">
                <Package className="w-5 h-5" />
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
                  className="text-sm text-brand hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Skills Grid */}
            {loading ? (
              <SkeletonGrid count={12} />
            ) : filteredSkills.length === 0 ? (
              <div className="text-center py-16">
                <SearchX className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No skills found</h3>
                <p className="text-text-secondary mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategories([])
                  }}
                  className="btn-ghost"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                  {paginatedSkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
