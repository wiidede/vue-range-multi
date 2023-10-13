<script lang="ts" setup generic="T">
import { computed, nextTick, provide, ref, watch } from 'vue'
import { RangeContainerRefKey, RangeTrackRefKey } from './Range'
import RangeThumb from './RangeThumb.vue'
import type { RangeData, RangeRenderFn, RangeValue } from './type'
import { percentage2value, swap, value2percentage } from './utils'

const props = withDefaults(defineProps<{
  modelValue: RangeValue<T>
  min?: number
  max?: number
  step?: number
  addable?: boolean
  limit?: number
  smooth?: boolean
  deduplicate?: boolean
  rangeHighlight?: boolean
  showStops?: boolean | number
  size?: 'small' | 'medium' | 'large'
  thumbType?: 'circle' | 'square' | 'rect'
  thumbSize?: 'small' | 'medium' | 'large'
  renderTop?: RangeRenderFn<T>
  renderBottom?: RangeRenderFn<T>
}>(), {
  modelValue: () => [],
  min: 0,
  max: 100,
  step: 1,
  deduplicate: true,
  showStops: 12,
  size: 'small',
  thumbType: 'circle',
  thumbSize: 'medium',
})

const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: typeof props.modelValue): void
  (e: 'add', value: number): void
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
const model = computed<RangeData<T>[]>({
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

const allowAdd = computed(() =>
  props.addable
  && (!props.limit || model.value.length < props.limit)
  && modelType.value !== 'single',
)
const stops = computed(() => {
  const stops = Math.floor((props.max - props.min) / props.step) + 1
  if (props.showStops === true)
    return stops
  else if (typeof props.showStops === 'number')
    return stops > props.showStops ? -1 : stops
  else
    return -1
})

const indexMap = ref<number[]>([])
function sort(val: RangeData<T>[]) {
  let changed = false
  for (let i = val.length; i > 0; i--) {
    for (let j = 0; j < i - 1; j++) {
      if (val[j].value > val[j + 1].value) {
        swap(val, j, j + 1)
        swap(indexMap.value, j, j + 1)
        changed = true
      }
    }
  }
  changed && nextTick(() => model.value = val)
}
watch(model, (val) => {
  if (val.length > indexMap.value.length) {
    for (let i = indexMap.value.length; i < val.length; i++)
      indexMap.value.push(i)
    sort(val)
  }
  else if (val.length < indexMap.value.length) {
    for (let i = indexMap.value.length - 1; i >= val.length; i--) {
      const index = indexMap.value.indexOf(i)
      index > -1 && indexMap.value.splice(index, 1)
    }
    sort(val)
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

const current = ref<number>(-1)
const currentPercentage = ref<number>(-1)
let currentPercentageTimer: number
function setCurrentPercentage(val: number) {
  currentPercentage.value = val
  clearTimeout(currentPercentageTimer)
  currentPercentageTimer = window.setTimeout(() => {
    currentPercentage.value = -1
  }, 300)
}
const position = computed(() => indexMap.value.map(
  (index, idx) => (props.smooth && current.value === idx && currentPercentage.value > -1)
    ? currentPercentage.value
    : getPercentage(model.value[index].value),
))

function onUpdate(percentage: number) {
  setCurrentPercentage(percentage)
  const value = getValue(percentage)
  const modelValue = model.value
  const values = modelValue.map(i => i.value)
  if (props.deduplicate && values.includes(value))
    return
  let index = indexMap.value[current.value]
  const oldValue = values[index]
  if (oldValue - value > 0 && index > 0) {
    for (let i = index; i > 0; i--) {
      const prev = values[i - 1]
      if (value < prev) {
        swap(modelValue, i, i - 1)
        swap(indexMap.value, indexMap.value.indexOf(i), indexMap.value.indexOf(i - 1))
        index -= 1
      }
    }
  }
  if (oldValue - value < 0 && index < modelValue.length - 1) {
    for (let i = index; i < modelValue.length - 1; i++) {
      const next = values[i + 1]
      if (value > next) {
        swap(modelValue, i, i + 1)
        swap(indexMap.value, indexMap.value.indexOf(i), indexMap.value.indexOf(i + 1))
        index += 1
      }
    }
  }
  modelValue[index].value = value
  model.value = modelValue
}

function onDelete() {
  const valueIndex = indexMap.value[current.value]
  const modelValue = model.value
  modelValue.splice(valueIndex, 1)
  model.value = modelValue
  indexMap.value.splice(current.value, 1)
  indexMap.value = indexMap.value.map(idx => idx >= valueIndex ? idx - 1 : idx)
}

let addTiming = false
function addThumb(e: MouseEvent) {
  if (!addTiming)
    return
  addTiming = false
  if (!trackRef?.value || !allowAdd.value)
    return
  const trackRect = trackRef.value.getBoundingClientRect()
  const offset = e.clientX - trackRect.left
  const percent = offset / trackRect.width * 100
  const value = getValue(percent)
  if (model.value.some(item => item.value === value))
    return
  emits('add', value)
}

provide(RangeTrackRefKey, trackRef)
provide(RangeContainerRefKey, containerRef)
</script>

<template>
  <div ref="containerRef" class="m-range" :class="`m-range-${size}`">
    <div
      ref="trackRef"
      class="m-range-track"
      :class="{ 'cursor-copy': allowAdd }"
      @pointerdown="addTiming = true"
      @pointerleave="addTiming = false"
      @pointerup.prevent="addThumb"
    >
      <div v-show="rangeHighlight && model.length === 2" class="m-range-highlight-container">
        <div
          class="m-range-highlight"
          :style="{ left: `${Math.min(...position)}%`, right: `${100 - Math.max(...position)}%` }"
        />
      </div>
      <div v-if="stops > 0" class="m-range-points-area">
        <div class="m-range-points-container">
          <div v-for="index in stops" :key="index" class="m-range-points" />
        </div>
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
        :addable="addable"
        :thumb-type="thumbType"
        :thumb-size="thumbSize"
        @move-done="current = -1"
        @update="onUpdate"
        @delete="onDelete"
        @pointerdown="!model[index].disabled && (current = idx)"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
