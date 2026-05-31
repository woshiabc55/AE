import { useState, useCallback } from 'react'
import { Delete } from 'lucide-react'

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [isNewNumber, setIsNewNumber] = useState(true)

  const handleNumber = useCallback(
    (num: string) => {
      if (isNewNumber) {
        setDisplay(num)
        setIsNewNumber(false)
      } else {
        setDisplay((prev) => (prev === '0' ? num : prev + num))
      }
    },
    [isNewNumber]
  )

  const handleOperator = useCallback(
    (op: string) => {
      setExpression((prev) => {
        const newExpr = prev + display + ' ' + op + ' '
        return newExpr
      })
      setIsNewNumber(true)
    },
    [display]
  )

  const handleEquals = useCallback(() => {
    try {
      const fullExpr = expression + display
      const sanitized = fullExpr.replace(/[^0-9+\-*/.() ]/g, '')
      const result = new Function('return ' + sanitized)()
      const resultStr = typeof result === 'number' ? String(parseFloat(result.toFixed(10))) : 'Error'
      setDisplay(resultStr)
      setExpression('')
      setIsNewNumber(true)
    } catch {
      setDisplay('Error')
      setExpression('')
      setIsNewNumber(true)
    }
  }, [expression, display])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setIsNewNumber(true)
  }, [])

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay((prev) => prev.slice(0, -1))
    } else {
      setDisplay('0')
      setIsNewNumber(true)
    }
  }, [display])

  const handleDecimal = useCallback(() => {
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.')
      setIsNewNumber(false)
    }
  }, [display])

  const Button = ({
    label,
    onClick,
    className = '',
    wide = false,
  }: {
    label: string | React.ReactNode
    onClick: () => void
    className?: string
    wide?: boolean
  }) => (
    <button
      className={`${wide ? 'col-span-2' : ''} h-12 rounded-xl text-sm font-medium
        transition-all duration-100 active:scale-95 ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col h-full bg-[#0d1117] p-3">
      <div className="mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
        <div className="text-right text-[11px] text-white/25 h-4 truncate">
          {expression}
        </div>
        <div className="text-right text-2xl text-white/90 font-light tabular-nums truncate">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 flex-1">
        <Button label="C" onClick={handleClear} className="bg-red-500/20 text-red-400 hover:bg-red-500/30" />
        <Button
          label={<Delete size={16} />}
          onClick={handleBackspace}
          className="bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"
        />
        <Button label="%" onClick={() => handleOperator('%')} className="bg-white/[0.06] text-white/60 hover:bg-white/[0.1]" />
        <Button label="÷" onClick={() => handleOperator('/')} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" />

        <Button label="7" onClick={() => handleNumber('7')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="8" onClick={() => handleNumber('8')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="9" onClick={() => handleNumber('9')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="×" onClick={() => handleOperator('*')} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" />

        <Button label="4" onClick={() => handleNumber('4')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="5" onClick={() => handleNumber('5')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="6" onClick={() => handleNumber('6')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="−" onClick={() => handleOperator('-')} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" />

        <Button label="1" onClick={() => handleNumber('1')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="2" onClick={() => handleNumber('2')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="3" onClick={() => handleNumber('3')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="+" onClick={() => handleOperator('+')} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" />

        <Button label="0" onClick={() => handleNumber('0')} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" wide />
        <Button label="." onClick={handleDecimal} className="bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" />
        <Button label="=" onClick={handleEquals} className="bg-blue-500 text-white hover:bg-blue-600" />
      </div>
    </div>
  )
}
