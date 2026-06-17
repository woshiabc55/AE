import { useEffect } from "react";
import { preloadImages } from "./useImagePreload";

/**
 * 在组件挂载时预热一批图片 URL。
 * 默认以隐藏 <link rel="preload"> 方式批量预热，确保首屏可立即命中浏览器缓存。
 */
export function usePreloadImages(urls: string[]): void {
  useEffect(() => {
    preloadImages(urls);
  }, [urls]);
}
