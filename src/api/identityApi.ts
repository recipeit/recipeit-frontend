import apiClient from '@/api/apiClient'

import { UserProfile } from '@/typings/userProfile'

const route = 'identity'

export const IDENTITY_URLS = {
  REGISTER: `/${route}/register`,
  LOGIN: `/${route}/login`,
  LOGOUT: `/${route}/logout`,
  FACEBOOK_AUTH: `/${route}/social/facebook`,
  GOOGLE_AUTH: `/${route}/social/google`,
  REFRESH: `/${route}/refresh`,
  REFRESH_COOKIE: `/${route}/refresh-cookie`,
  PROFILE: `/${route}/profile`,
  CONFIRM_EMAIL: `/${route}/confirm-email`,
  REQUEST_PASSWORD_RESET: `/${route}/request-password-reset`,
  RESET_PASSWORD: `/${route}/reset-password`,
  CHANGE_PASSWORD: `/${route}/change-password`,
  SEND_CONFIRMATION_EMAIL: `/${route}/send-confirmation-email`,
  DELETE_ACCOUNT: `/${route}/delete-account`
}

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
    return apiClient.post<UserProfileResponse>(IDENTITY_URLS.REGISTER, userData)
  },
  login(userData: { email: string; password: string; recaptchaToken: string }) {
    return apiClient.post<UserProfileResponse & { emailUnconfirmed?: boolean }>(IDENTITY_URLS.LOGIN, userData)
  },
  logout() {
    return apiClient.post(IDENTITY_URLS.LOGOUT)
  },
  facebookAuth(userData: { accessToken: string }) {
    return apiClient.post<UserProfileResponse>(IDENTITY_URLS.FACEBOOK_AUTH, userData)
  },
  googleAuth(userData: { idToken: string }) {
    return apiClient.post<UserProfileResponse>(IDENTITY_URLS.GOOGLE_AUTH, userData)
  },
  refreshCookie() {
    return apiClient.post<UserProfileResponse>(IDENTITY_URLS.REFRESH_COOKIE)
  },
  profile() {
    return apiClient.get<UserProfileResponse>(IDENTITY_URLS.PROFILE)
  },
  confirmEmail(data: { email: string; token: string }) {
    return apiClient.post<BaseIdentityResponse>(IDENTITY_URLS.CONFIRM_EMAIL, data)
  },
  requestPasswordReset(data: { email: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(IDENTITY_URLS.REQUEST_PASSWORD_RESET, data)
  },
  resetPassword(data: { email: string; token: string; password: string; confirmPassword: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(IDENTITY_URLS.RESET_PASSWORD, data)
  },
  changePassword(data: { currentPassword: string; newPassword: string; newPasswordConfirmation: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(IDENTITY_URLS.CHANGE_PASSWORD, data)
  },
  sendConfirmationEmail(data: { email: string; recaptchaToken: string }) {
    return apiClient.post<BaseIdentityResponse>(IDENTITY_URLS.SEND_CONFIRMATION_EMAIL, data)
  },
  deleteAccount(data: { recaptchaToken: string }) {
    return apiClient.delete<BaseIdentityResponse>(IDENTITY_URLS.DELETE_ACCOUNT, data)
  }
}
