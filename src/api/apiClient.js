// import { STORAGE_TOKEN } from '@/constants'
import axios from 'axios'
import store from '@/store'
import identityApi from './identityApi'
// import toastPlugin from '@/plugins/toast'
// import { ToastType } from '@/plugins/toast/toastType'

// process.env.NODE_ENV === 'production'
// const baseURL = 'https://localhost:44388'
const baseURL = 'https://recipeit-backend20201105000045.azurewebsites.net'

const apiClient = axios.create({
  baseURL,
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
    if (error.response?.status === 401 && originalRequest.url.includes('/identity/refresh')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      if (!store.getters['user/isUserTokenRefreshing']) {
        store.dispatch('user/setTokenRefreshing', true)
        identityApi
          .refreshCookie()
          .then(({ status }) => {
            if (status === 200 || status == 204) {
              onRefreshed()
            }
            subscribers = []
          })
          .catch(error => {
            // todo logout only when api error, not when there is no token
            if (error) {
              store.dispatch('user/logout')
            }
          })
          .finally(() => {
            store.dispatch('user/setTokenRefreshing', false)
          })
      }

      return new Promise(resolve => {
        subscribeTokenRefresh(() => {
          originalRequest.headers = {
            ...originalRequest.headers
            // ...authHeader()
          }
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
