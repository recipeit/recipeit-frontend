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
        .then(() => {
          onRefreshed(true)
          subscribers = []
        })
        .catch(() => {
          // TOOD JEST PĘTLA WYWOŁYWAŃ
          onRefreshed(false)
          subscribers = []
        })
      // if (!store.getters['user/isUserTokenRefreshing']) {
      //   store.dispatch('user/setTokenRefreshing', true)
      //   identityApi
      //     .refreshCookie()
      //     .then(({ status }) => {
      //       if (status === 200 || status == 204) {
      //         onRefreshed()
      //       }
      //       subscribers = []
      //     })
      //     .catch(error => {
      //       // todo logout only when api error, not when there is no token
      //       if (error) {
      //         store.dispatch('user/logout')
      //       }
      //     })
      //     .finally(() => {
      //       store.dispatch('user/setTokenRefreshing', false)
      //     })
      // }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(success => {
          console.log('success', success)
          if (success) {
            resolve(apiClient(originalRequest))
          } else {
            // reject(apiClient(originalRequest))
            reject()
          }
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

function onRefreshed(success) {
  subscribers.map(cb => cb(success))
}

export default apiClient
