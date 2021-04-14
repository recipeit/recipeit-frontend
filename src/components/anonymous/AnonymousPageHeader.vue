<template>
  <header class="header">
    <div class="header-container">
      <router-link :to="{ name: 'landing-page' }" class="logo-link">
        <Logotype class="logo" />
      </router-link>
      <div class="user-links">
        <template v-if="isAuthenticated">
          <router-link :to="authenticatedReturnUrl || { name: 'home' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="user-link" tag="a" size="small" :href="href" @click="navigate($event)" raised color="primary">
              Wróć do aplikacji
            </BaseButton>
          </router-link>
        </template>
        <template v-else>
          <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="user-link" tag="a" size="small" :href="href" @click="navigate($event)" stroked>
              Zaloguj się
            </BaseButton>
          </router-link>
          <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="user-link" tag="a" size="small" :href="href" @click="navigate($event)" raised color="primary">
              Utwórz konto
            </BaseButton>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import Logotype from '@/components/Logotype'
import { mapGetters } from 'vuex'

export default {
  components: {
    Logotype
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    authenticatedReturnUrl() {
      return this.$route.params.returnUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  background-color: var(--color-background);
}

.header-container {
  max-width: 960px;
  width: 100%;
  padding: 2rem;
  margin: 0 auto;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.logo {
  width: 128px;
  line-height: 1;
}

.user-links {
  margin-left: auto;
  padding-left: 1rem;
}

.user-link {
  & + & {
    margin-left: 1rem;
  }
}
</style>
