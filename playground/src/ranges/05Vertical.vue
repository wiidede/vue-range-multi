<script setup lang="ts">
import type { RangeData } from 'vue-range-multi'
import { h, ref } from 'vue'

const model = ref<RangeData<string>[]>([
  { data: 'disabled', value: 2, disabled: true },
  { data: 'random1', value: 4 },
  { data: 'unremovable', value: 8, unremovable: true },
])
function handleAddData(value: number) {
  return {
    data: `random${Math.floor(Math.random() * 10)}`,
    value,
  }
}
</script>

<template>
  <div class="flex justify-between">
    <div class="flex flex-col gap1">
      <h2 class="type-title m0">
        Vertical
      </h2>
      <span class="tag">vertical</span>
      <span class="tag">slot</span>
    </div>
    <Range
      v-model="model"
      class="h-60 pl-20 pr8"
      :max="10"
      addable
      vertical
      thumb-size="large"
      :render-bottom="(data) => h('div', data.value)"
      :add-data="handleAddData"
    >
      <template #top="{ data }">
        <div class="value px-2">
          {{ JSON.stringify(data) }}
        </div>
      </template>
    </Range>
  </div>
</template>

<style scoped>
.m-range {
  --c-drop: #80808080;
}
</style>
