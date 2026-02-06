import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Maximize2, Minimize2, Send, Terminal, Loader2 } from 'lucide-react'
import { Skill } from '../lib/types'
import { generateSystemPrompt, sendMessageToAI, ChatMessage } from '../lib/ai-utils'

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
  skill: Skill
}

// --- Helper: Simple Markdown Parser ---
function FormattedMessage({ content }: { content: string }) {
  // Split content by newlines to handle blocks/lists
  const lines = content.split('\n');

  const parseInline = (text: string) => {
    // Regex to capture **bold**, *italic*, and `code`
    // We split by these patterns to isolate them
    const parts = text.split(/(\*\*.+?\*\*|`.+?`|\*.+?\*)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="bg-white/10 px-1 py-0.5 rounded font-mono text-primary text-xs">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-white/80">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />; // Empty line spacer

        // Handle Bullet Lists
        if (trimmed.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 ml-1">
              <span className="text-primary font-bold">•</span>
              <p className="flex-1">{parseInline(trimmed.slice(2))}</p>
            </div>
          );
        }

        // Standard Paragraph
        return <p key={i}>{parseInline(line)}</p>;
      })}
    </div>
  );
}

export function ChatWindow({ isOpen, onClose, skill }: ChatWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initialize Chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const systemPrompt = generateSystemPrompt(skill)
      setMessages([
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: `🚀 ${skill.name} environment loaded.\nType 'help' to view available commands.` }
      ])
    }
  }, [isOpen, skill])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: input }
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const aiResponse = await sendMessageToAI([...messages, userMsg]);

    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    setIsLoading(false)
  }

  if (!isOpen) return null

  // Use Portal to escape parent stacking contexts (Fixes Z-Index issues)
  return createPortal(
    <div className={`fixed z-[9999] bg-black/95 border border-white/10 shadow-2xl backdrop-blur-md flex flex-col transition-all duration-300 ${
      isMaximized 
        ? 'inset-0 rounded-none' 
        : 'bottom-4 right-4 w-[90vw] md:w-[450px] h-[600px] rounded-xl'
    }`}>
      
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 handle cursor-move select-none">
        <div className="flex items-center gap-2 text-primary font-mono text-sm">
          <Terminal className="w-4 h-4" />
          <span className="truncate font-bold">Test Drive: {skill.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMaximized(!isMaximized)} 
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={onClose} 
            className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            title="Close Session"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {messages.filter(m => m.role !== 'system').map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 leading-relaxed animate-fade-in ${
              msg.role === 'user' 
                ? 'bg-primary/10 text-primary border border-primary/20 rounded-tr-none' 
                : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
            }`}>
              {msg.role === 'assistant' && (
                <div className="text-[10px] text-white/30 mb-2 uppercase tracking-wider font-bold select-none">
                  {skill.name}
                </div>
              )}
              {/* Use the FormattedMessage component here */}
              <FormattedMessage content={msg.content} />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2 text-white/40">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a command..."
            className="w-full bg-black border border-white/20 rounded-lg py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/5 font-mono shadow-inner"
            autoFocus
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body // Target container
  )
}