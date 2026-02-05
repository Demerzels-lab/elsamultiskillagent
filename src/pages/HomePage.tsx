import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Zap, Copy, Download, ArrowRight } from 'lucide-react'
import { useSkills } from '../hooks/useSkills'
import { SkillCard } from '../components/SkillCard'
import { StatsCounter } from '../components/StatsCounter'
import { SkeletonGrid } from '../components/Loading'

export function HomePage() {
  const navigate = useNavigate()
  const { skills, categories, loading } = useSkills()
  const [searchQuery, setSearchQuery] = useState('')

  const featuredSkills = useMemo(
    () => skills.filter(s => s.featured).slice(0, 6),
    [skills]
  )

  const popularSkills = useMemo(
    () => skills.filter(s => s.popular).slice(0, 8),
    [skills]
  )

  const uniqueAuthors = useMemo(
    () => new Set(skills.map(s => s.author)).size,
    [skills]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const howItWorks = [
    {
      icon: Search,
      title: 'Discover Skills',
      description: 'Browse 1700+ AI agent skills organized by category.',
    },
    {
      icon: Copy,
      title: 'Copy Command',
      description: 'One-click copy the install command to your clipboard.',
    },
    {
      icon: Download,
      title: 'Install & Use',
      description: 'Paste the command in your terminal and start using.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover <span className="text-brand">1700+</span> AI Agent Skills
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10">
              The ultimate directory for OpenClaw AI agent skills. 
              Search, discover, and install skills to supercharge your AI agents.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search skills by name, category, or author..."
                  className="input-neon w-full h-16 pl-14 pr-32 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-3"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Trending searches */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-text-tertiary text-sm">Trending:</span>
              {['frontend', 'git', 'ai', 'automation'].map(term => (
                <Link
                  key={term}
                  to={`/browse?q=${term}`}
                  className="pill hover:bg-brand/10 hover:text-brand"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border-subtle bg-surface">
        <div className="container mx-auto px-4">
          <StatsCounter
            totalSkills={skills.length || 1708}
            totalCategories={categories.length || 31}
            totalAuthors={uniqueAuthors || 800}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-text-secondary">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand/10 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-brand" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Skills</h2>
              <p className="text-text-secondary">Hand-picked skills to get you started</p>
            </div>
            <Link
              to="/browse?featured=true"
              className="hidden md:flex items-center gap-2 text-brand hover:underline"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(featuredSkills.length > 0 ? featuredSkills : skills.slice(0, 6)).map(skill => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Skills</h2>
              <p className="text-text-secondary">Most installed skills this month</p>
            </div>
            <Link
              to="/browse?popular=true"
              className="hidden md:flex items-center gap-2 text-brand hover:underline"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(popularSkills.length > 0 ? popularSkills : skills.slice(0, 8)).map(skill => (
                <SkillCard key={skill.id} skill={skill} compact />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-text-secondary">Explore skills across {categories.length} categories</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.slice(0, 15).map(category => (
              <Link
                key={category.slug}
                to={`/browse?category=${encodeURIComponent(category.name)}`}
                className="pill"
              >
                {category.name}
                <span className="ml-2 text-text-tertiary">{category.count}</span>
              </Link>
            ))}
            <Link
              to="/dashboard"
              className="pill bg-brand/10 text-brand border border-brand/30"
            >
              View all categories
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-surface border border-border-subtle rounded-2xl p-12">
            <Zap className="w-12 h-12 text-brand mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to supercharge your AI agent?
            </h2>
            <p className="text-text-secondary mb-8">
              Browse our collection of 1700+ skills and find the perfect tools for your project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/browse" className="btn-primary w-full sm:w-auto">
                Browse Skills
              </Link>
              <Link to="/docs" className="btn-ghost w-full sm:w-auto">
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
