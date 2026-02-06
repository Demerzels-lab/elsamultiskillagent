import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSkills } from '../hooks/useSkills'
import { 
  Search, 
  LayoutDashboard, 
  Globe, 
  BookOpen, 
  HelpCircle, 
  LogOut, 
  User, 
  BookmarkIcon,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export function Sidebar() {
  const { user, signOut } = useAuth()
  const { categories } = useSkills()
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  const mainLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/browse', label: 'Browse Skills', icon: Globe },
    { path: '/bookmarks', label: 'Bookmarks', icon: BookmarkIcon },
    { path: '/docs', label: 'Documentation', icon: BookOpen },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ]

  return (
    <aside className="hidden lg:flex w-72 bg-black/80 backdrop-blur-xl border-r border-white/10 fixed inset-y-0 z-50 flex-col">
      {/* Header / Logo */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <Link to="/">
          <div className="flex items-center gap-3 font-bold text-xl cursor-pointer group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary transition-colors shadow-lg shadow-white/5 group-hover:shadow-primary/20 bg-surface flex items-center justify-center">
               <span className="text-primary text-xl">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold tracking-tight leading-none group-hover:text-primary transition-colors">Elsa</span>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium group-hover:text-white/60 transition-colors">AGENT</span>
            </div>
          </div>
        </Link>
        
        {/* Search Input */}
        <div className="mt-5 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary/50 transition-colors" />
          <input 
            type="text"
            className="h-9 w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
            placeholder="Search skills..."
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
        
        {/* Main Navigation */}
        <div>
          <h3 className="mb-3 px-2 text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Platform</h3>
          <div className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link key={link.path} to={link.path}>
                  <button className={`
                    w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}
                  `}>
                    <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'opacity-70'}`} />
                    {link.label}
                  </button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Dynamic Categories from useSkills */}
        <div>
           <div className="flex items-center justify-between px-2 mb-3">
            <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Categories ({categories.length})</h3>
           </div>
           <div className="space-y-1">
             {categories.map((cat) => (
               <Link key={cat.slug} to={`/browse?category=${encodeURIComponent(cat.name)}`}>
                 <button className="w-full flex items-center justify-between px-4 py-2 rounded-md text-sm transition-all duration-200 text-white/60 hover:text-white hover:bg-white/5 group">
                   <div className="flex items-center gap-3 truncate">
                     <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></div>
                     <span className="truncate">{cat.name}</span>
                   </div>
                   <span className="text-[10px] text-white/20 group-hover:text-white/40">{cat.count}</span>
                 </button>
               </Link>
             ))}
           </div>
        </div>
      </div>

      {/* User / Auth Footer */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg border border-white/5 bg-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-white truncate">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] text-white/40 truncate">Free Plan</span>
              </div>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link to="/login" className="px-3 py-2 text-xs font-medium text-center text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors border border-transparent">
              Log In
            </Link>
            <Link to="/register" className="px-3 py-2 text-xs font-medium text-center text-black bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-[0_0_10px_rgba(var(--primary),0.3)]">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}