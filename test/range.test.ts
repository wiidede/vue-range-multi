import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { Range } from '../src/index'

describe('range', () => {
  it('should created a range', () => {
    const wrapper = mount(Range, {
      props: { modelValue: 0 },
    })
    expect(wrapper.props().modelValue).toEqual(0)
    expect(wrapper.find('.m-range-thumb').exists()).toBe(true)
  })

  it('should not have thumb while modelValue is undefined', () => {
    const wrapper = mount(Range)
    expect(wrapper.find('.m-range-thumb').exists()).toBe(false)
  })

  it('should be vertical', () => {
    const wrapper = mount(Range, {
      props: { modelValue: 0, vertical: true, max: 10, marks: { 0: '1' } },
    })
    expect(wrapper.find('.m-range-v-small').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-track').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-highlight').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-points-container').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-marks').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-mark-item').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-thumb').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-thumb-circle').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-thumb-medium').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-transition-container').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-thumb-top-container').exists()).toBe(true)
    expect(wrapper.find('.m-range-v-thumb-bottom-container').exists()).toBe(true)
  })

  it('should show stops', () => {
    const wrapper = mount(Range, {
      props: { modelValue: 0, min: 0, max: 100, step: 10 },
    })
    expect(wrapper.find('.m-range-points').exists()).toBe(true)
  })

  it('should not show stops', () => {
    const wrapper = mount(Range, {
      props: { modelValue: 0, min: 0, max: 10, step: 1, showStops: 10 },
    })
    expect(wrapper.find('.m-range-points').exists()).toBe(false)
  })

  it('should work with size, thumbSize, thumbType', () => {
    const wrapper = mount(Range, {
      props: { modelValue: 0, size: 'large', thumbSize: 'small', thumbType: 'rect' },
    })
    expect(wrapper.find('.m-range-large').exists()).toBe(true)
    expect(wrapper.find('.m-range-thumb-small').exists()).toBe(true)
    expect(wrapper.find('.m-range-thumb-rect').exists()).toBe(true)
  })

  it('should work with render function', () => {
    const wrapper = mount(Range, {
      props: {
        modelValue: [0, 1],
        renderTop: value => h('p', { class: 'top-render' }, String(value)),
        renderBottom: value => h('p', { class: 'bottom-render' }, String(value)),
      },
    })
    expect(wrapper.find('p.top-render').exists()).toBe(true)
    expect(wrapper.find('p.bottom-render').exists()).toBe(true)
  })

  it('should work with render on active', async () => {
    const wrapper = mount(Range, {
      props: {
        modelValue: [0, 1],
        renderTop: value => h('p', { class: 'top-render' }, String(value)),
        renderTopOnActive: true,
        renderBottom: value => h('p', { class: 'bottom-render' }, String(value)),
        renderBottomOnActive: true,
      },
    })
    expect(wrapper.find('p.top-render').exists()).toBe(false)
    expect(wrapper.find('p.bottom-render').exists()).toBe(false)
    const thumb = wrapper.findComponent({ name: 'RangeThumb' })
    await thumb.trigger('pointerdown', { clientX: 0 })
    expect(wrapper.find('p.top-render').exists()).toBe(true)
    expect(wrapper.find('p.bottom-render').exists()).toBe(true)
  })

  it('should work with marks', () => {
    const wrapper = mount(Range, {
      props: { modelValue: 0, marks: { 0: '1' } },
    })
    expect(wrapper.find('.m-range-mark-item').exists()).toBe(true)
  })
})
