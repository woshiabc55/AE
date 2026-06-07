#!/usr/bin/env bash
# ===========================================================
# 哥窑项目 · 一键启动脚本
# ===========================================================
# 用法：
#   ./start.sh                # 默认 8765 端口
#   ./start.sh 9000           # 指定端口
#   ./start.sh --no-gzip      # 关闭压缩
#   ./start.sh --daemon       # 后台运行
#   ./start.sh --stop         # 停止后台
#   ./start.sh --status       # 查看状态
#   ./start.sh --open         # 自动打开浏览器
# ===========================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

PORT=8765
GZIP_FLAG=""
DAEMON_FLAG=""
ACTION="start"
OPEN_BROWSER=false

# ---------- 颜色 ----------
if [ -t 1 ]; then
  R='\033[0m'; B='\033[1m'; CYAN='\033[36m'; YEL='\033[33m'
  GRN='\033[32m'; RED='\033[31m'; DIM='\033[2m'
else
  R=''; B=''; CYAN=''; YEL=''; GRN=''; RED=''; DIM=''
fi

log()  { echo -e "$1"; }
title(){ log "${CYAN}${B}╭───────────────────────────────────────────────╮${R}"; }
sep()  { local c="${1:-}"; if [ -n "$c" ]; then log "${CYAN}│${R}  ${c}"; else log "${CYAN}│${R}"; fi; }
ok()   { log "${GRN}✓${R} $1"; }
warn() { log "${YEL}!${R} $1"; }
err()  { log "${RED}✗${R} $1"; }

# ---------- 解析参数 ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-gzip) GZIP_FLAG="--no-gzip"; shift ;;
    --daemon)  DAEMON_FLAG="--daemon";  shift ;;
    --stop)    ACTION="stop";  shift ;;
    --status)  ACTION="status"; shift ;;
    --open)    OPEN_BROWSER=true; shift ;;
    --help|-h) ACTION="help"; shift ;;
    [0-9]*)    PORT="$1"; shift ;;
    *) err "未知参数：$1"; exit 1 ;;
  esac
done

# ---------- 帮助 ----------
if [ "$ACTION" = "help" ]; then
  title
  sep
  sep "  ${B}哥窑项目 · 一键启动脚本${R}"
  sep
  sep "  ${B}用法：${R}"
  sep "    ./start.sh                  默认 8765 端口"
  sep "    ./start.sh 9000             指定端口"
  sep "    ./start.sh --no-gzip        关闭 Gzip 压缩"
  sep "    ./start.sh --daemon         后台守护运行"
  sep "    ./start.sh --stop           停止后台"
  sep "    ./start.sh --status         查看状态"
  sep "    ./start.sh --open           启动后打开浏览器"
  sep
  sep "  ${B}API 端点：${R}"
  sep "    /api/health                 健康检查"
  sep "    /api/structure              文件结构"
  sep "    /api/list?path=shots        目录列表"
  sep
  log "${CYAN}╰───────────────────────────────────────────────╯${R}"
  exit 0
fi

# ---------- 状态 ----------
if [ "$ACTION" = "status" ]; then
  title
  sep "  ${B}服务器状态${R}"
  sep
  if [ -f "$ROOT/.server.pid" ]; then
    PID=$(cat "$ROOT/.server.pid")
    if kill -0 "$PID" 2>/dev/null; then
      sep "  状态：${GRN}运行中${R} · PID ${B}$PID${R}"
      [ -f "$ROOT/logs/access.log" ] && sep "  日志：${DIM}$ROOT/logs/access.log${R}"
    else
      sep "  状态：${RED}已停止（残留 PID 文件）${R}"
    fi
  else
    sep "  状态：${YEL}未运行${R}"
  fi
  sep
  log "${CYAN}╰───────────────────────────────────────────────╯${R}"
  exit 0
fi

# ---------- 停止 ----------
if [ "$ACTION" = "stop" ]; then
  title
  sep "  ${B}停止服务器${R}"
  sep
  python3 server.py --stop
  sep
  log "${CYAN}╰───────────────────────────────────────────────╯${R}"
  exit 0
fi

# ---------- 启动 ----------
title
sep "  ${B}哥窑项目 · 优化版服务器${R}"
sep

# 环境检查
if ! command -v python3 >/dev/null 2>&1; then
  err "未找到 python3"
  exit 1
fi
PY_VER=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
ok "Python ${PY_VER}"

if [ ! -f "$ROOT/server.py" ]; then
  err "server.py 不存在"
  exit 1
fi
ok "server.py"

# 端口检查
if (echo > /dev/tcp/127.0.0.1/$PORT) 2>/dev/null; then
  err "端口 $PORT 已被占用"
  log "  试试：${B}./start.sh $((PORT+1))${R}"
  exit 1
fi
ok "端口 $PORT 可用"

# 文件统计
HTML_COUNT=$(find "$ROOT" -maxdepth 1 -name "*.html" | wc -l)
SHOT_COUNT=$(find "$ROOT/shots" -name "shot-*.html" 2>/dev/null | wc -l || echo 0)
JS_COUNT=$(find "$ROOT/js" -name "*.js" 2>/dev/null | wc -l || echo 0)
ok "项目文件：${B}${HTML_COUNT}${R} HTML / ${B}${SHOT_COUNT}${R} 镜号页 / ${B}${JS_COUNT}${R} JS"

# 启动
sep
log "  ${CYAN}正在启动…${R}"
sep

DAEMON_FLAG_FINAL=""
if [ -n "$DAEMON_FLAG" ]; then
  DAEMON_FLAG_FINAL="--daemon"
fi

python3 server.py --port "$PORT" $GZIP_FLAG $DAEMON_FLAG_FINAL &
SERVER_PID=$!

# 前台模式下，等待服务可用
if [ -z "$DAEMON_FLAG" ]; then
  for i in {1..30}; do
    if curl -sf "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
      break
    fi
    sleep 0.2
  done

  echo
  log "  ${GRN}${B}服务器就绪 ✓${R}"
  log "  本地访问：${CYAN}http://localhost:$PORT/${R}"
  log "  健康检查：${CYAN}http://localhost:$PORT/api/health${R}"
  log "  项目结构：${CYAN}http://localhost:$PORT/api/structure${R}"
  log
  log "  快捷入口："
  log "    ${DIM}· 首页${R}      ${CYAN}http://localhost:$PORT/index.html${R}"
  log "    ${DIM}· 前幕${R}      ${CYAN}http://localhost:$PORT/preface.html${R}"
  log "    ${DIM}· 第一章${R}    ${CYAN}http://localhost:$PORT/chapter-1.html${R}"
  log "    ${DIM}· 第二章${R}    ${CYAN}http://localhost:$PORT/chapter-2.html${R}"
  log "    ${DIM}· 第三章${R}    ${CYAN}http://localhost:$PORT/chapter-3.html${R}"
  log "    ${DIM}· 第四章${R}    ${CYAN}http://localhost:$PORT/chapter-4.html${R}"
  log "    ${DIM}· 尾幕 PPT${R}  ${CYAN}http://localhost:$PORT/epilogue-ppt.html${R}"
  log "    ${DIM}· 独立 PPT${R}  ${CYAN}http://localhost:$PORT/ppt.html${R}"
  log "    ${DIM}· 分镜长卷${R}  ${CYAN}http://localhost:$PORT/storyboard.html${R}"
  log
  log "  键盘：${DIM}Ctrl+C 停止${R}"

  # 打开浏览器
  if [ "$OPEN_BROWSER" = true ]; then
    sleep 0.5
    URL="http://localhost:$PORT/index.html"
    if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1 &
    elif command -v open >/dev/null 2>&1; then open "$URL" >/dev/null 2>&1 &
    elif command -v start >/dev/null 2>&1; then start "$URL" >/dev/null 2>&1 &
    fi
  fi

  # 等待用户 Ctrl+C
  wait $SERVER_PID 2>/dev/null || true
else
  sleep 0.5
  if [ -f "$ROOT/.server.pid" ]; then
    PID=$(cat "$ROOT/.server.pid")
    log "  ${GRN}${B}已后台启动 ✓${R}"
    log "  PID：${B}$PID${R}"
    log "  本地访问：${CYAN}http://localhost:$PORT/${R}"
    log "  健康检查：${CYAN}http://localhost:$PORT/api/health${R}"
    log
    log "  停止：${DIM}./start.sh --stop${R}"
  fi
fi
log "${CYAN}╰───────────────────────────────────────────────╯${R}"
