import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMemo, useState, useRef, useEffect } from 'react'
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
  Play,
  X,
  Send,
  Bot,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useSkills } from '../hooks/useSkills'
import { useAuth } from '../context/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'
import { SkillCard } from '../components/SkillCard'
import { LoadingSpinner } from '../components/Loading'
import { generateSystemPrompt, ChatMessage } from '../lib/ai-utils'

// --- INTERNAL HELPER: Simple Markdown Formatter ---
// This fixes the "messy font" issue without needing to npm install new packages.
function SimpleMarkdown({ content }: { content: string }) {
  // 1. Split by code blocks (```)
  const parts = content.split(/```/g)
  
  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, index) => {
        // Odd indices are code blocks (inside ``` ... ```)
        if (index % 2 === 1) {
          // Remove language tag if present (e.g., "text\n" or "json\n")
          const cleanPart = part.replace(/^[a-z]+\n/, '')
          return (
            <pre key={index} className="bg-black/50 p-3 rounded-md overflow-x-auto my-3 font-mono text-xs border border-gray-700 text-green-400">
              {cleanPart}
            </pre>
          )
        }
        
        // Even indices are regular text (handle bolding **text**)
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part.split(/\*\*(.*?)\*\*/g).map((subPart, subIndex) => 
              // Odd subIndices are bold text
              subIndex % 2 === 1 ? (
                <strong key={subIndex} className="text-white font-bold">{subPart}</strong>
              ) : (
                subPart
              )
            )}
          </span>
        )
      })}
    </div>
  )
}

export function SkillDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { skills, loading } = useSkills()
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  
  // State
  const [copied, setCopied] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false) // NEW: Full screen state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isChatOpen, isFullScreen])

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

  // --- CHAT LOGIC ---

  const openTestDrive = () => {
    if (!skill) return
    setIsChatOpen(true)
    if (chatMessages.length === 0) {
      setChatMessages([
        { 
          role: 'assistant', 
          content: `🚀 **${skill.name}** Environment Loaded.\nType 'help' to see what I can do.` 
        }
      ])
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputMessage.trim() || !skill) return

    const userMsg: ChatMessage = { role: 'user', content: inputMessage }
    setChatMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsAiThinking(true)

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
      
      if (!apiKey) {
        throw new Error("Missing API Key")
      }

      const systemPrompt = generateSystemPrompt(skill)

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin, 
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: systemPrompt },
            ...chatMessages.map(m => ({ role: m.role, content: m.content })),
            userMsg
          ]
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices.length > 0) {
        const aiMsg: ChatMessage = { 
          role: 'assistant', 
          content: data.choices[0].message.content 
        }
        setChatMessages(prev => [...prev, aiMsg])
      } else {
        throw new Error("No response from AI")
      }

    } catch (error) {
      console.error(error)
      const errorMessage = (error as Error).message === "Missing API Key" 
        ? "⚠️ **Error**: Creator needs to add `VITE_OPENROUTER_API_KEY` to .env file." 
        : "⚠️ **Connection failed**. Please try again."

      setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
    } finally {
      setIsAiThinking(false)
    }
  }

  // --- RENDER ---

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
    <div className="min-h-screen pt-24 pb-16 relative">
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

              {/* NEW: Test Drive Button */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                 <button 
                  onClick={openTestDrive}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Test Drive Agent
                </button>

                <button onClick={copyCommand} className="btn-secondary w-full">
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

      {/* --- CHAT OVERLAY --- */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`
            bg-[#1e1e1e] flex flex-col border border-gray-700 overflow-hidden shadow-2xl transition-all duration-300
            ${isFullScreen ? 'fixed inset-0 w-full h-full rounded-none' : 'w-full max-w-2xl h-[600px] rounded-xl'}
          `}>
            
            {/* Chat Header */}
            <div className="bg-[#2d2d2d] p-4 flex items-center justify-between border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {skill.name} <span className="text-xs bg-brand/20 text-brand px-2 py-0.5 rounded">SIMULATION</span>
                  </h3>
                  <p className="text-xs text-gray-400">Interactive Web Demo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Full Screen Toggle */}
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                >
                  {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>

                {/* Close Button */}
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm bg-[#1e1e1e]">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4 text-brand" />
                    </div>
                  )}
                  
                  <div className={`
                    max-w-[90%] md:max-w-[80%] rounded-lg p-3
                    ${msg.role === 'user' 
                      ? 'bg-brand text-white' 
                      : 'bg-gray-800 text-gray-200 border border-gray-700'}
                  `}>
                    {/* USE THE NEW FORMATTER HERE */}
                    <SimpleMarkdown content={msg.content} />
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex-shrink-0 flex items-center justify-center mt-1">
                      <User className="w-4 h-4 text-brand" />
                    </div>
                  )}
                </div>
              ))}
              {isAiThinking && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-brand" />
                  </div>
                  <div className="bg-gray-800 text-gray-400 rounded-lg p-3 border border-gray-700 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#2d2d2d] border-t border-gray-700 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a command..."
                  className="w-full bg-[#1e1e1e] border border-gray-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand font-mono"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isAiThinking}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand hover:bg-brand/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                This is an AI simulation. It does not run code on your actual device.
              </p>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}