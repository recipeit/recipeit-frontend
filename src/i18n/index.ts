import { createI18n } from 'vue-i18n'

import plMessages from '@/i18n/locales/messages/pl'
import plPluralizationRules from '@/i18n/locales/pluralization/pl'

const messages = {
  pl: plMessages
}

const pluralizationRules = {
  pl: plPluralizationRules
}

export default createI18n({
  locale: 'pl',
  messages,
  pluralizationRules
})
