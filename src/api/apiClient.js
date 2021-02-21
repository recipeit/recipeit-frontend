import { STORAGE_TOKEN } from '@/constants'
import axios from 'axios'
import IdentityService from '@/services/identity'
// import identityApi from './identityApi'

// const baseURL = 'https://localhost:44388'
const baseURL = 'https://recipeit-backend20201105000045.azurewebsites.net'

const apiClient = axios.create({
  baseURL,
  // process.env.NODE_ENV === 'production'
  withCredentials: false,
  headers: {
    // Accept: 'application/json',
    Accept: '*/*',
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.response.use(
  response => response,
  async error => {
    // console.log('error', error)
    const originalRequest = error.config
    // console.log('originalRequest', originalRequest)

    // Prevent infinite loops
    if (error.response.status === 401 && originalRequest.url === baseURL + '/identity/refresh/') {
      // console.log('Prevent infinite')
      // window.location.href = '/login/'
      return Promise.reject(error)
    }

    if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
      try {
        // console.log('bedzie refresh')
        var refreshed = await IdentityService.refresh()

        if (!refreshed) {
          // console.log('to ja sobie poczekam', originalRequest)
          await new Promise(r => setTimeout(r, 500))
        }
        const token = localStorage.getItem(STORAGE_TOKEN)
        originalRequest.headers['Authorization'] = 'Bearer ' + token
        return apiClient(originalRequest)
      } catch (error) {
        console.error(error)
      }

      // if (refreshToken) {
      //   console.log('refreshToken')
      //   return apiClient
      //     .post('identity/refresh', { token, refreshToken })
      //     .then(response => {
      //       const { token, refreshToken } = response.data
      //       localStorage.setItem(STORAGE_TOKEN, token)
      //       localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
      //       // apiClient.defaults.headers['Authorization'] = 'JWT ' + response.data.access
      //       originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access
      //       return apiClient(originalRequest)
      //     })
      //     .catch(err => {
      //       console.log(err)
      //     })
      // } else {
      //   console.log('NOT refreshToken')
      //   // console.log('Refresh token not available.')
      //   // window.location.href = '/login/'
      // }
    }

    // specific error handling done elsewhere
    return Promise.reject(error)
  }
)

export default {
  apiClient,
  authHeader: function() {
    const token = localStorage.getItem(STORAGE_TOKEN)

    if (token) {
      return { Authorization: 'Bearer ' + token }
    } else {
      return {}
    }
  }
}
