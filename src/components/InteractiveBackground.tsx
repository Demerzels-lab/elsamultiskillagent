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
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* The "Spotlight" Glow */}
      <div 
        className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] transition-opacity duration-500"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: opacity
        }}
      />

      {/* Static Atmospheric Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[128px] translate-y-1/2 -translate-x-1/2 opacity-50" />

      {/* Scanline / Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #808080 1px, transparent 1px),
            linear-gradient(to bottom, #808080 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  )
}