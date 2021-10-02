import Cookies from 'js-cookie'
import { ref } from 'vue'

import { COOKIES_ANALYTICS_COOKIE_NAME, COOKIES_MESSAGE_COOKIE_NAME } from '@/configs/cookies'

import AnalyticsService from '@/services/analytics'

const GDPR_OPTIONS = [COOKIES_ANALYTICS_COOKIE_NAME]

const setGDPRCookie = (cookieName, value) => {
  if (value === true) {
    if (!GDPR_OPTIONS.includes(cookieName)) return
    Cookies.set(cookieName, value, { expires: 365 })

    if (!acceptedCookies.value.includes(cookieName)) {
      acceptedCookies.value.push(cookieName)

      if (cookieName === COOKIES_ANALYTICS_COOKIE_NAME) {
        AnalyticsService.init()
      }
    }
  } else {
    Cookies.remove(cookieName)
    const index = acceptedCookies.value.indexOf(cookieName)
    if (index >= 0) {
      acceptedCookies.value.splice(index, 1)
    }
  }
}

const isCookieAllowed = cookieName => {
  return acceptedCookies.value.includes(cookieName)
}

let initialized = false
let acceptedCookies = ref(null)

export default {
  init() {
    if (initialized) {
      return
    }

    acceptedCookies.value = GDPR_OPTIONS.filter(cookieName => Cookies.get(cookieName) === 'true') || []
    initialized = true

    if (this.analyticsAllowed()) {
      AnalyticsService.init()
    }
  },
  getAvailableCookies() {
    return GDPR_OPTIONS
  },
  getAcceptedCookies() {
    this.init()
    return acceptedCookies
  },
  acceptAll() {
    GDPR_OPTIONS.forEach(cookieName => {
      setGDPRCookie(cookieName, true)
    })
    this.setGDPRModalShowed()
  },
  acceptSelected(allowedCookies) {
    GDPR_OPTIONS.forEach(cookieName => {
      const allowed = allowedCookies.includes(cookieName)
      setGDPRCookie(cookieName, allowed)
    })
    this.setGDPRModalShowed()
  },
  showGDPRModal() {
    return Cookies.get(COOKIES_MESSAGE_COOKIE_NAME) !== 'true'
  },
  setGDPRModalShowed() {
    Cookies.set(COOKIES_MESSAGE_COOKIE_NAME, true, { expires: 365 })
  },
  analyticsAllowed() {
    return isCookieAllowed(COOKIES_ANALYTICS_COOKIE_NAME)
  }
}
