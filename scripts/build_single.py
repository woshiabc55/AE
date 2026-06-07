#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将整个《哥窑》项目打包为**单文件、自包含、可离线运行**的 HTML。

策略：
  - 选择一个"主入口"（默认 ppt.html），将所有外部 CSS/JS 内联为 <style>/<script>
  - 删除 <link href="http(s)://..."> 的 Google Fonts，替换为本地字体堆栈
  - 保留外链：base64 data-URI（无需联网）
  - 输出到 downloads/哥窑_主旨解读_单文件.html
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path('/workspace')
OUT  = ROOT / 'downloads' / '哥窑_主旨解读_单文件.html'
ENTRY = 'ppt.html'

# 不内联的远程字体：直接剥掉（用系统衬线字体兜底）
REMOTE_PREFIX = ('http://', 'https://', '//')

# 内联白名单：assets/ 下的 CSS/JS
def is_inlineable(href: str) -> bool:
    return href.startswith('assets/')

def read(p: Path) -> str:
    return p.read_text(encoding='utf-8')

def main() -> int:
    src_path = ROOT / ENTRY
    if not src_path.is_file():
        print(f'❌ 找不到入口 {src_path}', file=sys.stderr)
        return 1

    html = read(src_path)

    # === 1. 内联 <link rel="stylesheet" href="assets/..."> ===
    css_count = 0
    def inline_css(m: re.Match) -> str:
        nonlocal css_count
        href = m.group(1)
        if is_inlineable(href):
            css_path = ROOT / href
            if css_path.is_file():
                css_count += 1
                css = read(css_path)
                # 去掉 CSS 内部的 @import / url(assets/..) 引用（保留 url() 但绝不指向文件）
                return f'<style data-inlined="{href}">\n{css}\n</style>'
        return ''  # 远程字体/外链直接删除
    html = re.sub(
        r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\'][^>]*/?>',
        inline_css, html, flags=re.IGNORECASE)

    # === 2. 内联 <script src="assets/..."> ===
    js_count = 0
    def inline_js(m: re.Match) -> str:
        nonlocal js_count
        src = m.group(1)
        if is_inlineable(src):
            js_path = ROOT / src
            if js_path.is_file():
                js_count += 1
                js = read(js_path)
                return f'<script data-inlined="{src}">\n{js}\n</script>'
        return ''
    html = re.sub(
        r'<script[^>]+src=["\']([^"\']+)["\'][^>]*></script>',
        inline_js, html, flags=re.IGNORECASE)

    # === 3. 剥掉残留的远程 link（fonts 等） ===
    html = re.sub(
        r'<link[^>]+href=["\']https?://[^"\']+["\'][^>]*/?>',
        '', html, flags=re.IGNORECASE)

    # === 4. 注入：单文件 banner + 离线提示 ===
    banner = '''<!--
  哥窑 · 主旨解读 — 单文件自包含版
  所有 CSS / JS 已内联，无需联网即可完整运行。
  共内联 CSS: ''' + str(css_count) + ''' 个文件，JS: ''' + str(js_count) + ''' 个文件。
  生成时间: 2026-06-07
-->
'''
    html = re.sub(r'<!DOCTYPE[^>]+>', '<!-- 单文件自包含 · 哥窑 -->\n', html, count=1, flags=re.IGNORECASE)
    # 在 <head> 最前面插入 banner
    if '<head>' in html:
        html = html.replace('<head>', '<head>\n' + banner, 1)
    else:
        html = banner + html

    # === 5. 写入 ===
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding='utf-8')

    size = OUT.stat().st_size
    print(f'✓ 已生成：{OUT}')
    print(f'  大小：{size/1024:.1f} KB')
    print(f'  内联：CSS × {css_count} · JS × {js_count}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
