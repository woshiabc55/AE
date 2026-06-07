#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
哥窑项目 · 优化版静态服务器（单文件零依赖）
========================================
特性：
  · 零依赖（仅 Python 3.7+ 标准库）
  · 正确 MIME 类型（完整映射，含 .woff2/.webp/.ico/.map）
  · 强缓存 + 协商缓存（Cache-Control + ETag）
  · Gzip 压缩（text/html, text/css, application/javascript, application/json, image/svg+xml）
  · 范围请求（Range / 206 Partial Content）—— 重要，给 image 用
  · 请求日志（access.log）
  · 健康检查端点 /api/health
  · 目录结构 API  /api/structure
  · 自定义 404 / 500 页面
  · 防止目录穿越（os.path.realpath + relpath 校验）
  · 后台守护（--daemon）+ PID 文件
  · 优雅关闭（SIGINT/SIGTERM）
  · 多线程（ThreadingHTTPServer）

用法：
  python3 server.py                    # 前台运行，默认端口 8765
  python3 server.py --port 9000        # 指定端口
  python3 server.py --daemon           # 后台守护
  python3 server.py --stop             # 停止后台实例
  python3 server.py --status           # 查看状态
  python3 server.py --no-gzip          # 关闭压缩
"""

import argparse
import gzip
import hashlib
import json
import logging
import mimetypes
import os
import signal
import socketserver
import sys
import threading
import time
from datetime import datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

# ============================================================
# 配置
# ============================================================
ROOT = Path(__file__).resolve().parent
PID_FILE = ROOT / ".server.pid"
LOG_DIR = ROOT / "logs"
ACCESS_LOG = LOG_DIR / "access.log"
ERROR_LOG = LOG_DIR / "error.log"
DEFAULT_PORT = 8765
DEFAULT_HOST = "0.0.0.0"

# 完整 MIME 映射（补充 mimetypes 缺失的扩展名）
EXTRA_MIME_TYPES = {
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".svg": "image/svg+xml; charset=utf-8",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".eot": "application/vnd.ms-fontobject",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".wasm": "application/wasm",
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".html": "text/html; charset=utf-8",
    ".htm": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
}

# 可压缩类型
COMPRESSIBLE_TYPES = {
    "text/html",
    "text/css",
    "text/plain",
    "text/xml",
    "text/markdown",
    "text/javascript",
    "application/javascript",
    "application/json",
    "application/xml",
    "application/xml+rss",
    "application/manifest+json",
    "image/svg+xml",
    "font/ttf",
    "font/otf",
}

# 缓存策略：(max-age, immutable?)
CACHE_RULES = {
    # 静态资源 — 长缓存 + immutable
    (".css", ".js", ".mjs", ".map", ".woff", ".woff2", ".ttf", ".otf", ".eot",
     ".webp", ".avif", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".mp4",
     ".webm", ".mp3", ".ogg", ".wasm", ".pdf"): (31536000, True),
    # 数据 JSON — 短缓存
    (".json", ".xml", ".webmanifest"): (300, False),
    # HTML — 不缓存（让更新即时生效）
    (".html", ".htm"): (0, False),
}

# ============================================================
# 工具
# ============================================================
def get_mime_type(path: str) -> str:
    """综合 mimetypes + 自定义扩展名映射"""
    ext = os.path.splitext(path)[1].lower()
    if ext in EXTRA_MIME_TYPES:
        return EXTRA_MIME_TYPES[ext]
    mime, _ = mimetypes.guess_type(path)
    return mime or "application/octet-stream"


def is_compressible(mime: str) -> bool:
    base = mime.split(";")[0].strip().lower()
    return base in COMPRESSIBLE_TYPES


def get_cache_control(ext: str) -> str:
    ext = ext.lower()
    for exts, (max_age, immutable) in CACHE_RULES.items():
        if ext in exts:
            parts = [f"public", f"max-age={max_age}"]
            if immutable:
                parts.append("immutable")
            return ", ".join(parts)
    return "public, max-age=0, must-revalidate"


def make_etag(stat, mime: str) -> str:
    """基于文件大小 + mtime + MIME 计算弱 ETag"""
    raw = f"{stat.st_size}-{int(stat.st_mtime)}-{mime}"
    return 'W/"' + hashlib.md5(raw.encode()).hexdigest()[:16] + '"'


def human_size(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f} {unit}" if unit != "B" else f"{n} {unit}"
        n /= 1024
    return f"{n:.1f} TB"


def setup_logging(quiet: bool = False):
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    fmt = "%(asctime)s [%(levelname)s] %(message)s"

    # access log
    access = logging.getLogger("access")
    access.setLevel(logging.INFO)
    access.handlers.clear()
    h = logging.FileHandler(ACCESS_LOG, encoding="utf-8")
    h.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
    access.addHandler(h)
    access.propagate = False

    # error log
    err = logging.getLogger("error")
    err.setLevel(logging.INFO)
    err.handlers.clear()
    h = logging.FileHandler(ERROR_LOG, encoding="utf-8")
    h.setFormatter(logging.Formatter(fmt))
    err.addHandler(h)
    err.propagate = False


# ============================================================
# 请求处理器
# ============================================================
class OptimizedHandler(SimpleHTTPRequestHandler):
    server_version = "GeKiln/1.0"
    enable_gzip = True

    # 颜色化日志（终端可读）
    def log_message(self, format, *args):
        access = logging.getLogger("access")
        access.info("%s - %s", self.address_string(), format % args)

    def log_error(self, format, *args):
        err = logging.getLogger("error")
        err.error("%s - %s", self.address_string(), format % args)

    # ---------------- 工具方法 ----------------
    DENY_PATH_PARTS = {".git", "logs", ".server.pid", "__pycache__"}

    def _safe_path(self, url_path: str) -> Path:
        """防止目录穿越 + 拒绝受保护路径"""
        # 去掉 query string
        clean = url_path.split("?", 1)[0].split("#", 1)[0]
        # 去除前导斜杠
        rel = clean.lstrip("/")
        # 拼接 + 解析
        target = (ROOT / rel).resolve()
        try:
            target.relative_to(ROOT)
        except ValueError:
            raise PermissionError("Path traversal blocked")
        # 拒绝隐藏目录与受保护目录
        parts = target.relative_to(ROOT).parts
        for part in parts:
            if part.startswith(".") or part in self.DENY_PATH_PARTS:
                raise PermissionError(f"Access to {part} blocked")
        return target

    def _send_headers(self, status: HTTPStatus, length: int, mime: str,
                       extra: dict = None, accept_ranges: bool = False):
        self.send_response(status)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(length))
        self.send_header("Cache-Control", get_cache_control(os.path.splitext(self.path)[1]))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Server", self.server_version)
        if accept_ranges:
            self.send_header("Accept-Ranges", "bytes")
        if extra:
            for k, v in extra.items():
                self.send_header(k, v)
        self.end_headers()

    def _send_error_page(self, status: HTTPStatus, message: str):
        body = f"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>{status.value} {status.phrase}</title>
<style>body{{font-family:system-ui,sans-serif;background:#f4ecd8;color:#1a1814;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}}
.c{{text-align:center;padding:32px 48px;background:#fff;border:2px solid #b53028;border-radius:2px;max-width:480px}}
h1{{font-size:3rem;margin:0;color:#b53028}}p{{color:#4a4a4a}}a{{color:#d96b27;text-decoration:none}}</style>
</head><body><div class="c"><h1>{status.value}</h1><p>{message}</p>
<p><a href="/index.html">← 回到哥窑首页</a></p></div></body></html>""".encode("utf-8")
        self._send_headers(status, len(body), "text/html; charset=utf-8")
        self.wfile.write(body)

    def _gzip_response(self, body: bytes) -> bytes:
        if not self.enable_gzip:
            return body
        ae = self.headers.get("Accept-Encoding", "")
        if "gzip" not in ae.lower():
            return body
        gz = gzip.compress(body, compresslevel=6)
        if len(gz) < len(body):
            return gz
        return body

    def _send_compressed(self, status: HTTPStatus, body: bytes, mime: str,
                         extra: dict = None, accept_ranges: bool = False):
        # gzip?
        if is_compressible(mime) and len(body) > 512:
            compressed = self._gzip_response(body)
            if compressed is not body:
                hdrs = dict(extra or {})
                hdrs["Content-Encoding"] = "gzip"
                hdrs["Vary"] = "Accept-Encoding"
                self._send_headers(status, len(compressed), mime, hdrs, accept_ranges)
                self.wfile.write(compressed)
                return
        self._send_headers(status, len(body), mime, extra, accept_ranges)
        self.wfile.write(body)

    # ---------------- HTTP 方法 ----------------
    def do_GET(self):
        try:
            path = self._safe_path(self.path)
        except PermissionError:
            return self._send_error_page(HTTPStatus.FORBIDDEN, "Forbidden")

        # API 端点
        if self.path.startswith("/api/"):
            return self._handle_api(self.path)

        # HEAD 处理
        if not path.exists():
            return self._send_error_page(HTTPStatus.NOT_FOUND, f"找不到资源：{self.path}")
        if path.is_dir():
            # 默认提供 index.html
            idx = path / "index.html"
            if idx.exists():
                path = idx
            else:
                return self._send_error_page(HTTPStatus.FORBIDDEN, "目录列表已禁用")

        return self._serve_file(path)

    def do_HEAD(self):
        try:
            path = self._safe_path(self.path)
        except PermissionError:
            self.send_response(HTTPStatus.FORBIDDEN)
            self.end_headers()
            return
        if not path.exists() or path.is_dir():
            self.send_response(HTTPStatus.NOT_FOUND)
            self.end_headers()
            return
        try:
            st = path.stat()
            mime = get_mime_type(str(path))
            etag = make_etag(st, mime)
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(st.st_size))
            self.send_header("ETag", etag)
            self.send_header("Cache-Control", get_cache_control(path.suffix))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Last-Modified", self.date_time_string(st.st_mtime))
            self.end_headers()
        except OSError:
            self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
            self.end_headers()

    # ---------------- 静态文件服务（带范围请求 / ETag） ----------------
    def _serve_file(self, path: Path):
        try:
            st = path.stat()
        except OSError:
            return self._send_error_page(HTTPStatus.NOT_FOUND, f"文件不可读：{self.path}")

        mime = get_mime_type(str(path))
        etag = make_etag(st, mime)

        # 304 协商缓存
        if_none = self.headers.get("If-None-Match")
        if if_none and if_none == etag:
            self.send_response(HTTPStatus.NOT_MODIFIED)
            self.send_header("ETag", etag)
            self.send_header("Cache-Control", get_cache_control(path.suffix))
            self.end_headers()
            return

        size = st.st_size
        range_header = self.headers.get("Range")

        # 范围请求
        if range_header and range_header.startswith("bytes="):
            try:
                spec = range_header[6:]
                start_s, _, end_s = spec.partition("-")
                start = int(start_s) if start_s else 0
                end = int(end_s) if end_s else size - 1
                if start > end or end >= size:
                    self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                    self.send_header("Content-Range", f"bytes */{size}")
                    self.end_headers()
                    return
                length = end - start + 1
                with open(path, "rb") as f:
                    f.seek(start)
                    body = f.read(length)
                self.send_response(HTTPStatus.PARTIAL_CONTENT)
                self.send_header("Content-Type", mime)
                self.send_header("Content-Length", str(length))
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("ETag", etag)
                self.send_header("Cache-Control", get_cache_control(path.suffix))
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()
                self.wfile.write(body)
                return
            except ValueError:
                pass  # 错误 Range → 当作普通请求

        # 完整响应
        try:
            with open(path, "rb") as f:
                body = f.read()
        except OSError:
            return self._send_error_page(HTTPStatus.INTERNAL_SERVER_ERROR, "读取失败")

        extra = {
            "ETag": etag,
            "Last-Modified": self.date_time_string(st.st_mtime),
        }
        # 大文件不压缩，节省 CPU
        accept_ranges = mime.startswith(("image/", "video/", "audio/", "font/"))
        self._send_compressed(HTTPStatus.OK, body, mime, extra, accept_ranges=accept_ranges)

    # ---------------- API ----------------
    def _handle_api(self, path: str):
        if path.startswith("/api/health"):
            return self._json({
                "ok": True,
                "service": self.server_version,
                "uptime_s": int(time.time() - self.server.start_time),
                "requests": self.server.request_count,
                "gzip": self.enable_gzip,
                "root": str(ROOT),
                "now": datetime.utcnow().isoformat() + "Z",
            })
        if path.startswith("/api/structure"):
            # 返回项目文件结构概览
            structure = {
                "root": str(ROOT),
                "html_pages": sorted(p.name for p in ROOT.glob("*.html")),
                "data": sorted(p.name for p in (ROOT / "data").glob("*.json")) if (ROOT / "data").exists() else [],
                "js": sorted(p.name for p in (ROOT / "js").glob("*.js")) if (ROOT / "js").exists() else [],
                "css": sorted(p.name for p in (ROOT / "css").glob("*.css")) if (ROOT / "css").exists() else [],
                "shots": sorted(p.name for p in (ROOT / "shots").glob("shot-*.html")) if (ROOT / "shots").exists() else [],
                "total_size_bytes": sum(p.stat().st_size for p in ROOT.rglob("*") if p.is_file()),
            }
            return self._json(structure)
        if path.startswith("/api/list"):
            qs = parse_qs(urlparse(path).query)
            sub = (qs.get("path", [""])[0] or "").lstrip("/")
            try:
                target = (ROOT / sub).resolve()
                target.relative_to(ROOT)
            except Exception:
                return self._json({"error": "forbidden"}, HTTPStatus.FORBIDDEN)
            if not target.is_dir():
                return self._json({"error": "not a directory"}, HTTPStatus.BAD_REQUEST)
            return self._json({
                "path": str(target.relative_to(ROOT)),
                "items": [
                    {
                        "name": p.name,
                        "type": "dir" if p.is_dir() else "file",
                        "size": p.stat().st_size if p.is_file() else 0,
                    } for p in sorted(target.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
                ]
            })
        return self._json({"error": "not found"}, HTTPStatus.NOT_FOUND)

    def _json(self, obj, status: HTTPStatus = HTTPStatus.OK):
        body = json.dumps(obj, ensure_ascii=False, indent=2).encode("utf-8")
        self._send_compressed(status, body, "application/json; charset=utf-8",
                              extra={"Access-Control-Allow-Origin": "*"})

    # ---------------- 覆盖以统计请求 ----------------
    def handle_one_request(self):
        self.server.request_count += 1
        super().handle_one_request()


# ============================================================
# 服务器
# ============================================================
class StatsServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True
    def __init__(self, addr, handler, bind_and_activate=True):
        super().__init__(addr, handler, bind_and_activate)
        self.start_time = time.time()
        self.request_count = 0
        self._lock = threading.Lock()


# ============================================================
# 守护进程管理
# ============================================================
def write_pid(pid: int):
    PID_FILE.write_text(str(pid))


def read_pid() -> int | None:
    if not PID_FILE.exists():
        return None
    try:
        return int(PID_FILE.read_text().strip())
    except ValueError:
        return None


def is_running(pid: int) -> bool:
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def stop_daemon():
    pid = read_pid()
    if not pid:
        print("未发现 PID 文件，未在后台运行？")
        return
    if not is_running(pid):
        print(f"PID {pid} 已不在运行，清理 PID 文件")
        PID_FILE.unlink(missing_ok=True)
        return
    print(f"正在停止 PID {pid}…")
    os.kill(pid, signal.SIGTERM)
    for _ in range(20):
        time.sleep(0.2)
        if not is_running(pid):
            PID_FILE.unlink(missing_ok=True)
            print("已停止")
            return
    print("超时，强制 SIGKILL")
    os.kill(pid, signal.SIGKILL)
    PID_FILE.unlink(missing_ok=True)


def show_status():
    pid = read_pid()
    if pid and is_running(pid):
        print(f"运行中 · PID {pid} · 端口 {DEFAULT_PORT}")
        print(f"日志：{ACCESS_LOG}")
        print(f"健康检查：http://localhost:{DEFAULT_PORT}/api/health")
    else:
        print("未运行")


# ============================================================
# 入口
# ============================================================
def parse_args():
    p = argparse.ArgumentParser(description="哥窑项目 · 优化版静态服务器")
    p.add_argument("--port", type=int, default=DEFAULT_PORT, help="监听端口")
    p.add_argument("--host", default=DEFAULT_HOST, help="监听地址")
    p.add_argument("--daemon", action="store_true", help="后台守护")
    p.add_argument("--stop", action="store_true", help="停止后台实例")
    p.add_argument("--status", action="store_true", help="查看状态")
    p.add_argument("--no-gzip", action="store_true", help="关闭 Gzip 压缩")
    return p.parse_args()


def main():
    args = parse_args()
    setup_logging()

    if args.stop:
        return stop_daemon()
    if args.status:
        return show_status()

    OptimizedHandler.enable_gzip = not args.no_gzip

    # 端口占用检查
    try:
        test = socketserver.TCPServer((args.host, args.port), None)
        test.server_close()
    except OSError as e:
        print(f"端口 {args.port} 已被占用：{e}")
        print("试试：python3 server.py --port 9000")
        sys.exit(1)

    if args.daemon:
        # 检查是否已经在跑
        if read_pid() and is_running(read_pid()):
            print(f"已在运行 · PID {read_pid()}")
            return
        # 单 fork：子进程接管，父进程退出
        pid = os.fork()
        if pid > 0:
            # 父进程等子进程写好 PID 文件再退出
            for _ in range(50):
                time.sleep(0.1)
                if PID_FILE.exists():
                    break
            new_pid = read_pid()
            if new_pid and is_running(new_pid):
                print(f"已后台启动 · PID {new_pid} · 端口 {args.port}")
                print(f"日志目录：{LOG_DIR}")
                print(f"健康检查：http://localhost:{args.port}/api/health")
            else:
                print("后台启动失败，请查看 logs/error.log")
            return
        # 子进程：脱离终端、创建新会话
        os.setsid()
        # 写 PID
        write_pid(os.getpid())
        # 重定向 stdio（在 setsid 之后）
        sys.stdout.flush()
        sys.stderr.flush()
        with open("/dev/null", "rb", 0) as r:
            os.dup2(r.fileno(), sys.stdin.fileno())
        with open(ACCESS_LOG, "ab", 0) as w:
            os.dup2(w.fileno(), sys.stdout.fileno())
            os.dup2(w.fileno(), sys.stderr.fileno())
        # 忽略 SIGHUP（防止父进程关闭时被杀）
        signal.signal(signal.SIGHUP, signal.SIG_IGN)

    server = StatsServer((args.host, args.port), OptimizedHandler)
    print(f"\n哥窑项目 · 优化服务器已启动")
    print(f"  地址：    http://{args.host}:{args.port}/")
    print(f"  本地：    http://localhost:{args.port}/")
    print(f"  根目录：  {ROOT}")
    print(f"  压缩：    {'开启' if OptimizedHandler.enable_gzip else '关闭'}")
    print(f"  API：     /api/health · /api/structure · /api/list?path=")
    print(f"  日志：    {ACCESS_LOG.name} · {ERROR_LOG.name}")
    print(f"\n按 Ctrl+C 停止\n")

    def shutdown(*_):
        print("\n正在关闭…")
        threading.Thread(target=server.shutdown, daemon=True).start()
    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        server.serve_forever()
    finally:
        server.server_close()
        if PID_FILE.exists():
            PID_FILE.unlink(missing_ok=True)
        print("已退出")


if __name__ == "__main__":
    main()
