import type { VNode } from 'vue'

export type RangeRenderFn<T = unknown> = (data: RangeData<T>) => VNode
export interface RangeData<T = unknown> {
  value: number
  data?: T
  disabled?: boolean
  renderTop?: RangeRenderFn<T>
  renderBottom?: RangeRenderFn<T>
}
export type RangeValue<T = unknown> = number | number[] | RangeData<T>[]
