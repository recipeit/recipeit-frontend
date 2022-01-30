<template>
  <SheetModalContent class="new-expiration-date-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Nowa data ważności</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" class="form-columns" @submit="addExpirationDate($event)">
        <BaseSelect
          :searchable="false"
          placeholder="Rok"
          :value="yearValue"
          :errors="yearErrors"
          :options="years"
          @change="yearOnChange"
          @blur="yearOnBlur"
        />
        <BaseSelect
          :searchable="false"
          placeholder="Miesiąc"
          :value="monthValue"
          :errors="monthErrors"
          :options="months"
          @change="monthOnChange"
          @blur="monthOnBlur"
        />
        <BaseSelect
          :searchable="false"
          placeholder="Dzień"
          :value="dayValue"
          :errors="dayErrors"
          :options="days"
          @change="dayOnChange"
          @blur="dayOnBlur"
        />
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="primary" type="submit" :form="formID">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addExpirationDate') }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { useField, useForm } from 'vee-validate'
import { computed, defineComponent } from 'vue'
import * as Yup from 'yup'

import dayjs from '@/functions/dayjs'
import uniqueID from '@/functions/uniqueID'

type ExpirationDateForm = {
  year: number
  month: number
  day?: number
}

export default defineComponent({
  emits: ['close'],

  setup(_, { emit }) {
    const formID = 'form-' + uniqueID().getID()
    const currentYear = dayjs().year()

    const myForm = useForm<ExpirationDateForm>({
      initialValues: {
        year: currentYear,
        month: null
      }
    })
    const { value: yearValue, errors: yearErrors, handleBlur: yearOnBlur, handleChange: yearOnChange } = useField(
      'year',
      Yup.number()
        .required('REQUIRED')
        .typeError('REQUIRED')
    )
    const { value: monthValue, errors: monthErrors, handleBlur: monthOnBlur, handleChange: monthOnChange } = useField(
      'month',
      Yup.number()
        .required('REQUIRED')
        .typeError('REQUIRED')
    )
    const { value: dayValue, errors: dayErrors, handleBlur: dayOnBlur, handleChange: dayOnChange } = useField(
      'day',
      Yup.number().nullable()
    )

    const years = Array.from({ length: 15 }, (_, i) => i + currentYear)
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const days = computed(() => {
      const { year, month } = myForm.values
      if (!year || !month) return []

      const monthDays = dayjs(new Date(year, month - 1, 1)).daysInMonth()
      return Array.from({ length: monthDays }, (_, i) => i + 1)
    })

    const addExpirationDate = myForm.handleSubmit(values => {
      let date = { ...values }

      if (!date.day) date.day = 1

      emit('close', date)
    })

    return {
      myForm,
      yearValue,
      yearErrors,
      yearOnBlur,
      yearOnChange,
      monthValue,
      monthErrors,
      monthOnBlur,
      monthOnChange,
      dayValue,
      dayErrors,
      dayOnBlur,
      dayOnChange,
      formID,
      years,
      months,
      days,
      addExpirationDate
    }
  }
})
</script>

<style lang="scss" scoped>
.new-expiration-date-modal {
  .submit-button {
    width: 100%;
  }

  .amount-input {
    width: 128px;
    flex: unset;
  }
}
</style>
