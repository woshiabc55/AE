import { onMounted, onBeforeUnmount, ref, shallowRef, watch, type Ref } from 'vue'
import * as echarts from 'echarts/core'
import {
  BarChart, LineChart, PieChart, ScatterChart, RadarChart, TreemapChart,
  type BarSeriesOption, type LineSeriesOption, type PieSeriesOption,
  type ScatterSeriesOption, type RadarSeriesOption, type TreemapSeriesOption
} from 'echarts/charts'
import {
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  DatasetComponent, TransformComponent, ToolboxComponent, GraphicComponent,
  type TitleComponentOption, type TooltipComponentOption,
  type GridComponentOption, type LegendComponentOption,
  type DatasetComponentOption, type ToolboxComponentOption,
  type GraphicComponentOption
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type { ComposeOption } from 'echarts/core'

echarts.use([
  BarChart, LineChart, PieChart, ScatterChart, RadarChart, TreemapChart,
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  DatasetComponent, TransformComponent, ToolboxComponent, GraphicComponent,
  LabelLayout, UniversalTransition, CanvasRenderer
])

export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | RadarSeriesOption
  | TreemapSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DatasetComponentOption
  | ToolboxComponentOption
  | GraphicComponentOption
>

export function useECharts(option: Ref<ECOption>, theme: 'dark' | 'light' = 'dark') {
  const elRef = ref<HTMLDivElement | null>(null)
  const instance = shallowRef<echarts.ECharts | null>(null)

  onMounted(() => {
    if (!elRef.value) return
    instance.value = echarts.init(elRef.value, theme, { renderer: 'canvas' })
    instance.value.setOption(option.value)
  })

  watch(option, (v) => {
    instance.value?.setOption(v, true)
  }, { deep: true })

  const resize = () => instance.value?.resize()
  window.addEventListener('resize', resize)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    instance.value?.dispose()
  })

  return { elRef, instance }
}
