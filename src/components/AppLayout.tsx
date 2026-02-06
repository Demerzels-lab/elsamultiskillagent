import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Link } from 'react-router-dom'
import { Menu, X, Terminal } from 'lucide-react'
import { InteractiveBackground } from './InteractiveBackground'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-page text-white font-sans selection:bg-primary/30 relative">
      
      {/* Background Layer */}
      <InteractiveBackground />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl z-50 flex items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold">
           <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
             <Terminal className="w-4 h-4 text-primary" />
           </div>
           <span className="text-white font-semibold">Elsa</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black pt-20 px-4 animate-fade-in">
           <div className="flex flex-col gap-4">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80">Dashboard</Link>
              <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80">Browse Skills</Link>
              <Link to="/bookmarks" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80">Bookmarks</Link>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0 min-h-screen relative z-10">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
           {children}
        </div>
      </main>
    </div>
  )
}