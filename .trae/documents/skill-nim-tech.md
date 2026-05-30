## 1. 架构设计

```mermaid
flowchart TD
    "前端 React+Vite" --> "路由"
    "路由" --> "Skill-Nim工具页"
    "Skill-Nim工具页" --> "文档编辑器模块"
    "Skill-Nim工具页" --> "SVG工坊模块"
    "Skill-Nim工具页" --> "拼接画板模块"
    "文档编辑器模块" --> "Zustand状态"
    "SVG工坊模块" --> "Zustand状态"
    "SVG工坊模块" --> "SVG模板库(静态)"
    "拼接画板模块" --> "Zustand状态"
    "拼接画板模块" --> "html-to-image导出"
```

纯前端项目，无后端。所有编辑状态通过Zustand管理，导出通过html-to-image库实现PNG截图。

## 2. 技术说明
- 前端：React@18 + tailwindcss@3 + vite
- 初始化工具：vite-init（已有项目）
- 状态管理：Zustand
- SVG处理：原生DOM + innerHTML渲染
- 图片导出：html-to-image
- 后端：无
- 数据库：无

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| /nim | Skill-Nim工具主页（三模式切换） |

## 4. API定义
- 无后端API
- 图片生成API（复用已有）：trae-api text_to_image

## 5. 服务器架构
- 不适用（纯前端）

## 6. 数据模型
- 不适用（状态通过Zustand in-memory管理）
