import identityApi from '@/api/identityApi'
import { STORAGE_REFRESH_TOKEN, STORAGE_TOKEN } from '@/constants'
// import store from '@/store'
// import { dispatch } from 'vuex'

export class IdentityService {
  constructor() {
    this.refreshing = false
  }
  // test() {
  //   console.log(store.getters)
  //   return store.getters
  // }

  register({ email, password, confirmPassword }) {
    identityApi
      .register({ email, password, confirmPassword })
      .then(response => {
        const { token, refreshToken } = response.data
        localStorage.setItem(STORAGE_TOKEN, token)
        localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
      })
      .catch(response => {
        const { errors } = response.data
        console.error(errors)
      })
  }

  login({ email, password }, dispatch) {
    identityApi
      .login({ email, password })
      .then(response => {
        // console.log(response)
        const { token, refreshToken, userProfile } = response.data
        localStorage.setItem(STORAGE_TOKEN, token)
        localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
        // console.log('userProfile', userProfile)
        // console.log('dispatch', dispatch)
        dispatch('user/setUserProfile', userProfile)
      })
      .catch(response => {
        // console.log('catch', response)
        const { errors } = response.data
        console.error(errors)
      })
  }

  async refresh(dispatch) {
    if (this.refreshing) return false

    const currentToken = localStorage.getItem(STORAGE_TOKEN)
    const currentRefreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN)

    try {
      this.refreshing = true
      const { data } = await identityApi.refresh({ token: currentToken, refreshToken: currentRefreshToken })
      const { token, refreshToken, userProfile } = data
      localStorage.setItem(STORAGE_TOKEN, token)
      localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
      if (dispatch) {
        dispatch('user/setUserProfile', userProfile)
      }
      // console.log('try end')
      return true
    } catch (error) {
      const { errors } = error.data
      console.error(errors)
    } finally {
      // console.log('finally')
      this.refreshing = false
    }
  }

  logout(dispatch) {
    localStorage.removeItem(STORAGE_TOKEN)
    localStorage.removeItem(STORAGE_REFRESH_TOKEN)
    dispatch('user/setUserProfile', null)
  }
}

export default new IdentityService()
