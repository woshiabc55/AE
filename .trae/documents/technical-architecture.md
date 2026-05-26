## 1. 架构设计

```mermaid
flowchart TD
    "前端 React 应用" --> "状态管理 Zustand"
    "状态管理 Zustand" --> "文件上传逻辑"
    "文件上传逻辑" --> "本地文件列表"
    "本地文件列表" --> "移交操作"
```

纯前端应用，无后端依赖。文件上传和移交均在客户端完成，使用浏览器 File API 处理文件读取，状态由 Zustand 管理。

## 2. 技术说明
- 前端：React@18 + Tailwind CSS@3 + Vite
- 初始化工具：vite-init
- 后端：无
- 数据库：无（使用客户端内存状态）

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| / | 主页面，包含窗格布局和数据-存储模块 |

## 4. API 定义
无后端 API，所有操作在客户端完成。

## 5. 服务器架构图
不适用。

## 6. 数据模型

### 6.1 数据模型定义

```mermaid
erDiagram
    "FileItem" {
        "string id" PK
        "string name"
        "number size"
        "string type"
        "string status"
        "string uploadedAt"
    }
```

### 6.2 数据定义语言
无数据库，使用 TypeScript 接口定义：

```typescript
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploaded' | 'transferred';
  uploadedAt: string;
}
```
