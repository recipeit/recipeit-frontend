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

apiClient.interceptors.request.use(request => {
  request.headers = {
    // ...authHeader(),
    ...request.headers
  }
  return request
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config

    // Prevent infinite loops
    if (error.response?.status === 401 && originalRequest.url.includes('/identity/refresh')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      console.log(store)
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

        // store
        //   .dispatch('user/refresh')
        //   .then(({ status }) => {
        //     if (status === 200 || status == 204) {
        //       isRefreshing = false
        //       onRefreshed()
        //     }
        //     subscribers = []
        //   })
        //   .catch(error => {
        //     // todo logout only when api error, not when there is no token
        //     if (error) {
        //       // toastPlugin.toast.show('Wystąpił nieoczekiwany błąd', ToastType.ERROR)
        //       store.dispatch('user/logout')
        //     }
        //   })
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
    // toastPlugin.toast.show('Wystąpił nieoczekiwany błąd', ToastType.ERROR)
    return Promise.reject(error)
  }
)

function subscribeTokenRefresh(cb) {
  subscribers.push(cb)
}

function onRefreshed() {
  subscribers.map(cb => cb())
}

// function authHeader() {
//   const token = localStorage.getItem(STORAGE_TOKEN)

//   if (token) {
//     return { Authorization: 'Bearer ' + token }
//   } else {
//     return {}
//   }
// }

export default apiClient
