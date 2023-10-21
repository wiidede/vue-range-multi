<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const count = ref(0)

let interval: number
onMounted(() => {
  interval = window.setInterval(() => {
    count.value++
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <span>{{ count }}</span>
</template>

<style scoped>

</style>
