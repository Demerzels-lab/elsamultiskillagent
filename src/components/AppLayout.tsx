import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Link } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-page text-white font-sans selection:bg-primary/30 relative z-10">
      
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl z-50 flex items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-lg">
           <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 bg-surface flex items-center justify-center">
             <span className="text-primary">E</span>
           </div>
           <div className="flex flex-col">
             <span className="text-white font-semibold tracking-tight leading-none text-sm">Elsa</span>
             <span className="text-[8px] text-white/40 uppercase tracking-[0.15em] font-medium">AGENT</span>
           </div>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay (Simplified for now) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black pt-20 px-4 animate-fade-in">
           {/* Re-implement mobile nav links here if needed, or rely on sidebar responsive behavior in future steps */}
           <div className="flex flex-col gap-4">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80">Dashboard</Link>
              <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80">Browse Skills</Link>
              {user ? (
                 <Link to="/bookmarks" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80">Bookmarks</Link>
              ) : (
                 <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-primary">Login / Sign Up</Link>
              )}
           </div>
        </div>
      )}

      {/* Main Content Area */}
      {/* lg:pl-72 offsets the content to the right of the sidebar on desktop */}
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0 min-h-screen relative overflow-hidden">
        {/* Background Gradients from Reference */}
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[128px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10 p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
           {children}
        </div>
      </main>
    </div>
  )
}