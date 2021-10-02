<template>
  <SheetModalContent>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zaplanuj przepis</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" :validation-schema="schema" :initial-values="initialValues" class="form-columns" @submit="planRecipe($event)">
        <Field v-slot="{ field, errors }" name="day">
          <BaseSelect
            :searchable="false"
            placeholder="Dzień"
            :errors="errors"
            :options="days"
            v-bind="field"
            track-by="value"
            label="label"
          />
        </Field>
        <Field v-slot="{ field, errors }" name="timeOfDay">
          <BaseSelect :searchable="false" placeholder="Pora dnia" v-bind="field" :errors="errors" :options="timesOfDay">
            <template #label="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
            <template #option="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
          </BaseSelect>
        </Field>
      </Form>
      <div v-for="(error, i) in errorList" :key="i" class="error">
        {{ error }}
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="primary" type="submit" :form="formID" :loading="sending">
        <BaseIcon class="submit-button__icon" icon="clock" weight="semi-bold" />
        {{ $t('shared.planRecipe') }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script>
import { Field, Form } from 'vee-validate'
import { reactive, ref } from 'vue'
import * as Yup from 'yup'

import timesOfDayConst from '@/constants/timesOfDay'

import dayjs from '@/functions/dayjs'
import uniqueID from '@/functions/uniqueID'

export default {
  components: {
    Field,
    Form
  },
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup() {
    const formID = 'form-' + uniqueID().getID()
    const timesOfDay = Object.keys(timesOfDayConst)

    const today = dayjs()
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = today.add(i, 'days')
      return {
        value: day.format('YYYY-MM-DD'),
        label: day.calendar()
      }
    })
    const initialValues = {
      day: days[0],
      timeOfDay: timesOfDay[0]
    }
    const errorList = reactive(null)
    const schema = Yup.object({
      day: Yup.object()
        .required('REQUIRED')
        .typeError('REQUIRED'),
      timeOfDay: Yup.string()
        .required('REQUIRED')
        .typeError('REQUIRED')
    })

    const sending = ref(false)

    return {
      formID,
      days,
      timesOfDay,
      initialValues,
      errorList,
      sending,
      schema
    }
  },
  methods: {
    planRecipe({ day, timeOfDay }) {
      this.sending = true
      this.errorList = null

      const preparedData = {
        recipeId: this.recipeId,
        day: day.value,
        timeOfDay: timeOfDay
      }

      this.$store
        .dispatch('recipes/addRecipeToPlanned', preparedData)
        .then(({ data }) => {
          if (data.success) {
            this.$emit('close')
          } else {
            this.errorList = data.errors || ['coś poszło nie tak']
          }
        })
        .catch(error => {
          const responseErrors = error.response?.data?.errors
          this.errorList = responseErrors || ['coś poszło nie tak']
        })
        .finally(() => {
          this.sending = false
        })
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

.error {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--color-red);
}
</style>
