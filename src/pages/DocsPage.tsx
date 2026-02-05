import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Book, Download, Code, Terminal, Settings, Zap, ChevronRight } from 'lucide-react'

const sections = [
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'installation', label: 'Installation', icon: Download },
  { id: 'usage', label: 'Basic Usage', icon: Terminal },
  { id: 'api', label: 'API Reference', icon: Code },
  { id: 'configuration', label: 'Configuration', icon: Settings },
]

export function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Book className="w-5 h-5 text-brand" />
                <span className="font-semibold">Documentation</span>
              </div>
              <nav className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-brand/10 text-brand border-l-2 border-brand'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* Getting Started */}
            <section id="getting-started" className="mb-16 scroll-mt-24">
              <h1 className="text-3xl font-bold mb-6">Getting Started</h1>
              <p className="text-text-secondary mb-6">
                Welcome to Elsamultiskill, the comprehensive directory for OpenClaw AI agent skills.
                This guide will help you get started with discovering, installing, and using skills
                to enhance your AI agents.
              </p>
              <div className="card p-6 bg-brand/5 border-brand/20">
                <h3 className="font-semibold mb-2">What are OpenClaw Skills?</h3>
                <p className="text-text-secondary text-sm">
                  OpenClaw skills are modular capabilities that can be installed on AI agents to
                  extend their functionality. Skills range from web development tools to automation
                  utilities, API integrations, and more.
                </p>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Installation</h2>
              <p className="text-text-secondary mb-6">
                Installing skills is straightforward using the clawhub CLI tool. Follow these steps
                to get started:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">1. Prerequisites</h3>
                  <p className="text-text-secondary mb-3">
                    Ensure you have Node.js (v18+) and npm installed on your system.
                  </p>
                  <div className="code-block">
                    <code className="text-brand">node --version</code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">2. Install a Skill</h3>
                  <p className="text-text-secondary mb-3">
                    Use the npx command to install any skill from the directory:
                  </p>
                  <div className="code-block">
                    <code className="text-brand">npx clawhub@latest install &lt;skill-name&gt;</code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">3. Example</h3>
                  <p className="text-text-secondary mb-3">
                    Install the popular "frontend-design" skill:
                  </p>
                  <div className="code-block">
                    <code className="text-brand">npx clawhub@latest install frontend-design</code>
                  </div>
                </div>
              </div>
            </section>

            {/* Usage */}
            <section id="usage" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Basic Usage</h2>
              <p className="text-text-secondary mb-6">
                Once installed, skills are automatically available to your AI agent. Here's how to
                use them effectively:
              </p>

              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="font-semibold mb-3">Skill Activation</h3>
                  <p className="text-text-secondary text-sm">
                    Skills are automatically loaded when your AI agent starts. Simply reference
                    the skill's capabilities in your prompts or commands.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="font-semibold mb-3">Listing Installed Skills</h3>
                  <p className="text-text-secondary text-sm mb-3">
                    View all installed skills with:
                  </p>
                  <div className="code-block">
                    <code className="text-brand">npx clawhub@latest list</code>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="font-semibold mb-3">Updating Skills</h3>
                  <p className="text-text-secondary text-sm mb-3">
                    Keep your skills up to date:
                  </p>
                  <div className="code-block">
                    <code className="text-brand">npx clawhub@latest update &lt;skill-name&gt;</code>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section id="api" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">API Reference</h2>
              <p className="text-text-secondary mb-6">
                The clawhub CLI provides several commands for managing skills:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left py-3 px-4 font-semibold">Command</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 px-4">
                        <code className="text-brand">install &lt;name&gt;</code>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">Install a skill by name</td>
                    </tr>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 px-4">
                        <code className="text-brand">uninstall &lt;name&gt;</code>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">Remove an installed skill</td>
                    </tr>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 px-4">
                        <code className="text-brand">list</code>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">List all installed skills</td>
                    </tr>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 px-4">
                        <code className="text-brand">update &lt;name&gt;</code>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">Update a skill to latest version</td>
                    </tr>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 px-4">
                        <code className="text-brand">search &lt;query&gt;</code>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">Search for skills</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">
                        <code className="text-brand">info &lt;name&gt;</code>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">Get detailed skill information</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Configuration */}
            <section id="configuration" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Configuration</h2>
              <p className="text-text-secondary mb-6">
                Customize your skill installation with configuration options:
              </p>

              <div className="card p-6">
                <h3 className="font-semibold mb-3">Configuration File</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Create a <code className="text-brand">clawhub.config.json</code> in your project root:
                </p>
                <div className="code-block">
                  <pre className="text-brand">{`{
  "skillsDir": "./skills",
  "autoUpdate": true,
  "registry": "https://registry.clawhub.dev"
}`}</pre>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <div className="card p-6 bg-surface">
              <h3 className="font-semibold mb-3">Next Steps</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/browse"
                  className="flex items-center gap-2 text-brand hover:underline"
                >
                  Browse all skills <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/faq"
                  className="flex items-center gap-2 text-brand hover:underline"
                >
                  Read FAQ <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
