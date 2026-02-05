import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  User,
  Tag,
  Terminal,
  Github,
} from 'lucide-react'
import { useSkills } from '../hooks/useSkills'
import { useAuth } from '../context/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'
import { SkillCard } from '../components/SkillCard'
import { LoadingSpinner } from '../components/Loading'

export function SkillDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { skills, loading } = useSkills()
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const [copied, setCopied] = useState(false)

  const skill = useMemo(
    () => skills.find(s => s.slug === slug),
    [skills, slug]
  )

  const relatedSkills = useMemo(() => {
    if (!skill) return []
    return skills
      .filter(s => s.category === skill.category && s.id !== skill.id)
      .slice(0, 3)
  }, [skills, skill])

  const bookmarked = skill ? isBookmarked(skill.id) : false

  const copyCommand = async () => {
    if (!skill) return
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = async () => {
    if (!user || !skill) return
    await toggleBookmark(skill.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Skill Not Found</h1>
          <p className="text-text-secondary mb-8">
            The skill you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate('/browse')} className="btn-primary">
            Browse All Skills
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{skill.name}</h1>
                {user && (
                  <button
                    onClick={handleBookmark}
                    className={`p-3 rounded-lg transition-colors ${
                      bookmarked
                        ? 'bg-brand/10 text-brand'
                        : 'bg-surface-hover text-text-secondary hover:text-brand'
                    }`}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-6 h-6" />
                    ) : (
                      <Bookmark className="w-6 h-6" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-lg text-text-secondary">{skill.description}</p>
            </div>

            {/* Install Command */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-brand" />
                <h3 className="font-semibold">Install Command</h3>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 code-block text-brand overflow-x-auto">
                  {skill.install_command}
                </code>
                <button
                  onClick={copyCommand}
                  className={`flex-shrink-0 btn-primary flex items-center gap-2 ${
                    copied ? 'bg-green-500' : ''
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Related Skills */}
            {relatedSkills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Related Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedSkills.map(relatedSkill => (
                    <SkillCard key={relatedSkill.id} skill={relatedSkill} compact />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-6">
              <h3 className="font-semibold text-lg">Skill Information</h3>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Author</p>
                  <p className="font-medium">{skill.author}</p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Category</p>
                  <Link
                    to={`/browse?category=${encodeURIComponent(skill.category)}`}
                    className="font-medium text-brand hover:underline"
                  >
                    {skill.category}
                  </Link>
                </div>
              </div>

              {/* GitHub Link */}
              <a
                href={skill.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-surface-hover rounded-lg hover:bg-brand/10 transition-colors group"
              >
                <Github className="w-5 h-5 text-text-secondary group-hover:text-brand" />
                <span className="font-medium group-hover:text-brand">View on GitHub</span>
                <ExternalLink className="w-4 h-4 text-text-tertiary ml-auto group-hover:text-brand" />
              </a>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <button onClick={copyCommand} className="btn-primary w-full">
                  {copied ? 'Copied!' : 'Copy Install Command'}
                </button>
                {!user && (
                  <Link to="/login" className="btn-ghost w-full block text-center">
                    Login to Bookmark
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
