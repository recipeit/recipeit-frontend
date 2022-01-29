import { DOZEN_VALUE, FEW_VALUE } from '@/configs/amount'

const roundedAmount = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export const stringifiedDecimal = (value: number): string | null => {
  switch (roundedAmount(value)) {
    case roundedAmount(1 / 4):
      return '1/4'
    case roundedAmount(1 / 2):
      return '1/2'
    case roundedAmount(3 / 4):
      return '3/4'
    case roundedAmount(1 / 7):
      return '1/7'
    case roundedAmount(1 / 9):
      return '1/9'
    case roundedAmount(1 / 10):
      return '1/10'
    case roundedAmount(3 / 10):
      return '3/10'
    case roundedAmount(7 / 10):
      return '7/10'
    case roundedAmount(9 / 10):
      return '9/10'
    case roundedAmount(1 / 3):
      return '1/3'
    case roundedAmount(2 / 3):
      return '2/3'
    case roundedAmount(1 / 5):
      return '1/5'
    case roundedAmount(2 / 5):
      return '2/5'
    case roundedAmount(3 / 5):
      return '3/5'
    case roundedAmount(4 / 5):
      return '4/5'
    case roundedAmount(1 / 6):
      return '1/6'
    case roundedAmount(5 / 6):
      return '5/6'
    case roundedAmount(1 / 8):
      return '1/8'
    case roundedAmount(3 / 8):
      return '3/8'
    case roundedAmount(5 / 8):
      return '5/8'
    case roundedAmount(7 / 8):
      return '7/8'
    default:
      return null
  }
}

export const stringifiedAmount = (value: number): string | number | null => {
  if (value === DOZEN_VALUE) {
    return 'kilkanaście'
  } else if (value === FEW_VALUE) {
    return 'kilka'
  } else if (value > 0) {
    const integer = Math.floor(value)
    const decimal = value - integer

    if (integer && decimal) {
      const specialDecimal = stringifiedDecimal(decimal)
      return specialDecimal ? `${integer} i ${specialDecimal}` : value.toFixed(2)
    } else if (decimal) {
      return stringifiedDecimal(decimal) || value.toFixed(2)
    } else {
      return value
    }
  } else {
    return null
  }
}
