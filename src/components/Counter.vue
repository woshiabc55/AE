<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ end: number; duration?: number; suffix?: string }>(), {
  duration: 1800,
  suffix: '',
});

const value = ref(0);

function animate() {
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / props.duration);
    const e = 1 - Math.pow(1 - p, 3);
    value.value = Math.floor(e * props.end);
    if (p < 1) requestAnimationFrame(tick);
    else value.value = props.end;
  };
  requestAnimationFrame(tick);
}

onMounted(animate);
watch(() => props.end, animate);
</script>

<template>
  <span class="counter-pulse">{{ value.toLocaleString('en-US') }}{{ suffix }}</span>
</template>
