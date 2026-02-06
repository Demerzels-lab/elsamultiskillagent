import { useSkills } from '../hooks/useSkills'
import { Link } from 'react-router-dom'
import { DashboardTerminal } from '../components/DashboardTerminal'
import { LoadingSpinner } from '../components/Loading'
import { 
  ArrowRight, 
  Github, 
  Bot, 
  Code, 
  Zap, 
  Cpu, 
  Layers, 
  BookOpen 
} from 'lucide-react'

// Helper to pick icons based on category name
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('ai') || n.includes('agent')) return Bot
  if (n.includes('doc')) return BookOpen
  if (n.includes('dev') || n.includes('code')) return Code
  if (n.includes('plan')) return Zap
  if (n.includes('design') || n.includes('frontend')) return Layers
  return Cpu
}

export function DashboardPage() {
  const { skills, categories, loading } = useSkills()

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Calculate stats based on available fields (id, name, category, etc.)
  const totalSkills = skills.length
  const totalCategories = categories.length
  
  // Logic fix: Filter based on category or name instead of 'tags'
  const totalAgents = skills.filter(s => 
    s.category.toLowerCase().includes('agent') || 
    s.name.toLowerCase().includes('agent')
  ).length

  // Treat the rest as commands/tools
  const totalCommands = totalSkills - totalAgents

  return (
    <div className="space-y-16 lg:space-y-24">
      
      {/* 1. Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-8 md:pt-12">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:shadow-[0_0_25px_rgba(var(--primary),0.25)] transition-shadow cursor-default animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-medium tracking-wide">v2.0.0 Available Now</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-6 animate-fade-in [animation-delay:200ms]">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white">
            Supercharge your<br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
              AI Coding Agents
            </span>
          </h1>
          <p className="text-xl text-white/50 leading-relaxed max-w-2xl mx-auto font-light">
            A curated collection of <span className="text-white font-medium border-b border-primary/30 pb-0.5">{totalSkills} skills</span> and <span className="text-white font-medium border-b border-primary/30 pb-0.5">{totalCategories} categories</span> designed to extend the capabilities of modern AI coding assistants.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in [animation-delay:400ms]">
          <Link to="/browse">
            <button className="h-12 rounded-md bg-white text-black hover:bg-primary hover:text-black border-none shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] font-bold px-8 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
              Get Started 
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <a href="https://github.com/blackdragonspear62/Molty-XBT" target="_blank" rel="noopener noreferrer">
            <button className="h-12 rounded-md px-6 bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-primary/50 hover:text-primary font-medium transition-all flex items-center gap-2">
              <Github className="w-4 h-4" />
              View on GitHub
            </button>
          </a>
        </div>
      </section>

      {/* 2. Interactive Terminal Section */}
      <section className="relative animate-fade-in [animation-delay:600ms]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent blur-3xl -z-10"></div>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3 text-white tracking-wide">Try it yourself</h2>
          <p className="text-white/50">Experience the power of <span className="text-primary font-semibold">Elsa</span> directly in your browser.</p>
        </div>
        
        <DashboardTerminal />
      </section>

      {/* 3. Stats Row */}
      <section className="border-y border-white/5 py-12 bg-black/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-around items-center gap-12 md:gap-0">
          <StatsItem number={totalSkills} label="Total Skills" />
          <StatsItem number={totalAgents} label="Specialized Agents" />
          <StatsItem number={totalCommands} label="Slash Commands" />
          <StatsItem number={totalCategories} label="Categories" />
        </div>
      </section>

      {/* 4. Categories Grid */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Explore by Category</h2>
            <p className="text-white/40 mt-2 text-lg">Browse our curated collection of skills and tools</p>
          </div>
          <Link to="/browse" className="hidden md:flex items-center text-primary hover:text-accent transition-colors text-sm font-medium">
            View all skills <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <CategoryCard 
              key={category.slug} 
              category={category} 
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* Footer Note */}
      <div className="text-center py-12 border-t border-white/5 mt-12 bg-gradient-to-b from-transparent to-primary/5 rounded-t-3xl">
        <p className="text-sm text-white/30">
          Built with precision by <span className="text-white/60 font-medium hover:text-primary transition-colors cursor-pointer">Elsa Team</span>
        </p>
      </div>

    </div>
  )
}

// --- Sub Components for Dashboard ---

function StatsItem({ number, label }: { number: number, label: string }) {
  return (
    <div className="flex flex-col items-center text-center w-full md:w-1/4 border-b md:border-b-0 md:border-r border-white/5 last:border-0 pb-8 md:pb-0 group">
      <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-2 group-hover:text-primary transition-colors duration-500">
        {number}
      </span>
      <span className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors">
        {label}
      </span>
    </div>
  )
}

function CategoryCard({ category, index }: { category: any, index: number }) {
  const Icon = getCategoryIcon(category.name)
  
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-black hover:border-primary/50 transition-all duration-500 h-full p-6 group relative overflow-hidden">
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
          <Icon className="w-6 h-6 text-white/70 group-hover:text-primary transition-colors" />
        </div>
        <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-white/5 text-white/50 border border-white/10 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
          {category.count} skills
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-semibold text-xl text-white group-hover:text-primary transition-colors mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors mb-6">
          Explore capabilities in {category.name.toLowerCase()}.
        </p>
        
        {/* Mock Action */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <Link to={`/browse?category=${encodeURIComponent(category.name)}`}>
             <span className="inline-flex items-center text-xs font-medium text-white/60 bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/10 hover:border-primary/30 rounded-md px-2.5 py-1.5 transition-all cursor-pointer">
               Browse Category
             </span>
          </Link>
        </div>
      </div>
    </div>
  )
}