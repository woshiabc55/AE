import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

/**
 * 隐藏的 <audio> 元素，统一驱动所有真实音频的播放/暂停/进度。
 * - 维护 store.audioEl 引用
 * - 监听 timeupdate / loadedmetadata / ended / error
 * - 出错时自动暂停
 */
export default function AudioController() {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    const store = usePlayerStore.getState();
    store.setAudioEl(audio);
    audio.volume = store.volume;
    audio.preload = "metadata";

    const onTime = () => {
      if (audio.duration && isFinite(audio.duration)) {
        usePlayerStore.setState({
          currentTime: audio.currentTime / audio.duration,
        });
      }
    };
    const onMeta = () => {
      if (audio.duration && isFinite(audio.duration)) {
        usePlayerStore.setState({ duration: audio.duration });
      }
    };
    const onEnd = () => {
      usePlayerStore.getState().next();
    };
    const onErr = () => {
      usePlayerStore.setState({ playing: false, uploadError: "音频加载失败" });
    };
    const onCanPlay = () => {
      usePlayerStore.setState({ uploadError: null });
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onErr);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onErr);
      audio.removeEventListener("canplay", onCanPlay);
      usePlayerStore.getState().setAudioEl(null);
    };
  }, []);

  return <audio ref={ref} className="hidden" preload="metadata" />;
}
