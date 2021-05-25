/**
 * @type {string | number}
 * @param {number} [value]
 * */
export const stringifiedDecimal = value => {
  switch (value) {
    case 1 / 4:
      return '1/4'
    case 1 / 2:
      return '1/2'
    case 3 / 4:
      return '3/4'
    case 1 / 7:
      return '1/7'
    case 1 / 9:
      return '1/9'
    case 1 / 10:
      return '1/10'
    case 3 / 10:
      return '3/10'
    case 7 / 10:
      return '7/10'
    case 9 / 10:
      return '9/10'
    case 1 / 3:
      return '1/3'
    case 2 / 3:
      return '2/3'
    case 1 / 5:
      return '1/5'
    case 2 / 5:
      return '2/5'
    case 3 / 5:
      return '3/5'
    case 4 / 5:
      return '4/5'
    case 1 / 6:
      return '1/6'
    case 5 / 6:
      return '5/6'
    case 1 / 8:
      return '1/8'
    case 3 / 8:
      return '3/8'
    case 5 / 8:
      return '5/8'
    case 7 / 8:
      return '7/8'
    default:
      return null
  }
}

export const stringifiedAmount = value => {
  if (value === -2) {
    return 'kilkanaście'
  } else if (value === -1) {
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
