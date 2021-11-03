import apiClient from '@/src/api/apiClient'

const route = 'ingredients'

export default {
  getAllBaseProducts() {
    return apiClient.get(`/${route}/base-ingredients`)
  },
  getAllUnitKeysGroupedByMeasurement() {
    return apiClient.get(`/${route}/units/keys/by-measurement`)
  }
}
