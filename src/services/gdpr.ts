import Cookies from 'js-cookie'

import { COOKIES_ANALYTICS_COOKIE_NAME, COOKIES_MESSAGE_COOKIE_NAME } from '@/configs/cookies'

import AnalyticsService from '@/services/analytics'

const GDPR_OPTIONS = [COOKIES_ANALYTICS_COOKIE_NAME]

const detectRobot = (userAgent: NavigatorID['userAgent']) => {
  const robots = new RegExp(
    [
      /bot/,
      /spider/,
      /crawl/, // GENERAL TERMS
      /APIs-Google/,
      /AdsBot/,
      /Googlebot/, // GOOGLE ROBOTS
      /Lighthouse/,
      /mediapartners/,
      /Google Favicon/,
      /FeedFetcher/,
      /Google-Read-Aloud/,
      /DuplexWeb-Google/,
      /googleweblight/,
      /bing/,
      /yandex/,
      /baidu/,
      /duckduck/,
      /yahoo/, // OTHER ENGINES
      /ecosia/,
      /ia_archiver/,
      /facebook/,
      /instagram/,
      /pinterest/,
      /reddit/, // SOCIAL MEDIA
      /slack/,
      /twitter/,
      /whatsapp/,
      /youtube/,
      /semrush/ // OTHER
    ]
      .map(r => r.source)
      .join('|'),
    'i'
  ) // BUILD REGEXP + "i" FLAG

  return robots.test(userAgent)
}

const data = {
  acceptedCookies: null,
  initialized: false
}

const setGDPRCookie = (cookieName: string, value: string | object) => {
  if (value === 'true') {
    if (!GDPR_OPTIONS.includes(cookieName)) return
    Cookies.set(cookieName, value, { expires: 365 })

    if (!data.acceptedCookies.includes(cookieName)) {
      data.acceptedCookies.push(cookieName)

      if (cookieName === COOKIES_ANALYTICS_COOKIE_NAME) {
        AnalyticsService.init()
      }
    }
  } else {
    Cookies.remove(cookieName)
    const index = data.acceptedCookies.indexOf(cookieName)
    if (index >= 0) {
      data.acceptedCookies.splice(index, 1)
    }
  }
}

const isCookieAllowed = (cookieName: string) => {
  return data.acceptedCookies.includes(cookieName)
}

export default {
  init() {
    if (data.initialized) {
      return
    }

    data.acceptedCookies = GDPR_OPTIONS.filter(cookieName => Cookies.get(cookieName) === 'true') || []
    data.initialized = true

    if (this.analyticsAllowed()) {
      AnalyticsService.init()
    }
  },

  getAvailableCookies() {
    return GDPR_OPTIONS
  },

  getAcceptedCookies() {
    this.init()
    return data.acceptedCookies
  },

  acceptAll() {
    GDPR_OPTIONS.forEach(cookieName => {
      setGDPRCookie(cookieName, 'true')
    })
    this.setGDPRModalShowed()
  },

  acceptSelected(allowedCookies: Array<string>) {
    GDPR_OPTIONS.forEach(cookieName => {
      const allowed = allowedCookies.includes(cookieName)
      setGDPRCookie(cookieName, allowed.toString().toLowerCase())
    })
    this.setGDPRModalShowed()
  },

  showGDPRModal() {
    const isRobot = detectRobot(navigator.userAgent)

    return Cookies.get(COOKIES_MESSAGE_COOKIE_NAME) !== 'true' && !isRobot
  },

  setGDPRModalShowed() {
    Cookies.set(COOKIES_MESSAGE_COOKIE_NAME, 'true', { expires: 365 })
  },

  analyticsAllowed() {
    return isCookieAllowed(COOKIES_ANALYTICS_COOKIE_NAME)
  }
}
