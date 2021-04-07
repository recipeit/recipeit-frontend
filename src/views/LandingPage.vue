<template>
  <div>
    <div v-if="isAuthenticated">
      <router-link :to="{ name: 'home' }">Przejdź do aplikacji</router-link>
    </div>
    <div v-else>
      <router-link :to="{ name: 'login' }">Zaloguj się</router-link>
      <router-link :to="{ name: 'register' }">Utwórz konto</router-link>
    </div>
  </div>
  <div>
    Landing Page
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    })
  }
}
</script>
