<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zmień hasło</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit.prevent="changePassword()">
        <BaseInput class="form-row" label="E-mail" type="text" :disabled="true" :modelValue="email"></BaseInput>
        <BaseInput class="form-row" label="Obecne hasło" type="password" v-model="form.currentPassword"></BaseInput>
        <BaseInput class="form-row" label="Nowe hasło" type="password" v-model="form.newPassword"></BaseInput>
        <BaseInput class="form-row" label="Potwierdź nowe hasło" type="password" v-model="form.newPasswordConfirmation"></BaseInput>
      </form>
      <div v-for="(error, i) in errors" :key="i" class="error">
        {{ error }}
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="contrast" :form="formID">
        {{ loading ? '...czekaj' : 'Zapisz' }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { useToast } from '@/plugins/toast'
// import { useStore } from 'vuex'
import { reactive, toRefs } from 'vue'
// import ExpirationDatesFormSection from './ExpirationDatesFormSection'
// import ProductModalForm from '@/components/ProductModalForm'
import uniqueID from '@/functions/uniqueID'
import identityApi from '@/api/identityApi'
import { ToastType } from '@/plugins/toast/toastType'
// import components from '../base/icons'

export default {
  // components: { ExpirationDatesFormSection, ProductModalForm },
  emits: ['close'],
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup(props, component) {
    const toast = useToast()
    const formID = 'form-' + uniqueID().getID()
    const data = reactive({
      loading: false,
      errors: [],
      form: {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirmation: ''
      }
    })

    function changePassword() {
      const requestData = {
        ...data.form,
        email: props.email
      }
      data.loading = true
      data.errors = []
      identityApi
        .changePassword(requestData)
        .then(() => {
          component.emit('close', { success: true })
          toast.show('Hasło zmienione!', ToastType.SUCCESS)
        })
        .catch(error => {
          const errors = error?.response?.data?.errors
          if (errors) {
            data.errors = errors
          }
        })
        .finally(() => {
          data.loading = false
        })
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
