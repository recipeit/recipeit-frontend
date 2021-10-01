<template>
  <header class="header">
    <div class="header-container">
      <router-link :to="{ name: LANDING_PAGE }" class="logo-link">
        <Logotype class="logo" />
      </router-link>
      <div class="header-buttons">
        <template v-if="userAuthenticatedLazy">
          <router-link v-slot="{ href, navigate }" :to="{ name: APP_HOME }" custom>
            <BaseButton class="header-button" tag="a" :href="href" raised color="primary" @click="navigate($event)">
              Wróć do aplikacji
            </BaseButton>
          </router-link>
        </template>
        <template v-else>
          <router-link v-slot="{ href, navigate }" :to="{ name: AUTH_LOGIN }" custom>
            <BaseButton class="header-button" tag="a" :href="href" stroked @click="navigate($event)">
              Zaloguj się
            </BaseButton>
          </router-link>
          <router-link v-slot="{ href, navigate }" :to="{ name: AUTH_REGISTER }" custom>
            <BaseButton class="header-button" tag="a" :href="href" raised color="primary" @click="navigate($event)">
              Utwórz konto
            </BaseButton>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { LANDING_PAGE, AUTH_LOGIN, AUTH_REGISTER, APP_HOME } from '@/router/names'
import Logotype from '@/components/Logotype'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  components: { Logotype },
  setup() {
    const store = useStore()
    const userAuthenticatedLazy = computed(() => store.state.user.userAuthenticatedLazy)

    return {
      userAuthenticatedLazy,
      LANDING_PAGE,
      AUTH_REGISTER,
      AUTH_LOGIN,
      APP_HOME
    }
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
      height: 40px;
    }
  }
}
</style>
