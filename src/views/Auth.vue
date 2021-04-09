<template>
  <div class="auth-layout">
    <router-link :to="{ name: 'landing-page' }">Recipeit</router-link>

    <div class="auth-page">
      <router-view></router-view>
      <!-- <router-view v-slot="{ Component }">
        <transition name="page-component-fade" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </router-view> -->
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.auth-layout {
  max-width: 460px;
  box-sizing: border-box;
  margin: 0 auto;
  background: var(--color-background);
  min-height: 100%;
  // box-shadow: 0 0 64px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}

.auth-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 32px 84px 32px;

  &__content {
    text-align: center;
    font-size: 0.75rem;
    max-width: 350px;
    width: 100%;

    h1 {
      font-size: 1.5rem;
    }

    &__social-list {
      button {
        width: 3rem;
        padding: 0;
        margin: 0 0.5rem;
      }
    }

    &__submit {
      width: 100%;
    }

    &__errors {
      margin-top: 1rem;
      color: var(--color-red);
    }

    &__request-password-reset {
      display: inline-block;
      margin-top: 1rem;
    }

    &__terms {
      margin-top: 1rem;
      font-size: 0.625rem;
      // font-size: 0.75rem;
      color: var(--color-text-secondary);
      line-height: 1.5;

      &__link {
        // font-weight: bold;
      }
    }

    p:last-child {
      margin-bottom: 0;
    }

    p {
      margin: 0.5rem 0;
    }
  }
}
</style>
