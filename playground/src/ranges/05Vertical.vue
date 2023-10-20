<script setup lang="ts">
import { h, ref } from 'vue'
import type { RangeData } from 'vue-range-multi'

const modelDataList = ref<RangeData<string>[]>([
  { data: 'disabled', value: 1, disabled: true },
  { data: 'random1', value: 3 },
  { data: 'unremovable', value: 6, unremovable: true },
])
function handleAddData(value: number) {
  modelDataList.value.push({
    data: `random${Math.floor(Math.random() * 10)}`,
    value,
  })
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
      v-model="modelDataList"
      class="h-60 pl-80 pr8"
      :max="10"

      addable vertical
      thumb-size="large"
      :render-bottom="(data) => h('div', data.value)"
      @add="handleAddData"
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
</style>
