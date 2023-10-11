<script setup lang="ts">
import { h, ref } from 'vue'
import { Range } from '../../src'
import type { RangeData } from '../../src'

const modelSingle = ref<number>(3)

const modelNumbers = ref<number[]>([10, 20])

const modelNumbersAdd = ref<number[]>([10, 20, 30, 40, 50, 60, 70, 80, 90])
function handleAddNumbers(value: number) {
  modelNumbersAdd.value.push(value)
}

const modelData = ref<RangeData<string>[]>([
  { data: '00:00', value: 10 },
  { data: '59:59', value: 90 },
])
function handleAddData(value: number) {
  const date = new Date()
  modelData.value.push({
    data: `${date.getMinutes()}:${date.getSeconds()}`,
    value,
  })
}
</script>

<template>
  <h1>demo</h1>
  <h2>number</h2>
  {{ modelSingle }}
  <Range
    v-model="modelSingle"
    class="w-full pt16 pb8"
    :min="0"
    :max="10"
  />
  <h2>number[]</h2>
  range-highlight
  <br>
  {{ modelNumbers }}
  <Range
    v-model="modelNumbers"
    class="w-full pt16 pb8"
    range-highlight
  />
  <h2>number[]</h2>
  addable smooth show-stops
  <br>
  {{ modelNumbersAdd }}
  <Range
    v-model="modelNumbersAdd"
    class="w-full pt16 pb8"
    addable
    smooth
    show-stops
    :render-top="(data) => h('div', data.value)"
    @add="handleAddNumbers"
  />
  <h2>RangeData[]</h2>
  addable limit
  <br>
  {{ modelData }}
  <Range
    v-model="modelData"
    class="w-full pt16 pb8"
    addable
    :limit="5"
    :render-top="(data) => h('div', data.data)"
    :render-bottom="(data) => h('div', data.value)"
    @add="handleAddData"
  />
</template>

<style scoped>

</style>
