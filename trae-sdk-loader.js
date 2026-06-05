// trae-sdk-loader.js · 可选的真实 SDK 加载器
// 在生产环境中，将 <script src="..."> 指向你的真实 TRAE SDK 即可。
// 这里暴露一个示例：window.TRAE = { name, version, validateShot, suggestShot }

(function () {
  // 若页面已经定义了真实 SDK，则不覆盖
  if (window.TRAE && typeof window.TRAE.validateShot === "function") return;

  // 简单的"看起来像真实"的延迟校验器（仍可视为 mock 演示）
  window.TRAE = {
    name: "TRAE-SDK-DEMO",
    version: "0.1.0",
    async validateShot(prev, cur, next) {
      await new Promise(r => setTimeout(r, 80));
      const issues = [];
      const suggestions = [];
      if (!cur.shotSize) issues.push({ level: "error", field: "shotSize", msg: "缺少景别" });
      if (!cur.movement) issues.push({ level: "error", field: "movement", msg: "缺少运镜" });
      if (cur.duration < 0.5 || cur.duration > 15) issues.push({ level: "warn", field: "duration", msg: "时长超出推荐区间" });
      if (prev && next && prev.shotSize === cur.shotSize && cur.shotSize === next.shotSize) {
        issues.push({ level: "warn", field: "shotSize", msg: "连续三镜同景别" });
      }
      let score = 100;
      for (const it of issues) score -= it.level === "error" ? 18 : it.level === "warn" ? 8 : 2;
      score = Math.max(0, Math.min(100, score));
      if (!cur.sfx) suggestions.push("未配置音效");
      if (cur.movement === "static" && cur.duration > 5) suggestions.push("固定镜头超 5s，可加 dolly");
      return { ok: !issues.some(i => i.level === "error"), score, issues, suggestions };
    },
    async suggestShot(p) {
      await new Promise(r => setTimeout(r, 60));
      return Object.assign({ shotSize: "MS", movement: "static", cameraAngle: "平视", duration: 3 }, p);
    }
  };
  // 标记 SDK 已注入
  document.documentElement.dataset.traeSdk = "loaded";
  console.info("[TRAE] demo SDK injected");
})();
