<script lang="ts" setup generic="T = any, U = RangeValueType<T>">
import type { RangeData, RangeRenderFn, RangeValueType } from './type'
import { computed, inject, nextTick, ref } from 'vue'
import { RangeTrackRefKey } from './Range'
import Render from './Render.vue'

const props = defineProps<{
  position: number
  data: RangeData<T, U>
  modelType: 'number' | 'data' | 'numberList' | 'dataList'
  active?: boolean
  disabled?: boolean
  unremovable?: boolean
  vertical?: boolean
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
  (e: 'change'): void
}>()

defineSlots<{
  top: (props: { data: U }) => any
  bottom: (props: { data: U }) => any
}>()

const thumbRef = ref<HTMLElement>()
const trackRef = inject(RangeTrackRefKey)

const removable = computed(() => props.addable && !props.unremovable)
const cursor = computed(() => props.disabled ? 'cursor-not-allowed' : removable.value ? 'cursor-move' : props.vertical ? 'cursor-ns-resize' : 'cursor-ew-resize')

const deleting = ref(false)

let moved = false

function setTrackCursor(cursor: string | undefined) {
  if (!trackRef?.value)
    return
  if (cursor)
    trackRef.value.style.cursor = cursor.slice('cursor-'.length)
  else
    trackRef.value.style.removeProperty('cursor')
}

function shouldDelete(offset: number) {
  if (!trackRef?.value)
    return false
  const trackRect = trackRef.value.getBoundingClientRect()
  if (props.vertical) {
    const left = trackRect.left - 32
    const right = trackRect.right + 32
    return offset < left || offset > right
  }
  else {
    const top = trackRect.top - 32
    const bottom = trackRect.bottom + 32
    return offset < top || offset > bottom
  }
}

function onPointerMove(e: PointerEvent) {
  if (!thumbRef.value || !trackRef?.value || props.disabled)
    return
  moved = true
  const trackRect = trackRef.value.getBoundingClientRect()
  const offset = props.vertical ? e.clientY - trackRect.top : e.clientX - trackRect.left
  const percent = offset / (props.vertical ? trackRect.height : trackRect.width) * 100
  if (percent < 0)
    emits('update', 0)
  else if (percent > 100)
    emits('update', 100)
  else if (!Number.isNaN(percent))
    emits('update', percent)
  if (removable.value)
    deleting.value = shouldDelete(props.vertical ? e.clientX : e.clientY)
}

function onPointerUp(e: PointerEvent) {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  if (moved) {
    emits('change')
    moved = false
  }
  if (e.type === 'pointercancel' || props.disabled) {
    setTrackCursor(undefined)
    emits('moveDone')
    return
  }
  if (removable.value) {
    if (shouldDelete(props.vertical ? e.clientX : e.clientY)) {
      deleting.value = false
      emits('delete')
    }
  }
  setTrackCursor(undefined)
  emits('moveDone')
}

async function onPointerDown(e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (e.target !== thumbRef.value) {
    await nextTick()
    emits('moveDone')
    return
  }
  setTrackCursor(cursor.value)
  moved = false
  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}
</script>

<template>
  <div
    ref="thumbRef"
    :class="[
      vertical ? 'm-range-v-thumb' : 'm-range-thumb',
      {
        'm-range-thumb-active': active,
        'op-20': removable && deleting && active,
      },
      cursor,
      `m-range-${vertical ? 'v-' : ''}thumb-${thumbType}`,
      `m-range-${vertical ? 'v-' : ''}thumb-${thumbSize}`,
    ]"
    :style="vertical ? { top: `${position}%` } : { left: `${position}%` }"
    @pointerdown="onPointerDown"
  >
    <Transition name="fade">
      <div v-if="!renderTopOnActive || active" class="cursor-default" :class="vertical ? 'm-range-v-transition-container' : 'm-range-transition-container'">
        <div :class="vertical ? 'm-range-v-thumb-top-container' : 'm-range-thumb-top-container'">
          <Render v-if="renderTop" :render="() => renderTop?.((['data', 'dataList'].includes(modelType) ? data : data.value) as U)" />
          <slot v-else name="top" :data="(['data', 'dataList'].includes(modelType) ? data : data.value) as U" />
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="!renderBottomOnActive || active" class="cursor-default" :class="vertical ? 'm-range-v-transition-container' : 'm-range-transition-container'">
        <div :class="vertical ? 'm-range-v-thumb-bottom-container' : 'm-range-thumb-bottom-container'">
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
