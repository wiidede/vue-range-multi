<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue'
import { theRangeContainerRefKey, theRangeTrackRefKey } from './TheRange'
import type { TheRangeData, TheRangeRenderFn } from './type'

type TheRangeDataKey = TheRangeData<any>['key']

const props = withDefaults(defineProps<{
  modelValue: TheRangeData<any>[]
  progress?: number
  renderTop?: TheRangeRenderFn<any>
  renderBottom?: TheRangeRenderFn<any>
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

const model = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emits('update:modelValue', value)
  },
})

const modelMap = new Map<TheRangeDataKey, TheRangeData<any>>()
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
  }, new Map<TheRangeDataKey, number>())
})

const current = ref<TheRangeDataKey>()
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
  model.value[index].value = value
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

provide(theRangeTrackRefKey, trackRef)
provide(theRangeContainerRefKey, containerRef)
</script>

<template>
  <div ref="containerRef" class="the-range-container min-h-1 h8 box-content">
    <div
      ref="trackRef"
      class="the-range-track relative h-full bg-uno-3 select-none cursor-copy rd-4"
      :class="{ '!cursor-initial': model.length >= maxThumb }"
      @pointerdown="allowAdd = true"
      @pointerleave="allowAdd = false"
      @pointerup.prevent="addThumb"
    >
      <div class="h-full w-full rd-4 overflow-hidden">
        <div class="h-full bg-uno-4 rd-4" :style="{ width: `${progress || 0}%` }" />
      </div>
      <TheRangeThumb
        v-for="thumb in modelMap.values()"
        :key="thumb.key"
        :position="position.get(thumb.key) || 0"
        :active="current === thumb.key"
        :disabled="thumb.disabled"
        :data="thumb"
        :render-top="thumb.renderTop || renderTop"
        :render-bottom="thumb.renderBottom || renderBottom"
        @move-done="current = undefined"
        @update="onUpdate($event)"
        @delete="onDelete()"
        @pointerdown="!thumb.disabled && (current = thumb.key)"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
