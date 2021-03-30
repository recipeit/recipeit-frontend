<template>
  <div class="login-before-enter">
    <p>
      Zaloguj się, aby zobaczyć co tu na Ciebie czeka!
    </p>
    <BaseButton class="login-before-enter__button" raised color="contrast" type="submit" :disabled="anySending">
      <Spinner :show="sending" />
      Zaloguj się
    </BaseButton>
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
