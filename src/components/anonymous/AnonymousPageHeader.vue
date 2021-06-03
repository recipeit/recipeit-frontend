<template>
  <header class="header">
    <div class="header-container">
      <router-link :to="{ name: 'landing-page' }" class="logo-link">
        <Logotype class="logo" />
      </router-link>
      <div class="header-buttons">
        <template v-if="userAuthenticatedLazy">
          <router-link :to="{ name: 'home' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="header-button" tag="a" :href="href" @click="navigate($event)" raised color="primary" size="small">
              Wróć do aplikacji
            </BaseButton>
          </router-link>
        </template>
        <template v-else>
          <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="header-button" tag="a" :href="href" @click="navigate($event)" stroked size="small">
              Zaloguj się
            </BaseButton>
          </router-link>
          <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="header-button" tag="a" :href="href" @click="navigate($event)" raised color="primary" size="small">
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
import { mapState } from 'vuex'

export default {
  components: { Logotype },
  computed: {
    ...mapState({
      userAuthenticatedLazy: state => state.user.userAuthenticatedLazy
    })
  }
}
</script>

<style lang="scss" scoped>
.header {
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
    color: var(--color-max-contrast);
  }

  .header-buttons {
    margin-left: auto;
    padding-left: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 1rem;
  }

  @media (max-width: 720px) {
    .header-buttons {
      gap: 0.5rem;
    }

    .header-button {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
}
</style>
