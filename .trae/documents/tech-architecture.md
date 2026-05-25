## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层 (React + Vite)"
        "主页面 - 平台嵌入"
        "推广中心 - 数据看板"
        "资源中心 - 素材管理"
    end
    subgraph "桌面层 (Electron)"
        "窗口管理"
        "系统托盘"
        "自动更新"
    end
    subgraph "外部服务"
        "秒哒平台 API"
        "秒哒推广页面"
    end
    "桌面层" --> "前端层"
    "前端层" --> "外部服务"
```

## 2. 技术说明

- 前端：React@18 + TypeScript + TailwindCSS@3 + Vite
- 桌面框架：Electron@28 + electron-builder（打包EXE）
- 状态管理：Zustand
- 路由：React Router DOM
- 初始化工具：vite-init
- 后端：无独立后端，直接对接秒哒平台
- 数据库：无本地数据库，使用本地存储（localStorage）缓存用户偏好

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 主页面，嵌入秒哒平台 |
| /promotion | 推广中心，数据看板和邀请管理 |
| /resources | 资源中心，素材下载和活动信息 |

## 4. API定义

无独立后端API。应用通过以下方式与外部交互：

- **秒哒平台嵌入**：通过iframe加载 `https://app-6p5j8eshleyp.appmiaoda.com/?track_id=promolink-8ps30594vh1c`
- **推广数据**：使用Mock数据模拟推广数据展示（实际接入需秒哒开放API）
- **本地存储**：用户偏好设置、侧边栏状态等存储在localStorage

### 4.1 数据类型定义

```typescript
interface PromotionStats {
  totalInvites: number;
  totalRevenue: number;
  monthlyRevenue: number;
  rank: number;
  inviteTrend: number[];
  revenueTrend: number[];
}

interface InviteLink {
  id: string;
  url: string;
  qrCode: string;
  createdAt: string;
  clickCount: number;
  registerCount: number;
}

interface ResourceItem {
  id: string;
  title: string;
  type: 'poster' | 'copy' | 'video';
  thumbnail: string;
  downloadUrl: string;
  createdAt: string;
}

interface ActivityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'online' | 'offline';
  status: 'upcoming' | 'ongoing' | 'ended';
}
```

## 5. 服务器架构图

不适用（无独立后端）

## 6. 数据模型

不适用（无本地数据库）

### Electron打包配置

- 目标平台：Windows (EXE)
- 安装包类型：NSIS安装程序
- 应用图标：自定义图标
- 自动更新：通过electron-updater实现
- 窗口配置：默认尺寸 1280x800，最小尺寸 1024x600，无边框标题栏
