import * as Sentry from '@sentry/browser'
import axios from 'axios'

import { IDENTITY_URLS } from '@/src/api/identityApi'

import { API_DEV_BASE_URL_SSL, API_PROD_BASE_URL } from '@/src/configs/api'

import store from '@/src/store'

const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? API_DEV_BASE_URL_SSL : API_DEV_BASE_URL_SSL,
  withCredentials: true,
  timeout: 15000, // 15 seconds
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

let subscribers = []

apiClient.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config

    // Prevent infinite loops
    if (error.response?.status === 401 && originalRequest.url.includes(IDENTITY_URLS.REFRESH_COOKIE)) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      store
        .dispatch('user/refreshCookie')
        .then(response => {
          if (response?.isFetching !== true) {
            onRefreshed(true)
            // subscribers = []
          }
        })
        .catch(() => {
          onRefreshed(false)
          // subscribers = []
          // Sentry.captureException(error)
        })

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(success => {
          if (success) {
            resolve(apiClient(originalRequest))
          } else {
            reject()
            // Sentry.captureException(error)
          }
        })
      })
    }

    Sentry.captureException(error)

    // specific error handling done elsewhere
    return Promise.reject(error)
  }
)

function subscribeTokenRefresh(cb) {
  subscribers.push(cb)
}

function onRefreshed(success) {
  subscribers.map(cb => cb(success))
  subscribers = []
}

export default apiClient
