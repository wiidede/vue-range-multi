import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import Component from 'unplugin-vue-components/vite'
import { VueRangeMultiResolver } from '../src/resolver'

export default defineConfig({
  plugins: [
    Vue(),
    Component({
      resolvers: [VueRangeMultiResolver({ name: 'Range' })],
    }),
    Unocss(),
    Inspect(),
    {
      name: 'blank',
      load(id) {
        if (id.endsWith('vue-range-multi/style.css'))
          return ''
      },
    },
  ],
  resolve: {
    alias: [
      { find: /^vue-range-multi$/, replacement: path.resolve(__dirname, '../src/index.ts') },
    ],
  },
})
