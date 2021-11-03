import { createI18n } from 'vue-i18n'
import en from '@/src/i18n/locales/en'
import pl from '@/src/i18n/locales/pl'

const messages = {
  en: en.messages,
  pl: pl.messages
}

const pluralizationRules = {
  en: en.pluralizationRules,
  pl: pl.pluralizationRules
}

export default new createI18n({
  locale: 'pl',
  messages,
  pluralizationRules
})
