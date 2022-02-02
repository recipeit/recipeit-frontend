import { createI18n } from 'vue-i18n'

import pl from '@/i18n/locales/pl'

const messages = {
  pl: pl.messages
}

const pluralizationRules = {
  pl: pl.pluralizationRules
}

export default createI18n({
  locale: 'pl',
  messages,
  pluralizationRules
})
