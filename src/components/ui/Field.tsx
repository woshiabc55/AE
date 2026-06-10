import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'
import { Shuffle } from 'lucide-react'

interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
  required?: boolean
}

export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-mono-ui text-bone-300 tracking-widest uppercase">
          {label}
          {required && <span className="text-amber-500 ml-1">*</span>}
        </span>
        {hint && <span className="text-[10px] text-bone-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] text-curtain-400 font-mono-ui">{error}</p>}
    </label>
  )
}

const baseInput =
  'w-full bg-ink-950 border border-ink-700 text-bone-50 placeholder:text-bone-400 rounded-[6px] px-3 py-2.5 font-mono-ui text-[13px] focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 transition-colors'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onShuffle?: () => void
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', onShuffle, ...rest }, ref) => {
    return (
      <div className="relative">
        <input ref={ref} className={`${baseInput} ${onShuffle ? 'pr-9' : ''} ${className}`} {...rest} />
        {onShuffle && (
          <button
            type="button"
            onClick={onShuffle}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-bone-400 hover:text-amber-400 p-1 rounded transition-colors"
            aria-label="随机灵感"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  },
)
TextInput.displayName = 'TextInput'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...rest }, ref) => {
    return <textarea ref={ref} className={`${baseInput} leading-relaxed ${className}`} {...rest} />
  },
)
Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={`${baseInput} appearance-none pr-8 cursor-pointer ${className}`}
        {...rest}
      >
        {children}
      </select>
    )
  },
)
Select.displayName = 'Select'
