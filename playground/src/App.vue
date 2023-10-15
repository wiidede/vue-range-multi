<script setup lang="ts">
import { h, ref } from 'vue'
import { Range } from 'vue-range-multi'
import type { RangeData } from 'vue-range-multi'
import 'vue-range-multi/style.css'
import { useDark, useToggle } from '@vueuse/core'

const modelSingle = ref<number>(3)

const modelNumbers = ref<number[]>([10, 20])

const modelNumbersAdd = ref<number[]>([10, 20, 30, 40, 50, 60, 70, 80, 90])
function handleAddNumbers(value: number) {
  modelNumbersAdd.value.push(value)
}

const modelData = ref<RangeData<string>[]>([
  { data: '00:00', value: 10, disabled: true },
  { data: '59:59', value: 90 },
])
function handleAddData(value: number) {
  const date = new Date()
  modelData.value.push({
    data: `${date.getMinutes()}:${date.getSeconds()}`,
    value,
  })
}

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <main class="m-auto prose">
    <h1 class="text-4xl font-serif dark:text-zinc-50">
      Vue Range Multi Demo
    </h1>
    <div class="flex flex-col gap-12">
      <div>
        <h2 class="type-title m0">
          number
        </h2>
        <br>
        <div class="flex items-baseline">
          <span class="label">modelValue</span>
          <pre class="value">{{ modelSingle }}</pre>
        </div>
        <Range
          v-model="modelSingle"
          class="w-full py1"
          :min="0"
          :max="10"
        />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap2">
          <h2 class="type-title m0">
            number[]
          </h2>
          <span class="tag">range-highlight</span>
        </div>
        <div class="flex items-baseline">
          <span class="label">modelValue</span>
          <pre class="value">{{ JSON.stringify(modelNumbers) }}</pre>
        </div>
        <Range
          v-model="modelNumbers"
          class="w-full py1"
          range-highlight
          size="medium"
          thumb-size="small"
        />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap2">
          <h2 class="type-title m0">
            number[]
          </h2>
          <span class="tag">addable</span>
          <span class="tag">smooth</span>
          <span class="tag">show-stops</span>
          <span class="tag">thumb-type:square</span>
        </div>
        <div class="flex items-baseline">
          <span class="label">modelValue</span>
          <pre class="value">{{ JSON.stringify(modelNumbersAdd) }}</pre>
        </div>
        <Range
          v-model="modelNumbersAdd"
          class="add-range w-full pb1 pt8"
          :step="5"
          addable
          smooth
          show-stops
          size="medium"
          thumb-type="square"
          thumb-size="large"
          @add="handleAddNumbers"
        >
          <template #top="{ data }">
            <div class="c-primary">
              {{ data.value }}
            </div>
          </template>
        </Range>
      </div>
      <div>
        <div class="flex flex-wrap items-center gap2">
          <h2 class="type-title m0">
            RangeData[]
          </h2>
          <span class="tag">addable</span>
          <span class="tag">limit:5</span>
          <span class="tag">thumb-type:rect</span>
          <span class="tag">render-bottom-on-active</span>
        </div>
        <div class="flex items-baseline">
          <span class="label">modelValue</span>
          <pre class="value">{{ JSON.stringify(modelData) }}</pre>
        </div>
        <Range
          v-model="modelData"
          class="data-range w-full py8"
          addable
          size="large"
          thumb-type="rect"
          render-bottom-on-active
          :limit="5"
          :render-top="(data) => h('div', data.data)"
          :render-bottom="(data) => h('div', data.value)"
          @add="handleAddData"
        />
      </div>
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
.add-range {
  --c-fill-stop: #F7FEE7;
  --c-fill-thumb: #F7FEE7;
  --c-fill: #DFF8A7;
  --c-primary: #B1E457;
}

.dark .add-range {
  --c-fill-stop: #73A132;
  --c-fill-thumb: #73A132;
  --c-fill: #B1E457;
  --c-primary: #94CA42;
}

.data-range :deep(.m-range-track) {
  border-radius: 6px;
}

a {
  --at-apply: underline decoration-zinc-400/50 after:content-['↗'] after:text-0.8em after:op67;
}
</style>
