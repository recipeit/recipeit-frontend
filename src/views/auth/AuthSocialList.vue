<template>
  <div class="social-list">
    <BaseButton
      class="social-button"
      stroked
      :disabled="anySending ? true : null"
      :loading="facebookSending"
      @click="loginFacebook()"
    >
      <div class="social-logo" v-html="FacebookLogo" />
      Kontynuuj z Facebook
    </BaseButton>
    <BaseButton
      class="social-button"
      stroked
      :disabled="anySending ? true : null"
      :loading="googleSending"
      @click="loginGoogle()"
    >
      <div class="social-logo" v-html="GoogleLogo" />
      Kontynuuj z Google
    </BaseButton>
  </div>
</template>

<script>
import FacebookLogo from "@/src/assets/logos/facebook.svg?inline";
import GoogleLogo from "@/src/assets/logos/google.svg?inline";

import authSocialMixin from "@/src/views/auth/mixins/authSocialMixin";

export default {
  mixins: [authSocialMixin],
  emits: ["lockInputs", "unlockInputs"],
  setup() {
    return {
      FacebookLogo,
      GoogleLogo,
    };
  },
  computed: {
    anySending() {
      return this.facebookSending || this.googleSending;
    },
  },
  watch: {
    anySending(anySending) {
      if (anySending) {
        this.$emit("lockInputs");
      } else {
        this.$emit("unlockInputs");
      }
    },
  },
};
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
    width: auto;
  }
}
</style>
