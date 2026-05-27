<script setup lang="ts">
import type { VersionConfig } from '../core/versions'
import { getLayerColor } from '../core/agents'

const props = defineProps<{
  version: VersionConfig
}>()
</script>

<template>
  <div class="vdetail">
    <section class="vdetail-section">
      <div class="vdetail-title" style="color:#a29bfe">⬡ AGENT · 模块代理</div>
      <div class="vdetail-body">
        <div class="agent-grid">
          <div v-for="agent in version.agents" :key="agent.id" class="agent-chip" :style="{ borderColor: getLayerColor(agent.layer), background: getLayerColor(agent.layer) + '10' }">
            <span class="agent-dot" :style="{ background: getLayerColor(agent.layer) }"></span>
            <span class="agent-name" :style="{ color: getLayerColor(agent.layer) }">{{ agent.name }}</span>
            <span class="agent-layer" :class="agent.layer">{{ agent.layer }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="vdetail-section" v-if="version.effects.length">
      <div class="vdetail-title" style="color:#ff6b9d">◈ EFFECT · 效果变换</div>
      <div class="vdetail-body">
        <div v-for="eff in version.effects" :key="eff.id" class="effect-chip" :style="{ borderColor: eff.color }">
          <span :style="{ color: eff.color }">{{ eff.name }}</span>
          <span class="effect-cat">{{ eff.category }}</span>
        </div>
      </div>
    </section>

    <section class="vdetail-section">
      <div class="vdetail-title" style="color:#00ff88">▶ RPA · 渲染管线</div>
      <div class="vdetail-body">
        <div class="pipe-flow">
          <template v-for="(stage, i) in version.pipeline.stages" :key="i">
            <div class="pipe-node" :class="{ highlight: i === 0 || i === version.pipeline.stages.length - 1 }">{{ stage }}</div>
            <span v-if="i < version.pipeline.stages.length - 1" class="pipe-arrow">→</span>
          </template>
        </div>
      </div>
    </section>

    <section class="vdetail-section">
      <div class="vdetail-title" style="color:#44ddff">◇ SELENA · 场景</div>
      <div class="vdetail-body">
        <div class="scene-info">
          <span class="scene-name">{{ version.scene.name }}</span>
          <span class="scene-surface">surface: {{ version.scene.surface }}</span>
        </div>
      </div>
    </section>

    <section class="vdetail-section">
      <div class="vdetail-title" style="color:#ffaa00">⚡ HERMES · 事件</div>
      <div class="vdetail-body">
        <div v-for="ev in version.events" :key="ev.name" class="event-row">
          <span class="event-name">{{ ev.name }}</span>
          <span class="event-pub">← {{ ev.publisher }}</span>
        </div>
      </div>
    </section>

    <section class="vdetail-section">
      <div class="vdetail-title" style="color:#7cff6b">▣ SKILL · 技能包</div>
      <div class="vdetail-body">
        <div class="skill-tags">
          <span v-for="sp in version.skillPacks" :key="sp" class="skill-tag">{{ sp.replace('skillpack-', '') }}</span>
        </div>
      </div>
    </section>

    <section class="vdetail-section">
      <div class="vdetail-title" style="color:#d0ffd0">★ 新增能力</div>
      <div class="vdetail-body">
        <div class="cap-list">
          <span v-for="cap in version.newCapabilities" :key="cap" class="cap-item">+ {{ cap }}</span>
        </div>
        <div class="cap-count">累计能力: <span style="color:#00ff88">{{ version.cumulativeCount }}</span></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.vdetail { display: flex; flex-direction: column; gap: 8px; }
.vdetail-section { border: 1px solid #1a2a1a; border-radius: 3px; overflow: hidden; }
.vdetail-title { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 6px 8px; letter-spacing: 1px; background: #0f0f1a; }
.vdetail-body { padding: 6px 8px; border-top: 1px solid #1a2a1a; }
.agent-grid { display: flex; flex-wrap: wrap; gap: 4px; }
.agent-chip { padding: 3px 6px; border: 1px solid; border-radius: 2px; display: flex; align-items: center; gap: 4px; font-size: 10px; }
.agent-dot { width: 5px; height: 5px; border-radius: 50%; }
.agent-name { font-size: 10px; }
.agent-layer { font-family: 'Press Start 2P', monospace; font-size: 4px; padding: 1px 3px; border-radius: 1px; }
.agent-layer.core { background: rgba(162,155,254,0.15); color: #a29bfe; }
.agent-layer.effect { background: rgba(255,107,157,0.15); color: #ff6b9d; }
.agent-layer.arch { background: rgba(68,221,255,0.15); color: #44ddff; }
.effect-chip { padding: 3px 8px; border: 1px solid; border-radius: 2px; display: inline-flex; align-items: center; gap: 6px; font-size: 10px; margin-right: 4px; margin-bottom: 4px; }
.effect-cat { font-size: 8px; color: #3a5a3a; }
.pipe-flow { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.pipe-node { padding: 3px 8px; border: 1px solid #1a2a1a; border-radius: 2px; font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 0.5px; }
.pipe-node.highlight { border-color: #00ff88; color: #00ff88; background: rgba(0,255,136,0.06); }
.pipe-arrow { color: #3a5a3a; font-size: 10px; }
.scene-info { display: flex; align-items: center; gap: 8px; }
.scene-name { font-size: 11px; color: #44ddff; }
.scene-surface { font-size: 9px; color: #3a5a3a; }
.event-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.event-name { font-family: 'Fira Code', monospace; font-size: 9px; color: #ffaa00; }
.event-pub { font-size: 9px; color: #3a5a3a; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.skill-tag { padding: 2px 6px; border: 1px solid #1a2a1a; border-radius: 2px; font-family: 'Press Start 2P', monospace; font-size: 5px; color: #7cff6b; letter-spacing: 0.5px; }
.cap-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 6px; }
.cap-item { font-size: 10px; color: #6a8a6a; }
.cap-count { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; }
</style>
