// 简单的差异算法（按行 LCS 变种）
export interface DiffLine {
  type: "same" | "add" | "del";
  text: string;
  oldIdx?: number;
  newIdx?: number;
}

export function diffLines(a: string, b: string): DiffLine[] {
  const A = a.split("\n");
  const B = b.split("\n");
  const n = A.length;
  const m = B.length;
  // LCS 长度矩阵
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (A[i] === B[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      out.push({ type: "same", text: A[i], oldIdx: i, newIdx: j });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "del", text: A[i], oldIdx: i });
      i++;
    } else {
      out.push({ type: "add", text: B[j], newIdx: j });
      j++;
    }
  }
  while (i < n) { out.push({ type: "del", text: A[i++], oldIdx: i }); }
  while (j < m) { out.push({ type: "add", text: B[j++], newIdx: j }); }
  return out;
}

export function diffStats(diff: DiffLine[]) {
  let added = 0, removed = 0, same = 0;
  for (const d of diff) {
    if (d.type === "add") added++;
    else if (d.type === "del") removed++;
    else same++;
  }
  return { added, removed, same };
}
