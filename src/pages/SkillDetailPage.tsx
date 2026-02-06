import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Terminal, 
  Shield, 
  Zap,
  Github,
  Play
} from 'lucide-react'
import { useState } from 'react'
import { useSkills } from '../hooks/useSkills'
import { useAuth } from '../context/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'
import { LoadingSpinner } from '../components/Loading'
import { ChatWindow } from '@/components/ChatWindow'

export function SkillDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getSkillBySlug, loading } = useSkills()
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  
  const [copied, setCopied] = useState(false)
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false)

  const skill = getSkillBySlug(slug)
  const bookmarked = skill ? isBookmarked(skill.id) : false

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Skill not found</h2>
        <p className="text-white/50">The skill you are looking for doesn't exist or has been removed.</p>
        <Link to="/browse" className="text-primary hover:underline">Return to Browse</Link>
      </div>
    )
  }

  const copyCommand = async () => {
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    await toggleBookmark(skill.id)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* 1. Test Drive Chat Window (Popup) */}
      <ChatWindow 
        isOpen={isTestDriveOpen} 
        onClose={() => setIsTestDriveOpen(false)} 
        skill={skill} 
      />

      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <Link to="/browse">Back to Browse</Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary">
              <Terminal className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{skill.name}</h1>
              <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                <span>by {skill.author}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs">
                  {skill.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
              bookmarked
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-black border-white/20 text-white/60 hover:border-white/40 hover:text-white'
            }`}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span className="font-medium hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
          </button>
          
          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
          >
            <Github className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Hero / Install Block with Test Drive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Install Command */}
        <div className="md:col-span-2 rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-mono text-white/40">
              <Terminal className="w-3 h-3" />
              <span>INSTALLATION</span>
            </div>
            <button
              onClick={copyCommand}
              className="flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-primary transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>
          <div className="p-6 font-mono text-sm md:text-base relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-3 text-white/90">
              <span className="text-primary select-none">$</span>
              <span className="break-all">{skill.install_command}</span>
            </div>
          </div>
        </div>

        {/* Test Drive Button - Triggers Popup */}
        <div className="flex flex-col justify-center">
          <button 
            onClick={() => setIsTestDriveOpen(true)}
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-3 rounded-xl bg-white text-black font-bold hover:bg-primary transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] group"
          >
            <div className="p-3 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <span className="text-lg">Test Drive Skill</span>
          </button>
        </div>
      </div>

      {/* Description & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-white mb-4">About this Skill</h3>
            <p className="text-white/60 leading-relaxed whitespace-pre-line text-lg">
              {skill.description}
            </p>
          </section>

          {/* Features / Capabilities Mockup */}
          <section>
             <h3 className="text-xl font-semibold text-white mb-4">Capabilities</h3>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-white/60">
                 <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                 <span>Optimized for low-latency execution environments.</span>
               </li>
               <li className="flex items-start gap-3 text-white/60">
                 <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                 <span>Sandboxed execution with strict permission boundaries.</span>
               </li>
             </ul>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/10 bg-white/5">
            <h4 className="font-semibold text-white mb-4">Metadata</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Version</span>
                <span className="text-white/80">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">License</span>
                <span className="text-white/80">MIT</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Updated</span>
                <span className="text-white/80">2 days ago</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/40">Downloads</span>
                <span className="text-white/80">1.2k</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-white/5">
            <h4 className="font-semibold text-white mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {(skill.tags || ['ai', 'automation']).map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-black border border-white/10 text-xs text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}