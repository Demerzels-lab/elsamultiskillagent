import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  large?: boolean
}

export function SearchBar({ value, onChange, placeholder = 'Search skills...', large = false }: SearchBarProps) {
  return (
    <div className="relative w-full group">
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary/50 transition-colors ${
          large ? 'w-6 h-6' : 'w-5 h-5'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-black border border-white/10 rounded-xl text-white placeholder:text-white/20 outline-none focus:border-primary/50 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(var(--primary),0.1)] transition-all ${
          large ? 'h-16 pl-14 pr-12 text-lg' : 'h-12 pl-12 pr-10 text-base'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors ${
            large ? 'p-1' : ''
          }`}
        >
          <X className={large ? 'w-6 h-6' : 'w-5 h-5'} />
        </button>
      )}
    </div>
  )
}