import { useEffect, useRef } from 'react';
import type { KeyState } from '@/utils/types';
import { KEY_MAP } from '@/utils/constants';

const allKeys = new Set<string>();
Object.values(KEY_MAP).forEach((map) => {
  Object.values(map).forEach((key) => allKeys.add(key));
});

export function useInput(): React.MutableRefObject<KeyState> {
  const keysRef = useRef<KeyState>({
    red: {},
    blue: {},
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allKeys.has(e.code)) {
        e.preventDefault();
      }
      if (e.repeat) return;

      if (Object.values(KEY_MAP.red).includes(e.code)) {
        keysRef.current.red[e.code] = true;
      }
      if (Object.values(KEY_MAP.blue).includes(e.code)) {
        keysRef.current.blue[e.code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (Object.values(KEY_MAP.red).includes(e.code)) {
        keysRef.current.red[e.code] = false;
      }
      if (Object.values(KEY_MAP.blue).includes(e.code)) {
        keysRef.current.blue[e.code] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keysRef;
}
