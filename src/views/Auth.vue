<template>
  <div class="auth-layout">
    <div class="auth-main">
      <div class="auth-main__logo">
        <router-link :to="{ name: 'landing-page' }">
          <Logotype class="logo" />
        </router-link>
      </div>
      <router-view v-slot="{ Component }">
        <transition name="page-component-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div class="auth-image">
      <BaseImageLazyload class="auth-image__image" :src="BackgroundUrl" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import BackgroundUrl from '@/assets/img/auth.jpg'

import Logotype from '@/components/Logotype.vue'

export default defineComponent({
  components: { Logotype },

  setup() {
    return {
      BackgroundUrl
    }
  }
})
</script>

<style lang="scss">
.logo {
  width: 128px;
}

.auth-layout {
  // max-width: 460px;
  box-sizing: border-box;
  // margin: 0 auto;
  // background: var(--color-background);
  min-height: 100%;
  // // box-shadow: 0 0 64px rgba(0, 0, 0, 0.1);
  display: flex;
  // flex-direction: column;
  // width: 100%;
  flex: 1;
  flex-direction: row-reverse;
}

.auth-image {
  // average color of current image
  background-color: #536066;
  position: relative;
  padding: 32px;
  flex: 1;

  @media (max-width: 960px) {
    display: none;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
}

.auth-main {
  padding: 48px 32px;
  flex: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;

  &__logo {
    margin-bottom: 2rem;
    max-width: 350px;
    width: 100%;

    .logo {
      color: var(--color-max-contrast);
    }
  }

  &__content {
    // text-align: center;
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

    .link {
      font-weight: bold;
    }
  }
}
</style>
