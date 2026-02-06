import { Link } from 'react-router-dom'
import { Github, Twitter, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">E</span>
              </div>
              <span className="font-semibold text-lg">Elsamultiskill.Agent</span>
            </Link>
            <p className="text-text-secondary text-sm">
              Discover and install 1700+ AI agent skills for OpenClaw.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-text-secondary hover:text-brand text-sm transition-colors">
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-text-secondary hover:text-brand text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-text-secondary hover:text-brand text-sm transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-text-secondary hover:text-brand text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/openclaw/skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-brand text-sm transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link to="/docs#getting-started" className="text-text-secondary hover:text-brand text-sm transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link to="/docs#api" className="text-text-secondary hover:text-brand text-sm transition-colors">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Community</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/openclaw/skills"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-hover rounded-lg text-text-secondary hover:text-brand transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/openclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-hover rounded-lg text-text-secondary hover:text-brand transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-tertiary text-sm">
            2026 Elsamultiskill.Agent. All rights reserved.
          </p>
          <p className="text-text-tertiary text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-error" /> for the AI community
          </p>
        </div>
      </div>
    </footer>
  )
}
