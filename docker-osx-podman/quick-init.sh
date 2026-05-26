#!/usr/bin/env bash
set -euo pipefail

echo "========================================="
echo "  Docker-OSX + Podman 快速初始化脚本"
echo "  适用于 Ubuntu/Debian Linux"
echo "========================================="
echo ""

if [[ "$(uname -s)" != "Linux" ]]; then
    echo "[ERROR] 此脚本仅支持 Linux"
    exit 1
fi

if [[ $EUID -eq 0 ]]; then
    echo "[WARN] 检测到 root 用户，建议使用普通用户运行"
fi

echo "[1/5] 安装 Podman..."
if command -v podman &>/dev/null; then
    echo "  Podman 已安装: $(podman --version)"
else
    sudo apt-get update -qq
    sudo apt-get install -y -qq podman
    echo "  Podman 安装完成: $(podman --version)"
fi

echo ""
echo "[2/5] 安装 QEMU 和虚拟化工具..."
if command -v qemu-system-x86_64 &>/dev/null; then
    echo "  QEMU 已安装"
else
    sudo apt-get install -y -qq qemu-system-x86 qemu-utils ovmf
    echo "  QEMU 安装完成"
fi

echo ""
echo "[3/5] 检查 KVM 支持..."
if [[ -e /dev/kvm ]]; then
    echo "  KVM 可用 ✅ - 将使用硬件加速"
    KVM_DEVICE="--device /dev/kvm"
else
    echo "  KVM 不可用 ❌ - 将使用软件模拟（较慢）"
    echo "  提示: 请在 BIOS 中启用 Intel VT-x 或 AMD-V"
    KVM_DEVICE=""
fi

echo ""
echo "[4/5] 拉取 Docker-OSX 镜像（约 2GB）..."
MACOS_VERSION="${MACOS_VERSION:-ventura}"
podman pull "sickcodes/docker-osx:${MACOS_VERSION}"
echo "  镜像拉取完成"

echo ""
echo "[5/5] 创建虚拟磁盘..."
DATA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/macos-data"
mkdir -p "${DATA_DIR}"
DISK_SIZE="${DISK_SIZE:-64G}"
if [[ ! -f "${DATA_DIR}/macos.qcow2" ]]; then
    qemu-img create -f qcow2 "${DATA_DIR}/macos.qcow2" "${DISK_SIZE}"
    echo "  虚拟磁盘创建完成: ${DATA_DIR}/macos.qcow2 (${DISK_SIZE})"
else
    echo "  虚拟磁盘已存在，跳过"
fi

echo ""
echo "========================================="
echo "  初始化完成！"
echo "========================================="
echo ""
echo "启动 macOS VM:"
echo "  cd $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "  ./start-vm.sh"
echo ""
echo "或手动启动:"
echo "  podman run -d \\"
echo "    --name macos-vm \\"
echo "    ${KVM_DEVICE} \\"
echo "    -p 50922:10022 \\"
echo "    -p 5999:5999 \\"
echo "    -v ${DATA_DIR}/macos.qcow2:/image \\"
echo "    -e RAM=8G -e SMP=4 \\"
echo "    sickcodes/docker-osx:${MACOS_VERSION}"
echo ""
echo "连接方式:"
echo "  SSH:  ssh -p 50922 user@localhost  (密码: alpine)"
echo "  VNC:  vnc://localhost:5999"
