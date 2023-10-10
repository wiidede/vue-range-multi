<script setup lang="ts">
import { ref } from 'vue'
import { Range } from '../../src'
import type { RangeData } from '../../src'

const modelSingle = ref<number>(0)

const modelNumbers = ref<number[]>([])
function handleAddThumbNumbers(value: number) {
  modelNumbers.value.push(value)
}

const modelData = ref<RangeData[]>([])
function handleAddThumbData(value: number) {
  modelData.value.push({
    key: Date.now(),
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
  />
  <h2>number[]</h2>
  {{ modelNumbers }}
  <Range
    v-model="modelNumbers"
    class="w-full pt16 pb8"
    :max-thumb="6"
    @add-thumb="handleAddThumbNumbers"
  />
  <h2>RangeData[]</h2>
  {{ modelData }}
  <Range
    v-model="modelData"
    class="w-full pt16 pb8"
    :max-thumb="6"
    @add-thumb="handleAddThumbData"
  />
</template>

<style scoped>

</style>
