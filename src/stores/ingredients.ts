import groupby from 'lodash.groupby'
import sortby from 'lodash.sortby'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'

import ingredientsApi from '@/api/ingredientsApi'

import { PRODUCT_CATEGORY_ORDER } from '@/configs/productCategories'

import { BaseProductEntity } from '@/typings/entities'
import { UnitGroup } from '@/typings/units'

type IngredientsStoreState = {
  baseProducts: Array<BaseProductEntity>
  units: Array<UnitGroup>
}

export const useIngredientsStore = defineStore('ingredients', () => {
  // state
  const state = reactive<IngredientsStoreState>({
    baseProducts: null,
    units: null
  })

  // actions
  const fetchBaseProducts = async () => {
    if (state.baseProducts) return

    const { data: baseIngredients } = await ingredientsApi.getAllBaseProducts()

    state.baseProducts = baseIngredients
  }

  const fetchUnitsGroupedByMeasurement = async () => {
    if (state.units) return

    const { data: unitGroups } = await ingredientsApi.getAllUnitKeysGroupedByMeasurement()

    state.units = unitGroups
  }

  // getters
  const groupedBaseProducts = computed(() => {
    const sorted = sortby(state.baseProducts, 'baseProductName')
    const grouped = groupby(sorted, 'category')
    const sortedGroups = sortby(Object.entries(grouped), ([group]) => PRODUCT_CATEGORY_ORDER[group])

    return sortedGroups.map(([groupKey, groupValues]) => ({
      groupKey,
      groupValues
    }))
  })

  return {
    //state
    ...toRefs(state),
    // actions
    fetchBaseProducts,
    fetchUnitsGroupedByMeasurement,
    // getters
    groupedBaseProducts
  }
})
