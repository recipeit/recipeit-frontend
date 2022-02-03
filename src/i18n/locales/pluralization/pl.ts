import { PluralizationRule } from 'vue-i18n'

import { ADDITIONAL_AMOUNT_VALUES } from '@/configs/amount'

const pluralizationRules: PluralizationRule = (choice: number, choicesLength: number) => {
  const absChoice = Math.abs(choice) // Change to positive
  const decimal = absChoice - Math.floor(absChoice)

  if (decimal) {
    return 0
  }

  if (ADDITIONAL_AMOUNT_VALUES.includes(choice)) {
    return 3
  }

  if (absChoice === 1) {
    return 1
  }

  if (choicesLength < 4) {
    return 2
  }

  const teen = absChoice > 10 && absChoice < 20
  // at first, there was ... % 10 >= 2, but there was problem with float numbers, eg. 1.5
  if (!teen && absChoice % 10 > 1 && absChoice % 10 <= 4) {
    return 2
  }

  return 3
}

export default pluralizationRules
