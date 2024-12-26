<script setup lang="ts">
import type { RangeData, RangeProgress } from 'vue-range-multi'
import { computed, h, ref } from 'vue'

const model = ref<RangeData<string>[]>([
  { data: '00:00', value: 10, disabled: true },
  { data: '30:00', value: 40 },
  { data: '50:00', value: 80 },
  { data: '59:59', value: 90, unremovable: true },
])

const backgrounds = ['bg-cyan', 'bg-violet', 'bg-rose', 'bg-lime']
const progress = computed(() => {
  const p: RangeProgress = []
  for (let i = 0; i < model.value.length - 1; i += 2) {
    p.push({
      range: [model.value[i].value, model.value[i + 1]?.value ?? 100],
      class: backgrounds[(i / 2) % backgrounds.length],
    })
  }
  return p
})
function handleAddData(value: number) {
  const date = new Date()
  return {
    data: `${date.getMinutes()}:${date.getSeconds()}`,
    value,
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap2">
      <h2 class="type-title m0">
        RangeData[]
      </h2>
      <span class="tag">addable</span>
      <span class="tag">progress</span>
      <span class="tag">thumb-type:rect</span>
      <span class="tag">render-top-on-active</span>
    </div>
    <div class="flex items-baseline">
      <span class="label">modelValue</span>
      <pre class="value">{{ JSON.stringify(model) }}</pre>
    </div>
    <Range
      v-model="model"
      class="w-full py8"
      addable
      :progress="progress"
      :add-data="handleAddData"
      size="large"
      thumb-type="rect"
      render-top-on-active
      :render-top="(data) => h('div', data.value)"
      :render-bottom="(data) => h('div', data.data)"
    />
  </div>
</template>

<style scoped>
.m-range :deep(.m-range-track) {
  border-radius: 6px;
}
</style>
