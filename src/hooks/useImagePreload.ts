/**
 * 预加载图片 — 把一批 URL 在后台 fetch 出来塞进浏览器缓存。
 * 即使跨域/无权限，只要 image 标签加过 src，浏览器就会自动缓存。
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === "undefined") return;
  urls.forEach((url) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = url;
  });
}
