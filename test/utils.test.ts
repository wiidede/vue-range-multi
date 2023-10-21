import { describe, expect, it } from 'vitest'
import { percentage2value, swap, value2percentage } from '../src/utils'

describe('swap', () => {
  it('should swap elements in an array', () => {
    const arr = [1, 2, 3]
    swap(arr, 0, 2)
    expect(arr).toEqual([3, 2, 1])
  })
  it('should swap elements in an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    swap(obj, 'a', 'c')
    expect(obj).toEqual({ a: 3, b: 2, c: 1 })
  })
})

describe('value and percentage conversion', () => {
  it('should convert percentage to value', () => {
    expect(percentage2value(-1, 0, 100, 1)).toEqual(0)
    expect(percentage2value(0, 0, 100, 1)).toEqual(0)
    expect(percentage2value(50, 0, 100, 1)).toEqual(50)
    expect(percentage2value(50.0001, 0, 100, 1)).toEqual(50)
    expect(percentage2value(100, 0, 100, 1)).toEqual(100)
    expect(percentage2value(101, 0, 100, 1)).toEqual(100)
    expect(percentage2value(1, 1, 0, 1)).toEqual(Number.NaN)
    expect(percentage2value(1, 1, 1, 1)).toEqual(Number.NaN)
    expect(percentage2value(Number.NaN, 0, 100, 1)).toEqual(Number.NaN)
    expect(percentage2value(Number.NaN, Number.NaN, Number.NaN, Number.NaN)).toEqual(Number.NaN)
  })

  it('should convert value to percentage', () => {
    expect(value2percentage(-1, 0, 100, 1)).toEqual(0)
    expect(value2percentage(0, 0, 100, 1)).toEqual(0)
    expect(value2percentage(50, 0, 100, 1)).toEqual(50)
    expect(value2percentage(50.0001, 0, 100, 1)).toEqual(50)
    expect(value2percentage(100, 0, 100, 1)).toEqual(100)
    expect(value2percentage(101, 0, 100, 1)).toEqual(100)
    expect(value2percentage(1, 1, 0, 1)).toEqual(Number.NaN)
    expect(value2percentage(1, 1, 1, 1)).toEqual(Number.NaN)
    expect(value2percentage(Number.NaN, 0, 100, 1)).toEqual(Number.NaN)
    expect(value2percentage(Number.NaN, Number.NaN, Number.NaN, Number.NaN)).toEqual(Number.NaN)
  })
})
