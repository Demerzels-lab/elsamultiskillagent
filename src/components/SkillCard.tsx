import { Link } from 'react-router-dom'
import { Copy, Check, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react'
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
    <Link
      to={`/skill/${skill.slug}`}
      className="card p-5 flex flex-col gap-3 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary group-hover:text-brand transition-colors truncate">
            {skill.name}
          </h3>
          <p className="text-sm text-text-secondary">by {skill.author}</p>
        </div>
        {user && (
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? 'text-brand bg-brand/10'
                : 'text-text-tertiary hover:text-brand hover:bg-brand/10'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Description */}
      {!compact && (
        <p className="text-sm text-text-secondary line-clamp-2 flex-1">
          {skill.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="pill text-xs">{skill.category}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={copyCommand}
            className={`p-1.5 rounded-lg transition-all ${
              copied
                ? 'text-brand bg-brand/10'
                : 'text-text-tertiary hover:text-brand hover:bg-brand/10'
            }`}
            title={copied ? 'Copied!' : 'Copy install command'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-brand hover:bg-brand/10 transition-colors"
            title="View on GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </Link>
  )
}
