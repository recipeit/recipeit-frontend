import apiClient from '@/api/apiClient'

import { BaseProductEntity } from '@/typings/entities'
import { UnitGroup } from '@/typings/units'

const route = 'ingredients'

export default {
  getAllBaseProducts() {
    return apiClient.get<Array<BaseProductEntity>>(`/${route}/base-ingredients`)
  },
  getAllUnitKeysGroupedByMeasurement() {
    return apiClient.get<Array<UnitGroup>>(`/${route}/units/keys/by-measurement`)
  }
}
