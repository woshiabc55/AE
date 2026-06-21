# 拼豆半面工坊 · Perler Bead Studio

一款网页端拼豆角色创作与骨架动画工具。绘制角色半面，自动镜像生成完整对称形象，再通过网格化拼豆呈现，绑定骨架后可拖拽关节生成可拉动动画，并将图案与动画数据持久化到浏览器数据库中。

## 功能特性

- **半面镜像绘制**：左半绘制自动镜像到右半，中线虚线指示对称轴
- **拼豆网格化**：48 色拼豆标准色卡 + 自定义颜色，16/24/32/48 四档网格
- **骨架绑定**：添加关节、连接骨骼、指派格子、移动关节四种工具
- **可拉动动画**：关键帧录制 + ease-in-out 插值 + 时间轴拖动预览
- **数据库存储**：IndexedDB 持久化图案 + 骨架 + 关键帧，支持 JSON 导入导出

## 技术栈

- React 18 + TypeScript + Vite
- TailwindCSS 3 + Zustand
- Canvas 2D 渲染
- IndexedDB（idb 库封装）

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署工作流（`.github/workflows/deploy.yml`）。

### 首次部署步骤

1. 代码已推送到 `woshiabc55/AE` 仓库的 `main` 分支
2. 进入仓库 **Settings → Pages**
3. **Source** 选择 **GitHub Actions**
4. 等待 Actions 运行完成，访问 `https://woshiabc55.github.io/AE/`

### 修改仓库名

如果使用其他仓库名，需同步修改：
- [vite.config.ts](vite.config.ts) 中的 `base: '/AE/'`
- [package.json](package.json) 中的 `homepage` 字段

## 项目结构

```
src/
├── components/   Workspace(画布/工具栏/调色板) · Skeleton · Animation · Gallery · common
├── engine/       gridUtils · skeleton · animation · renderer
├── store/        useArtworkStore · useToolStore · useUIStore (Zustand)
├── db/           database · artworkRepo (IndexedDB)
├── types/        统一类型定义
└── utils/        colors(色卡) · geometry(几何计算)
```

## 使用流程

1. **绘制模式**（默认）：左半画布画拼豆，右侧自动镜像生成完整对称形象
2. **骨架模式**：添加关节 → 连接骨骼 → 指派格子 → 拖拽关节测试变形
3. **动画模式**：拖关节摆姿势 → 录制关键帧 → 播放可拉动动画
4. **保存**：顶部「保存」按钮存入 IndexedDB，「存档」按钮管理作品
