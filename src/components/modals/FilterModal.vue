<template>
  <sheet-modal-content>
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
            @change="orderSelectedChanged($event)"
            :options="orderOptions"
            :searchable="false"
          >
            <template #label="{ option }">{{ $t(`recipesSortingMethods.${option}`) }}</template>
            <template #option="{ option }">{{ $t(`recipesSortingMethods.${option}`) }}</template>
          </BaseSelect>
        </div>
        <div v-for="(group, groupValue) in options" :key="groupValue" class="filter__group">
          <div class="filter__group__title">
            <div class="filter__group__name">{{ $t(`recipeFilterGroups.${groupValue}`) }}</div>
            <transition name="fade">
              <BaseLink
                tag="button"
                color="primary"
                class="filter__group__clear"
                v-if="selected[groupValue] && selected[groupValue].length > 0"
                @click.stop="clearFilterGroup(groupValue)"
              >
                wyczyść
              </BaseLink>
            </transition>
          </div>
          <div v-if="groupValue === OPTION_KEYS.BASE_PRODUCTS">
            <div class="test-multiselect-pills">
              <BaseButton
                subtle
                class="test-multiselect-pill"
                color="primary"
                size="small"
                v-for="baseProduct in selected[groupValue]"
                :key="baseProduct.id"
                @click.stop="removeSelectedBaseProduct(baseProduct.id)"
              >
                {{ baseProduct.name }}
                <BaseIcon class="test-multiselect-pill-close" icon="close" weight="semi-bold" />
              </BaseButton>
            </div>
            <BaseSelect
              placeholder="Produkt"
              class="form-row"
              trackBy="id"
              label="name"
              defaultOpenDirection="above"
              :options="baseProducts"
              :limit="25"
              :searchable="true"
              @change="addSelectedBaseProduct($event)"
            />
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
              {{ $t(`recipeFilterOptions.${groupValue}.${option.value}`) }}
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
  </sheet-modal-content>
</template>

<script>
import _ from 'lodash'
import { computed, reactive, toRefs } from '@vue/runtime-core'
import { useStore } from 'vuex'

const OPTION_KEYS = {
  BASE_PRODUCTS: 'BaseProducts'
}

export default {
  emits: ['close'],
  props: {
    options: {
      type: Object,
      required: true
    },
    orderOptions: {
      type: Object,
      required: true
    },
    defaultSelected: {
      type: Object
    },
    defaultOrderSelected: {
      type: String
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const baseProducts = computed(() => store.state.ingredients.baseProducts)

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { [OPTION_KEYS.BASE_PRODUCTS]: defaultSelectedBaseProductIds, ...rest } = props.defaultSelected

    const data = reactive({
      selected: {
        ...Object.fromEntries(Object.keys(props.options).map(o => [o, []])),
        ...rest,
        [OPTION_KEYS.BASE_PRODUCTS]: defaultSelectedBaseProductIds?.map(id => baseProducts.value?.find(p => p.id === id)) || []
      },
      orderSelected: props.defaultOrderSelected
    })

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

    const addSelectedBaseProduct = product => {
      const productIndex = data.selected[OPTION_KEYS.BASE_PRODUCTS].findIndex(p => p.id === product.id)
      if (productIndex < 0) {
        data.selected[OPTION_KEYS.BASE_PRODUCTS].push(product)
      }
    }

    const removeSelectedBaseProduct = id => {
      const productIndex = data.selected[OPTION_KEYS.BASE_PRODUCTS].findIndex(p => p.id === id)
      if (productIndex >= 0) {
        data.selected[OPTION_KEYS.BASE_PRODUCTS].splice(productIndex, 1)
      }
    }

    const orderedGroupOptions = groupKey => {
      const options = props.options[groupKey]?.options
      const defaultSelectedIds = props.defaultSelected[groupKey]
      if (options) {
        return _.sortBy(options, o => {
          return !defaultSelectedIds?.includes(o.key)
        })
      }
      return []
    }

    const pillCheckboxClickHandler = ({ target }) => {
      setTimeout(() => {
        target?.scrollIntoView({
          behavior: 'smooth'
        })
      }, 500)
    }

    return {
      ...toRefs(data),
      baseProducts,
      submit,
      clearFilterGroup,
      orderSelectedChanged,
      addSelectedBaseProduct,
      removeSelectedBaseProduct,
      orderedGroupOptions,
      pillCheckboxClickHandler,
      OPTION_KEYS
    }
  }
}
</script>

<style lang="scss" scoped>
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
    & + & {
      margin-top: 24px;
    }

    &__title {
      display: flex;
      font-size: 12px;
      position: relative;
      font-weight: 600;
      margin-bottom: 12px;
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

      & + & {
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
</style>
