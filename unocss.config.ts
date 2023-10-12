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
    ['m-range', 'min-h-1 h8 box-content'],
    ['m-range-track', 'relative h-full bg-fill select-none rd-full'],
    ['m-range-highlight-container', 'absolute h-full w-full overflow-hidden'],
    ['m-range-highlight', 'h-full bg-primary absolute rd-1px'],
    ['m-range-points-area', 'absolute h-full w-full rd-inherit overflow-hidden'],
    ['m-range-points-container', 'absolute h-full left--3px right--3px flex justify-between items-center'],
    ['m-range-points', 'w-6px h-6px rd-3px bg-fill-stop'],
    ['m-range-thumb', 'm-range-border absolute w3 bg-fill-thumb rd-full cursor-move translate-x--50% transform-origin-center transition transition-property-[opacity,transform]'],
    ['m-range-thumb-rect', 'top--1 bottom--1'],
    ['m-range-thumb-active', 'z-1 bg-primary  drop-shadow-[0.1rem_0.15rem_0.25rem_var(--c-primary)]'],
    ['m-range-thumb-top-container', 'absolute left-50% top-0 translate-x--50% translate-y--110%'],
    ['m-range-thumb-bottom-container', 'absolute left-50% bottom-0 translate-x--50% translate-y-110%'],
  ],
  theme: {
    colors: {
      black: '#000',
      white: '#fff',
      fill: {
        DEFAULT: 'var(--c-fill, #E4E7ED)',
        stop: 'var(--c-fill-stop, #F5F5F5)',
        thumb: 'var(--c-fill-thumb, #fff)',
      },
      primary: 'var(--c-primary, #409EFF)',
    },
  },
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
