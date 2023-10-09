<script setup lang="ts">
import { Range } from 'vue-range-multi'
import { ref } from 'vue'

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
