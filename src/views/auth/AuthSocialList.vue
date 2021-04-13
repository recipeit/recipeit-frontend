<template>
  <div class="auth-social-list">
    <BaseButton class="auth-social-list__button" stroked color="contrast" @click="loginFacebook()" :disabled="anySending ? true : null">
      <Spinner :show="facebookSending" color="text-primary" />
      <img src="@/assets/logos/facebook.svg" alt="logo" />
      Kontynuuj z Facebook
    </BaseButton>
    <BaseButton class="auth-social-list__button" stroked color="contrast" @click="loginGoogle()" :disabled="anySending ? true : null">
      <Spinner :show="googleSending" color="text-primary" />
      <img src="@/assets/logos/google.svg" alt="logo" />
      Kontynuuj z Google
    </BaseButton>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import authSocialMixin from './mixins/authSocialMixin'

export default {
  emits: ['lockInputs', 'unlockInputs'],
  mixins: [authSocialMixin],
  components: { Spinner },
  computed: {
    anySending() {
      return this.facebookSending || this.googleSending
    }
  },
  watch: {
    anySending(anySending) {
      if (anySending) {
        this.$emit('lockInputs')
      } else {
        this.$emit('unlockInputs')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-social-list-title {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  gap: 1rem;

  &:before,
  &:after {
    content: '';
    height: 1px;
    flex: 1;
    background: var(--color-border);
  }
}
.auth-social-list {
  margin-top: 1rem;

  &__button {
    width: 100%;

    & + & {
      margin-top: 1rem;
    }

    &__icon {
      font-size: 1rem;
      margin-right: 0.5rem;

      &--apple {
        font-size: 1.25rem;
        color: var(--color-max-contrast);
      }
    }

    img {
      height: 1rem;
      margin-right: 0.5rem;
    }
  }
}
</style>
