<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle class="title">Czy na pewno chcesz usunąć konto?</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div class="message">
        <b>Nieodwracalnie</b> utracisz m.in. listy zakupów, Twoje produkty, Twój plan dnia czy listę ulubionych przepisów.
      </div>
      <form class="form" :id="formID" @submit.prevent="changePassword()">
        <BaseInput class="form-row" label="E-mail" type="text" :disabled="true" :modelValue="email"></BaseInput>
        <BaseInput class="form-row" label="Obecne hasło" type="password" v-model="form.currentPassword"></BaseInput>
      </form>
      <div v-for="(error, i) in errors" :key="i" class="error">
        {{ error }}
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Nie chcę
      </BaseButton>
      <BaseButton class="submit-button" raised color="danger" :form="formID">
        {{ loading ? '...czekaj' : 'Usuń konto' }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { reactive, toRefs } from 'vue'
import uniqueID from '@/functions/uniqueID'
import identityApi from '@/api/identityApi'
import { useStore } from 'vuex'

export default {
  emits: ['close'],
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup(props, component) {
    const store = useStore()
    const formID = 'form-' + uniqueID().getID()
    const data = reactive({
      loading: false,
      errors: [],
      form: {
        password: ''
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
        .deleteFAAAAccount(requestData)
        .then(() => {
          component.emit('close', { success: true })
          store.dispatch('user/logout')
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

.title {
  color: var(--color-red);
}

.message {
  font-size: 0.875rem;
}

.form {
  margin-top: 1.5rem;
}
</style>
