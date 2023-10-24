import type { ComponentResolver } from 'unplugin-vue-components'

export interface VueRangeMultiResolverOptions {
  /**
   * The name of the component. It should always CapitalCase
   *
   * @default 'MRange'
   */
  name?: string
}

export function VueRangeMultiResolver(option: VueRangeMultiResolverOptions = {}): ComponentResolver {
  option = {
    name: 'MRange',
    ...option,
  }

  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === option.name) {
        return {
          name: 'Range',
          as: name,
          from: 'vue-range-multi',
          sideEffects: 'vue-range-multi/style.css',
        }
      }
    },
  }
}
