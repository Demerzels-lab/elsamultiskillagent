import { Link } from 'react-router-dom'
import { DashboardTerminal } from '../components/DashboardTerminal'
import { ArrowRight, Github, Code, Globe, Zap } from 'lucide-react'
import { useSkills } from '../hooks/useSkills'

export function HomePage() {
  const { skills, categories } = useSkills()

  // Calculate quick stats for the hero
  const stats = [
    { label: 'Skills', value: skills.length || '40+' },
    { label: 'Categories', value: categories.length || '7' },
    { label: 'Agents', value: '6' },
  ]

  return (
    <div className="space-y-24 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center max-w-5xl mx-auto px-4">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          v2.0 System Online
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 animate-fade-in [animation-delay:200ms]">
          Orchestrate your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary animate-shimmer bg-[length:200%_auto]">
            Digital Workforce
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in [animation-delay:400ms]">
          The complete ecosystem for AI coding agents. Access 
          <span className="text-white font-medium"> {skills.length} skills</span>, 
          deploy specialized agents, and automate complex workflows with a single command.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:600ms]">
          <Link to="/browse" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold rounded-lg hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] flex items-center justify-center gap-2 group">
              Explore Skills
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link to="/docs" className="w-full sm:w-auto">
             <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2">
              <Code className="w-4 h-4 text-white/60" />
              Documentation
            </button>
          </Link>
        </div>
      </section>

      {/* 2. Terminal Demo */}
      <section className="max-w-4xl mx-auto px-4 animate-fade-in [animation-delay:800ms]">
        <div className="text-center mb-8">
          <p className="text-sm text-white/30 uppercase tracking-widest">Interactive Protocol Shell</p>
        </div>
        <DashboardTerminal />
      </section>

      {/* 3. Features Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Globe}
            title="Centralized Intelligence"
            description="A unified registry of skills and prompts, accessible through a single optimized interface."
          />
          <FeatureCard 
            icon={Zap}
            title="Instant Deployment"
            description="Copy-paste ready commands to instantly equip your AI agents with new capabilities."
          />
          <FeatureCard 
            icon={Github}
            title="Open Source Core"
            description="Built by the community, for the community. Continuously evolving and improving."
          />
        </div>
      </section>

      {/* 4. Stats Band */}
      <section className="border-y border-white/5 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-3 gap-8 text-center divide-x divide-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</span>
                <span className="text-xs text-white/40 uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-black border border-white/10 flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors">
        <Icon className="w-6 h-6 text-white/60 group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-white/50 leading-relaxed text-sm">{description}</p>
    </div>
  )
}