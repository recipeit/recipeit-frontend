<template>
  <SheetModalContent class="change-password-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zmień hasło</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit="onSubmit($event)">
        <BaseInput class="form-row" label="E-mail" type="text" :disabled="true" :value="email" />
        <BaseInputField name="currentPassword" type="password" class="form-row" label="Obecne hasło" />
        <BaseLink tag="button" class="forgot-password-button" color="primary" @click="forgotPassword()"> nie pamiętasz hasła? </BaseLink>

        <BaseInputField name="newPassword" type="password" class="form-row" label="Nowe hasło" />
        <BaseInputField name="newPasswordConfirmation" type="password" class="form-row" label="Potwierdź nowe hasło" />
      </form>
      <div v-for="(error, i) in errors" :key="i" class="error">
        {{ error }}
      </div>

      <RecaptchaBranding class="recaptcha-branding" />
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')"> Anuluj </BaseButton>
      <BaseButton class="submit-button" raised color="primary" :form="formID" :loading="sending"> Zapisz </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { useForm } from 'vee-validate'
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import { object as yupObject, string as yupString } from 'yup'

import identityApi from '@/api/identityApi'

import { confirmNewPasswordSchema, newPasswordSchema } from '@/configs/schemas'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'

import { getUniqueId } from '@/functions/uniqueId'

import { useToast } from '@/plugins/toast'

import recaptcha from '@/services/recaptcha'

import RecaptchaBranding from '@/components/RecaptchaBranding.vue'

type ChangePasswordForm = {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export default defineComponent({
  components: {
    RecaptchaBranding
  },

  props: {
    email: {
      type: String,
      required: true
    }
  },

  emits: ['close'],

  setup(_, { emit }) {
    // usings
    const toast = useToast()

    const { handleSubmit } = useForm<ChangePasswordForm>({
      validationSchema: yupObject().shape({
        currentPassword: yupString().required('REQUIRED'),
        newPassword: newPasswordSchema(),
        newPasswordConfirmation: confirmNewPasswordSchema('newPassword')
      })
    })

    // consts
    const formID = 'form-' + getUniqueId()

    // data
    const data = reactive({
      sending: false,
      errors: []
    })

    // methods
    const onSubmit = handleSubmit(values => {
      data.sending = true
      data.errors = []

      recaptcha
        .execute(RECAPTCHA_ACTIONS.CHANGE_PASSWORD)
        .then(recaptchaToken => {
          identityApi
            .changePassword({ ...values, recaptchaToken })
            .then(() => {
              emit('close', { success: true })
              toast.show('Hasło zmienione!', 'success')
            })
            .catch(error => {
              const errors = error?.response?.data?.errors
              if (errors) {
                data.errors = errors
              }
            })
            .finally(() => {
              data.sending = false
            })
        })
        .catch(() => {
          data.sending = false
        })
    })

    const forgotPassword = () => {
      emit('close', { success: false, openForgotPasswordModal: true })
    }

    // lifecycle hooks
    onBeforeMount(async () => {
      await recaptcha.init()
    })

    return {
      // consts
      formID,
      // data
      ...toRefs(data),
      // methods
      onSubmit,
      forgotPassword
    }
  }
})
</script>

<style lang="scss" scoped>
.change-password-modal {
  .submit-button {
    width: 100%;
  }

  .forgot-password-button {
    margin-bottom: 1.5rem;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .recaptcha-branding {
    margin-top: 1rem;
  }
}
</style>
