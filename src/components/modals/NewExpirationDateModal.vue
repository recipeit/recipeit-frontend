<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Nowa data ważności</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit.prevent="addExpirationDate()" class="form-columns">
        <BaseSelect :searchable="false" placeholder="Rok" v-model="date.year" :options="years"></BaseSelect>
        <BaseSelect :searchable="false" placeholder="Miesiąc" v-model="date.month" :options="months"></BaseSelect>
        <BaseSelect :searchable="false" placeholder="Dzień" v-model="date.day" :options="days"></BaseSelect>
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="contrast" type="submit" :form="formID">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addExpirationDate') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import dayjs from 'dayjs'
// import { units } from '@/constants'
// import { mapState } from 'vuex'
import uniqueID from '@/functions/uniqueID'

const currentYear = dayjs().year()

export default {
  emits: ['close'],
  data: () => ({
    date: {
      year: null,
      month: null,
      day: null
    },
    formID: 'form-' + uniqueID().getID(),
    years: Array.from({ length: 15 }, (_, i) => i + currentYear),
    months: Array.from({ length: 12 }, (_, i) => i + 1)
  }),
  beforeMount() {
    this.date.year = currentYear
  },
  computed: {
    days() {
      const { year, month } = this.date
      if (!year || !month) return []

      const monthDays = dayjs(new Date(year, month - 1, 1)).daysInMonth()
      return Array.from({ length: monthDays }, (_, i) => i + 1)
    }
  },
  methods: {
    addExpirationDate() {
      this.$emit('close', this.date)
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-button {
  width: 100%;

  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}

.amount-input {
  width: 128px;
  flex: unset;
}
</style>
