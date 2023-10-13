<script lang="ts" setup generic="T">
import { inject, nextTick, ref } from 'vue'
import { RangeContainerRefKey, RangeTrackRefKey } from './Range'
import Render from './Render.vue'
import type { RangeData, RangeRenderFn } from './type'

const props = defineProps<{
  position: number
  data: RangeData<T>
  active?: boolean
  disabled?: boolean
  addable?: boolean
  thumbType?: 'circle' | 'square' | 'rect'
  thumbSize?: 'small' | 'medium' | 'large'
  renderTop?: RangeRenderFn<T>
  renderTopOnActive?: boolean
  renderBottom?: RangeRenderFn<T>
  renderBottomOnActive?: boolean
}>()

const emits = defineEmits<{
  (e: 'update', percent: number): void
  (e: 'delete'): void
  (e: 'deleting'): void
  (e: 'cancelDelete'): void
  (e: 'moveDone'): void
}>()

const thumbRef = ref<HTMLElement>()
const trackRef = inject(RangeTrackRefKey)
const containerRef = inject(RangeContainerRefKey)

const deleting = ref(false)

function onPointerMove(e: PointerEvent) {
  if (!thumbRef.value || !trackRef?.value || !containerRef?.value)
    return
  const trackRect = trackRef.value.getBoundingClientRect()
  const offset = e.clientX - trackRect.left
  const percent = offset / trackRect.width * 100
  if (percent < 0)
    emits('update', 0)
  else if (percent > 100)
    emits('update', 100)
  else if (!Number.isNaN(percent))
    emits('update', percent)
  if (props.addable) {
    const containerRect = containerRef.value.getBoundingClientRect()
    if (e.clientY - containerRect.top < 0 || e.clientY - containerRect.bottom > 0)
      deleting.value = true
    else
      deleting.value = false
  }
}

async function onPointerUp(e: PointerEvent) {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  if (!containerRef?.value)
    return
  const containerRect = containerRef.value.getBoundingClientRect()
  if (props.addable) {
    if (e.clientY - containerRect.top < 0 || e.clientY - containerRect.bottom > 0) {
      deleting.value = false
      emits('delete')
    }
    await nextTick()
  }
  emits('moveDone')
}

function onPointerDown(e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (props.disabled)
    return
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}
</script>

<template>
  <div
    ref="thumbRef"
    class="m-range-thumb"
    :class="[{
      'm-range-thumb-active': active,
      'op-20': addable && deleting && active,
      'cursor-not-allowed': disabled,
    }, `m-range-thumb-${thumbType}`, `m-range-thumb-${thumbSize}`]"
    :style="{ left: `${position}%` }"
    @pointerdown="onPointerDown"
    @mousedown.prevent="() => {}"
    @touchstart.prevent.passive="() => {}"
  >
    <div v-if="!renderTopOnActive || active" class="m-range-thumb-top-container">
      <Render :render="() => renderTop?.(data)" />
    </div>
    <div v-if="!renderBottomOnActive || active" class="m-range-thumb-bottom-container">
      <Render :render="() => renderBottom?.(data)" />
    </div>
  </div>
</template>

<style scoped>
</style>
