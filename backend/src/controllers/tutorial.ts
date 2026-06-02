import type { Request, Response } from 'express'

interface TutorialStep {
  title: Record<string, string>
  content: Record<string, string>
  code: string
}

interface Tutorial {
  id: number
  title: Record<string, string>
  description: Record<string, string>
  steps: TutorialStep[]
}

const tutorials: Tutorial[] = [
  {
    id: 1,
    title: {
      en: 'Getting Started with SVG',
      zh: 'SVG入门指南',
      ja: 'SVGの基本',
      ko: 'SVG 시작하기'
    },
    description: {
      en: 'Learn the basics of SVG and how to create simple shapes',
      zh: '学习SVG基础知识和如何创建简单形状',
      ja: 'SVGの基本と単純な図形の作成方法を学びましょう',
      ko: 'SVG 기본 및 단순 도형 생성 방법 학습'
    },
    steps: [
      {
        title: { en: 'Create a Rectangle', zh: '创建矩形', ja: '四角形を作成', ko: '사각형 만들기' },
        content: { en: 'Use the rect element to create a rectangle', zh: '使用rect元素创建矩形', ja: 'rect要素を使って四角形を作成します', ko: 'rect 요소로 사각형 만들기' },
        code: '<rect x="10" y="10" width="100" height="50" fill="blue"/>'
      },
      {
        title: { en: 'Add a Circle', zh: '添加圆形', ja: '円を追加', ko: '원 추가' },
        content: { en: 'Use the circle element to add a circle', zh: '使用circle元素添加圆形', ja: 'circle要素を使って円を追加します', ko: 'circle 요소로 원 추가' },
        code: '<circle cx="60" cy="80" r="30" fill="red"/>'
      }
    ]
  },
  {
    id: 2,
    title: {
      en: 'SVG Animations',
      zh: 'SVG动画',
      ja: 'SVGアニメーション',
      ko: 'SVG 애니메이션'
    },
    description: {
      en: 'Learn how to add animations to your SVG elements',
      zh: '学习如何为SVG元素添加动画',
      ja: 'SVG要素にアニメーションを追加する方法を学びましょう',
      ko: 'SVG 요소에 애니메이션 추가 방법 학습'
    },
    steps: [
      {
        title: { en: 'Basic Animation', zh: '基本动画', ja: '基本アニメーション', ko: '기본 애니메이션' },
        content: { en: 'Use animate element for basic animations', zh: '使用animate元素创建基本动画', ja: 'animate要素を使って基本的なアニメーションを作成します', ko: 'animate 요소로 기본 애니메이션 만들기' },
        code: '<circle cx="100" cy="100" r="50"><animate attributeName="cx" values="100;200;100" dur="3s" repeatCount="indefinite"/></circle>'
      },
      {
        title: { en: 'Transform Animation', zh: '变换动画', ja: '変形アニメーション', ko: '변형 애니메이션' },
        content: { en: 'Use animateTransform for transformations', zh: '使用animateTransform创建变换动画', ja: 'animateTransformを使って変形アニメーションを作成します', ko: 'animateTransform으로 변형 애니메이션 만들기' },
        code: '<rect width="50" height="50"><animateTransform attributeName="transform" type="rotate" values="0 25 25;360 25 25" dur="4s" repeatCount="indefinite"/></rect>'
      }
    ]
  }
]

export const getTutorials = (req: Request, res: Response) => {
  const lng = req.headers['accept-language']?.split(',')[0] || 'en'
  const filtered = tutorials.map(t => ({
    id: t.id,
    title: t.title[lng] || t.title.en,
    description: t.description[lng] || t.description.en
  }))
  res.json({ success: true, data: filtered })
}

export const getTutorial = (req: Request, res: Response) => {
  const { id } = req.params
  const lng = req.headers['accept-language']?.split(',')[0] || 'en'
  const tutorial = tutorials.find(t => t.id === parseInt(id))
  
  if (!tutorial) {
    res.status(404).json({ success: false, error: 'Tutorial not found' })
    return
  }
  
  const localized = {
    id: tutorial.id,
    title: tutorial.title[lng] || tutorial.title.en,
    description: tutorial.description[lng] || tutorial.description.en,
    steps: tutorial.steps.map(step => ({
      title: step.title[lng] || step.title.en,
      content: step.content[lng] || step.content.en,
      code: step.code
    }))
  }
  
  res.json({ success: true, data: localized })
}