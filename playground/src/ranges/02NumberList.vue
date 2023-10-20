<script setup lang="ts">
import { ref } from 'vue'

const modelNumberList = ref<number[]>([10, 20])
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap2">
      <h2 class="type-title m0">
        number[]
      </h2>
      <span class="tag">range-highlight</span>
    </div>
    <div class="flex items-baseline">
      <span class="label">modelValue</span>
      <pre class="value">{{ JSON.stringify(modelNumberList) }}</pre>
    </div>
    <Range
      v-model="modelNumberList"
      class="w-full py1"
      range-highlight
      size="medium"
      thumb-size="small"
    />
  </div>
</template>

<style scoped>

</style>
