import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'
import { useSkills } from '../hooks/useSkills'
import { SkillCard } from '../components/SkillCard'
import { Bookmark, ArrowRight, Loader2 } from 'lucide-react'

export function BookmarksPage() {
  const { bookmarks, loading: bookmarksLoading } = useBookmarks()
  const { skills, loading: skillsLoading } = useSkills()

  const loading = bookmarksLoading || skillsLoading

  const bookmarkedSkills = skills.filter(skill => 
    bookmarks.includes(skill.id)
  )

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
          <Bookmark className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
          <p className="text-white/50">
            {bookmarkedSkills.length} saved skill{bookmarkedSkills.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grid or Empty State */}
      {bookmarkedSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookmarkedSkills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center px-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h2>
          <p className="text-white/40 max-w-md mb-8">
            Save useful skills to your personal collection for quick access later.
          </p>
          <Link to="/browse">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all">
              Browse Skills
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}