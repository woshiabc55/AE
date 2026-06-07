#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将整个 /workspace 项目打包为可下载的 ZIP
"""
import os
import zipfile

ROOT = '/workspace'
OUT  = '/workspace/downloads/哥窑_主旨解读_HTML包.zip'

# 需要排除的目录和文件
EXCLUDE_DIRS = {'.trae', 'node_modules', '.git', '__pycache__', 'dist', 'scripts'}
EXCLUDE_FILES = {'.DS_Store'}

# 包含的文件
INCLUDE_TOP = ['index.html', 'ppt.html', 'theme.html', 'essay.html', 'gallery.html',
               'character-zhangji.html', 'character-zhangzhiyuan.html',
               'act-1.html', 'act-2.html', 'act-3.html', 'components.html',
               'README.md']

count = 0
total_size = 0
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as zf:
    # 顶层 HTML 与 README
    for f in INCLUDE_TOP:
        path = os.path.join(ROOT, f)
        if os.path.isfile(path):
            zf.write(path, f)
            count += 1
            total_size += os.path.getsize(path)
            print(f'+ {f}  ({os.path.getsize(path)} bytes)')

    # 66 个分镜
    for i in range(1, 67):
        f = f'shot-{i:02d}.html'
        path = os.path.join(ROOT, f)
        if os.path.isfile(path):
            zf.write(path, f)
            count += 1
            total_size += os.path.getsize(path)

    # assets/css, assets/js, assets/img
    for sub in ['assets/css', 'assets/js', 'assets/img']:
        dirpath = os.path.join(ROOT, sub)
        if not os.path.isdir(dirpath):
            continue
        for root, dirs, files in os.walk(dirpath):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for fn in files:
                if fn in EXCLUDE_FILES:
                    continue
                full = os.path.join(root, fn)
                rel  = os.path.relpath(full, ROOT)
                zf.write(full, rel)
                count += 1
                total_size += os.path.getsize(full)
                print(f'+ {rel}  ({os.path.getsize(full)} bytes)')

print(f'\n=== 已打包 {count} 个文件 ({total_size/1024:.1f} KB) ===')
print(f'输出: {OUT}  ({os.path.getsize(OUT)} bytes)')
