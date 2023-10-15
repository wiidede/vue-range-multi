# vue-range-multi(WIP)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

A range vue component that support one or more thumb

- ✨ Support for one or more thumbs.
- 🔄 Auto-detect the type of model and display the corresponding thumb(s).
- 🔀 Automatically sort the model values without sorting the DOM.
- ➕ Ability to add or remove thumbs dynamically.
- 🚫 Avoid duplicate thumbs by rejecting them.
- 🍡 Smooth movement or jump movement over the stops.
- 🎨 Customizable style and theme.
- 🌓 Supports dark mode.
- 📍 Render content above or below the thumb.

## Demo

[Demo](https://range.wiidede.space/)

## Quick Start

1. Install

```bash
pnpm add vue-range-multi
```

2. Use in Vue

in SFC

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Range } from 'vue-range-multi'
import 'vue-range-multi/style.css'

const model = ref<number>(0)
</script>

<template>
  <Range v-model="model" />
</template>
```

install globally

```ts
// main.ts
import { Range } from 'vue-range-multi'
import 'vue-range-multi/style.css'

app.component('MRange', Range)
```

```ts
declare module 'vue' {
  export interface GlobalComponents {
    MRange: typeof import('vue-range-multi')['Range']
  }
}
```

Or you can import it globally in main.ts.

## Props

generic="T"

| Name | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| v-model:modelValue | number \| number[] \| RangeData\<T>[] | model value. It will auto detect the type of model and show the corresponding thumb(s) | [] | true |
| min | number | minimum value | 0 | |
| max | number | maximum value | 100 | |
| step | number | step | 1 | |
| addable | boolean | can add data. This will emit event 'addThumb' | false | |
| limit | number | the limit can be add | undefined | |
| smooth | boolean | with smooth off, the thumb will only show on the stop point | false | |
| deduplicate | boolean | can the thumb be duplicated | true | |
| rangeHighlight | boolean | highlight range between min and max. This will only effect while modelValue is array and length is 2 | false | |
| showStops | boolean \| number | whether to show dots on the track. When set to number, will only show dots while stops less than the value | 12 | |
| size | 'small' \| 'medium' \| 'large' | track size | 'small' | |
| thumbType | 'circle' \| 'square' \| 'rect' | thumb type(default 'rect' while size is 'large', otherwise 'small') | 'circle' \| 'rect' | |
| thumbSize | 'small' \| 'medium' \| 'large' | thumb size | 'medium' | |
| renderTop | (data: RangeData\<T>) => VNode | render function on the top of thumb | undefined | |
| renderTopOnActive | boolean | only render top function on the active thumb | false | |
| renderBottom | (data: RangeData\<T>) => VNode | render bottom function on the bottom of thumb | undefined | |
| renderBottomOnActive | boolean | only render bottom function on the active thumb | false | |

## events

| Name | Type| Description |
| --- | --- | --- |
| add | (value: number): void | add event while click the track |

## types

```ts
export type RangeRenderFn<T = unknown> = (data: RangeData<T>) => VNode
export interface RangeData<T = unknown> {
  value: number
  data?: T
  disabled?: boolean
  renderTop?: RangeRenderFn<T>
  renderBottom?: RangeRenderFn<T>
}
export type RangeValue<T = unknown> = number | number[] | RangeData<T>[]
```

## theme

If you want to customize the theme, just use css variables to override the default theme.

```css
.m-range-theme {
  --c-primary: #409EFF; /* primary color */
  --c-fill: #E4E7ED; /* track's fill color */
  --c-fill-stop: #F5F5F5; /* stop's fill color */
  --c-fill-thumb: #fff;  /* thumb's fill color */
}
```

## TODO

- [ ] test

## License

[MIT](./LICENSE) License © 2023-PRESENT [wiidede](https://github.com/wiidede)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vue-range-multi?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vue-range-multi
[npm-downloads-src]: https://img.shields.io/npm/dm/vue-range-multi?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vue-range-multi
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vue-range-multi?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vue-range-multi
[license-src]: https://img.shields.io/github/license/wiidede/vue-range-multi.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/wiidede/vue-range-multi/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vue-range-multi
