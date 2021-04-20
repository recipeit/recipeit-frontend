<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Przypomnienie hasła</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div v-if="!success" class="before-send">
        <p class="message">Jeżeli zapomiałeś swoje aktualne hasło, wyślemy Ci wiadomość e-mail umożliwiającą jego zresetowanie.</p>
        <div v-for="(error, i) in errors" :key="i" class="error">
          {{ error }}
        </div>
      </div>
      <div v-else class="success-after-send">
        <p class="message">
          Sprawdź swoją skrzyknę pocztową!
        </p>
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <template v-if="!success">
        <BaseButton class="submit-button" stroked @click="$emit('close')">
          Anuluj
        </BaseButton>
        <BaseButton class="submit-button" raised color="primary" :loading="sending" @click="onConfirmForgotPassword()">
          {{ 'Wyślij e-mail' }}
        </BaseButton>
      </template>
      <template v-else>
        <BaseButton class="submit-button" stroked @click="$emit('close')">
          Ok
        </BaseButton>
      </template>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { reactive, toRefs } from 'vue'
import identityApi from '@/api/identityApi'

export default {
  emits: ['close'],
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const data = reactive({
      sending: false,
      success: false,
      errors: []
    })

    const onConfirmForgotPassword = () => {
      data.sending = true

      identityApi
        .requestPasswordReset(props.email)
        .then(() => {
          data.success = true
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
    }

    return {
      ...toRefs(data),
      onConfirmForgotPassword
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

.forgot-password-button {
  margin-bottom: 1.5rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.message {
  font-size: 0.875rem;
  margin: 0;
}
</style>
