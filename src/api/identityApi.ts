import apiClient from '@/api/apiClient'

import { UserProfile } from '@/typings/userProfile'

const route = 'identity'

export const REFRESH_COOKIE_URL = `/${route}/refresh-cookie`

type UserProfileResponse = {
  errors?: Array<string>
  userProfile?: UserProfile
}

type BaseIdentityResponse = {
  success: boolean
  errors?: Array<string>
}

export default {
  register(userData: { email: string; password: string; recaptchaToken: string }) {
    return apiClient.post<UserProfileResponse>(`/${route}/register`, userData)
  },
  login(userData: { email: string; password: string; recaptchaToken: string }) {
    return apiClient.post<UserProfileResponse & { emailUnconfirmed?: boolean }>(`/${route}/login`, userData)
  },
  logout() {
    return apiClient.post(`/${route}/logout`)
  },
  facebookAuth(userData: { accessToken: string }) {
    return apiClient.post<UserProfileResponse>(`/${route}/social/facebook`, userData)
  },
  googleAuth(userData: { idToken: string }) {
    return apiClient.post<UserProfileResponse>(`/${route}/social/google`, userData)
  },
  refreshCookie() {
    return apiClient.post<UserProfileResponse>(REFRESH_COOKIE_URL)
  },
  profile() {
    return apiClient.get<UserProfileResponse>(`/${route}/profile`)
  },
  confirmEmail(data: { email: string; token: string }) {
    return apiClient.post<BaseIdentityResponse>(`/${route}/confirm-email`, data)
  },
  requestPasswordReset(data: { email: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(`/${route}/request-password-reset`, data)
  },
  resetPassword(data: { email: string; token: string; password: string; confirmPassword: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(`/${route}/reset-password`, data)
  },
  changePassword(data: { currentPassword: string; newPassword: string; newPasswordConfirmation: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(`/${route}/change-password`, data)
  },
  sendConfirmationEmail(data: { email: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(`/${route}/send-confirmation-email`, data)
  },
  deleteAccount(data: { recaptchaToken: string }) {
    return apiClient.delete<BaseIdentityResponse>(`/${route}/delete-account`, {
      params: data
    })
  }
}
