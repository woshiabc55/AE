#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
fail()  { echo -e "${RED}[FAIL]${NC} $*"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${SCRIPT_DIR}/macos-data"
SSH_PORT=50922
VNC_PORT=5999
RAM_SIZE="8G"
CPU_COUNT="4"
DISK_SIZE="64G"
MACOS_VERSION="ventura"

usage() {
    cat <<EOF
Usage: $0 [command]

Docker-OSX + Podman 一键部署脚本 - 在 Linux 上运行 macOS 虚拟机

Commands:
  install     安装 Podman 和依赖（首次运行必须）
  pull        拉取 Docker-OSX 镜像
  create      创建 macOS 虚拟磁盘（首次启动前必须）
  start       启动 macOS 虚拟机
  stop        停止 macOS 虚拟机
  status      查看虚拟机状态
  ssh         SSH 连接到 macOS 虚拟机
  vnc         显示 VNC 连接信息
  reset       重置（删除所有数据）
  help        显示此帮助信息

Environment Variables:
  RAM_SIZE     内存大小 (default: 8G)
  CPU_COUNT    CPU 核心数 (default: 4)
  DISK_SIZE    磁盘大小 (default: 64G)
  SSH_PORT     SSH 端口 (default: 50922)
  VNC_PORT     VNC 端口 (default: 5999)
  MACOS_VERSION macOS 版本 (default: ventura)
                可选: high-sierra, mojave, catalina, big-sur, monterey, ventura, sonoma

Examples:
  $0 install                    # 安装所有依赖
  $0 pull                       # 拉取镜像
  $0 create                     # 创建虚拟磁盘
  $0 start                      # 启动 VM
  $0 ssh                        # 连接 SSH
  RAM_SIZE=16G CPU_COUNT=8 $0 start  # 使用 16G 内存 8 核启动

EOF
}

check_os() {
    if [[ "$(uname -s)" != "Linux" ]]; then
        fail "此脚本仅支持 Linux 系统。macOS 用户请直接使用 'brew install podman'"
    fi
}

check_kvm() {
    if [[ -e /dev/kvm ]]; then
        ok "KVM 可用 - 将使用硬件加速"
        return 0
    else
        warn "KVM 不可用 - 将使用软件模拟（速度较慢）"
        warn "建议在 BIOS 中启用虚拟化支持 (Intel VT-x / AMD-V)"
        return 1
    fi
}

check_resources() {
    local total_mem_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    local total_mem_gb=$((total_mem_kb / 1024 / 1024))
    local avail_disk_gb=$(df -BG / | awk 'NR==2 {print $4}' | tr -d 'G')

    info "系统内存: ${total_mem_gb}GB, 可用磁盘: ${avail_disk_gb}GB"

    if [[ $total_mem_gb -lt 8 ]]; then
        warn "内存不足 8GB (当前 ${total_mem_gb}GB)，macOS VM 可能无法正常运行"
    fi
    if [[ $avail_disk_gb -lt 50 ]]; then
        warn "磁盘空间不足 50GB (当前 ${avail_disk_gb}GB)，macOS VM 需要较大磁盘空间"
    fi
}

do_install() {
    info "开始安装 Podman 和依赖..."
    check_os

    if command -v podman &>/dev/null; then
        ok "Podman 已安装: $(podman --version)"
    else
        info "安装 Podman..."
        if command -v apt-get &>/dev/null; then
            sudo apt-get update
            sudo apt-get install -y podman
        elif command -v dnf &>/dev/null; then
            sudo dnf install -y podman
        elif command -v yum &>/dev/null; then
            sudo yum install -y podman
        elif command -v pacman &>/dev/null; then
            sudo pacman -S --noconfirm podman
        else
            fail "不支持的包管理器，请手动安装 Podman: https://podman.io/getting-started/installation"
        fi
        ok "Podman 安装完成: $(podman --version)"
    fi

    if command -v qemu-system-x86_64 &>/dev/null; then
        ok "QEMU 已安装: $(qemu-system-x86_64 --version | head -1)"
    else
        info "安装 QEMU..."
        if command -v apt-get &>/dev/null; then
            sudo apt-get install -y qemu-system-x86 qemu-utils ovmf
        elif command -v dnf &>/dev/null; then
            sudo dnf install -y qemu-system-x86 qemu-img OVMF
        elif command -v yum &>/dev/null; then
            sudo yum install -y qemu-system-x86 qemu-img OVMF
        elif command -v pacman &>/dev/null; then
            sudo pacman -S --noconfirm qemu-headless ovmf
        fi
        ok "QEMU 安装完成"
    fi

    info "配置 Podman rootless 模式..."
    mkdir -p ~/.config/containers
    if [[ ! -f ~/.config/containers/containers.conf ]]; then
        cat > ~/.config/containers/containers.conf <<'EOF'
[containers]
netns="bridge"

[network]
network_backend="netavark"

[engine]
cgroup_manager="systemd"
EOF
    fi

    check_kvm
    check_resources

    ok "所有依赖安装完成！"
    echo ""
    info "下一步: $0 pull"
}

do_pull() {
    info "拉取 Docker-OSX 镜像（约 2GB，可能需要几分钟）..."
    podman pull sickcodes/docker-osx:${MACOS_VERSION} || \
    podman pull docker.io/sickcodes/docker-osx:${MACOS_VERSION} || {
        warn "从 Docker Hub 拉取失败，尝试从 GitHub Container Registry..."
        podman pull ghcr.io/sickcodes/docker-osx:${MACOS_VERSION}
    }
    ok "镜像拉取完成！"
    echo ""
    info "下一步: $0 create"
}

do_create() {
    mkdir -p "${DATA_DIR}"

    if [[ -f "${DATA_DIR}/macos.qcow2" ]]; then
        warn "虚拟磁盘已存在: ${DATA_DIR}/macos.qcow2"
        read -rp "是否覆盖？(y/N) " confirm
        [[ "${confirm}" == "y" || "${confirm}" == "Y" ]] || { info "跳过创建"; return 0; }
    fi

    info "创建 ${DISK_SIZE} 虚拟磁盘..."
    qemu-img create -f qcow2 "${DATA_DIR}/macos.qcow2" "${DISK_SIZE}"
    ok "虚拟磁盘创建完成: ${DATA_DIR}/macos.qcow2"
    echo ""
    info "下一步: $0 start"
}

do_start() {
    check_os

    if ! podman image exists sickcodes/docker-osx:${MACOS_VERSION} 2>/dev/null; then
        fail "镜像不存在，请先运行: $0 pull"
    fi

    mkdir -p "${DATA_DIR}"

    local kvm_flag=""
    if [[ -e /dev/kvm ]]; then
        kvm_flag="--device /dev/kvm"
    else
        warn "KVM 不可用，使用软件模拟模式（速度较慢）"
    fi

    local disk_arg=""
    if [[ -f "${DATA_DIR}/macos.qcow2" ]]; then
        disk_arg="-v ${DATA_DIR}/macos.qcow2:/image"
        info "使用已有虚拟磁盘: ${DATA_DIR}/macos.qcow2"
    else
        warn "虚拟磁盘不存在，将使用临时磁盘（数据不会持久化）"
        warn "建议先运行: $0 create"
    fi

    info "启动 macOS ${MACOS_VERSION} 虚拟机..."
    info "配置: CPU=${CPU_COUNT}, RAM=${RAM_SIZE}, SSH=${SSH_PORT}, VNC=${VNC_PORT}"

    podman run -d \
        --name macos-vm \
        ${kvm_flag} \
        -p ${SSH_PORT}:10022 \
        -p ${VNC_PORT}:5999 \
        ${disk_arg} \
        -e RAM="${RAM_SIZE}" \
        -e SMP="${CPU_COUNT}" \
        -e EXTRA="-usb -device usb-kbd -device usb-mouse" \
        sickcodes/docker-osx:${MACOS_VERSION}

    ok "macOS 虚拟机已启动！"
    echo ""
    info "首次启动需要安装 macOS 系统，大约需要 20-40 分钟"
    info "安装完成后，可以通过以下方式连接："
    echo ""
    echo "  SSH:  ssh -p ${SSH_PORT} user@localhost  (密码: alpine)"
    echo "  VNC:  vnc://localhost:${VNC_PORT}"
    echo ""
    info "查看状态: $0 status"
    info "SSH 连接: $0 ssh"
}

do_stop() {
    info "停止 macOS 虚拟机..."
    podman stop macos-vm 2>/dev/null && ok "虚拟机已停止" || warn "虚拟机未在运行"
    podman rm macos-vm 2>/dev/null || true
}

do_status() {
    if podman ps -a --filter name=macos-vm --format '{{.Names}}' | grep -q macos-vm; then
        local status=$(podman ps -a --filter name=macos-vm --format '{{.Status}}')
        info "macOS VM 状态: ${status}"
        if echo "${status}" | grep -q "Up"; then
            ok "虚拟机正在运行"
            echo ""
            echo "  SSH:  ssh -p ${SSH_PORT} user@localhost"
            echo "  VNC:  vnc://localhost:${VNC_PORT}"
        fi
    else
        warn "macOS VM 不存在"
        info "请先运行: $0 start"
    fi
}

do_ssh() {
    if ! podman ps --filter name=macos-vm --format '{{.Names}}' | grep -q macos-vm; then
        fail "macOS VM 未运行，请先: $0 start"
    fi
    info "连接到 macOS VM (密码: alpine)..."
    info "提示: 首次启动需要先完成 macOS 安装才能 SSH 连接"
    ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} user@localhost
}

do_vnc() {
    info "VNC 连接信息:"
    echo ""
    echo "  地址: vnc://localhost:${VNC_PORT}"
    echo "  或使用 VNC 客户端连接: localhost:${VNC_PORT}"
    echo ""
    info "推荐 VNC 客户端:"
    echo "  - Remmina (Linux): sudo apt install remmina"
    echo "  - RealVNC Viewer: https://www.realvnc.com/en/connect/download/viewer/"
    echo "  - TigerVNC: sudo apt install tigervnc-viewer"
}

do_reset() {
    warn "此操作将删除所有 macOS VM 数据！"
    read -rp "确认删除？(y/N) " confirm
    [[ "${confirm}" == "y" || "${confirm}" == "Y" ]] || { info "取消"; return 0; }

    do_stop
    rm -rf "${DATA_DIR}"
    podman rmi sickcodes/docker-osx:${MACOS_VERSION} 2>/dev/null || true
    ok "已重置所有数据"
}

case "${1:-help}" in
    install)  do_install  ;;
    pull)     do_pull     ;;
    create)   do_create   ;;
    start)    do_start    ;;
    stop)     do_stop     ;;
    status)   do_status   ;;
    ssh)      do_ssh      ;;
    vnc)      do_vnc      ;;
    reset)    do_reset    ;;
    help|*)   usage       ;;
esac
