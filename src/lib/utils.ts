// 通用工具函数
export const cn = (...args: (string | false | null | undefined)[]) =>
  args.filter(Boolean).join(" ");

export const formatTime = (s: number) => {
  if (s < 10) return `0${s}`;
  return `${s}`;
};
