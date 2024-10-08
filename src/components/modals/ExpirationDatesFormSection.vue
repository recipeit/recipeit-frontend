<template>
  <div class="form-row">
    <div class="expiration-date-title">Daty ważności</div>
  </div>
  <div v-if="!(expirationDateObjects && expirationDateObjects.length === 0)" class="form-row">
    <div v-if="expirationDateObjects === null" class="expiration-date-list">
      <BaseButton v-for="i in 3" :key="i" class="expiration-date-list__item" subtle color="primary" size="small" />
    </div>
    <div v-else class="expiration-date-list">
      <BaseButton
        v-for="(date, index) in expirationDateObjects"
        :key="index"
        class="expiration-date-list__item"
        subtle
        :color="isExpiredDate(date) ? 'danger' : 'contrast'"
        size="small"
        @click.stop="deleteExpirationDateAt(index)"
      >
        {{ formattedExpirationDate(date) }}
        <BaseIcon class="expiration-date-list__item__icon" icon="close" weight="semi-bold" />
      </BaseButton>
    </div>
  </div>

  <div class="form-row">
    <BaseLink tag="button" color="primary" class="add-expiration-date-button" @click.prevent="openNewExpirationDateModal()">
      <BaseIcon class="add-expiration-date-button__icon" icon="plus" weight="semi-bold" />
      {{ expirationDateObjects && expirationDateObjects.length > 0 ? 'dodaj kolejną datę ważności' : 'dodaj datę ważności' }}
    </BaseLink>
  </div>
</template>

<script lang="ts">
import { Dayjs } from 'dayjs'
import { computed, defineComponent, markRaw, PropType } from 'vue'

import dayjs from '@/functions/dayjs'

import { ExpirationDateForm } from '@/typings/expirationDates'
import { DateYMDString } from '@/typings/dates'

import NewExpirationDateModal from '@/components/modals/NewExpirationDateModal.vue'
import { useModal } from '@/plugins/global-sheet-modal'

export default defineComponent({
  props: {
    productId: String,
    modelValue: {
      type: Array as PropType<Array<DateYMDString>>
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    // usings
    const modal = useModal()

    // computed
    const expirationDateObjects = computed(() => {
      return props.modelValue?.map(date => dayjs(date)).sort((a, b) => (a.isAfter(b) ? 1 : -1))
    })

    // methods

    const isExpiredDate = (date: Dayjs) => {
      return date.isBefore(dayjs(), 'day')
    }

    const formattedExpirationDate = (date: Dayjs) => {
      return date.format('D MMMM YYYY')
    }

    const deleteExpirationDateAt = (index: number) => {
      const newDates = [...props.modelValue]
      newDates.splice(index, 1)
      emit('update:modelValue', newDates)
    }

    const openNewExpirationDateModal = () => {
      modal.show(
        markRaw(NewExpirationDateModal),
        {},
        {
          close: (date: ExpirationDateForm) => {
            if (!date) return
            const newDates: Array<DateYMDString> = [
              ...props.modelValue,
              `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`
            ]
            emit('update:modelValue', newDates)
          }
        }
      )
    }

    return {
      // computed
      expirationDateObjects,
      // methods
      isExpiredDate,
      formattedExpirationDate,
      deleteExpirationDateAt,
      openNewExpirationDateModal
    }
  }
})
</script>

<style lang="scss" scoped>
.expiration-date-title {
  color: var(--color-text-secondary);
  font-size: 12px;
  // margin-bottom: -8px;
}

.add-expiration-date-button {
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;

  &__icon {
    margin-right: 4px;
  }
}

.expiration-date-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  &__item {
    font-weight: bold;
    padding: 0.625rem 1rem;
    height: 32px;

    &__icon {
      font-size: 1rem;
      margin-left: 4px;
      margin-right: -6px;
    }
  }
}
</style>
