#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成项目清单 (manifest.json) — 描述整个《哥窑》项目的文件结构、用途、统计信息。

输出：
  /workspace/downloads/哥窑_项目清单.json
"""
import os
import json
import datetime
from pathlib import Path

ROOT = Path('/workspace')
OUT  = ROOT / 'downloads' / '哥窑_项目清单.json'

# 目录用途注释
DIR_PURPOSE = {
    'assets/css':         '样式表目录',
    'assets/css/components': '14 个可复用组件 CSS + 设计令牌',
    'assets/js':          '脚本目录',
    'assets/js/components': '组件 JS 模块（flame / toc）',
    'assets/img':         '图片资源',
    'downloads':          '可下载资源（pptx / zip / 单文件HTML / 项目清单）',
    'scripts':            '项目构建脚本',
    '.trae/documents':    'PRD 产品文档 + 技术架构',
}

# 顶层 HTML 用途注释
HTML_PURPOSE = {
    'index.html':                  '主 PPT 旧版（14 张）',
    'ppt.html':                    '正式文稿 PPT（24 张，含下载）',
    'theme.html':                  '主旨专题',
    'essay.html':                  '深度解读',
    'gallery.html':                '资源索引',
    'character-zhangji.html':      '哥哥 · 张寄 档案',
    'character-zhangzhiyuan.html': '弟弟 · 张志元 档案',
    'act-1.html':                  '第一幕 · 历史回溯',
    'act-2.html':                  '第二幕 · 贡品之印',
    'act-3.html':                  '第三幕 · 窑火成瓷',
    'components.html':             '组件库演示（Storybook 风格）',
    'export.html':                 '项目导出门户',
}

def is_text(p: Path) -> bool:
    try:
        with open(p, 'rb') as f:
            chunk = f.read(512)
        return b'\x00' not in chunk
    except Exception:
        return False

def build_tree() -> dict:
    files = []
    total_size = 0
    html_count = css_count = js_count = md_count = py_count = other_count = 0

    SKIP = {'.trae', '.git', '__pycache__', 'node_modules', 'dist'}

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP]
        rel_dir = os.path.relpath(dirpath, ROOT)
        for fn in filenames:
            full = Path(dirpath) / fn
            rel  = str(full.relative_to(ROOT))
            try:
                size = full.stat().st_size
            except OSError:
                continue
            total_size += size

            ext = full.suffix.lower()
            if   ext == '.html': html_count += 1
            elif ext == '.css':  css_count  += 1
            elif ext == '.js':   js_count   += 1
            elif ext == '.md':   md_count   += 1
            elif ext == '.py':   py_count   += 1
            else:                other_count += 1

            entry = {
                'path': rel,
                'size': size,
                'type': ext.lstrip('.') or 'file',
                'text': is_text(full),
            }
            if rel in HTML_PURPOSE:
                entry['purpose'] = HTML_PURPOSE[rel]
            files.append(entry)

    # 顶层 HTML 按用途注解
    tree = {
        'name'     : '哥窑 · 主旨解读项目',
        'theme'    : '窑火如歌，兄弟如线',
        'version'  : 'v1.0',
        'generated': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'summary'  : {
            'total_files':   len(files),
            'total_size_b':  total_size,
            'total_size_kb': round(total_size / 1024, 1),
            'total_size_mb': round(total_size / 1024 / 1024, 2),
            'by_type': {
                'html':  html_count,
                'css':   css_count,
                'js':    js_count,
                'md':    md_count,
                'py':    py_count,
                'other': other_count,
            },
        },
        'characters': {
            'elder_brother'  : '张寄 · 守护者 · 理性 · 承担',
            'younger_brother': '张志元 · 探索者 · 感性 · 天赋',
            'note'           : '此为唯一正确设定（脚本中"章生一"、"张志耀"为笔误）',
        },
        'stats': {
            'slides'   : 24,
            'shots'    : 66,
            'acts'     : 3,
            'components': 15,
            'html_pages': html_count,
        },
        'downloads': {
            'pptx'  : 'downloads/哥窑_主旨解读.pptx',
            'zip'   : 'downloads/哥窑_主旨解读_HTML包.zip',
            'single': 'downloads/哥窑_主旨解读_单文件.html',
        },
        'directory_purpose': DIR_PURPOSE,
        'files': files,
    }
    return tree

def main() -> int:
    tree = build_tree()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(tree, f, ensure_ascii=False, indent=2)
    size = OUT.stat().st_size
    by = tree['summary']['by_type']
    print(f'✓ 已生成：{OUT}')
    print(f'  大小：{size/1024:.1f} KB')
    print(f'  文件数：{tree["summary"]["total_files"]}')
    print(f'  HTML：{by["html"]} · CSS：{by["css"]} · JS：{by["js"]} · MD：{by["md"]} · PY：{by["py"]}')
    return 0

if __name__ == '__main__':
    exit(main())
