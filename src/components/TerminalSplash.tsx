import React, { useState, useEffect, useRef } from 'react';

interface TerminalSplashProps {
  onComplete: () => void;
}

export const TerminalSplash: React.FC<TerminalSplashProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // The sequence of messages to display
  const bootSequence = [
    { text: "Initializing System...", color: "text-gray-500", delay: 500 },
    { text: "Loading Agent Skill Protocols... [OK]", color: "text-accent", delay: 800 },
    { text: "Mounting neural pathways... [OK]", color: "text-accent", delay: 800 },
    { text: "Connecting to Orchestration Layer... [CONNECTED]", color: "text-accent", delay: 1000 },
    { text: "Loading agent protocols...", color: "text-gray-500", delay: 600 },
    { text: "  → Codex Planner... [READY]", color: "text-accent", delay: 400 },
    { text: "  → UI/UX Designer... [READY]", color: "text-accent", delay: 400 },
    { text: "  → Codebase Pattern Finder... [READY]", color: "text-accent", delay: 400 },
    { text: "  → Documentation Agent... [READY]", color: "text-accent", delay: 400 },
    { text: "System check complete.", color: "text-gray-500", delay: 500 },
    { text: " ", color: "text-transparent", delay: 100 },
    { text: "═══════════════════════════════════════════════════", color: "text-white font-bold", delay: 100 },
    { text: "   ELSA v2.0.0 / System Ready", color: "text-primary font-bold", delay: 100 },
    { text: "   Intelligent Multi-Agent Orchestration System", color: "text-gray-500", delay: 100 },
    { text: "═══════════════════════════════════════════════════", color: "text-white font-bold", delay: 100 },
    { text: " ", color: "text-transparent", delay: 500 },
    { text: "Type 'start' or press ENTER to launch dashboard...", color: "text-gray-400", delay: 0 },
  ];

  // Run the boot sequence
  useEffect(() => {
    let currentIndex = 0;
    
    const runSequence = () => {
      if (currentIndex >= bootSequence.length) {
        setShowPrompt(true);
        // Auto-focus the hidden input when sequence is done
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      const step = bootSequence[currentIndex];
      setLines(prev => [...prev, step.text]); // We store just text here, but render maps with index
      
      currentIndex++;
      setTimeout(runSequence, step.delay);
    };

    runSequence();
  }, []);

  // Handle Enter key or 'start' command
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      triggerExit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.toLowerCase() === 'start') {
      triggerExit();
    }
  };

  const triggerExit = () => {
    // Add a small delay for effect before unmounting
    setLines(prev => [...prev, "Launching Dashboard..."]);
    setTimeout(onComplete, 800);
  };

  // Focus management
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black font-mono text-sm md:text-base cursor-text overflow-hidden"
      onClick={handleContainerClick}
    >
      {/* Background Grid / Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: `radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)`,
               opacity: 0.1 
             }} 
        />
        <div className="w-full h-full" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
               backgroundSize: '100% 2px, 3px 100%'
             }}
        />
      </div>

      {/* Main Terminal Container */}
      <div className="relative z-10 w-full h-full max-w-5xl mx-auto p-4 md:p-12 flex flex-col justify-center">
        
        {/* Terminal Window */}
        <div className="w-full bg-black/90 border border-white/10 shadow-2xl shadow-primary/10 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar (Logo Area) */}
          <div className="hidden md:flex w-[320px] flex-shrink-0 border-r border-white/10 items-center justify-center p-8 bg-black/50">
            <div className="relative w-48 h-48 rounded-full border-2 border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)]">
               {/* Placeholder for Logo - Using a simple Div representation */}
               <div className="w-40 h-40 bg-black rounded-full flex items-center justify-center border border-primary/20">
                  <img src="/bg-anime.jpeg" alt="Anime Background" className="w-full h-full object-cover rounded-full border-2 border-white" />
               </div>
               <div className="absolute inset-0 rounded-full animate-pulse-slow ring-1 ring-primary/20"></div>
            </div>
          </div>

          {/* Terminal Output Area */}
          <div className="flex-1 flex flex-col relative">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">ELSA_TERMINAL</span>
                <span className="text-[8px] text-white/20 tracking-wide">接続中...</span>
              </div>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse"></div>
                 <div className="w-2 h-2 rounded-full bg-white/10"></div>
                 <div className="w-2 h-2 rounded-full bg-white/10"></div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
               {lines.map((line, idx) => {
                 // Determine color based on index matching original sequence
                 // Note: Since we push plain text strings, we look up the color from bootSequence by index if possible
                 const style = idx < bootSequence.length ? bootSequence[idx].color : 'text-primary';
                 return (
                   <div key={idx} className="mb-2 flex items-start animate-fade-in">
                     <span className="text-primary mr-3 opacity-80 shrink-0">›</span>
                     <span className={`${style} whitespace-pre-wrap`}>{line}</span>
                   </div>
                 );
               })}

               {/* Input Line */}
               {showPrompt && (
                 <div className="flex items-center mt-4 group">
                   <span className="text-primary mr-3 opacity-80">›</span>
                   <input
                     ref={inputRef}
                     type="text"
                     value={inputValue}
                     onChange={handleChange}
                     onKeyDown={handleKeyDown}
                     className="bg-transparent border-none outline-none text-white w-full caret-primary"
                     autoFocus
                   />
                   <span className="inline-block w-2.5 h-4 bg-primary animate-blink ml-1"></span>
                 </div>
               )}
            </div>

            {/* Bottom Footer */}
            {showPrompt && (
              <div className="p-4 text-center border-t border-white/5">
                <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium animate-pulse">
                  Press Enter to Initialize Dashboard
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};