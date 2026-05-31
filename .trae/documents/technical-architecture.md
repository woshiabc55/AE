## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层"
        A["React + TypeScript + Vite"]
        B["Zustand 状态管理"]
        C["Tailwind CSS 样式"]
        D["DnD Kit 拖拽引擎"]
    end
    subgraph "数据层"
        E["LocalStorage 持久化"]
        F["内存状态管理"]
    end
    A --> B
    A --> C
    A --> D
    B --> F
    B --> E
```

## 2. 技术说明
- 前端：React@18 + TypeScript + Tailwind CSS@3 + Vite
- 初始化工具：vite-init
- 后端：无（纯前端应用）
- 数据库：无（使用 LocalStorage 持久化 + 内存状态）
- 拖拽引擎：@dnd-kit/core + @dnd-kit/sortable
- 状态管理：Zustand

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| / | 工作台页面，概念画布和提示词编辑主界面 |
| /templates | 模板库页面，浏览和使用预设模板 |

## 4. API定义
- 无后端API，所有数据在客户端处理

## 5. 服务器架构图
- 不适用（纯前端应用）

## 6. 数据模型

### 6.1 数据模型定义

```mermaid
erDiagram
    "ConceptModule" {
        string id PK
        string name
        string category
        string icon
        string color
        string description
        string[] variants
    }
    "CanvasBlock" {
        string id PK
        string moduleId FK
        number x
        number y
        number weight
        string customText
        string selectedVariant
    }
    "PromptTemplate" {
        string id PK
        string name
        string description
        string category
        string[] tags
        string previewImage
        string[] blockIds
    }
    "PromptHistory" {
        string id PK
        string text
        number timestamp
        string templateId FK
    }
    "ConceptModule" ||--o{ "CanvasBlock" : "实例化"
    "PromptTemplate" ||--o{ "CanvasBlock" : "包含"
    "PromptTemplate" ||--o{ "PromptHistory" : "生成"
```

### 6.2 数据定义语言

```typescript
interface ConceptModule {
  id: string;
  name: string;
  category: 'subject' | 'style' | 'scene' | 'mood' | 'technique' | 'custom';
  icon: string;
  color: string;
  description: string;
  variants: string[];
}

interface CanvasBlock {
  id: string;
  moduleId: string;
  x: number;
  y: number;
  weight: number;
  customText: string;
  selectedVariant: string;
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  previewImage: string;
  blocks: CanvasBlock[];
}

interface PromptHistory {
  id: string;
  text: string;
  timestamp: number;
  templateId?: string;
}
```
