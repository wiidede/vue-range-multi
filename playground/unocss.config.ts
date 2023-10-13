import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { defu } from 'defu'
import rootConfig from '../unocss.config'

export default defineConfig(defu({
  shortcuts: [
    ['tag', 'inline-block bg-zinc-100 text-zinc-600 text-0.8em px-2 leading-normal rd h-fit w-fit'],
    ['type-title', 'text-2xl inline font-normal font-mono text-zinc-800'],
    ['label', 'text-zinc-900 after:content-[":"] mr1 ws-nowrap'],
    ['value', 'text-sm inline-block m0 p0 ws-pre-wrap text-zinc-700 b b-solid b-zinc-300 bg-zinc-50 rd'],
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
}, rootConfig))
