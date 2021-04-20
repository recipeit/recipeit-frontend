<template>
  <div class="social-list">
    <BaseButton class="social-button" stroked @click="loginFacebook()" :disabled="anySending ? true : null" :loading="facebookSending">
      <div class="social-logo" v-html="FacebookLogo" />
      Kontynuuj z Facebook
    </BaseButton>
    <BaseButton class="social-button" stroked @click="loginGoogle()" :disabled="anySending ? true : null" :loading="googleSending">
      <div class="social-logo" v-html="GoogleLogo" />
      Kontynuuj z Google
    </BaseButton>
  </div>
</template>

<script>
import authSocialMixin from './mixins/authSocialMixin'
import FacebookLogo from '@/assets/logos/facebook.svg?inline'
import GoogleLogo from '@/assets/logos/google.svg?inline'

export default {
  emits: ['lockInputs', 'unlockInputs'],
  mixins: [authSocialMixin],
  setup() {
    return {
      FacebookLogo,
      GoogleLogo
    }
  },
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
.social-list {
  margin-top: 1rem;
}

.social-button {
  width: 100%;

  & + & {
    margin-top: 1rem;
  }
}

.social-logo {
  height: 1rem;
  margin-right: 0.5rem;

  ::v-deep(svg) {
    height: 100%;
  }
}
</style>
