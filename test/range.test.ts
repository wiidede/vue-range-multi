import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import type { RangeData } from '../src/type'
import { PromiseTimeout } from '../src/utils'
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

  it('should work with drag', async () => {
    const model = ref(0)
    const wrapper = mount(Range, {
      props: { modelValue: model, style: 'width:200px' },
      attachTo: document.getElementById('app') || document.body,
    })
    const track = wrapper.find('.m-range-track')
    // @ts-expect-error no mock of getBoundingClientRect
    vi.spyOn(track.element, 'getBoundingClientRect', 'get').mockImplementation(() => () => ({ left: 0, top: 0, width: 200, height: 200 }))
    const thumb = wrapper.findComponent({ name: 'RangeThumb' })
    thumb.trigger('pointerdown', { clientX: 0 })

    const mousemove = new MouseEvent('pointermove', {
      screenX: 100,
      screenY: 0,
      clientX: 100,
      clientY: 0,
    })
    window.dispatchEvent(mousemove)
    await nextTick()
    expect(model.value).toBe(50)

    const mouseup = new MouseEvent('pointerup', {
      screenX: 100,
      screenY: 0,
      clientX: 100,
      clientY: 0,
    })
    window.dispatchEvent(mouseup)
    await nextTick()
    expect(model.value).toBe(50)
  })

  it('should work with outside model value change', async () => {
    const model = ref<RangeData<number>[]>(Array.from({ length: 10 }, (_, i) => ({
      value: i * 10,
      data: i,
    })))
    mount(Range, {
      props: {
        modelValue: model,
      },
    })
    model.value.splice(5, 1)
    await PromiseTimeout(10)
    expect(model.value).toMatchInlineSnapshot(`
      [
        {
          "data": 0,
          "value": 0,
        },
        {
          "data": 1,
          "value": 10,
        },
        {
          "data": 2,
          "value": 20,
        },
        {
          "data": 3,
          "value": 30,
        },
        {
          "data": 4,
          "value": 40,
        },
        {
          "data": 6,
          "value": 60,
        },
        {
          "data": 7,
          "value": 70,
        },
        {
          "data": 8,
          "value": 80,
        },
        {
          "data": 9,
          "value": 90,
        },
      ]
    `)
  })
})
