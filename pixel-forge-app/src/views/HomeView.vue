<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hoverItem = ref<string | null>(null)

const navItems = [
  { id: 'tool', label: '稻锊 · 工具', icon: '◈', color: '#7cff6b', desc: 'MD文档查看 · 图像预览' },
  { id: 'model-editor', label: '模型编辑器', icon: '◈', color: '#ffaa00', desc: '稻锊 · Canvas Pixel 模型编辑' },
  { id: 'editor', label: '像素编辑器', icon: '✏', color: '#00ff88', desc: '像素绘制 + 5种效果渲染' },
  { id: 'dataset', label: '数据集标注', icon: '▣', color: '#ff6b9d', desc: '图文→标注数据制作' },
  { id: 'training', label: '训练管线', icon: '⬡', color: '#a29bfe', desc: 'Node训练 + 空链后端' },
  { id: 'docs', label: 'MCOP文档', icon: '◈', color: '#44ddff', desc: '7种标记格式 · 57个文档' },
  { id: 'versions', label: '版本迭代', icon: '▶', color: '#ffaa00', desc: 'v1-v7 七个迭代版本' },
]
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1 class="logo">稻锊 模型 编辑器</h1>
      <p class="sub">DAOLUE · MODEL EDITOR · Canvas Pixel System</p>
    </div>
    <div class="nav-grid">
      <div
        v-for="item in navItems"
        :key="item.id"
        class="nav-card"
        :class="{ hover: hoverItem === item.id }"
        @mouseenter="hoverItem = item.id"
        @mouseleave="hoverItem = null"
        @click="router.push({ name: item.id })"
      >
        <span class="nav-icon" :style="{ color: item.color }">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
        <span class="nav-desc">{{ item.desc }}</span>
      </div>
    </div>
    <div class="footer">
      <span>MCOP: .selena .kelex .skill .hermes .agent .opic .rpa</span>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 40px;
}
.hero { text-align: center; }
.logo {
  font-family: 'Press Start 2P', monospace;
  font-size: 22px;
  color: #ffaa00;
  text-shadow: 0 0 30px rgba(255,170,0,0.5), 0 0 60px rgba(255,170,0,0.2);
  letter-spacing: 6px;
  margin-bottom: 12px;
}
.sub {
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  color: #6a8a6a;
  letter-spacing: 2px;
}
.nav-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.nav-card {
  width: 220px;
  padding: 24px 20px;
  border: 1px solid #1a2a1a;
  border-radius: 4px;
  background: rgba(10,10,18,0.8);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.nav-card.hover {
  border-color: #ffaa00;
  background: rgba(255,170,0,0.04);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(255,170,0,0.08);
}
.nav-icon { font-size: 28px; }
.nav-label {
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  color: #d0ffd0;
  letter-spacing: 1px;
}
.nav-desc {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: #3a5a3a;
  text-align: center;
}
.footer {
  font-family: 'Press Start 2P', monospace;
  font-size: 6px;
  color: #3a5a3a;
  letter-spacing: 1px;
}
</style>