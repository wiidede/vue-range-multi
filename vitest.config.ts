import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    // deps: {
    //   inline: ['@vue'],
    // },
  },
})
