<script setup lang="ts">
import { ref } from 'vue'
import { Range } from '../../src'

const model = ref<any[]>([])
</script>

<template>
  <Range
    v-model="model"
    class="w-full pt16 pb8"
    :max-thumb="6"
  />
</template>

<style scoped>

</style>
