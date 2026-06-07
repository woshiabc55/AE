import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// 镜头间的过场动画 — 模拟"水下下沉"的视觉
// 当镜头滚动到下一张时，从底部升起的暗潮 + 血线下滑
export default function DepthTransition() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // 当 scroll 位置接近整页 1/n 边界时触发
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pos = window.scrollY;
      const progress = pos / total;
      // 模拟每张幻灯片即将切换
      const segment = Math.floor(progress * 7); // 7 个段落 (Hero / Agenda / 5 shots)
      setActive(segment > 0 && segment < 7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 顶部血线 — 滚动时血线下移 4px */}
      <motion.div
        animate={{ opacity: active ? [0.3, 0.6, 0.3] : 0.3 }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood to-transparent z-20"
      />

      {/* 左侧深度暗潮 — 持续向上流动的暗线 */}
      <div className="fixed left-0 top-0 bottom-0 w-px pointer-events-none z-20 hidden lg:block overflow-hidden">
        <motion.div
          className="w-full h-32 bg-gradient-to-b from-transparent via-blood/30 to-transparent"
          animate={{ y: ["-100%", "100vh"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 右侧深度暗潮 */}
      <div className="fixed right-0 top-0 bottom-0 w-px pointer-events-none z-20 hidden lg:block overflow-hidden">
        <motion.div
          className="w-full h-24 bg-gradient-to-b from-transparent via-cyan/30 to-transparent"
          animate={{ y: ["-100%", "100vh"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </div>
    </>
  );
}
