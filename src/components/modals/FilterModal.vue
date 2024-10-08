<template>
  <SheetModalContent class="filter-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>{{ $t('filterModal.title') }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div class="filters">
        <div class="filter__group">
          <BaseSelect
            placeholder="Sortuj wg."
            class="form-row"
            :value="orderSelected"
            :options="orderOptions"
            :searchable="false"
            @change="orderSelectedChanged($event)"
          >
            <template #label="{ option }">{{ $t(`recipesSortingMethods.${option}`) }}</template>
            <template #option="{ option }">{{ $t(`recipesSortingMethods.${option}`) }}</template>
          </BaseSelect>
        </div>
        <div v-for="(group, groupValue) in options" :key="groupValue" class="filter__group">
          <div :class="{ filter__group__title: true, 'filter__group__title--no-margin': groupValue === OPTION_KEYS.BASE_PRODUCTS }">
            <div class="filter__group__name">{{ $t(`recipeFilterGroups.${groupValue}`) }}</div>
            <transition name="fade">
              <BaseLink
                v-if="selected[groupValue] && selected[groupValue].length > 0"
                tag="button"
                color="primary"
                class="filter__group__clear"
                @click.stop="clearFilterGroup(groupValue)"
              >
                wyczyść
              </BaseLink>
            </transition>
          </div>
          <div v-if="groupValue === OPTION_KEYS.BASE_PRODUCTS">
            <BaseSelect
              placeholder="Dodaj składnik"
              multi-placeholder="dodaj kolejny składnik"
              class="form-row"
              track-by="id"
              search-by="variants"
              label="name"
              default-open-direction="above"
              :options="groupedBaseProducts"
              :multiple="true"
              :searchable="true"
              :limit="1000"
              :value="selected[OPTION_KEYS.BASE_PRODUCTS]"
              group-label="groupKey"
              group-values="groupValues"
              @click.stop
              @change="selected[OPTION_KEYS.BASE_PRODUCTS] = $event"
            >
              <template #groupLabel="{ label }">
                <span class="category-group">
                  <ProductIcon class="category-group-icon" :group="label" />
                  {{ $t(`productCategory.${label}`) }}
                </span>
              </template>
            </BaseSelect>
          </div>
          <div v-else class="filter__group__options">
            <BasePillCheckbox
              v-for="option in orderedGroupOptions(groupValue)"
              :key="option.value"
              v-model="selected[groupValue]"
              :value="option.key"
              :excluding="group.type === 'None'"
              class="filter__group__option"
              @click="pillCheckboxClickHandler($event)"
            >
              {{
                RecipeCategoryGroups.find(validGroup => validGroup === groupValue)
                  ? $t(`recipeCategory.${option.value}`).replace('Kuchnia ', '')
                  : $t(`recipeFilterOptions.${groupValue}.${option.value}`)
              }}
            </BasePillCheckbox>
          </div>
        </div>
      </div>
    </BaseModalBody>
    <BaseModalFooter :sticky="true">
      <BaseButton class="submit-button" stroked color="white" @click="$emit('close')">
        {{ $t('filterModal.cancelButton') }}
      </BaseButton>
      <BaseButton class="submit-button" raised color="primary" @click="submit">
        {{ $t('filterModal.submitButton') }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import sortby from 'lodash.sortby'
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue'

import { RecipeCategoryGroups } from '@/constants/recipeCategories'

import { useIngredientsStore } from '@/stores/ingredients'

import { RecipeFilterGroup, RecipeFilterOptions, RecipeSortingOptions } from '@/typings/recipeFilters'

import ProductIcon from '@/components/ProductIcon.vue'

const OPTION_KEYS = {
  BASE_PRODUCTS: 'BaseProducts'
}

export default defineComponent({
  components: {
    ProductIcon
  },

  props: {
    options: {
      type: Object as PropType<RecipeFilterOptions>,
      required: true
    },
    orderOptions: {
      type: Object as PropType<RecipeSortingOptions>,
      required: true
    },
    defaultSelected: {
      type: Object
    },
    defaultOrderSelected: {
      type: String
    }
  },

  emits: ['close'],

  setup(props, { emit }) {
    // usings
    const ingredientsStore = useIngredientsStore()

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { [OPTION_KEYS.BASE_PRODUCTS]: defaultSelectedBaseProductIds, ...rest } = props.defaultSelected

    // data
    const data = reactive({
      selectedTheme: [],
      selected: {
        ...Object.fromEntries(Object.keys(props.options).map(o => [o, []])),
        ...rest,
        [OPTION_KEYS.BASE_PRODUCTS]: defaultSelectedBaseProductIds?.map(id => ingredientsStore.baseProducts?.find(p => p.id === id)) || []
      },
      orderSelected: props.defaultOrderSelected
    })

    // computed
    const groupedBaseProducts = computed(() => ingredientsStore.groupedBaseProducts)

    // methods
    const submit = () => {
      const { [OPTION_KEYS.BASE_PRODUCTS]: selectedBaseProducts, ...restSelected } = data.selected

      emit('close', {
        selected: {
          ...restSelected,
          [OPTION_KEYS.BASE_PRODUCTS]: selectedBaseProducts.map(p => p.id)
        },
        orderSelected: data.orderSelected
      })
    }

    const clearFilterGroup = groupValue => {
      data.selected[groupValue] = []
    }

    const orderSelectedChanged = newValue => {
      data.orderSelected = newValue || props.defaultOrderSelected
    }

    const orderedGroupOptions = (groupKey: RecipeFilterGroup) => {
      const options = props.options[groupKey]?.options
      const defaultSelectedIds = props.defaultSelected[groupKey]
      if (options) {
        return sortby(options, o => {
          return !defaultSelectedIds?.includes(o.key)
        })
      }
      return []
    }

    const pillCheckboxClickHandler = () => {
      // TODO zeby nie scrollowało wertykalnie
      // setTimeout(() => {
      //   target?.scrollIntoView({
      //     behavior: 'smooth'
      //   })
      // }, 500)
    }

    return {
      // consts
      OPTION_KEYS,
      RecipeCategoryGroups,
      // data
      ...toRefs(data),
      // computed
      groupedBaseProducts,
      // methods
      submit,
      clearFilterGroup,
      orderSelectedChanged,
      orderedGroupOptions,
      pillCheckboxClickHandler
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-modal {
  .category-group {
    display: flex;
    align-items: center;
  }

  .category-group-icon {
    margin-right: 0.5rem;
    font-size: 1.25rem;
  }

  .test-multiselect-pills {
    margin: -4px;
  }

  .test-multiselect-pill {
    height: 28px;
    padding: 0 12px;
    margin: 4px;

    &-close {
      margin-left: 4px;
      margin-right: -4px;
      font-size: 0.875rem;
    }
  }

  .submit-button {
    width: 100%;

    &__icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }

  .filter {
    &__group {
      &:not(:first-child) {
        margin-top: 24px;
      }

      &__title {
        display: flex;
        font-size: 12px;
        position: relative;
        font-weight: 600;
        margin-bottom: 12px;

        &--no-margin {
          margin-bottom: 0;
        }
      }

      &__name {
        color: var(--color-text-secondary);
        // font-weight: bold;
      }

      &__clear {
        margin-left: auto;
      }

      &__option {
        flex-shrink: 0;

        &:not(:first-child) {
          margin-left: 12px;

          @include cursor-only {
            margin-left: 0;
          }
        }
      }

      &__options {
        display: flex;
        flex-wrap: wrap;
        // gap: 12px;
        flex-wrap: nowrap;
        overflow: auto;
        margin: 0 -32px;

        &::before,
        &::after {
          content: '';
          width: 32px;
          flex-shrink: 0;
        }

        @include cursor-only {
          flex-wrap: wrap;
          overflow: initial;
          margin: 0;
          gap: 12px;

          &::before,
          &::after {
            content: none;
          }
        }
      }
    }
  }
}
</style>
