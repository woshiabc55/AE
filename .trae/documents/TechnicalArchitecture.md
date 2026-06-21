## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层 Frontend"
        "React 18 + Vite"
        "TailwindCSS 3"
        "React Router"
    end
    subgraph "数据层 Data"
        "本地 Mock 数据"
        "试卷 JSON"
        "提纲 JSON"
    end
    "前端层" --> "数据层"
```

## 2. 技术说明
- 前端：React@18 + tailwindcss@3 + vite
- 初始化工具：vite-init
- 路由：react-router-dom@6
- 后端：无（纯前端展示，使用本地 Mock 数据）
- 数据：试卷与提纲以 JSON / TS 模块形式内嵌

## 3. 路由定义
| 路由 | 用途 |
|-------|---------|
| `/` | 首页 - 卷宗总览（试卷档案 + 提纲索引） |
| `/exam/:id` | 试卷页 - 真题卷宗（题目正文 + 答题卡） |
| `/outline/:chapterId` | 提纲页 - 考点脉络（章节目录 + 知识点树） |

## 4. 数据模型

### 4.1 试卷数据结构
```typescript
interface ExamPaper {
  id: string;
  title: string;          // 试卷名称
  semester: string;       // 学期
  year: number;
  duration: number;       // 考试时长（分钟）
  totalScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  sections: ExamSection[];
}

interface ExamSection {
  title: string;          // 大题标题，如"一、选择题"
  type: 'choice' | 'fill' | 'compute' | 'proof';
  questions: Question[];
}

interface Question {
  id: string;
  number: number;
  content: string;        // 题干
  score: number;
  options?: string[];     // 选择题选项
}
```

### 4.2 提纲数据结构
```typescript
interface OutlineChapter {
  id: string;
  number: string;         // 章节编号，如"第一章"
  title: string;
  weight: number;         // 考点权重 0-100
  points: KnowledgePoint[];
}

interface KnowledgePoint {
  id: string;
  title: string;
  level: '了解' | '理解' | '掌握' | '熟练掌握';
  description: string;
}
```
