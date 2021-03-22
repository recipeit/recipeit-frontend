<template>
  <div class="layout__page__content auth-page">
    <router-view v-slot="{ Component }">
      <transition name="page-component-fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;

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
