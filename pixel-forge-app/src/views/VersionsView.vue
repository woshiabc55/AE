<script setup lang="ts">
import { ref } from 'vue'

const versions = [
  { v: 'v1-core', name: '模块化基础', desc: 'EventBus + 单效果渲染', color: '#00ff88', path: '/v1-core/' },
  { v: 'v2-chain', name: '链式管道', desc: '效果串联执行', color: '#ffaa00', path: '/v2-chain/' },
  { v: 'v3-blend', name: '图层合成', desc: '多效果图层叠加 + 7种混合模式', color: '#ff3366', path: '/v3-blend/' },
  { v: 'v4-interactive', name: '参数调制', desc: 'source→transform→target参数联动', color: '#44ddff', path: '/v4-interactive/' },
  { v: 'v5-plugin', name: '插件系统', desc: '动态注册/注销效果插件', color: '#a29bfe', path: '/v5-plugin/' },
  { v: 'v6-physics3d', name: '3D物理解算', desc: 'Three.js + Verlet物理 + 5种3D面', color: '#ff6b9d', path: '/v6-physics3d/' },
  { v: 'v7-software-model', name: '软件实体模型', desc: '程序化纹理 + 3D软件实体建模', color: '#7cff6b', path: '/v7-software-model/' },
]

const hoverV = ref<string | null>(null)
const baseUrl = window.location.origin + ':8081'
</script>

<template>
  <div class="versions-page">
    <header class="v-header">
      <h1 class="v-title">▶ 版本迭代</h1>
      <span class="v-sub">v1-v7 七个迭代版本</span>
    </header>
    <div class="v-grid">
      <a
        v-for="ver in versions"
        :key="ver.v"
        class="v-card"
        :class="{ hover: hoverV === ver.v }"
        :href="baseUrl + ver.path"
        target="_blank"
        @mouseenter="hoverV = ver.v"
        @mouseleave="hoverV = null"
      >
        <span class="v-badge" :style="{ color: ver.color, borderColor: ver.color }">{{ ver.v }}</span>
        <span class="v-name">{{ ver.name }}</span>
        <span class="v-desc">{{ ver.desc }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.versions-page { min-height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; padding: 40px; }
.v-header { margin-bottom: 32px; }
.v-title { font-family: 'Press Start 2P', monospace; font-size: 12px; color: #ffaa00; letter-spacing: 2px; margin-bottom: 8px; }
.v-sub { font-size: 12px; color: #3a5a3a; }
.v-grid { display: flex; flex-wrap: wrap; gap: 16px; }
.v-card {
  width: 240px; padding: 20px; border: 1px solid #1a2a1a; border-radius: 4px;
  background: rgba(10,10,18,0.8); cursor: pointer; transition: all 0.3s;
  display: flex; flex-direction: column; gap: 8px; text-decoration: none; color: inherit;
}
.v-card.hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
.v-badge { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 3px 8px; border: 1px solid; border-radius: 2px; letter-spacing: 1px; display: inline-block; width: fit-content; }
.v-name { font-size: 13px; color: #d0ffd0; }
.v-desc { font-size: 10px; color: #3a5a3a; }
</style>
