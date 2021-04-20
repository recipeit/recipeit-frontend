<template>
  <div class="auth-social-list-pills-title">lub {{ buttonPrefix }}</div>
  <div class="auth-social-list-pills">
    <BaseButton class="auth-social-list-pills__button" stroked @click="loginFacebook()">
      <img src="@/assets/logos/facebook.svg" alt="logo" />
    </BaseButton>
    <BaseButton class="auth-social-list-pills__button" stroked @click="loginGoogle()">
      <img src="@/assets/logos/google.svg" alt="logo" />
    </BaseButton>
    <BaseButton class="auth-social-list-pills__button" stroked @click="loginGoogle()">
      <BaseIcon class="auth-social-list-pills__button__icon auth-social-list-pills__button__icon--apple" weight="brands" icon="apple" />
    </BaseButton>
  </div>
</template>

<script>
import authSocialMixin from './mixins/authSocialMixin'

export default {
  props: {
    buttonPrefix: String
  },
  mixins: [authSocialMixin]
}
</script>

<style lang="scss" scoped>
.auth-social-list-pills-title {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  // min-height: 2rem;
  // font-weight: bold;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  // font-weight: bold;
  gap: 1rem;

  &:before,
  &:after {
    content: '';
    height: 1px;
    flex: 1;
    background: var(--color-border);
  }
}
.auth-social-list-pills {
  margin-top: 1rem;
  display: flex;

  &__button {
    flex: 1;

    &__icon {
      font-size: 1rem;

      &--apple {
        font-size: 1.25rem;
        color: var(--color-max-contrast);
      }
    }

    img {
      height: 1rem;
    }
  }

  &__button + &__button {
    margin-left: 1rem;
  }
}
</style>
