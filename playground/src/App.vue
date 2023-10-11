<script setup lang="ts">
import { h, ref } from 'vue'
import { Range } from '../../src'
import type { RangeData } from '../../src'

const modelSingle = ref<number>(0)

const modelNumbers = ref<number[]>([10, 20])

const modelNumbersAdd = ref<number[]>([])
function handleAddThumbNumbers(value: number) {
  modelNumbersAdd.value.push(value)
}

const modelData = ref<RangeData<string>[]>([
  { data: '00:00', value: 10 },
  { data: '59:59', value: 90 },
])
function handleAddThumbData(value: number) {
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
  add smooth show-stops
  <br>
  {{ modelNumbersAdd }}
  <Range
    v-model="modelNumbersAdd"
    class="w-full pt16 pb8"
    add
    smooth
    show-stops
    :render-top="(data) => h('div', data.value)"
    @add-thumb="handleAddThumbNumbers"
  />
  <h2>RangeData[]</h2>
  add limit
  <br>
  {{ modelData }}
  <Range
    v-model="modelData"
    class="w-full pt16 pb8"
    add
    :limit="5"
    :render-top="(data) => h('div', data.data)"
    :render-bottom="(data) => h('div', data.value)"
    @add-thumb="handleAddThumbData"
  />
</template>

<style scoped>

</style>
