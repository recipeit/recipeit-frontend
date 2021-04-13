<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zaplanuj przepis</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" @submit="planRecipe($event)" :validation-schema="schema" :initial-values="initialValues" class="form-columns">
        <Field name="day" v-slot="{ field, errors }">
          <BaseSelect
            :searchable="false"
            placeholder="Dzień"
            :errors="errors"
            :options="days"
            v-bind="field"
            trackBy="value"
            label="label"
          />
        </Field>
        <Field name="timeOfDay" v-slot="{ field, errors }">
          <BaseSelect :searchable="false" placeholder="Pora dnia" v-bind="field" :errors="errors" :options="timesOfDay">
            <template #label="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
            <template #option="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
          </BaseSelect>
        </Field>
      </Form>
      <div v-for="(error, i) in errors" :key="i" class="error">
        {{ error }}
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="contrast" type="submit" :form="formID">
        <BaseIcon class="submit-button__icon" icon="clock" weight="semi-bold" />
        {{ $t('shared.planRecipe') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import * as Yup from 'yup'
import { Field, Form } from 'vee-validate'
import uniqueID from '@/functions/uniqueID'
import dayjs from '@/functions/dayjs'
import timesOfDayConst from '@/constants/timesOfDay'
import { reactive } from 'vue'

export default {
  emits: ['close'],
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
    const errors = reactive(null)
    const schema = Yup.object().shape({
      day: Yup.object()
        .required('REQUIRED')
        .typeError('REQUIRED'),
      timeOfDay: Yup.string()
        .required('REQUIRED')
        .typeError('REQUIRED')
    })

    return {
      formID,
      days,
      timesOfDay,
      initialValues,
      errors,
      schema
    }
  },
  methods: {
    planRecipe(values) {
      this.errors = null

      const preparedData = {
        recipeId: this.recipeId,
        day: values.day.value,
        timeOfDay: values.timeOfDay
      }

      this.$store
        .dispatch('recipes/addRecipeToPlanned', preparedData)
        .then(({ data }) => {
          if (data.success) {
            this.$emit('close')
          } else {
            this.errors = data.errors || ['coś poszło nie tak']
          }
        })
        .catch(error => {
          const responseErrors = error.response?.data?.errors
          this.errors = responseErrors || ['coś poszło nie tak']
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
