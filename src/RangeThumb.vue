<script lang="ts" setup generic="T = any, U = RangeValueType<T>">
import { computed, inject, nextTick, ref } from 'vue'
import { RangeContainerRefKey, RangeTrackRefKey } from './Range'
import Render from './Render.vue'
import type { RangeData, RangeRenderFn, RangeValueType } from './type'

const props = defineProps<{
  position: number
  data: RangeData<T, U>
  modelType: 'number' | 'data' | 'numberList' | 'dataList'
  active?: boolean
  disabled?: boolean
  unremovable?: boolean
  addable?: boolean
  thumbType?: 'circle' | 'square' | 'rect'
  thumbSize?: 'small' | 'medium' | 'large'
  renderTop?: RangeRenderFn<T, U>
  renderTopOnActive?: boolean
  renderBottom?: RangeRenderFn<T, U>
  renderBottomOnActive?: boolean
}>()

const emits = defineEmits<{
  (e: 'update', percent: number): void
  (e: 'delete'): void
  (e: 'deleting'): void
  (e: 'cancelDelete'): void
  (e: 'moveDone'): void
}>()

defineSlots<{
  top(props: { data: U }): any
  bottom(props: { data: U }): any
}>()

const thumbRef = ref<HTMLElement>()
const trackRef = inject(RangeTrackRefKey)
const containerRef = inject(RangeContainerRefKey)

const removable = computed(() => props.addable && !props.unremovable)

const deleting = ref(false)

function shouldDelete(clientY: number) {
  if (!containerRef?.value || !trackRef?.value)
    return false
  const containerRect = containerRef.value.getBoundingClientRect()
  const trackRect = trackRef.value.getBoundingClientRect()
  const top = Math.min(containerRect.top, trackRect.top - 32)
  const bottom = Math.max(containerRect.bottom, trackRect.bottom + 32)
  return clientY < top || clientY > bottom
}

function onPointerMove(e: PointerEvent) {
  if (!thumbRef.value || !trackRef?.value || props.disabled)
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
  if (removable.value)
    deleting.value = shouldDelete(e.clientY)
}

async function onPointerUp(e: PointerEvent) {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  if (e.type === 'pointercancel' || props.disabled) {
    emits('moveDone')
    return
  }
  if (removable.value) {
    if (shouldDelete(e.clientY)) {
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
  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}
</script>

<template>
  <div
    ref="thumbRef"
    class="m-range-thumb"
    :class="[
      {
        'm-range-thumb-active': active,
        'op-20': removable && deleting && active,
      },
      disabled ? 'cursor-not-allowed' : removable ? 'cursor-move' : 'cursor-ew-resize',
      `m-range-thumb-${thumbType}`,
      `m-range-thumb-${thumbSize}`,
    ]"
    :style="{ left: `${position}%` }"
    @pointerdown="onPointerDown"
    @mousedown.prevent="() => {}"
    @touchstart="(e) => { e.cancelable === true && e.preventDefault() }"
  >
    <Transition name="fade">
      <div v-if="!renderTopOnActive || active" class="m-range-transition-container">
        <div class="m-range-thumb-top-container">
          <Render v-if="renderTop" :render="() => renderTop?.((['data', 'dataList'].includes(modelType) ? data : data.value) as U)" />
          <slot v-else name="top" :data="(['data', 'dataList'].includes(modelType) ? data : data.value) as U" />
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="!renderBottomOnActive || active" class="m-range-transition-container">
        <div class="m-range-thumb-bottom-container">
          <Render v-if="renderBottom" :render="() => renderBottom?.((['data', 'dataList'].includes(modelType) ? data : data.value) as U)" />
          <slot v-else name="bottom" :data="(['data', 'dataList'].includes(modelType) ? data : data.value) as U" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active {
  animation: fade 0.3s;
}

.fade-leave-active {
  animation: fade 0.3s reverse;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
