import React, { useState, useRef, useEffect } from 'react'
import { Terminal, Minus, Square, X } from 'lucide-react'

export function DashboardTerminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([
    "Initializing Elsa Agent Protocol v2.0...",
    "Loading skill registry... [OK]",
    "Connecting to neural knowledge base... [CONNECTED]",
    "System ready. Type 'help' to see available commands."
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase()
      setHistory(prev => [...prev, `→ ${input}`])
      
      // Simple command simulation
      if (cmd === 'help') {
        setHistory(prev => [...prev, 
          "Available commands:",
          "  list-skills   - Show all available skills",
          "  status        - Check system status",
          "  clear         - Clear terminal"
        ])
      } else if (cmd === 'status') {
        setHistory(prev => [...prev, "System Operational. All agents online."])
      } else if (cmd === 'list-skills') {
        setHistory(prev => [...prev, "Fetching skills... [DONE]", "Use the Browse page to view full details."])
      } else if (cmd === 'clear') {
        setHistory([])
      } else if (cmd !== '') {
        setHistory(prev => [...prev, `Command not found: ${cmd}`])
      }
      
      setInput('')
    }
  }

  return (
    <div className="transform transition-transform hover:scale-[1.01] duration-500">
      <div className="flex flex-col rounded-xl border border-primary/30 w-full max-w-4xl mx-auto bg-black shadow-2xl shadow-primary/10 overflow-hidden font-mono text-sm relative z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-3 text-white/40">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-wide">user@elsa-agent: ~</span>
          </div>
          <div className="flex items-center gap-2 opacity-50">
            <Minus className="w-3 h-3 hover:text-white cursor-pointer" />
            <Square className="w-2.5 h-2.5 hover:text-white cursor-pointer" />
            <X className="w-3 h-3 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={scrollRef}
          className="p-6 h-[300px] overflow-y-auto cursor-text bg-black/90 text-white/90"
          onClick={() => document.getElementById('terminal-input')?.focus()}
        >
          {/* ASCII Art Header */}
          <div className="mb-4 text-primary/60 font-bold whitespace-pre-wrap leading-tight select-none">
{`   _____ _             
  |   __| |___ ___     
  |   __| |_ -| .'|    
  |_____|_|___|__,| AGENT`}
          </div>

          {/* History Log */}
          <div className="space-y-1 mb-2">
            {history.map((line, i) => (
              <div key={i} className={`${line.startsWith('→') ? 'text-white/60 mt-2' : 'text-primary/80'}`}>
                {line}
              </div>
            ))}
          </div>

          {/* Input Line */}
          <div className="flex items-center group">
            <span className="text-primary mr-2">→</span>
            <input
              id="terminal-input"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/20 caret-primary"
              placeholder="Type 'help'..."
              spellCheck={false}
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    </div>
  )
}