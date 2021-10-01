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

<script>
import dayjs from '@/functions/dayjs'

import { markRaw } from 'vue'
// import myKitchenApi from '@/api/myKitchenApi'
import NewExpirationDateModal from './NewExpirationDateModal'

export default {
  // emits: [update:],
  props: {
    productId: String,
    modelValue: [Array, null]
  },
  // beforeMount() {
  //   if (this.productId) {
  //     myKitchenApi.getProductExpirationDates(this.productId).then(response => {
  //       this.$emit('update:modelValue', response.data)
  //     })
  //   }
  // },
  computed: {
    expirationDateObjects() {
      return this.modelValue?.map(date => dayjs(date)).sort((a, b) => (a.isAfter(b) ? 1 : -1))
    }
  },
  methods: {
    isExpiredDate(date) {
      return date.isBefore(dayjs(), 'day')
    },
    formattedExpirationDate(date) {
      return date.format('D MMMM YYYY')
    },
    deleteExpirationDateAt(index) {
      const newDates = [...this.modelValue]
      newDates.splice(index, 1)
      this.$emit('update:modelValue', newDates)
    },
    openNewExpirationDateModal() {
      const self = this

      this.$modal.show(
        markRaw(NewExpirationDateModal),
        {},
        {
          close: date => {
            if (!date) return
            const { year, month, day } = date
            const newDates = [...self.modelValue]
            newDates.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)
            self.$emit('update:modelValue', newDates)
          }
        }
      )
    }
  }
}
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
