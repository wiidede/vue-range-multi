<script setup lang="ts">
import { ref } from 'vue'

const modelNumber = ref<number>(3)
</script>

<template>
  <div>
    <h2 class="type-title m0">
      number
    </h2>
    <br>
    <div class="flex items-baseline">
      <span class="label">modelValue</span>
      <pre class="value">{{ modelNumber }}</pre>
    </div>
    <Range
      v-model="modelNumber"
      class="w-full py1"
      :min="0"
      :max="10"
    />
  </div>
</template>

<style scoped>

</style>
