<script setup lang="ts">
import { ref } from 'vue'
import { Range } from '../../src'
import type { TheRangeData } from '../../src'

const model = ref<TheRangeData[]>([])

function handleAddThumb(value: number) {
  model.value.push({
    key: Date.now(),
    value,
  })
}
</script>

<template>
  <Range
    v-model="model"
    class="w-full pt16 pb8"
    :max-thumb="6"
    @add-thumb="handleAddThumb"
  />
</template>

<style scoped>

</style>
