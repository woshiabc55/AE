# Electron AI Framework 架构文档

## 1. 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Application                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Main Process │  │   Preload    │  │  Renderer Process │  │
│  │              │  │   Script     │  │                   │  │
│  │ ┌──────────┐ │  │             │  │ ┌───────────────┐ │  │
│  │ │ Window   │ │  │ context     │  │ │  React App    │ │  │
│  │ │ Manager  │ │  │ Bridge      │  │ │               │ │  │
│  │ └──────────┘ │  │             │  │ │ ┌───────────┐ │ │  │
│  │ ┌──────────┐ │  │ Expose API  │  │ │ │ Training  │ │ │  │
│  │ │   IPC    │ │◄─┤ to Renderer │─►│ │ │ Panel     │ │ │  │
│  │ │ Handlers │ │  │             │  │ │ └───────────┘ │ │  │
│  │ └──────────┘ │  │ - ai        │  │ │ ┌───────────┐ │ │  │
│  │              │  │ - plugin    │  │ │ │ Plugins   │ │ │  │
│  │              │  │ - config    │  │ │ │ Panel     │ │ │  │
│  │              │  │ - module    │  │ │ └───────────┘ │ │  │
│  │              │  │ - system    │  │ │ ┌───────────┐ │ │  │
│  └──────┬───────┘  └─────────────┘  │ │ │ Config    │ │ │  │
│         │                            │ │ │ Panel     │ │ │  │
│         ▼                            │ │ └───────────┘ │ │  │
│  ┌──────────────┐                    │ │ ┌───────────┐ │ │  │
│  │   Backend    │                    │ │ │ Logs      │ │ │  │
│  │   Service    │                    │ │ │ Panel     │ │ │  │
│  │              │                    │ │ └───────────┘ │ │  │
│  │ ┌──────────┐ │                    │ └───────────────┘ │  │
│  │ │   AI     │ │                    └───────────────────┘  │
│  │ │ Service  │ │                                           │
│  │ │          │ │                                           │
│  │ │┌────────┐│ │  ┌─────────────────────────────────────┐  │
│  │ ││Trainer ││ │  │           Core Modules              │  │
│  │ │└────────┘│ │  │                                     │  │
│  │ │┌────────┐│ │  │ ┌────────┐ ┌────────┐ ┌──────────┐ │  │
│  │ ││ Model  ││ │  │ │ Event  │ │ Logger │ │ Config   │ │  │
│  │ ││Manager ││ │  │ │  Bus   │ │        │ │ Manager  │ │  │
│  │ │└────────┘│ │  │ └────────┘ └────────┘ └──────────┘ │  │
│  │ │┌────────┐│ │  │ ┌────────┐ ┌──────────────────┐   │  │
│  │ ││Dataset ││ │  │ │Plugin  │ │  Module Loader   │   │  │
│  │ ││Loader  ││ │  │ │System  │ │                  │   │  │
│  │ │└────────┘│ │  │ └────────┘ └──────────────────┘   │  │
│  │ └──────────┘ │  └─────────────────────────────────────┘  │
│  │ ┌──────────┐ │                                           │
│  │ │   API    │ │                                           │
│  │ │  Routes  │ │                                           │
│  │ └──────────┘ │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## 2. 模块说明

### 2.1 主进程 (Main Process)

| 模块 | 文件 | 职责 |
|------|------|------|
| Application | `src/main/index.ts` | 应用入口，初始化所有子系统，管理应用生命周期 |
| WindowManager | `src/main/window-manager.ts` | 窗口创建/销毁/聚焦，窗口状态持久化 |
| IPCHandlers | `src/main/ipc-handlers.ts` | 注册所有 IPC 通道，桥接渲染进程与后端服务 |

### 2.2 预加载脚本 (Preload)

| 模块 | 文件 | 职责 |
|------|------|------|
| Preload | `src/preload/index.ts` | 通过 contextBridge 安全暴露 API 到渲染进程 |

### 2.3 渲染进程 (Renderer Process)

| 模块 | 文件 | 职责 |
|------|------|------|
| App | `src/renderer/App.tsx` | 主应用组件，包含侧边栏导航和四个功能面板 |
| TrainingPanel | `src/renderer/App.tsx` | AI 训练面板：模型加载/卸载、训练启动/停止、训练状态展示 |
| PluginsPanel | `src/renderer/App.tsx` | 插件管理面板：插件列表、启用/停用/卸载 |
| ConfigPanel | `src/renderer/App.tsx` | 配置面板：配置查看/修改/验证/保存/重载 |
| LogsPanel | `src/renderer/App.tsx` | 日志面板：实时日志流、级别过滤、关键词搜索 |

### 2.4 后端服务 (Backend)

| 模块 | 文件 | 职责 |
|------|------|------|
| BackendService | `src/backend/index.ts` | 统一后端入口，初始化 AI 服务、启动 HTTP 服务、管理训练队列 |
| AIService | `src/backend/ai-service.ts` | AI 服务层：模型加载/卸载、推理接口、训练任务管理 |
| Trainer | `src/backend/training/trainer.ts` | 训练循环、超参数管理、训练状态回调、检查点保存 |
| ModelManager | `src/backend/training/model-manager.ts` | 模型注册表、版本控制、模型导入/导出 |
| DatasetLoader | `src/backend/training/dataset-loader.ts` | 多格式数据加载、预处理管道、数据增强 |
| APIRouter | `src/backend/api/routes.ts` | RESTful API 路由定义 |

### 2.5 核心模块 (Core)

| 模块 | 文件 | 职责 |
|------|------|------|
| EventBus | `src/core/event-bus.ts` | 发布/订阅模式、类型安全事件、事件历史、异步事件处理 |
| Logger | `src/core/logger.ts` | 多级别日志、文件轮转、多传输（控制台/文件/远程）、结构化日志 |
| ConfigManager | `src/core/config-manager.ts` | 分层配置（默认<用户<项目）、热重载、验证、变更通知 |
| PluginSystem | `src/core/plugin-system.ts` | 插件注册/注销、生命周期管理、依赖解析、通信机制、沙箱隔离 |
| ModuleLoader | `src/core/module-loader.ts` | 动态模块加载、依赖图、模块生命周期、懒加载 |

## 3. 接口定义

### 3.1 IPC 通道

| 通道 | 方向 | 参数 | 返回值 |
|------|------|------|--------|
| `ai:load-model` | Renderer → Main | `modelId: string` | `void` |
| `ai:unload-model` | Renderer → Main | `modelId: string` | `void` |
| `ai:inference` | Renderer → Main | `{ modelId, input, options }` | `InferenceResult` |
| `ai:start-training` | Renderer → Main | `{ modelId, datasetId, hyperparameters }` | `string (trainingId)` |
| `ai:stop-training` | Renderer → Main | `trainingId: string` | `void` |
| `ai:get-training-status` | Renderer → Main | `trainingId: string` | `TrainingJob` |
| `ai:list-models` | Renderer → Main | - | `ModelInfo[]` |
| `ai:get-model-info` | Renderer → Main | `modelId: string` | `ModelInfo` |
| `plugin:register` | Renderer → Main | `{ manifest, modulePath }` | `void` |
| `plugin:activate` | Renderer → Main | `pluginId: string` | `void` |
| `plugin:deactivate` | Renderer → Main | `pluginId: string` | `void` |
| `plugin:unregister` | Renderer → Main | `pluginId: string` | `void` |
| `plugin:list` | Renderer → Main | - | `PluginInfo[]` |
| `config:get` | Renderer → Main | `{ key, defaultValue }` | `ConfigValue` |
| `config:set` | Renderer → Main | `{ key, value, layer }` | `{ success: boolean }` |
| `config:get-all` | Renderer → Main | - | `ConfigObject` |
| `config:validate` | Renderer → Main | - | `{ valid, errors }` |
| `config:save` | Renderer → Main | `layerName: string` | `void` |
| `config:reload` | Renderer → Main | - | `void` |
| `module:list` | Renderer → Main | - | `ModuleInfo[]` |
| `module:load` | Renderer → Main | `moduleId: string` | `ModuleExports` |
| `module:unload` | Renderer → Main | `moduleId: string` | `void` |

### 3.2 RESTful API 端点

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/models` | 列出所有模型 |
| GET | `/api/models/:id` | 获取模型详情 |
| POST | `/api/models/register` | 注册新模型 |
| POST | `/api/models/:id/load` | 加载模型 |
| POST | `/api/models/:id/unload` | 卸载模型 |
| POST | `/api/models/:id/inference` | 执行推理 |
| GET | `/api/training/jobs` | 列出训练任务 |
| POST | `/api/training/start` | 启动训练 |
| POST | `/api/training/:id/stop` | 停止训练 |
| GET | `/api/training/:id/status` | 获取训练状态 |
| GET | `/api/datasets` | 列出数据集 |
| POST | `/api/datasets/register` | 注册数据集 |

### 3.3 事件总线事件

| 事件 | 载荷 | 触发时机 |
|------|------|----------|
| `app:ready` | - | 应用初始化完成 |
| `app:quitting` | - | 应用即将退出 |
| `model:registered` | `{ id, name }` | 模型注册 |
| `model:loaded` | `{ id }` | 模型加载完成 |
| `model:unloaded` | `{ id }` | 模型卸载完成 |
| `model:error` | `{ id, error }` | 模型错误 |
| `training:started` | `{ id }` | 训练开始 |
| `training:completed` | `{ id }` | 训练完成 |
| `training:failed` | `{ id, error }` | 训练失败 |
| `training:epoch-end` | `{ id, epoch, metrics }` | 训练 Epoch 结束 |
| `plugin:registered` | `{ id, name }` | 插件注册 |
| `plugin:activated` | `{ id }` | 插件激活 |
| `plugin:deactivated` | `{ id }` | 插件停用 |
| `config:change` | `{ key, newValue, oldValue }` | 配置变更 |
| `module:loaded` | `{ id, loadTime }` | 模块加载完成 |
| `module:unloaded` | `{ id }` | 模块卸载完成 |

### 3.4 插件生命周期接口

```typescript
interface PluginModule {
  install?(context: PluginContext): void | Promise<void>;
  activate?(context: PluginContext): void | Promise<void>;
  deactivate?(context: PluginContext): void | Promise<void>;
  uninstall?(context: PluginContext): void | Promise<void>;
}

interface PluginContext {
  eventBus: EventBus;
  logger: Logger;
  storage: Map<string, unknown>;
  api: PluginAPI;
}

interface PluginAPI {
  emit(eventId: string, payload: unknown): void;
  on(eventId: string, handler: (payload: unknown) => void): () => void;
  requestPermission(permission: string): boolean;
  getPlugin(id: string): PluginManifest | null;
}
```

### 3.5 配置分层

```
优先级: 项目配置 (20) > 用户配置 (10) > 默认配置 (0)

default.yml  ──►  合并  ──►  最终配置
user.yml     ──►
project.yml  ──►
```

- **默认层** (`default`): 应用内置默认值，不可修改
- **用户层** (`user`): 用户全局偏好设置
- **项目层** (`project`): 项目级覆盖配置

### 3.6 日志传输接口

```typescript
interface LogTransport {
  name: string;
  log(entry: LogEntry): void | Promise<void>;
  flush?(): void | Promise<void>;
  close?(): void | Promise<void>;
}
```

内置传输:
- `ConsoleTransport` - 控制台输出
- `FileTransport` - 文件输出，支持轮转
- `RemoteTransport` - 远程日志服务，支持批量发送

## 4. 数据流

```
用户操作 (Renderer)
    │
    ▼
contextBridge (Preload)
    │
    ▼
IPC Channel (Main Process)
    │
    ▼
IPCHandlers ──► BackendService ──► AIService
    │                                  │
    │                          ┌───────┼───────┐
    │                          ▼       ▼       ▼
    │                      Trainer  ModelMgr  DatasetLoader
    │                          │
    ▼                          ▼
EventBus ◄────────────── 事件回调
    │
    ▼
Logger / ConfigManager / PluginSystem
```
