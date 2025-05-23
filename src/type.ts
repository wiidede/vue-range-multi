import type { CSSProperties, VNode } from 'vue'

export type RangeValueType<T> = number | RangeData<T>
export interface RangeData<T, U = RangeValueType<T>> {
  value: number
  data?: T
  disabled?: boolean
  unremovable?: boolean
  limits?: [number, number]
  renderTop?: RangeRenderFn<T, U>
  renderBottom?: RangeRenderFn<T, U>
}
export type RangeRenderFn<T, U = RangeValueType<T>> = (data: U) => VNode
export type RangeValue<T, U = RangeValueType<T>> = U | U[]
export type RangeProgress = ([number, number] | {
  range: [number, number]
  style?: CSSProperties
  class?: string
})[]
export type RangeMarks = Record<number, string | {
  label: string
  style?: CSSProperties
  class?: string
}>
