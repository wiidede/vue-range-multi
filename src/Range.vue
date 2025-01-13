<script lang="ts" setup generic="T = any, U = RangeValueType<T>">
import type { RangeData, RangeMarks, RangeProgress, RangeRenderFn, RangeValue, RangeValueType } from './type'
import { computed, nextTick, provide, ref, watch } from 'vue'
import { RangeTrackRefKey } from './Range'
import RangeThumb from './RangeThumb.vue'
import { percentage2value, swap, value2percentage } from './utils'

const props = withDefaults(defineProps<{
  modelValue: RangeValue<T, U>
  min?: number
  max?: number
  step?: number
  vertical?: boolean
  addable?: boolean
  addData?: (value: number) => RangeData<T, U>
  limit?: number
  smooth?: boolean
  deduplicate?: boolean
  rangeHighlight?: boolean
  progress?: RangeProgress
  showStops?: boolean | number
  size?: 'small' | 'medium' | 'large'
  thumbType?: 'circle' | 'square' | 'rect'
  thumbSize?: 'small' | 'medium' | 'large'
  renderTop?: RangeRenderFn<T, U>
  renderTopOnActive?: boolean
  renderBottom?: RangeRenderFn<T, U>
  renderBottomOnActive?: boolean
  marks?: RangeMarks
}>(), {
  modelValue: () => [],
  min: 0,
  max: 100,
  step: 1,
  deduplicate: true,
  showStops: 12,
  size: 'small',
  thumbSize: 'medium',
})

const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: typeof props.modelValue): void
  (e: 'change', value: RangeValue<T, U>, thumbValue: U, thumbIndex: number): void
}>()

defineSlots<{
  top?: (props: { data: U }) => any
  bottom?: (props: { data: U }) => any
}>()

const modelType = computed<'number' | 'data' | 'numberList' | 'dataList'>(() => {
  const value = props.modelValue
  if (Array.isArray(value) && typeof value[0] === 'number')
    return 'numberList'
  else if (Array.isArray(value))
    return 'dataList'
  else if (typeof value === 'number')
    return 'number'
  else if (typeof value === 'object')
    return 'data'
  else
    console.warn('[vue-range-multi]: modelValue type not support', value)
  return 'number'
})
const model = computed<RangeData<T, U>[]>({
  get: () => {
    const value = props.modelValue
    if (Array.isArray(value))
      return value.map(item => typeof item === 'number' ? { value: (item as number) } : (item as RangeData<T, U>))
    else
      return [typeof value === 'number' ? { value: (value as number) } : (value as RangeData<T, U>)]
  },
  set: (value) => {
    let res: any
    if (modelType.value === 'number')
      res = value[0].value
    else if (modelType.value === 'data')
      res = value[0]
    else if (modelType.value === 'numberList')
      res = value.map(item => (item.value))
    else
      res = value
    emits('update:modelValue', res)
  },
})

const allowAdd = computed(() =>
  props.addable
  && (!props.limit || model.value.length < props.limit)
  && !['data', 'number'].includes(modelType.value),
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

// {idx: index} - idx is the real dom of thumb's index, index is the index in model
const indexMap = ref<Record<number, number>>({})
const indexMapReversed = computed(() => Object.fromEntries(Object.entries(indexMap.value).map(([k, v]) => [v, Number.parseInt(k)])))

function sort(val: RangeData<T, U>[]) {
  const valMap = val.map((v, i) => ({ v: v.value, i, raw: v }))
  valMap.sort((a, b) => a.v - b.v)
  const changed = valMap.some((v, i) => v.i !== i)
  if (!changed)
    return
  const sortMap = Object.fromEntries(valMap.map((v, i) => [v.i, i]))
  indexMap.value = Object.fromEntries(Object.entries(indexMap.value).map(([k, v]) => [k, sortMap[v]]))
  nextTick(() => model.value = valMap.map(v => v.raw))
}
function getAddableIndex(arr: number[]) {
  [...arr].sort()
  let i = 0
  for (; i < arr.length; i++) {
    if (i !== arr[i])
      return i
  }
  return i
}
watch(model, (val) => {
  const length = Object.keys(indexMap.value).length
  if (val.length > length) {
    for (let i = length; i < val.length; i++)
      indexMap.value[getAddableIndex(Object.keys(indexMap.value).map(key => Number.parseInt(key)))] = i
    sort(val)
  }
  else if (val.length < length) {
    for (let i = length - 1; i >= val.length; i -= 1) {
      const index = indexMapReversed.value[i]
      delete indexMap.value[index]
    }
    sort(val)
  }
}, {
  immediate: true,
})

const trackRef = ref<HTMLElement>()

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
const position = computed(() => Object.fromEntries(Object.entries(indexMap.value).map(
  ([idx, index]) => (props.smooth && current.value === Number.parseInt(idx) && currentPercentage.value > -1)
    ? [idx, currentPercentage.value]
    : [idx, getPercentage(model.value[index].value)],
)))

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
    for (let i = index; i > 0; i -= 1) {
      const prev = values[i - 1]
      if (value < prev) {
        swap(modelValue, i, i - 1)
        swap(indexMap.value, indexMapReversed.value[i], indexMapReversed.value[i - 1])
        index -= 1
      }
    }
  }
  if (oldValue - value < 0 && index < modelValue.length - 1) {
    for (let i = index; i < modelValue.length - 1; i++) {
      const next = values[i + 1]
      if (value > next) {
        swap(modelValue, i, i + 1)
        swap(indexMap.value, indexMapReversed.value[i], indexMapReversed.value[i + 1])
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
  delete indexMap.value[current.value]
  indexMap.value = Object.fromEntries(Object.entries(indexMap.value).map(([idx, index]) => index >= valueIndex ? [idx, index - 1] : [idx, index]))
}

let addTiming = false
function addThumb(e: MouseEvent) {
  if (!addTiming)
    return
  addTiming = false
  if (!trackRef?.value || !allowAdd.value)
    return
  const trackRect = trackRef.value.getBoundingClientRect()
  const offset = props.vertical ? e.clientY - trackRect.top : e.clientX - trackRect.left
  const percent = offset / (props.vertical ? trackRect.height : trackRect.width) * 100
  const value = getValue(percent)
  if (model.value.some(item => item.value === value))
    return
  const modelValue = model.value
  if (modelType.value === 'numberList') {
    modelValue.push({ value })
    model.value = modelValue
  }
  else if (modelType.value === 'dataList') {
    modelValue.push(props.addData ? props.addData(value) : { value })
    model.value = modelValue
  }
}

provide(RangeTrackRefKey, trackRef)
</script>

<template>
  <div
    class="dark:m-range-theme-dark m-range-theme m-range"
    :class="[`m-range-${vertical ? 'v-' : ''}${size}`, `m-range-${vertical ? 'v-' : ''}thumb-${thumbSize}`]"
  >
    <div
      ref="trackRef"
      :class="[vertical ? 'm-range-v-track' : 'm-range-track', { 'cursor-copy': allowAdd }]"
      @pointerdown="addTiming = true"
      @pointerleave="addTiming = false"
      @pointerup.prevent="addThumb"
    >
      <div v-show="rangeHighlight && model.length >= 2" class="m-range-highlight-container">
        <div
          :class="vertical ? 'm-range-v-highlight' : 'm-range-highlight'"
          :style="vertical
            ? { top: `${Math.min(...Object.values(position))}%`, bottom: `${100 - Math.max(...Object.values(position))}%` }
            : { left: `${Math.min(...Object.values(position))}%`, right: `${100 - Math.max(...Object.values(position))}%` }"
        />
      </div>
      <div v-if="progress?.length" class="m-range-progress-container">
        <template v-for="bar, idx in progress" :key="idx">
          <div
            v-if="(Array.isArray(bar))"
            :class="vertical ? 'm-range-v-progress' : 'm-range-progress'"
            :style="vertical
              ? { top: `${getPercentage(bar[0])}%`, bottom: `${100 - getPercentage(bar[1])}%` }
              : { left: `${getPercentage(bar[0])}%`, right: `${100 - getPercentage(bar[1])}%` }"
          />
          <div
            v-else
            :class="[vertical ? 'm-range-v-progress' : 'm-range-progress', bar.class]"
            :style="vertical
              ? { top: `${getPercentage(bar.range[0])}%`, bottom: `${100 - getPercentage(bar.range[1])}%`, ...bar.style }
              : { left: `${getPercentage(bar.range[0])}%`, right: `${100 - getPercentage(bar.range[1])}%`, ...bar.style }"
          />
        </template>
      </div>
      <div v-if="stops > 0" class="m-range-points-area">
        <div :class="vertical ? 'm-range-v-points-container' : 'm-range-points-container'">
          <div v-for="index in stops" :key="index" class="m-range-points" />
        </div>
      </div>
      <div v-if="marks" :class="vertical ? 'm-range-v-marks' : 'm-range-marks'">
        <template v-for="mark, key in marks" :key="key">
          <div
            v-if="(typeof mark === 'string')"
            :class="vertical ? 'm-range-v-mark-item' : 'm-range-mark-item'"
            :style="vertical ? { top: `${getPercentage(key)}%` } : { left: `${getPercentage(key)}%` }"
          >
            {{ mark }}
          </div>
          <div
            v-else
            :class="[vertical ? 'm-range-v-mark-item' : 'm-range-mark-item', mark.class]"
            :style="vertical ? { top: `${getPercentage(key)}%` } : { left: `${getPercentage(key)}%`, ...mark.style }"
          >
            {{ mark.label }}
          </div>
        </template>
      </div>
      <RangeThumb
        v-for="index, idx in indexMap"
        :key="idx"
        :position="position[idx] || 0"
        :active="current === Number(idx)"
        :disabled="model[index].disabled"
        :unremovable="model[index].unremovable"
        :data="model[index]"
        :model-type="modelType"
        :render-top="model[index].renderTop || renderTop"
        :render-top-on-active="renderTopOnActive"
        :render-bottom="model[index].renderBottom || renderBottom"
        :render-bottom-on-active="renderBottomOnActive"
        :vertical="vertical"
        :addable="addable"
        :thumb-type="thumbType || (size === 'large' ? 'rect' : 'circle')"
        :thumb-size="thumbSize"
        @move-done="current = -1"
        @update="onUpdate"
        @delete="onDelete"
        @pointerdown="current = Number(idx)"
        @change="emits('change', props.modelValue, Array.isArray(props.modelValue) ? props.modelValue[index] : props.modelValue, index)"
      >
        <template #top="{ data }">
          <slot name="top" :data="data" />
        </template>
        <template #bottom="{ data }">
          <slot name="bottom" :data="data" />
        </template>
      </RangeThumb>
    </div>
  </div>
</template>

<style scoped>
</style>
