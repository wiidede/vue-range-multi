import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // common
    ['m-range-border', 'border-2 border-primary border-solid'],
    // classes
    ['m-range', 'min-h-1 min-w-1 box-content'],
    // theme
    ['m-range-theme', '[--c-primary:#409EFF] [--c-fill:#E4E7ED] [--c-fill-stop:#F5F5F5] [--c-fill-thumb:#fff] [--c-drop:var(--c-primary)]'],
    ['m-range-theme-dark', '[--c-primary:#3070ED] [--c-fill:#444] [--c-fill-stop:#555] [--c-fill-thumb:#333] [--c-drop:var(--c-primary)]'],
    // track
    ['m-range-small', 'h2 [--m-range-h:0.5rem]'],
    ['m-range-medium', 'h4 [--m-range-h:1rem]'],
    ['m-range-large', 'h8 [--m-range-h:2rem]'],
    ['m-range-track', 'relative h-full bg-fill select-none rd-full'],
    ['m-range-v-small', 'w2 [--m-range-w:0.5rem]'],
    ['m-range-v-medium', 'w4 [--m-range-w:1rem]'],
    ['m-range-v-large', 'w8 [--m-range-w:2rem]'],
    ['m-range-v-track', 'relative w-full h-full bg-fill select-none rd-full'],
    // highlight
    ['m-range-highlight-container', 'absolute h-full w-full overflow-hidden rd-inherit'],
    ['m-range-highlight', 'h-full bg-primary absolute'],
    ['m-range-v-highlight', 'w-full bg-primary absolute'],
    // progress
    ['m-range-progress-container', 'absolute h-full w-full overflow-hidden rd-inherit'],
    ['m-range-progress', 'h-full bg-primary absolute'],
    ['m-range-v-progress', 'w-full bg-primary absolute'],
    // points
    ['m-range-points-area', 'absolute h-full w-full rd-inherit overflow-hidden'],
    ['m-range-points-container', 'absolute h-full left--3px right--3px flex justify-between items-center'],
    ['m-range-points', 'w-6px h-6px rd-3px bg-fill-stop'],
    ['m-range-v-points-container', 'absolute w-full top--3px bottom--3px flex flex-col justify-between items-center'],
    // marks
    ['m-range-marks', 'absolute h-full w-full left-0 top-0 translate-y-[calc(var(--m-range-h)_+_var(--m-range-thumb-h))]'],
    ['m-range-mark-item', 'absolute top-0 translate-x--50%'],
    ['m-range-v-marks', 'absolute h-full w-full left-0 top-0 translate-x-[calc(var(--m-range-w)_+_var(--m-range-thumb-w))]'],
    ['m-range-v-mark-item', 'absolute left-0 translate-y--50%'],
    // thumb
    ['m-range-thumb', 'm-range-border touch-none absolute bg-fill-thumb translate-x--50% transform-origin-center transition transition-property-[opacity,transform]'],
    ['m-range-thumb-circle', 'w-[calc(var(--m-range-h)_+_var(--m-range-thumb-h)_*_2)] rd-full'],
    ['m-range-thumb-square', 'w-[calc(var(--m-range-h)_+_var(--m-range-thumb-h)_*_2)]'],
    ['m-range-thumb-rect', 'w3 rd-full'],
    ['m-range-thumb-small', 'top--0 bottom--0 [--m-range-thumb-h:0rem]'],
    ['m-range-thumb-medium', 'top--1 bottom--1 [--m-range-thumb-h:0.25rem]'],
    ['m-range-thumb-large', 'top--2 bottom--2 [--m-range-thumb-h:0.5rem]'],
    ['m-range-thumb-active', 'z-1  drop-shadow-[0.1rem_0.15rem_0.25rem_var(--c-drop)]'],
    ['m-range-transition-container', 'absolute h-full w0 left-50%'],
    ['m-range-thumb-top-container', 'absolute left-50% top-0 translate-x--50% translate-y-[calc(-100%_-_4px)]'],
    ['m-range-thumb-bottom-container', 'absolute left-50% bottom-0 translate-x--50% translate-y-[calc(100%_+_4px)]'],
    ['m-range-v-thumb', 'm-range-border touch-none absolute bg-fill-thumb translate-y--50% transform-origin-center transition transition-property-[opacity,transform]'],
    ['m-range-v-thumb-circle', 'h-[calc(var(--m-range-w)_+_var(--m-range-thumb-w)_*_2)] rd-full'],
    ['m-range-v-thumb-square', 'h-[calc(var(--m-range-w)_+_var(--m-range-thumb-w)_*_2)]'],
    ['m-range-v-thumb-rect', 'h3 rd-full'],
    ['m-range-v-thumb-small', 'left--0 right--0 [--m-range-thumb-w:0rem]'],
    ['m-range-v-thumb-medium', 'left--1 right--1 [--m-range-thumb-w:0.25rem]'],
    ['m-range-v-thumb-large', 'left--2 right--2 [--m-range-thumb-w:0.5rem]'],
    ['m-range-v-transition-container', 'absolute w-full h0 top-50%'],
    ['m-range-v-thumb-top-container', 'absolute top-50% left-0 translate-y--50% translate-x-[calc(-100%_-_4px)]'],
    ['m-range-v-thumb-bottom-container', 'absolute top-50% right-0 translate-y--50% translate-x-[calc(100%_+_4px)]'],
  ],
  theme: {
    colors: {
      fill: {
        DEFAULT: 'var(--c-fill)',
        stop: 'var(--c-fill-stop)',
        thumb: 'var(--c-fill-thumb)',
      },
      drop: 'var(--c-drop)',
      primary: 'var(--c-primary)',
    },
  },
  safelist: [
    ...['small', 'medium', 'large'].flatMap(size => [`m-range-${size}`, `m-range-v-${size}`]),
    ...['circle', 'square', 'rect'].flatMap(size => [`m-range-thumb-${size}`, `m-range-v-thumb-${size}`]),
    ...['small', 'medium', 'large'].flatMap(size => [`m-range-thumb-${size}`, `m-range-v-thumb-${size}`]),
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  rules: [
  ],
})
