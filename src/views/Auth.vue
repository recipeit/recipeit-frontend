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
    font-size: 0.875rem;
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

    p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
