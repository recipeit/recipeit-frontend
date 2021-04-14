<template>
  <div class="landing-page">
    <Splash />
  </div>
  <!-- <div>
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
  </div> -->
</template>

<script>
import Splash from '@/components/landingPage/Splash'
import { mapGetters } from 'vuex'

export default {
  components: { Splash },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    })
  }
}
</script>

<style lang="scss" scoped>
.landing-page {
  background: #fff;
  min-height: 100vh;
}
</style>
