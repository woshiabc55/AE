import { useRef, useCallback, type InputHTMLAttributes } from 'react';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  dragSpeed?: number;
}

export default function NumberInput({
  value,
  onChange,
  step = 0.1,
  min,
  max,
  label,
  dragSpeed = 0.01,
  ...rest
}: NumberInputProps) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startValue = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startValue.current = value;

      const handleMouseMove = (me: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = (me.clientX - startX.current) * dragSpeed;
        let newValue = startValue.current + delta;
        if (step >= 1) newValue = Math.round(newValue);
        if (min !== undefined) newValue = Math.max(min, newValue);
        if (max !== undefined) newValue = Math.min(max, newValue);
        onChange(parseFloat(newValue.toFixed(4)));
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [value, dragSpeed, step, min, max, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v)) {
        let nv = v;
        if (min !== undefined) nv = Math.max(min, nv);
        if (max !== undefined) nv = Math.min(max, nv);
        onChange(nv);
      }
    },
    [min, max, onChange]
  );

  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span className="w-5 flex-shrink-0 text-[10px] font-medium text-white/40">{label}</span>
      )}
      <input
        type="number"
        value={parseFloat(value.toFixed(4))}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        step={step}
        min={min}
        max={max}
        className="w-full rounded border border-[#0f3460]/60 bg-[#0a0a1a] px-2 py-1 font-mono text-xs text-white/80 outline-none transition-colors focus:border-[#00d4aa]/50"
        {...rest}
      />
    </div>
  );
}
