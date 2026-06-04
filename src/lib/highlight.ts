// 轻量级代码高亮：仅做标签和字符串的着色，不引入大依赖
const KEYWORDS = new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'new', 'class', 'this', 'import', 'from', 'export', 'default', 'true', 'false', 'null', 'undefined', 'in', 'of', 'typeof', 'instanceof', 'throw', 'try', 'catch']);
const HTML_TAGS = /(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g;

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlight(src: string): string {
  let s = escapeHtml(src);
  // strings
  s = s.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span style="color:#f0ff00">$1</span>');
  // html tags
  s = s.replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g, '$1<span style="color:#ff3da5">$2</span>');
  // comments
  s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#5c5c5c;font-style:italic">$1</span>');
  // numbers
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color:#00e5ff">$1</span>');
  // keywords (simple word boundary)
  s = s.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (m) => KEYWORDS.has(m) ? `<span style="color:#ff3da5;font-weight:700">${m}</span>` : m);
  // css properties (rough): lines starting with word + colon
  s = s.replace(/(^|\n)([a-zA-Z-]+)(:)/g, '$1<span style="color:#00e5ff">$2</span>$3');
  return s;
}
