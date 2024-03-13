<script setup lang="ts">
import { h, ref } from 'vue'
import type { RangeMarks } from 'vue-range-multi'
import Count from '../Count.vue'

const model = ref<number[]>([10, 30, 50, 70, 90])
const marks: RangeMarks = {
  15: '15%',
  25: { label: '25%', class: 'c-zinc-400' },
  50: { label: 'center', class: 'c-primary text-0.8em' },
}
</script>

<template>
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
      <pre class="value">{{ JSON.stringify(model) }}</pre>
    </div>
    <Range
      v-model="model"
      class="range-lime w-full pb1 pt8"
      :step="5"
      addable
      smooth
      show-stops
      size="medium"
      thumb-type="square"
      thumb-size="large"
      :marks="marks"
      :render-top="() => h(Count, { class: 'c-primary' })"
    />
  </div>
</template>

<style scoped>
.range-lime {
  --c-fill-stop: #f7fee7;
  --c-fill-thumb: #f7fee7;
  --c-fill: #dff8a7;
  --c-primary: #b1e457;
}

.dark .range-lime {
  --c-fill-stop: #73a132;
  --c-fill-thumb: #73a132;
  --c-fill: #b1e457;
  --c-primary: #94ca42;
}
</style>
