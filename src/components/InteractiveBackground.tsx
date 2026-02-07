import { useRef, useState } from 'react'

export function InteractiveBackground() {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setOpacity(1)
  }

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOpacity(0)}
      className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]"
    >
      {/* --- LAYER 1: THE CORE AMBIENCE --- */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-crimson/10 rounded-full blur-[120px]" />
      </div>

      {/* --- LAYER 2: MOVING HUD ELEMENTS (CROWDED VIBE) --- */}
      <div className="absolute inset-0 bg-grid-mecha pointer-events-none opacity-40" />
      
      {/* Floating Data Particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(120)].map((_, i) => {
          const size = Math.random() > 0.7 ? 'w-2 h-2' : Math.random() > 0.4 ? 'w-1.5 h-1.5' : 'w-1 h-1'
          const color = Math.random() > 0.6 ? 'bg-accent' : 'bg-primary'
          return (
            <div 
              key={i}
              className={`absolute ${size} ${color} animate-float`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          )
        })}
      </div>

      {/* Additional Geometric Particles */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {[...Array(40)].map((_, i) => {
          const shapes = ['rounded-full', 'rounded-sm', 'rounded-lg']
          const shape = shapes[Math.floor(Math.random() * shapes.length)]
          const size = Math.random() > 0.8 ? 'w-3 h-3' : Math.random() > 0.5 ? 'w-2 h-2' : 'w-1 h-1'
          return (
            <div 
              key={`geo-${i}`}
              className={`absolute ${size} bg-primary/60 ${shape} animate-float-slow`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`,
                opacity: Math.random() * 0.6 + 0.1
              }}
            />
          )
        })}
      </div>

      {/* Line Particles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(25)].map((_, i) => {
          const width = Math.random() > 0.7 ? 'w-8' : Math.random() > 0.4 ? 'w-6' : 'w-4'
          const height = 'h-[1px]'
          return (
            <div 
              key={`line-${i}`}
              className={`absolute ${width} ${height} bg-accent/40 animate-float`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: Math.random() * 0.5 + 0.2,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          )
        })}
      </div>

      {/* Vertical Scanning Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="absolute right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        <div className="w-full h-[2px] bg-primary/20 shadow-[0_0_20px_rgba(251,146,60,0.4)] absolute top-0 animate-scan" />
      </div>

      {/* --- LAYER 3: THE "REFLECTION" FLOOR --- */}
      <div className="absolute bottom-0 w-full h-[40vh] reflection-mask pointer-events-none">
        {/* Mirroring the primary light strips from the character's armor */}
        <div className="absolute bottom-10 left-0 w-full h-[2px] bg-primary/40 blur-sm animate-drift" />
        <div className="absolute bottom-20 left-0 w-full h-[1px] bg-accent/20 blur-[1px] animate-drift [animation-delay:2s]" />
        
        {/* Glow Reflection Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-gradient-to-t from-primary/10 to-transparent blur-3xl" />
      </div>

      {/* --- LAYER 4: INTERACTIVE SENSOR & NOISE --- */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none mix-blend-overlay" />

      {/* The Mouse Sensor Spotlight */}
      <div 
        className="absolute w-[600px] h-[600px] bg-primary/15 rounded-full blur-[110px] transition-opacity duration-700 pointer-events-none mix-blend-screen"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: opacity
        }}
      />
    </div>
  )
}