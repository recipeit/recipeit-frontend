<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Zmień hasło</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" @submit="changePassword($event)" :validation-schema="schema">
        <BaseInput class="form-row" label="E-mail" type="text" :disabled="true" :modelValue="email" />
        <Field type="password" name="currentPassword" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="Obecne hasło" type="password" :field="field" :errors="errors" />
        </Field>
        <Field type="password" name="newPassword" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="Nowe hasło" type="password" :field="field" :errors="errors" />
        </Field>
        <Field type="password" name="newPasswordConfirmation" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="Potwierdź nowe hasło" type="password" :field="field" :errors="errors" />
        </Field>
      </Form>
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
import { Field, Form } from 'vee-validate'
import { useToast } from '@/plugins/toast'
import { reactive, toRefs } from 'vue'
import uniqueID from '@/functions/uniqueID'
import identityApi from '@/api/identityApi'
import { ToastType } from '@/plugins/toast/toastType'
import * as Yup from 'yup'

export default {
  components: {
    Field,
    Form
  },
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

    function changePassword(values) {
      const requestData = {
        ...values,
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
      formID,
      schema
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
