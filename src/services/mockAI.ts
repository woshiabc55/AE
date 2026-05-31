import type { AIMessage, CodeBlock, TerminalLine } from "@/types";

const codeResponses: Record<string, { content: string; codeBlocks: CodeBlock[] }> = {
  default: {
    content: "我来帮你写一个示例函数。这是一个通用的工具函数，你可以根据需要修改：",
    codeBlocks: [
      {
        language: "javascript",
        code: "function processData(input) {\n  if (!input) throw new Error('Input is required');\n  const result = input\n    .filter(item => item.active)\n    .map(item => ({\n      ...item,\n      processed: true,\n      timestamp: Date.now()\n    }));\n  return result;\n}",
        fileName: "utils.js",
      },
    ],
  },
  react: {
    content: "这是一个 React 组件的示例，包含了状态管理和副作用处理：",
    codeBlocks: [
      {
        language: "javascript",
        code: "import { useState, useEffect } from 'react';\n\nfunction DataFetcher({ url }) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        setLoading(true);\n        const res = await fetch(url);\n        const json = await res.json();\n        setData(json);\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    };\n    fetchData();\n  }, [url]);\n\n  if (loading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error}</div>;\n  return <pre>{JSON.stringify(data, null, 2)}</pre>;\n}",
        fileName: "DataFetcher.jsx",
      },
    ],
  },
  api: {
    content: "这是一个 RESTful API 路由处理器的示例：",
    codeBlocks: [
      {
        language: "javascript",
        code: "async function handleRequest(req, res) {\n  const { method, body, params } = req;\n  \n  try {\n    switch (method) {\n      case 'GET':\n        const items = await db.findAll(params.id);\n        return res.json({ success: true, data: items });\n      case 'POST':\n        const created = await db.create(body);\n        return res.status(201).json({ success: true, data: created });\n      case 'PUT':\n        const updated = await db.update(params.id, body);\n        return res.json({ success: true, data: updated });\n      case 'DELETE':\n        await db.delete(params.id);\n        return res.json({ success: true });\n      default:\n        return res.status(405).json({ error: 'Method not allowed' });\n    }\n  } catch (err) {\n    return res.status(500).json({ error: err.message });\n  }\n}",
        fileName: "apiHandler.js",
      },
    ],
  },
  sort: {
    content: "这是一个高效的排序算法实现：",
    codeBlocks: [
      {
        language: "javascript",
        code: "function quickSort(arr, compareFn = (a, b) => a - b) {\n  if (arr.length <= 1) return arr;\n  \n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => compareFn(x, pivot) < 0);\n  const middle = arr.filter(x => compareFn(x, pivot) === 0);\n  const right = arr.filter(x => compareFn(x, pivot) > 0);\n  \n  return [...quickSort(left, compareFn), ...middle, ...quickSort(right, compareFn)];\n}",
        fileName: "sort.js",
      },
    ],
  },
  error: {
    content: "我检测到了代码中的问题。以下是修复建议：",
    codeBlocks: [
      {
        language: "javascript",
        code: "// 修复前（有 bug）:\n// const result = data.map(item => item.name);\n// 如果 data 为 null 会报错\n\n// 修复后:\nconst result = data?.map(item => item.name) ?? [];\n\n// 或者更安全的写法:\nconst safeResult = Array.isArray(data)\n  ? data.filter(Boolean).map(item => item.name)\n  : [];",
        fileName: "fix.js",
      },
    ],
  },
};

function detectIntent(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("react") || lower.includes("组件") || lower.includes("component")) return "react";
  if (lower.includes("api") || lower.includes("接口") || lower.includes("路由") || lower.includes("route")) return "api";
  if (lower.includes("排序") || lower.includes("sort") || lower.includes("算法") || lower.includes("algorithm")) return "sort";
  if (lower.includes("错误") || lower.includes("error") || lower.includes("bug") || lower.includes("修复") || lower.includes("fix")) return "error";
  return "default";
}

export function generateAIResponse(input: string): { message: AIMessage; terminalLines: TerminalLine[] } {
  const intent = detectIntent(input);
  const response = codeResponses[intent];

  const message: AIMessage = {
    id: `ai-${Date.now()}`,
    role: "assistant",
    content: response.content,
    timestamp: Date.now(),
    codeBlocks: response.codeBlocks,
  };

  const terminalLines: TerminalLine[] = [
    {
      id: `term-${Date.now()}-1`,
      content: `> AI 正在分析: "${input.slice(0, 50)}..."`,
      type: "info",
      timestamp: Date.now(),
    },
    {
      id: `term-${Date.now()}-2`,
      content: `> 代码生成完成 (${response.codeBlocks[0].fileName})`,
      type: "output",
      timestamp: Date.now(),
    },
  ];

  if (intent === "error") {
    terminalLines.push({
      id: `term-${Date.now()}-3`,
      content: "⚡ AI 诊断: 检测到潜在的空引用问题，建议使用可选链操作符",
      type: "ai-suggestion",
      timestamp: Date.now(),
    });
  }

  return { message, terminalLines };
}

export function generateCompletion(context: string): string {
  const completions: Record<string, string> = {
    function: "\n  // Implementation\n  return result;\n}",
    const: " = await fetchData();",
    import: " from 'react';",
    return: " { success: true, data: result };",
    if: " (condition) {\n    // handle case\n  }",
    class: " {\n  constructor() {\n    // init\n  }\n}",
  };

  const lastWord = context.trim().split(/\s+/).pop() || "";
  for (const [key, value] of Object.entries(completions)) {
    if (lastWord.endsWith(key)) return value;
  }
  return "\n  // TODO: implement\n";
}
