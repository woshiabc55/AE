#!/usr/bin/env bash
set -euo pipefail

SSH_PORT="${SSH_PORT:-50922}"
SSH_USER="${SSH_USER:-user}"

echo "[INFO] 连接到 macOS VM..."
echo "  地址: localhost:${SSH_PORT}"
echo "  用户: ${SSH_USER}"
echo "  密码: alpine"
echo ""

if ! ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -p "${SSH_PORT}" "${SSH_USER}@localhost" echo "连接成功！"; then
    echo ""
    echo "[WARN] 无法连接，可能原因："
    echo "  1. macOS 尚未安装完成（首次启动需要 20-40 分钟）"
    echo "  2. SSH 服务未启动（需要在 macOS 中启用远程登录）"
    echo "  3. VM 未运行（运行 ./setup.sh start）"
    echo ""
    echo "请通过 VNC 查看安装进度: vnc://localhost:${VNC_PORT:-5999}"
    exit 1
fi

ssh -o StrictHostKeyChecking=no -p "${SSH_PORT}" "${SSH_USER}@localhost"
