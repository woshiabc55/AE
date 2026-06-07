import { useCallback, useState } from "react";

export function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState(false);
  const cb = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        // 退化方案
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), timeout);
        } catch {
          /* noop */
        }
        document.body.removeChild(ta);
        return false;
      }
    },
    [timeout],
  );
  return { copied, copy: cb };
}
