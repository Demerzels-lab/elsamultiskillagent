import { useRef, useState } from 'react'

export function InteractiveBackground() {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    
    const div = divRef.current
    const rect = div.getBoundingClientRect()
    
    setPosition({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    })
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="fixed inset-0 z-0 overflow-hidden bg-page"
    >
      {/* --- LAYER 1: AMBIENT LIQUID FLUIDS (NEON ORANGE THEME) --- 
        Swapped cool colors for Primary (Orange), Accent (Amber), and Red-Orange.
      */}
      <div className="absolute inset-0 opacity-30">
        {/* Orb 1: The Main Glow - Neon Orange (Top Left) */}
        <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob" />
        
        {/* Orb 2: The Highlight - Electric Amber (Top Right) */}
        <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-accent rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-2000" />
        
        {/* Orb 3: The Depth - Deep Red/Orange (Bottom Left) 
            Replaces the "cold" blue spot with a "hot" deep burn to add contrast.
        */}
        <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-4000" />
        
        {/* Orb 4: Secondary Detail - Red/Rose (Bottom Right) */}
        <div className="absolute -bottom-8 -right-4 w-[500px] h-[500px] bg-red-600 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob" />
      </div>

      {/* --- LAYER 2: TEXTURE OVERLAY --- 
        Keeps the "frosted glass" look.
      */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />

      {/* --- LAYER 3: INTERACTIVE MOUSE SPOTLIGHT --- 
        Updated to use a warm amber glow instead of pure white/blue.
      */}
      <div 
        className="absolute w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] transition-opacity duration-500 pointer-events-none mix-blend-screen"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: opacity
        }}
      />
      
      {/* Scanline / Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #808080 1px, transparent 1px),
            linear-gradient(to bottom, #808080 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  )
}