<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zmień hasło</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit.prevent="changePassword()">
        <BaseInput class="form-row" label="Obecne hasło" type="password" v-model="form.currentPassword"></BaseInput>
        <BaseInput class="form-row" label="Nowe hasło" type="password" v-model="form.newPassword"></BaseInput>
        <BaseInput class="form-row" label="Potwierdź nowe hasło" type="password" v-model="form.newPasswordConfirmation"></BaseInput>
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="contrast" @click="changePassword">
        {{ loading ? '...czekaj' : 'Zapisz' }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
// import { useStore } from 'vuex'
import { reactive, toRefs } from 'vue'
// import ExpirationDatesFormSection from './ExpirationDatesFormSection'
// import ProductModalForm from '@/components/ProductModalForm'
import uniqueID from '@/functions/uniqueID'
import identityApi from '@/api/identityApi'

export default {
  // components: { ExpirationDatesFormSection, ProductModalForm },
  emits: ['close'],
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup(props) {
    // const store = useStore()
    const formID = 'form-' + uniqueID().getID()
    const data = reactive({
      form: {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirmation: ''
      }
    })

    function changePassword() {
      const requestData = {
        email: props.email,
        ...this.form
      }
      identityApi.changePassword(requestData).then()
    }

    return {
      ...toRefs(data),
      changePassword,
      formID
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
</style>
