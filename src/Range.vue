<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue'
import { RangeContainerRefKey, RangeTrackRefKey } from './Range'
import type { RangeData, RangeRenderFn, RangeValue } from './type'
import RangeThumb from './RangeThumb.vue'

type RangeValueKey = RangeData['key']

const props = withDefaults(defineProps<{
  modelValue: RangeValue
  progress?: number
  renderTop?: RangeRenderFn
  renderBottom?: RangeRenderFn
  min?: number
  max?: number
  step?: number
  maxThumb?: number
}>(), {
  modelValue: () => [],
  progress: 0,
  min: 0,
  max: 100,
  step: 1,
  maxThumb: 10,
})

const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: typeof props.modelValue): void
  (e: 'addThumb', value: number): void
}>()

const modelType = computed<'single' | 'numbers' | 'data'>(() => {
  const value = props.modelValue
  if (Array.isArray(value) && typeof value[0] === 'number')
    return 'numbers'
  else if (Array.isArray(value))
    return 'data'
  else
    return 'single'
})
const model = computed<RangeData[]>({
  get: () => {
    const value = props.modelValue
    if (Array.isArray(value)) {
      return value.map((item, idx) => {
        if (typeof item === 'number')
          return { key: idx, value: item }
        else
          return item
      })
    }
    else {
      return [{ key: 0, value }]
    }
  },
  set: (value) => {
    if (modelType.value === 'single')
      emits('update:modelValue', value[0]?.value)
    else if (modelType.value === 'numbers')
      emits('update:modelValue', value.map(item => item.value))
    else
      emits('update:modelValue', value)
  },
})

const modelMap = new Map<RangeValueKey, RangeData>()
watch(model, (value) => {
  value.forEach((item) => {
    if (!modelMap.has(item.key))
      modelMap.set(item.key, item)
  })
  const keys = Array.from(value.map(item => item.key))
  modelMap.forEach((item, key) => {
    if (!keys.includes(key))
      modelMap.delete(key)
  })
}, {
  immediate: true,
  deep: true,
})

const trackRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()

function getValue(percentage: number) {
  const min = props.min
  const max = props.max
  const step = props.step
  if (min === undefined || max === undefined || step === undefined)
    return 0
  if (percentage < 0)
    return min
  if (percentage > 100)
    return max
  const value = min + (max - min) * percentage / 100
  return Math.round(value / step) * step
}
function getPercentage(value: number) {
  const min = props.min
  const max = props.max
  const step = props.step / (max - min)
  if (min === undefined || max === undefined || step === undefined)
    return 0
  if (value < min)
    return 0
  if (value > max)
    return 100
  const percentage = (value - min) / (max - min) * 100
  return Math.round(percentage / step) * step
}

const position = computed(() => {
  return model.value.reduce((map, item) => {
    map.set(item.key, getPercentage(item.value))
    return map
  }, new Map<RangeValueKey, number>())
})

const current = ref<RangeValueKey>()
function onUpdate(percentage: number) {
  const value = getValue(percentage)
  let index = model.value.findIndex(item => item.key === current.value)
  if (index === -1)
    return
  if (index > 0) {
    const prev = model.value[index - 1].value
    if (value === prev)
      return
    if (value < prev) {
      [model.value[index], model.value[index - 1]] = [model.value[index - 1], model.value[index]]
      current.value = model.value[index - 1].key
      index -= 1
    }
  }
  if (index < model.value.length - 1) {
    const next = model.value[index + 1].value
    if (value === next)
      return
    if (value > next) {
      [model.value[index], model.value[index + 1]] = [model.value[index + 1], model.value[index]]
      current.value = model.value[index + 1].key
      index += 1
    }
  }
  const modelValue = model.value
  modelValue[index].value = value
  model.value = modelValue
}

function onDelete() {
  const index = model.value.findIndex(item => item.key === current.value)
  if (index === -1)
    return
  model.value.splice(index, 1)
}

let allowAdd = false
function addThumb(e: MouseEvent) {
  if (!allowAdd)
    return
  allowAdd = false
  if (!trackRef?.value || model.value.length >= props.maxThumb)
    return
  const trackRect = trackRef.value.getBoundingClientRect()
  const offset = e.clientX - trackRect.left
  const percent = offset / trackRect.width * 100
  const value = getValue(percent)
  if (model.value.some(item => item.value === value))
    return
  emits('addThumb', value)
}

provide(RangeTrackRefKey, trackRef)
provide(RangeContainerRefKey, containerRef)
</script>

<template>
  <div ref="containerRef" class="the-range-container min-h-1 h8 box-content">
    <div
      ref="trackRef"
      class="the-range-track relative h-full bg-slate-3 select-none cursor-copy rd-4"
      :class="{ '!cursor-initial': model.length >= maxThumb }"
      @pointerdown="allowAdd = true"
      @pointerleave="allowAdd = false"
      @pointerup.prevent="addThumb"
    >
      <div class="h-full w-full rd-4 overflow-hidden">
        <div class="h-full bg-slate-4 rd-4" :style="{ width: `${progress || 0}%` }" />
      </div>
      <RangeThumb
        v-for="thumb in modelMap.values()"
        :key="thumb.key"
        :position="position.get(thumb.key) || 0"
        :active="current === thumb.key"
        :disabled="thumb.disabled"
        :data="thumb"
        :render-top="thumb.renderTop || renderTop"
        :render-bottom="thumb.renderBottom || renderBottom"
        @move-done="current = undefined"
        @update="onUpdate"
        @delete="onDelete"
        @pointerdown="!thumb.disabled && (current = thumb.key)"
      />
    </div>
  </div>
</template>

<style scoped>
.the-range-container {
  --c-primary: #007aff;
}
</style>
