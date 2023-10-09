import type { InjectionKey, Ref } from 'vue'

export const theRangeTrackRefKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('theRangeTrackRefKey')
export const theRangeContainerRefKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('theRangeContainerRefKey')
