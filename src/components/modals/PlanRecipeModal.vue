<template>
  <SheetModalContent class="plan-recipe-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zaplanuj przepis</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" class="form-columns" @submit="onSubmit($event)">
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
          <BaseSelect :searchable="false" placeholder="Pora dnia" v-bind="field" :errors="errors" :options="TimesOfDay">
            <template #label="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
            <template #option="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
          </BaseSelect>
        </Field>
      </form>
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

<script lang="ts">
import { Field, useForm } from 'vee-validate'
import { defineComponent, reactive, toRefs } from 'vue'
import { object as yupObject, string as yupString } from 'yup'

import { TimesOfDay } from '@/constants/timesOfDay'

import dayjs from '@/functions/dayjs'
import uniqueID from '@/functions/uniqueID'

import { useRecipesStore } from '@/stores/recipes'

type Day = {
  value: string
  label: string
}

type PlanRecipeForm = {
  day: object
  timeOfDay: string
}

export default defineComponent({
  components: {
    Field
  },

  props: {
    recipeId: {
      type: String,
      required: true
    }
  },

  emits: ['close'],

  setup(props, { emit }) {
    // consts
    const formID = 'form-' + uniqueID().getID()
    const days = Array.from({ length: 7 }, (_, i): Day => {
      const day = dayjs().add(i, 'days')
      return {
        value: day.format('YYYY-MM-DD'),
        label: day.calendar()
      }
    })

    // usings
    const recipesStore = useRecipesStore()

    const { handleSubmit } = useForm<PlanRecipeForm>({
      validationSchema: yupObject().shape({
        day: yupObject().required('REQUIRED').typeError('REQUIRED'),
        timeOfDay: yupString().required('REQUIRED').typeError('REQUIRED')
      }),
      initialValues: {
        day: days[0],
        timeOfDay: TimesOfDay[0]
      }
    })

    // data
    const data = reactive({
      errorList: null,
      sending: false
    })

    // methods
    const onSubmit = handleSubmit(async ({ day, timeOfDay }) => {
      data.sending = true
      data.errorList = null

      const { value } = day as Day

      try {
        const {
          data: { success, errors }
        } = await recipesStore.addRecipeToPlanned({
          recipeId: props.recipeId,
          day: value,
          timeOfDay: timeOfDay
        })

        if (success) {
          emit('close')
        } else {
          data.errorList = errors || ['coś poszło nie tak']
        }
      } catch (error) {
        const responseErrors = error.response?.data?.errors
        data.errorList = responseErrors || ['coś poszło nie tak']
      } finally {
        data.sending = false
      }
    })

    return {
      // consts
      formID,
      TimesOfDay,
      days,
      // data
      ...toRefs(data),
      // methods
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.plan-recipe-modal {
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
}
</style>
