import axios from 'axios'
import store from '@/store'
import { API_DEV_BASE_URL_SSL, API_PROD_BASE_URL } from '@/configs/api'

const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? API_PROD_BASE_URL : API_DEV_BASE_URL_SSL,
  withCredentials: true,
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
    if (error.response?.status === 401 && originalRequest.url.includes('/identity/refresh-cookie')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      store
        .dispatch('user/refreshCookie')
        .then(response => {
          if (response?.isFetching !== true) {
            onRefreshed(true)
            subscribers = []
          }
        })
        .catch(() => {
          subscribers = []
        })

      return new Promise(resolve => {
        subscribeTokenRefresh(() => {
          resolve(apiClient(originalRequest))
        })
      })
    }

    // specific error handling done elsewhere
    return Promise.reject(error)
  }
)

function subscribeTokenRefresh(cb) {
  subscribers.push(cb)
}

function onRefreshed() {
  subscribers.map(cb => cb())
}

export default apiClient
