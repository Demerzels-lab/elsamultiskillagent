import { Link } from 'react-router-dom'
import { Copy, Check, ExternalLink, Bookmark, BookmarkCheck, Terminal } from 'lucide-react'
import { useState } from 'react'
import type { Skill } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'

interface SkillCardProps {
  skill: Skill
  compact?: boolean
}

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const [copied, setCopied] = useState(false)
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const bookmarked = isBookmarked(skill.id)

  const copyCommand = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    await toggleBookmark(skill.id)
  }

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-black p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
      
      {/* 1. The Overlay Link: Covers the card for navigation */}
      <Link 
        to={`/skill/${skill.slug}`} 
        className="absolute inset-0 z-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label={`View details for ${skill.name}`}
      />

      {/* 2. Header: Buttons must have higher z-index (z-10) to be clickable */}
      <div className="relative z-10 flex items-start justify-between gap-3 pointer-events-none">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
            <Terminal className="w-4 h-4 text-white/50 group-hover:text-primary transition-colors" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors truncate">
              {skill.name}
            </h3>
            <p className="text-xs text-white/40">by {skill.author}</p>
          </div>
        </div>

        {user && (
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors pointer-events-auto ${
              bookmarked
                ? 'text-primary bg-primary/10'
                : 'text-white/30 hover:text-primary hover:bg-primary/10'
            }`}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Description */}
      {!compact && (
        <p className="relative z-10 text-sm text-white/60 line-clamp-2 flex-1 leading-relaxed pointer-events-none">
          {skill.description}
        </p>
      )}

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between gap-2 mt-auto pt-4 border-t border-white/5 pointer-events-none">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-white/50 border border-white/5">
          {skill.category}
        </span>
        
        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={copyCommand}
            className={`p-2 rounded-lg transition-all ${
              copied
                ? 'text-primary bg-primary/10'
                : 'text-white/40 hover:text-primary hover:bg-primary/10'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()} 
            className="p-2 rounded-lg text-white/40 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}