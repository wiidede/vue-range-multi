import type { InjectionKey, Ref } from 'vue'

export const RangeTrackRefKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('RangeTrackRefKey')
export const RangeContainerRefKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('RangeContainerRefKey')
