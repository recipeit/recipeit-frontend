<template>
  <div class="login-before-enter">
    <p>
      Zaloguj się, aby zobaczyć co tu na Ciebie czeka!
    </p>
    <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
      <BaseButton :anchorTag="true" :href="href" @click="navigate($event)" class="login-before-enter__button" raised color="contrast">
        Zaloguj się
      </BaseButton>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.login-before-enter {
  text-align: center;

  &__button {
    width: 100%;
  }
}
</style>
