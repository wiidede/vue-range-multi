<script setup lang="ts">
import { h, ref } from 'vue'
import { Range } from '../../src'
import type { RangeData } from '../../src'

const modelSingle = ref<number>(3)

const modelNumbers = ref<number[]>([10, 20])

const modelNumbersAdd = ref<number[]>([10, 20, 30, 40, 50, 60, 70, 80, 90])
function handleAddNumbers(value: number) {
  modelNumbersAdd.value.push(value)
}

const modelData = ref<RangeData<string>[]>([
  { data: '00:00', value: 10 },
  { data: '59:59', value: 90 },
])
function handleAddData(value: number) {
  const date = new Date()
  modelData.value.push({
    data: `${date.getMinutes()}:${date.getSeconds()}`,
    value,
  })
}
</script>

<template>
  <main class="m-auto max-w-65ch">
    <h1 class="text-4xl font-serif text-zinc-900">
      Vue Range Multi Demo
    </h1>
    <div class="flex flex-col gap-12">
      <div>
        <h2 class="type-title m0">
          number
        </h2>
        <br>
        modelValue:
        <pre class="value">{{ modelSingle }}</pre>
        <Range
          v-model="modelSingle"
          class="w-full py1"
          :min="0"
          :max="10"
        />
      </div>
      <div>
        <div class="flex items-center gap2">
          <h2 class="type-title m0">
            number[]
          </h2>
          <span class="tag">range-highlight</span>
        </div>
        modelValue:
        <pre class="value">{{ JSON.stringify(modelNumbers) }}</pre>
        <Range
          v-model="modelNumbers"
          class="w-full py1"
          range-highlight
        />
      </div>
      <div>
        <div class="flex items-center gap2">
          <h2 class="type-title m0">
            number[]
          </h2>
          <span class="tag">addable</span>
          <span class="tag">smooth</span>
          <span class="tag">show-stops</span>
        </div>
        modelValue:
        <pre class="value">{{ JSON.stringify(modelNumbersAdd) }}</pre>
        <Range
          v-model="modelNumbersAdd"
          class="add-range [--c-fill-stop:#DFF8A7] [--c-fill:#EFFBD0] [--c-primary:#B1E457] w-full pb1 pt8"
          :step="5"
          addable
          smooth
          show-stops
          size="large"
          :render-top="(data) => h('div', data.value)"
          @add="handleAddNumbers"
        />
      </div>
      <div>
        <div class="flex items-center gap2">
          <h2 class="type-title m0">
            RangeData[]
          </h2>
          <span class="tag">addable</span>
          <span class="tag">limit</span>
        </div>
        modelValue:
        <pre class="value">{{ JSON.stringify(modelData) }}</pre>
        <Range
          v-model="modelData"
          class="w-full py8"
          addable
          size="large"
          :limit="5"
          :render-top="(data) => h('div', data.data)"
          :render-bottom="(data) => h('div', data.value)"
          @add="handleAddData"
        />
      </div>
    </div>
  </main>
  <footer class="m-auto mt8 max-w-65ch">
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
.add-range :deep(.m-range-track) {
  border-radius: 8px;
}

a {
  --at-apply: underline decoration-zinc-300 after:content-['↗'] after:text-0.8em after:op67;
}
</style>
