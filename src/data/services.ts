export type Service = {
  index: string
  title: string
  description: string
  deliverables: string[]
}

export const services: Service[] = [
  {
    index: '01',
    title: '品牌识别',
    description:
      '从策略到落地的完整品牌识别系统。围绕一句话价值主张,构建可在所有触点复用的视觉语法。',
    deliverables: ['品牌策略工作坊', '字标与定制字体', '色彩与图形系统', '应用规范手册'],
  },
  {
    index: '02',
    title: '动态视觉',
    description:
      '以镜头感与节奏为核心的动态内容。从分镜、调色到最终渲染,所有动效都为叙事服务。',
    deliverables: ['动态 KV', '动态海报', '片头与转场', '社交媒体动效'],
  },
  {
    index: '03',
    title: '视觉系统',
    description:
      '为可持续生产而设计的视觉系统:网格、组件、规则,让设计资产在团队中保持一致。',
    deliverables: ['版式与网格', '组件库', '模板系统', '规范文档'],
  },
  {
    index: '04',
    title: '活动主视觉',
    description:
      '为线下活动、快闪与展览提供主视觉与延展。线上线下物料在节奏与气质上保持一致。',
    deliverables: ['主视觉', '空间与展陈', '周边与印刷', '现场拍摄'],
  },
]
