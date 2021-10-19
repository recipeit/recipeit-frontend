<template>
  <Container class="social-media">
    <h2 class="header">
      Bądź na bieżąco
    </h2>
    <div class="social-list">
      <span class="social-logo" @click="openSocialMediaPage(FACEBOOK_PROFILE_URL)" v-html="FacebookLogo" />
      <span class="social-logo" @click="openSocialMediaPage(INSTAGRAM_PROFILE_URL)" v-html="InstagramLogo" />
    </div>
  </Container>
</template>

<script>
import FacebookLogo from '@/assets/logos/facebook.svg?inline'
import InstagramLogo from '@/assets/logos/instagram.svg?inline'

import { FACEBOOK_PROFILE_URL, INSTAGRAM_PROFILE_URL } from '@/configs/socialMedia'

import Container from '@/components/landingPage/Container'

export default {
  components: { Container },

  setup() {
    const openSocialMediaPage = url => {
      window.open(url, '_blank')
    }

    return {
      FacebookLogo,
      InstagramLogo,
      FACEBOOK_PROFILE_URL,
      INSTAGRAM_PROFILE_URL,
      openSocialMediaPage
    }
  }
}
</script>

<style lang="scss" scoped>
.social-media {
  text-align: center;
  padding-bottom: 0;

  .header {
    font-size: 1.15rem;
    line-height: 1.15;
    font-weight: bold;
  }

  .social-list {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .social-logo {
    width: 32px;
    margin: 12px;
    cursor: pointer;

    @include transition((opacity));

    @include cursor-only {
      &:hover,
      &:focus {
        opacity: 0.75;
      }
    }
  }
}
</style>
