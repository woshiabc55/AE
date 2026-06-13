import { useCallback, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import type { Track } from "@/data/tracks";

/**
 * 音乐文件上传 hook
 * - 通过 input[type=file] 选取音频文件
 * - 通过 URL.createObjectURL 创建可播放 URL
 * - 解析元数据（时长）后加入播放列表
 * - 自动切到新曲目并播放
 */
export function useFileUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addTrack = usePlayerStore((s) => s.addTrack);
  const setError = usePlayerStore((s) => s.setUploadError);
  const audioEl = usePlayerStore((s) => s.audioEl);

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!/^audio\//.test(f.type) && !/\.(mp3|wav|ogg|m4a|flac|aac|opus|webm)$/i.test(f.name)) {
          setError(`不支持的格式: ${f.name}`);
          continue;
        }
        try {
          const url = URL.createObjectURL(f);
          const dur = await readDuration(url);
          const t: Track = {
            id: `up-${Date.now()}-${i}`,
            title: stripExt(f.name).slice(0, 32).toUpperCase() || "UNTITLED",
            artist: `UPLOADED · ${formatSize(f.size)}`,
            cover:
              "linear-gradient(135deg,#262B33 0%,#FF2A2A 50%,#7CF6FF 100%)",
            src: url,
            bpm: 0,
            dur: formatHHMMSS(dur),
          };
          addTrack(t);
          // 切到新曲目并播放
          if (audioEl) {
            audioEl.src = url;
            audioEl.load();
            audioEl.play().catch(() => undefined);
          }
        } catch {
          setError(`解析失败: ${f.name}`);
        }
      }
    },
    [addTrack, audioEl, setError]
  );

  return {
    inputRef,
    open,
    handleFiles,
  };
}

function stripExt(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function formatHHMMSS(s: number) {
  if (!s || !isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function readDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const a = new Audio();
    a.preload = "metadata";
    a.src = url;
    const onMeta = () => {
      resolve(a.duration || 0);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("error", onErr);
    };
    const onErr = () => {
      resolve(0);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("error", onErr);
    };
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("error", onErr);
  });
}
