# vue-range-multi(WIP)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

A range vue component that support one or more thumb

## Demo

[Demo](https://range.wiidede.space/)

## Quick Start

1. Install

```bash
pnpm add vue-range-multi
```

2. Use in Vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Range } from 'vue-range-multi'

const model = ref<number>(0)
</script>

<template>
  <Range
    v-model="model"
  />
</template>
```

## Props

| Name | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| modelValue | number \| number[] \| RangeData<T>[] | model value. It will auto detect the type of model and show different thumb(s) | [] | true |
| min | number | minimum value | 0 | |
| max | number | maximum value | 100 | |
| step | number | step | 1 | |
| add | boolean | can add data. This will emit 'addThumb' | false | |
| limit | number | the limit can be add | 0 | |
| smooth | boolean | with smooth off, the thumb will only show on the stop point | false | |
| deduplicate | boolean | can the thumb be duplicated | true | |
| rangeHighlight | boolean | highlight range between min and max. This will only effect while modelValue is array and length is 2 | false | |
| showStops | boolean \| number | whether to show dots on the track | 12 | |
| renderTop | Function | render function on the top of thumb | undefined | |
| renderBottom | Function | render bottom function on the bottom of thumb | undefined | |

type:

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

## TODO

- [ ] style convenience(track height/thumb style)

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
