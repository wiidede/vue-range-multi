import type { VNode } from 'vue'

export type TheRangeRenderFn<T> = (data: TheRangeData<T>) => VNode
export interface TheRangeData<T> {
  key: string | number | symbol
  value: number
  data?: T
  disabled?: boolean
  renderTop?: TheRangeRenderFn<T>
  renderBottom?: TheRangeRenderFn<T>
}
