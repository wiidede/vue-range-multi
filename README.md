# Vue Range Multi

<a href="https://range.wiidede.space/" target="_blank" ><img src="./playground/public/favicon.svg" width="100px" height="100px"></div></a>

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

unplugin-vue-components

```ts
import { VueRangeMultiResolver } from 'vue-range-multi'

// and then add `VueRangeMultiResolver()` into resolvers
```

```ts
interface VueRangeMultiResolverOptions {
  /**
   * The name of the component. It should be camelCase
   *
   * @default 'MRange'
   */
  name?: string
}
```

## Props

generic="T"

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| v-model:modelValue* | number \| number[] \| RangeData\<T>[] | Model value. It will automatically detect the type of model and show the corresponding thumb(s) | [] |
| min | number | The minimum value allowed | 0 |
| max | number | The maximum value allowed | 100 |
| step | number | Step | 1 |
| addable | boolean | Determines if new data can be added/deleted. This will emit event 'addThumb' | false |
| limit | number | the limit can be add | undefined |
| smooth | boolean | Determines if the thumb(s) should only be displayed on the stop points or not | false |
| deduplicate | boolean | Determines if the thumb(s) can be duplicated | true |
| rangeHighlight | boolean | Determines if the range between the minimum and maximum values should be highlighted. This only has an effect when the modelValue is an array with a length of 2 | false |
| showStops | boolean \| number | Determines if dots should be displayed on the track. When set to a number, dots will only be displayed if the number of stops is less than the specified value | 12 |
| size | 'small' \| 'medium' \| 'large' | Track size | 'small' |
| thumbType | 'circle' \| 'square' \| 'rect' | Thumb type(default 'rect' while size is 'large', otherwise 'small') | 'circle' \| 'rect' |
| thumbSize | 'small' \| 'medium' \| 'large' | Thumb size | 'medium' |
| renderTop | (data: RangeData\<T>) => VNode | A render function for displaying content above the thumb | undefined |
| renderTopOnActive | boolean | Specifies whether to render only while the thumb is active | false |
| renderBottom | (data: RangeData\<T>) => VNode | A render function for displaying content below the thumb | undefined |
| renderBottomOnActive | boolean | Specifies whether to render only while the thumb is active | false |

## events

| Name | Type| Description |
| --- | --- | --- |
| add | (value: number): void | add event while click the track |

## slots

| Name | Type | Description |
| --- | --- | --- |
| top | { data: RangeData\<T> } | render above the thumb, only effect while renderTop is undefined |
| bottom | { data: RangeData\<T> } | render below the thumb, only effect while renderBottom is undefined |

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
