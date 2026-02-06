import { Link } from 'react-router-dom'
import { Github, Twitter, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand / Copyright */}
          <div className="flex items-center gap-2 text-sm text-white/40">
            <span className="font-mono text-primary/80">root@elsa:~$</span>
            <span>© 2026 Elsa Agent Protocol.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/blackdragonspear62/Molty-XBT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-primary transition-colors flex items-center gap-2 text-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a 
              href="https://x.com/moltyxbty86t" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-primary transition-colors flex items-center gap-2 text-sm"
            >
              <Twitter className="w-4 h-4" />
              <span className="hidden sm:inline">Twitter</span>
            </a>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-8 text-center">
           <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
             Orchestrating Intelligence • Building the Future
           </p>
        </div>
      </div>
    </footer>
  )
}