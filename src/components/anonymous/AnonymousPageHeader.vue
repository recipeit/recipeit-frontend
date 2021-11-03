<template>
  <header class="header">
    <div class="header-container">
      <NuxtLink to="/" class="logo-link" title="Recipeit">
        <Logotype class="logo" />
        Recipeit
      </NuxtLink>
      <div class="header-buttons">
        <template v-if="userAuthenticatedLazy">
          <NuxtLink v-slot="{ href, navigate }" to="/start" custom>
            <BaseButton
              class="header-button"
              tag="a"
              :href="href"
              raised
              color="primary"
              @click="navigate($event)"
            >
              Wróć do aplikacji
            </BaseButton>
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink v-slot="{ href, navigate }" to="/logowanie" custom>
            <BaseButton
              class="header-button"
              tag="a"
              :href="href"
              stroked
              @click="navigate($event)"
            >
              Zaloguj się
            </BaseButton>
          </NuxtLink>
          <NuxtLink v-slot="{ href, navigate }" to="/rejestracja" custom>
            <BaseButton
              class="header-button"
              tag="a"
              :href="href"
              raised
              color="primary"
              @click="navigate($event)"
            >
              Utwórz konto
            </BaseButton>
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
// import { useStore } from "vuex";

import {
  LANDING_PAGE,
  AUTH_LOGIN,
  AUTH_REGISTER,
  APP_HOME,
} from "@/src/router/names";

import Logotype from "@/src/components/Logotype";

export default {
  components: { Logotype },
  setup() {
    // const store = useStore();
    // const userAuthenticatedLazy = computed(
    //   () => store.state.user.userAuthenticatedLazy
    // );

    return {
      userAuthenticatedLazy: false,
      LANDING_PAGE,
      AUTH_REGISTER,
      AUTH_LOGIN,
      APP_HOME,
    };
  },
};
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

  .logo-link {
    font-size: 0;
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
