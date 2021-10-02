<template>
  <div class="authorization">
    <div v-if="page === AuthorizationPageType.LOGIN" class="authorization__content">
      <div class="authorization__content">Zaloguj się</div>
      facebook lub użyj adresu email ZALOGUJ SIĘ Nie masz konta? Zarejestruj się
    </div>
    <div v-else class="authorization__content">
      <div class="authorization__content">Zarejestruj się</div>
    </div>
  </div>
</template>

<script>
export const AuthorizationPageType = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER'
}

export default {
  props: {
    page: {
      type: String,
      default: AuthorizationPageType.REGISTER,
      validator: value => AuthorizationPageType[value] !== undefined
    }
  },
  setup() {
    return {
      AuthorizationPageType
    }
  }
}
</script>
