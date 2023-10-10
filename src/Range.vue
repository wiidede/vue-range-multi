<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue'
import { RangeContainerRefKey, RangeTrackRefKey } from './Range'
import RangeThumb from './RangeThumb.vue'
import type { RangeData, RangeRenderFn, RangeValue } from './type'
import { percentage2value, swap, value2percentage } from './utils'

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
    if (Array.isArray(value))
      return value.map(item => typeof item === 'number' ? { value: item } : item)
    else
      return [{ key: 0, value }]
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

const indexMap = ref<number[]>([])
watch(model, (val) => {
  if (val.length > indexMap.value.length) {
    for (let i = indexMap.value.length; i < val.length; i++)
      indexMap.value.push(i)
  }
  else if (val.length < indexMap.value.length) {
    for (let i = indexMap.value.length - 1; i >= val.length; i--) {
      const index = indexMap.value.indexOf(i)
      index > -1 && indexMap.value.splice(index, 1)
    }
  }
}, {
  immediate: true,
})

const trackRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()

function getValue(percentage: number) {
  return percentage2value(percentage, props.min, props.max, props.step)
}
function getPercentage(value: number) {
  return value2percentage(value, props.min, props.max, props.step)
}

const position = computed(() => indexMap.value.map(idx => getPercentage(model.value[idx].value)))

const current = ref<number>(-1)
function onUpdate(percentage: number) {
  const value = getValue(percentage)
  const modelValue = model.value
  let index = indexMap.value.indexOf(current.value)
  if (index === -1)
    return
  if (index > 0) {
    const prev = modelValue[index - 1].value
    if (value === prev)
      return
    if (value < prev) {
      swap(modelValue, index, index - 1)
      swap(indexMap.value, index, index - 1)
      index -= 1
    }
  }
  if (index < modelValue.length - 1) {
    const next = modelValue[index + 1].value
    if (value === next)
      return
    if (value > next) {
      swap(modelValue, index, index + 1)
      swap(indexMap.value, index, index + 1)
      index += 1
    }
  }
  modelValue[index].value = value
  model.value = modelValue
}

function onDelete() {
  indexMap.value.splice(current.value, 1)
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
        v-for="index, idx in indexMap"
        :key="idx"
        :position="position[idx] || 0"
        :active="current === idx"
        :disabled="model[index].disabled"
        :data="model[index]"
        :render-top="model[index].renderTop || renderTop"
        :render-bottom="model[index].renderBottom || renderBottom"
        @move-done="current = -1"
        @update="onUpdate"
        @delete="onDelete"
        @pointerdown="!model[index].disabled && (current = idx)"
      />
    </div>
  </div>
</template>

<style scoped>
.the-range-container {
  --c-primary: #007aff;
}
</style>
