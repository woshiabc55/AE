#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/setup.sh" help &>/dev/null || true

CONTAINER_NAME="macos-vm-custom"
DATA_DIR="${SCRIPT_DIR}/macos-data"
SSH_PORT="${SSH_PORT:-50922}"
VNC_PORT="${VNC_PORT:-5999}"
RAM_SIZE="${RAM_SIZE:-8G}"
CPU_COUNT="${CPU_COUNT:-4}"
DISK_SIZE="${DISK_SIZE:-64G}"
MACOS_VERSION="${MACOS_VERSION:-ventura}"

mkdir -p "${DATA_DIR}"

if [[ ! -f "${DATA_DIR}/macos.qcow2" ]]; then
    echo "[INFO] 创建 ${DISK_SIZE} 虚拟磁盘..."
    qemu-img create -f qcow2 "${DATA_DIR}/macos.qcow2" "${DISK_SIZE}"
fi

KVM_FLAG=""
[[ -e /dev/kvm ]] && KVM_FLAG="--device /dev/kvm"

podman run -d \
    --name "${CONTAINER_NAME}" \
    ${KVM_FLAG} \
    -p "${SSH_PORT}:10022" \
    -p "${VNC_PORT}:5999" \
    -v "${DATA_DIR}/macos.qcow2:/image" \
    -e RAM="${RAM_SIZE}" \
    -e SMP="${CPU_COUNT}" \
    -e EXTRA="-usb -device usb-kbd -device usb-mouse -vnc :0" \
    sickcodes/docker-osx:"${MACOS_VERSION}"

echo ""
echo "[OK] macOS VM 已启动！"
echo ""
echo "  SSH:  ssh -p ${SSH_PORT} user@localhost  (密码: alpine)"
echo "  VNC:  vnc://localhost:${VNC_PORT}"
echo ""
echo "首次启动需要安装 macOS 系统，约 20-40 分钟"
echo "安装完成后即可 SSH 连接"
