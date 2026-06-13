import { useEffect, useState } from 'react';
import { useAtelier } from '../store/useAtelier';

// 监听 pulseAt 变化，返回"刚刚脉冲"的布尔标志（用于节点短暂高亮）
export function usePulse(hold = 360) {
  const pulseAt = useAtelier((s) => s.pulseAt);
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!pulseAt) return;
    setPulse(true);
    const id = setTimeout(() => setPulse(false), hold);
    return () => clearTimeout(id);
  }, [pulseAt, hold]);
  return pulse;
}
