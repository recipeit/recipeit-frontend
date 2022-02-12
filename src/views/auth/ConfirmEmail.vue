<template>
  <div class="auth-main__content confirm-email">
    <h1>Potwierdź adres email</h1>

    <div v-if="state === 'LOADING'" class="wait">
      <Spinner class="wait-spinner" :show="true" />
      czekaj
    </div>

    <div v-else-if="state === 'SUCCESS'">
      Udało się! Teraz możesz się zalogować
      <div>
        <router-link v-slot="{ href, navigate }" :to="{ name: 'login', params: { email } }" custom>
          <BaseButton tag="a" class="login-button" :href="href" raised color="primary" @click="navigate($event)"> Zaloguj się </BaseButton>
        </router-link>
      </div>
    </div>

    <div v-else>
      Coś poszło nie tak
      <div>
        <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton tag="a" class="login-button" :href="href" stroked @click="navigate($event)">
            <BaseIcon class="login-button-icon" icon="arrow-left" weight="semi-bold" />
            Wróć do logowania
          </BaseButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

import identityApi from '@/api/identityApi'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { BASE_URL } from '@/configs/url'

import { useErrorHandler } from '@/error'

import { AUTH_CONFIRM_EMAIL } from '@/router/paths'

import Spinner from '@/components/Spinner.vue'

type ConfirmEmailData = {
  state: 'LOADING' | 'SUCCESS' | 'ERROR'
  email: string
}

export default defineComponent({
  components: { Spinner },

  setup() {
    // usings
    const errorHandler = useErrorHandler()
    const route = useRoute()
    useMeta({
      title: 'Potwierdź adres email',
      link: [{ rel: 'canonical', href: `${BASE_URL}${AUTH_CONFIRM_EMAIL}` }]
    })

    // data
    const data = reactive<ConfirmEmailData>({
      state: 'LOADING',
      email: null
    })

    // lifecycle hooks
    onMounted(() => {
      data.state = 'LOADING'
      const { email, token } = route.query

      if (email && typeof email === 'string' && token && typeof token === 'string') {
        identityApi
          .confirmEmail({
            email,
            token
          })
          .then(resp => {
            if (resp.data.success) {
              data.state = 'SUCCESS'
              data.email = email
            } else {
              data.state = 'ERROR'
            }
          })
          .catch(error => {
            data.state = 'ERROR'
            errorHandler.captureError(error, {
              [ERROR_ACTION_TAG_NAME]: 'auth.confirmEmail'
            })
          })
      } else {
        data.state = 'ERROR'
        errorHandler.captureError(new Error('missing email or token'), {
          [ERROR_ACTION_TAG_NAME]: 'auth.confirmEmail.missingData'
        })
      }
    })

    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
.confirm-email {
  .wait {
    display: flex;
    align-items: center;
  }

  .wait-spinner {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }

  .login-button {
    margin-top: 1.5rem;
  }

  .login-button-icon {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
}
</style>
