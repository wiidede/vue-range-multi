<script setup lang="ts">
import { ref } from 'vue'
import { Range } from '../../src'
import type { RangeData } from '../../src'

const modelSingle = ref<number>(0)

const modelNumbers = ref<number[]>([10, 20])

const modelNumbersAdd = ref<number[]>([])
function handleAddThumbNumbers(value: number) {
  modelNumbersAdd.value.push(value)
}

const modelData = ref<RangeData<string>[]>([])
function handleAddThumbData(value: number) {
  modelData.value.push({
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
  range-highlight
  <br>
  {{ modelNumbers }}
  <Range
    v-model="modelNumbers"
    class="w-full pt16 pb8"
    range-highlight
  />
  <h2>number[]</h2>
  add smooth
  <br>
  {{ modelNumbersAdd }}
  <Range
    v-model="modelNumbersAdd"
    class="w-full pt16 pb8"
    add
    smooth
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
    @add-thumb="handleAddThumbData"
  />
</template>

<style scoped>

</style>
