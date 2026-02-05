import { useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'
import { useSkills } from '../hooks/useSkills'
import { SkillCard } from '../components/SkillCard'
import { SkeletonGrid, LoadingSpinner } from '../components/Loading'
import { Bookmark, BookmarkX, LogIn } from 'lucide-react'

export function BookmarksPage() {
  const { user, loading: authLoading } = useAuth()
  const { bookmarks, loading: bookmarksLoading } = useBookmarks()
  const { skills, loading: skillsLoading } = useSkills()

  const bookmarkedSkills = useMemo(
    () => skills.filter(skill => bookmarks.includes(skill.id)),
    [skills, bookmarks]
  )

  const loading = authLoading || bookmarksLoading || skillsLoading

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-text-secondary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-text-secondary mb-8">
            Please sign in to view and manage your bookmarked skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" state={{ from: { pathname: '/bookmarks' } }} className="btn-primary w-full sm:w-auto">
              Sign In
            </Link>
            <Link to="/register" className="btn-ghost w-full sm:w-auto">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-brand" />
            </div>
            <h1 className="text-3xl font-bold">My Bookmarks</h1>
          </div>
          <p className="text-text-secondary">
            {bookmarkedSkills.length > 0
              ? `You have ${bookmarkedSkills.length} saved skill${bookmarkedSkills.length !== 1 ? 's' : ''}`
              : 'Save skills to access them quickly later'}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : bookmarkedSkills.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookmarkX className="w-10 h-10 text-text-tertiary" />
            </div>
            <h2 className="text-xl font-semibold mb-3">No bookmarks yet</h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Start exploring skills and click the bookmark icon to save your favorites.
              They'll appear here for quick access.
            </p>
            <Link to="/browse" className="btn-primary">
              Browse Skills
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarkedSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
