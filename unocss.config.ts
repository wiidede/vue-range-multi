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
    ['m-range-border', 'border border-primary border-solid'],
    // classes
    ['m-range', 'min-h-1 h8 box-content'],
    ['m-range-track', 'relative h-full bg-fill select-none rd-4'],
    ['m-range-highlight-container', 'h-full w-full rd-4 overflow-hidden'],
    ['m-range-highlight', 'h-full bg-primary absolute rd-1px'],
    ['m-range-points-container', 'absolute h-full rd-full left--3px right--3px rd-3px flex justify-between items-center overflow-hidden'],
    ['m-range-points', 'w-6px h-6px rd-3px op50 bg-white'],
    ['m-range-thumb', 'm-range-border absolute w3 bg-white rd-full cursor-move translate-x--50% transform-origin-center transition transition-property-[opacity,transform]'],
    ['m-range-thumb-rect', 'top--1 bottom--1'],
    ['m-range-thumb-active', 'z-1 bg-primary  drop-shadow-[0.1rem_0.15rem_0.25rem_var(--c-primary)]'],
    ['m-range-thumb-top-container', 'absolute left-50% top-0 translate-x--50% translate-y--110%'],
    ['m-range-thumb-bottom-container', 'absolute left-50% bottom-0 translate-x--50% translate-y-110%'],
  ],
  theme: {
    colors: {
      black: '#000',
      white: '#fff',
      fill: 'var(--c-fill, #E4E7ED)',
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
