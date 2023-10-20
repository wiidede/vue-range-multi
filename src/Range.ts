import type { InjectionKey, Ref } from 'vue'

export const RangeTrackRefKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('RangeTrackRefKey')
