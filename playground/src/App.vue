<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const ranges = import.meta.glob('./ranges/*.vue', { eager: true, import: 'default' })

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <main class="m-auto prose">
    <h1 class="text-4xl font-serif dark:text-zinc-50">
      Vue Range Multi Demo
    </h1>
    <div class="flex flex-col gap-12">
      <component :is="range" v-for="range in ranges" :key="range" />
    </div>
  </main>
  <footer class="m-auto mt8 prose">
    <button icon-btn title="toggle dark mode" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>
    <div class="flex gap4">
      <a href="https://github.com/wiidede/vue-range-multi" target="_blank">GitHub</a>
      <a href="https://github.com/wiidede/vue-range-multi/blob/main/playground/src/App.vue" target="_blank">Demo Source</a>
    </div>
    <div class="text-sm">
      <a href="https://github.com/wiidede/vue-range-multi/blob/main/LICENSE">MIT</a> License © 2023-PRESENT <a href="https://github.com/wiidede">wiidede</a>
    </div>
  </footer>
</template>

<style scoped>
a {
  --at-apply: underline decoration-zinc-400/50 after: content-[ '↗'] after: text-0.8em
    after: op67;
}
</style>
