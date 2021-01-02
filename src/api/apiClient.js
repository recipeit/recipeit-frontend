import axios from 'axios'

export const apiClient = axios.create({
  baseURL:
    // process.env.NODE_ENV === 'production'
    //   ? 'https://recipeit-backend20201105000045.azurewebsites.net'
    //   : 'https://localhost:44388',
    // 'https://localhost:44388',
    'https://recipeit-backend20201105000045.azurewebsites.net',
  withCredentials: false,
  headers: {
    // Accept: 'application/json',
    Accept: '*/*',
    'Content-Type': 'application/json'
  }
})
