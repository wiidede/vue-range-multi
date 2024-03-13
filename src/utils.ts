export function swap<T extends object>(arr: T, i: keyof T, j: keyof T): void {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

export function percentage2value(percentage: number, min: number, max: number, step: number) {
  if (min === undefined || max === undefined || step === undefined)
    return Number.NaN
  if (max <= min)
    return Number.NaN
  if (percentage < 0)
    return min
  if (percentage > 100)
    return max
  const value = min + (max - min) * percentage / 100
  return Math.round(value / step) * step
}

export function value2percentage(value: number, min: number, max: number, step: number) {
  if (min === undefined || max === undefined || step === undefined)
    return Number.NaN
  if (max <= min)
    return Number.NaN
  if (value < min)
    return 0
  if (value > max)
    return 100
  const percentage = (value - min) / (max - min) * 100
  const percentageStep = step / (max - min)
  return Math.round(percentage / percentageStep) * percentageStep
}

export const PromiseTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
