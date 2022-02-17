import { string as yupString, ref as yupRef } from 'yup'

export const emailSchema = () => yupString().required('REQUIRED').email('INVALID_EMAIL')

export const passwordSchema = () => yupString().required('REQUIRED')

export const newPasswordSchema = () =>
  yupString()
    .min(6, 'REQUIRED_AT_LEAST_6_CHAR')
    .matches(/^(?=.*[a-z])/, 'REQUIRED_AT_LEAST_ONE_LOWER')
    .matches(/^(?=.*[A-Z])/, 'REQUIRED_AT_LEAST_ONE_UPPER')
    .matches(/^(?=.*[0-9])/, 'REQUIRED_AT_LEAST_ONE_DIGIT')
    .matches(/^(?=.*[!@#$%^&*])/, 'REQUIRED_AT_LEAST_ONE_NON_ALPHANUM')
    .required('REQUIRED')

export const confirmNewPasswordSchema = (passwordFieldName: string) =>
  yupString()
    .oneOf([yupRef(passwordFieldName), null], 'WRONG_PASSWORD_COMBINATION')
    .required('REQUIRED')
