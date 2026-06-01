
import { Tool, Category } from '@/types';

export const categories: Category[] = [
  { id: 'all', name: '全部', icon: 'grid' },
  { id: 'chat', name: '对话', icon: 'message-square' },
  { id: 'image', name: '图像', icon: 'image' },
  { id: 'code', name: '代码', icon: 'code' },
  { id: 'audio', name: '音频', icon: 'volume-2' },
  { id: 'video', name: '视频', icon: 'video' },
  { id: 'text', name: '文本', icon: 'file-text' },
  { id: 'research', name: '研究', icon: 'search' },
];

export const tools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'OpenAI 开发的强大对话 AI，可用于问答、写作、编程等多种场景。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ChatGPT%20logo%20AI%20assistant&image_size=square',
    categories: ['chat', 'text', 'code'],
    url: 'https://chat.openai.com',
    tags: ['OpenAI', 'GPT-4', '对话'],
    addedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'DALL·E 3',
    description: 'OpenAI 开发的图像生成 AI，能够根据文字描述生成高质量图像。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=DALL-E%20AI%20art%20generator%20logo&image_size=square',
    categories: ['image'],
    url: 'https://openai.com/dall-e-3',
    tags: ['OpenAI', '图像生成', '艺术'],
    addedAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Midjourney',
    description: '基于 Discord 的 AI 艺术生成器，创建令人惊叹的数字艺术作品。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Midjourney%20AI%20art%20logo%20design&image_size=square',
    categories: ['image'],
    url: 'https://www.midjourney.com',
    tags: ['艺术', '图像', '设计'],
    addedAt: '2024-01-25'
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    description: 'AI 编程助手，在您的编辑器中提供智能代码建议。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=GitHub%20Copilot%20coding%20AI%20logo&image_size=square',
    categories: ['code'],
    url: 'https://github.com/copilot',
    tags: ['GitHub', '编程', '代码'],
    addedAt: '2024-03-01'
  },
  {
    id: '5',
    name: 'Claude',
    description: 'Anthropic 开发的安全、有益、诚实的 AI 助手。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Claude%20AI%20assistant%20logo&image_size=square',
    categories: ['chat', 'text', 'code'],
    url: 'https://www.anthropic.com',
    tags: ['Anthropic', '安全', '对话'],
    addedAt: '2024-02-10'
  },
  {
    id: '6',
    name: 'Stable Diffusion',
    description: '开源的文本到图像扩散模型，支持自定义和本地部署。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Stable%20Diffusion%20AI%20logo&image_size=square',
    categories: ['image'],
    url: 'https://stability.ai',
    tags: ['开源', '图像', '扩散模型'],
    addedAt: '2024-01-30'
  },
  {
    id: '7',
    name: 'Whisper',
    description: 'OpenAI 开发的通用语音识别系统，支持多种语言。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Whisper%20AI%20speech%20recognition%20logo&image_size=square',
    categories: ['audio'],
    url: 'https://openai.com/research/whisper',
    tags: ['OpenAI', '语音', '识别'],
    addedAt: '2024-02-15'
  },
  {
    id: '8',
    name: 'Sora',
    description: 'OpenAI 开发的视频生成模型，创建逼真的视频内容。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sora%20AI%20video%20generation%20logo&image_size=square',
    categories: ['video'],
    url: 'https://openai.com/sora',
    tags: ['OpenAI', '视频', '生成'],
    addedAt: '2024-03-05'
  },
  {
    id: '9',
    name: 'Perplexity',
    description: 'AI 驱动的搜索引擎，提供准确、最新的信息。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Perplexity%20AI%20search%20engine%20logo&image_size=square',
    categories: ['chat', 'research'],
    url: 'https://www.perplexity.ai',
    tags: ['搜索', '研究', '信息'],
    addedAt: '2024-02-05'
  },
  {
    id: '10',
    name: 'Notion AI',
    description: '集成在 Notion 中的 AI 写作助手。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Notion%20AI%20writing%20assistant%20logo&image_size=square',
    categories: ['text'],
    url: 'https://www.notion.so',
    tags: ['Notion', '写作', '笔记'],
    addedAt: '2024-01-20'
  },
  {
    id: '11',
    name: 'Runway ML',
    description: 'AI 视频编辑平台，提供多种 AI 视频工具。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Runway%20ML%20AI%20video%20editing%20logo&image_size=square',
    categories: ['video', 'image'],
    url: 'https://runwayml.com',
    tags: ['视频', '编辑', '创意'],
    addedAt: '2024-03-10'
  },
  {
    id: '12',
    name: 'Replit AI',
    description: '在线代码编辑器与 AI 辅助编程功能。',
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Replit%20AI%20coding%20platform%20logo&image_size=square',
    categories: ['code'],
    url: 'https://replit.com',
    tags: ['编程', '在线', 'IDE'],
    addedAt: '2024-02-25'
  }
];
