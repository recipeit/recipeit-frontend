<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zaplanuj przepis</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit.prevent="planRecipe()" class="form-columns">
        <BaseSelect :searchable="false" placeholder="Dzień" v-model="formData.day" :options="days"></BaseSelect>
        <BaseSelect :searchable="false" placeholder="Pora dnia" v-model="formData.timeOfDay" :options="timesOfDay">
          <template v-slot:label="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
          <template v-slot:option="{ option }">{{ $t(`timeOfDay.${option}`) }}</template>
        </BaseSelect>
      </form>
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="contrast" type="submit" :form="formID">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.planRecipe') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import uniqueID from '@/functions/uniqueID'
import dayjs from '@/functions/dayjs'
import timesOfDay from '@/constants/timesOfDay'

const today = dayjs()

export default {
  emits: ['close'],
  data: () => ({
    formData: {
      day: null,
      timeOfDay: null
    },
    formID: 'form-' + uniqueID().getID(),
    days: Array.from({ length: 7 }, (_, i) => today.add(i, 'days').calendar()),
    timesOfDay: Object.keys(timesOfDay),
    error: null
  }),
  methods: {
    planRecipe() {
      const { formData } = this
      if (!formData.day || !formData.timeOfDay) {
        this.error = 'oba pola są wymagane'
        return
      }
      this.error = null
      // this.$emit('close', date)
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
