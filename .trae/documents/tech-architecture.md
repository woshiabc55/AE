## 1. 架构设计

```mermaid
flowchart TD
    "前端 React+Vite" --> "页面路由"
    "页面路由" --> "主展示页"
    "页面路由" --> "方案详情页"
    "主展示页" --> "提示词数据(静态)"
    "方案详情页" --> "提示词数据(静态)"
    "主展示页" --> "图片生成API"
```

纯前端项目，无后端服务。提示词数据以静态JSON/TS模块形式内嵌。图片通过trae-api图片生成接口获取。

## 2. 技术说明
- 前端：React@18 + tailwindcss@3 + vite
- 初始化工具：vite-init
- 后端：无
- 数据库：无（静态数据）

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| / | 主展示页，双方案切换/对比 |
| /scheme/:id | 方案详情页，结构化浏览 |

## 4. API定义
- 图片生成：`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt={prompt}&image_size=landscape_16_9`
- 无其他后端API

## 5. 服务器架构
- 不适用（纯前端）

## 6. 数据模型
- 不适用（静态数据内嵌于前端代码）
