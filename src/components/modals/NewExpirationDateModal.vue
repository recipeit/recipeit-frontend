<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Nowa data ważności</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit="addExpirationDate($event)" class="form-columns">
        <BaseSelect
          :searchable="false"
          placeholder="Rok"
          :value="yearValue"
          @change="yearOnChange"
          @blur="yearOnBlur"
          :errors="yearErrors"
          :options="years"
        />
        <BaseSelect
          :searchable="false"
          placeholder="Miesiąc"
          :value="monthValue"
          @change="monthOnChange"
          @blur="monthOnBlur"
          :errors="monthErrors"
          :options="months"
        />
        <BaseSelect
          :searchable="false"
          placeholder="Dzień"
          :value="dayValue"
          @change="dayOnChange"
          @blur="dayOnBlur"
          :errors="dayErrors"
          :options="days"
        />
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="primary" type="submit" :form="formID">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addExpirationDate') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import dayjs from '@/functions/dayjs'
import uniqueID from '@/functions/uniqueID'
import { computed } from 'vue'

export default {
  emits: ['close'],
  setup(props, { emit }) {
    const formID = 'form-' + uniqueID().getID()
    const currentYear = dayjs().year()

    const myForm = useForm({
      initialValues: {
        year: currentYear
      }
    })
    const { value: yearValue, errors: yearErrors, handleBlur: yearOnBlur, handleChange: yearOnChange } = useField(
      'year',
      Yup.number()
        .required('REQUIRED')
        .typeError('REQUIRED'),
      { myForm }
    )
    const { value: monthValue, errors: monthErrors, handleBlur: monthOnBlur, handleChange: monthOnChange } = useField(
      'month',
      Yup.number()
        .required('REQUIRED')
        .typeError('REQUIRED'),
      { myForm }
    )
    const { value: dayValue, errors: dayErrors, handleBlur: dayOnBlur, handleChange: dayOnChange } = useField(
      'day',
      Yup.number().nullable(),
      {
        myForm
      }
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

// .error {
//   margin-top: 1rem;
//   font-size: 0.75rem;
//   color: var(--color-red);
// }
</style>
