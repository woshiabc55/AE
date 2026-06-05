<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ prompt: string; color: string }>()

// 简易高亮：把首字母大写的短语、关键时间、数字 8k/24fps/48fps、轴位符号上色
const tokens = computed(() => {
  const text = props.prompt
  const out: { type: string; text: string }[] = []
  const regex = /(\b\d+(?:fps|k|°|cm|m)?\b)|([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)|((?:→|↘|↗|↙|↑|↓|↔|↻|↺|○|∩|‖|←|─|｜|<|>)+)|(\b(?:IMAX|8k|24fps|48fps|photorealistic|warrior|war\s+horse|cinematic|war\s+scene)\b)|(blade|sword|arrow|war|horse|armor|camera|motion|trail|burst|axis|orbits?|leaps?|impact|rotating|explosion|afterimage|trench|crossbow|cavalry)\b/gi
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) out.push({ type: 'plain', text: text.slice(last, m.index) })
    if (m[1]) out.push({ type: 'num', text: m[1] })
    else if (m[2]) out.push({ type: 'caps', text: m[2] })
    else if (m[3]) out.push({ type: 'sym', text: m[3] })
    else if (m[4]) out.push({ type: 'key', text: m[4] })
    else if (m[5]) out.push({ type: 'caps', text: m[5] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ type: 'plain', text: text.slice(last) })
  return out
})
</script>

<template>
  <pre class="prompt-card-body mono" :style="{ '--c': color }"><template v-for="(t, i) in tokens" :key="i"><span :class="['tk', `tk-${t.type}`]">{{ t.text }}</span></template></pre>
</template>

<style scoped>
.prompt-card-body {
  margin: 0;
  padding: 18px 22px 22px;
  color: #D6CFBD;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--f-mono);
  position: relative;
  z-index: 1;
  max-height: 360px;
  overflow-y: auto;
}
.tk-caps { color: var(--c); font-weight: 500; }
.tk-num { color: var(--c-spark-bright); font-weight: 500; }
.tk-sym { color: var(--c-bronze-glow); }
.tk-key { color: var(--c-blood); }
.tk-plain { color: #D6CFBD; }
</style>
