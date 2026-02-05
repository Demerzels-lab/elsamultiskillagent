import { useEffect, useState, useRef } from 'react'

interface StatsCounterProps {
  totalSkills: number
  totalCategories: number
  totalAuthors: number
}

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(value * easeOut))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return <span ref={ref}>{displayValue.toLocaleString()}</span>
}

export function StatsCounter({ totalSkills, totalCategories, totalAuthors }: StatsCounterProps) {
  const stats = [
    { label: 'Skills', value: totalSkills, suffix: '+' },
    { label: 'Categories', value: totalCategories },
    { label: 'Authors', value: totalAuthors, suffix: '+' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-brand mb-1">
            <AnimatedNumber value={stat.value} />
            {stat.suffix}
          </div>
          <div className="text-sm md:text-base text-text-secondary">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
