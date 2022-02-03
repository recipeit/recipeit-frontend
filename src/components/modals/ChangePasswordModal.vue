<template>
  <SheetModalContent class="change-password-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zmień hasło</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" :validation-schema="schema" @submit="changePassword($event)">
        <BaseInput class="form-row" label="E-mail" type="text" :disabled="true" :value="email" />
        <Field v-slot="{ field, errors }" type="password" name="currentPassword">
          <BaseInput class="form-row" label="Obecne hasło" type="password" v-bind="field" :errors="errors" />
        </Field>
        <BaseLink tag="button" class="forgot-password-button" color="primary" @click="forgotPassword()"> nie pamiętasz hasła? </BaseLink>

        <Field v-slot="{ field, errors }" type="password" name="newPassword">
          <BaseInput class="form-row" label="Nowe hasło" type="password" v-bind="field" :errors="errors" />
        </Field>
        <Field v-slot="{ field, errors }" type="password" name="newPasswordConfirmation">
          <BaseInput class="form-row" label="Potwierdź nowe hasło" type="password" v-bind="field" :errors="errors" />
        </Field>
      </Form>
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
import { Field, Form } from 'vee-validate'
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import * as Yup from 'yup'

import identityApi from '@/api/identityApi'

import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'

import uniqueID from '@/functions/uniqueID'

import { useToast } from '@/plugins/toast'

import recaptcha from '@/services/recaptcha'

import RecaptchaBranding from '@/components/RecaptchaBranding.vue'

export default defineComponent({
  components: {
    RecaptchaBranding,
    Field,
    Form
  },

  props: {
    email: {
      type: String,
      required: true
    }
  },

  emits: ['close'],

  setup(_, { emit }) {
    const toast = useToast()
    const formID = 'form-' + uniqueID().getID()
    const data = reactive({
      sending: false,
      errors: []
    })

    const schema = Yup.object().shape({
      currentPassword: Yup.string().required('REQUIRED'),
      newPassword: Yup.string()
        .min(6, 'REQUIRED_AT_LEAST_6_CHAR')
        .matches(/^(?=.*[a-z])/, 'REQUIRED_AT_LEAST_ONE_LOWER')
        .matches(/^(?=.*[A-Z])/, 'REQUIRED_AT_LEAST_ONE_UPPER')
        .matches(/^(?=.*[0-9])/, 'REQUIRED_AT_LEAST_ONE_DIGIT')
        .matches(/^(?=.*[!@#$%^&*])/, 'REQUIRED_AT_LEAST_ONE_NON_ALPHANUM')
        .required('REQUIRED'),
      newPasswordConfirmation: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'WRONG_PASSWORD_COMBINATION')
        .required('REQUIRED')
    })

    const changePassword = values => {
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
    }

    const forgotPassword = () => {
      emit('close', { success: false, openForgotPasswordModal: true })
    }

    onBeforeMount(async () => {
      await recaptcha.init()
    })

    return {
      ...toRefs(data),
      changePassword,
      forgotPassword,
      formID,
      schema
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
