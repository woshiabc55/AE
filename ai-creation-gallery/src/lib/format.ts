/** 格式化热度数字：12340 -> 12.3k，184200 -> 184k */
export function formatHeat(n: number): string {
  if (n >= 10000) {
    const v = n / 1000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}k`;
  }
  return String(n);
}

/** 格式化日期 YYYY-MM-DD -> YYYY.MM.DD */
export function formatDate(iso: string): string {
  return iso.replace(/-/g, ".");
}
