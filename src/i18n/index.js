import { createI18n } from 'vue-i18n'
import pl from './locales/pl'
import en from './locales/en'

const messages = {
  en: en.messages,
  pl: pl.messages
}

const pluralizationRules = {
  en: en.pluralizationRules,
  pl: pl.pluralizationRules
}

export default new createI18n({
  locale: 'en',
  messages,
  pluralizationRules
})
