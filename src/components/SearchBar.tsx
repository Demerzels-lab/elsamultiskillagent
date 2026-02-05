import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  large?: boolean
}

export function SearchBar({ value, onChange, placeholder = 'Search skills...', large = false }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary ${
          large ? 'w-6 h-6' : 'w-5 h-5'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-neon w-full ${
          large ? 'h-16 pl-14 pr-12 text-lg' : 'h-12 pl-12 pr-10'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors ${
            large ? 'p-1' : ''
          }`}
        >
          <X className={large ? 'w-6 h-6' : 'w-5 h-5'} />
        </button>
      )}
    </div>
  )
}
