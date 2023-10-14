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
    ['m-range', 'min-h-1 box-content'],
    ['m-range-theme', '[--c-primary:#409EFF] [--c-fill:#E4E7ED] [--c-fill-stop:#F5F5F5] [--c-fill-thumb:#fff]'],
    ['m-range-small', 'h2 [--m-range-h:0.5rem]'],
    ['m-range-medium', 'h4 [--m-range-h:1rem]'],
    ['m-range-large', 'h8 [--m-range-h:2rem]'],
    ['m-range-track', 'relative h-full bg-fill select-none rd-full'],
    ['m-range-highlight-container', 'absolute h-full w-full overflow-hidden'],
    ['m-range-highlight', 'h-full bg-primary absolute rd-1px'],
    ['m-range-points-area', 'absolute h-full w-full rd-inherit overflow-hidden'],
    ['m-range-points-container', 'absolute h-full left--3px right--3px flex justify-between items-center'],
    ['m-range-points', 'w-6px h-6px rd-3px bg-fill-stop'],
    ['m-range-thumb', 'm-range-border absolute bg-fill-thumb translate-x--50% transform-origin-center transition transition-property-[opacity,transform]'],
    ['m-range-thumb-circle', 'w-[calc(var(--m-range-h)_+_var(--m-range-thumb-h))] rd-full'],
    ['m-range-thumb-square', 'w-[calc(var(--m-range-h)_+_var(--m-range-thumb-h))]'],
    ['m-range-thumb-rect', 'w3 rd-full'],
    ['m-range-thumb-small', 'top--0 bottom--0 [--m-range-thumb-h:0rem]'],
    ['m-range-thumb-medium', 'top--1 bottom--1 [--m-range-thumb-h:0.5rem]'],
    ['m-range-thumb-large', 'top--2 bottom--2 [--m-range-thumb-h:1rem]'],
    ['m-range-thumb-active', 'z-1  drop-shadow-[0.1rem_0.15rem_0.25rem_var(--c-primary)]'],
    ['m-range-transition-container', 'absolute h-full w-full'],
    ['m-range-thumb-top-container', 'absolute left-50% top-0 translate-x--50% translate-y--110%'],
    ['m-range-thumb-bottom-container', 'absolute left-50% bottom-0 translate-x--50% translate-y-110%'],
  ],
  theme: {
    colors: {
      fill: {
        DEFAULT: 'var(--c-fill)',
        stop: 'var(--c-fill-stop)',
        thumb: 'var(--c-fill-thumb)',
      },
      primary: 'var(--c-primary)',
    },
  },
  safelist: [
    ...['small', 'medium', 'large'].map(size => `m-range-${size}`),
    ...['circle', 'square', 'rect'].map(size => `m-range-thumb-${size}`),
    ...['small', 'medium', 'large'].map(size => `m-range-thumb-${size}`),
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
