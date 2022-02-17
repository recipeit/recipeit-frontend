<template>
  <div class="footer-auth">
    <Container class="footer-auth-container">
      <div class="footer-auth-content">
        <h2 class="footer-auth-header">Zacznij korzystać z Recipeit już teraz!</h2>
        <div class="footer-auth-buttons">
          <router-link v-slot="{ href, navigate }" :to="{ name: 'register' }" custom>
            <BaseButton class="button button--main" tag="span" :href="href" @click="navigate($event)">Utwórz konto</BaseButton>
          </router-link>
          <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
            <BaseButton class="button button--secondary" tag="span" :href="href" @click="navigate($event)">Zaloguj się</BaseButton>
          </router-link>
        </div>
      </div>
      <BaseImageLazyload :src="BackgroundUrl" class="footer-auth-background" />
    </Container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import BackgroundUrl from '@/assets/img/footer-auth.webp'

import Container from '@/components/landingPage/Container.vue'

export default defineComponent({
  components: { Container },

  setup() {
    return {
      BackgroundUrl
    }
  }
})
</script>

<style lang="scss" scoped>
.footer-auth {
  padding: 0 1.5rem;
  text-align: center;

  .footer-auth-header {
    font-size: 1.5rem;
    color: #fff;
    line-height: 1.15;
    margin: 0 0 1rem 0;
    font-weight: bold;
  }

  .button {
    margin: 0.5rem;

    &.button--main {
      background-color: $light-theme-primary;
      color: #ffff;
    }

    &.button--secondary {
      border: 1px solid rgba(#fff, 0.35);
      color: #fff;
      @include transition('border-color');

      &:hover {
        border-color: rgba(#fff, 0.45);
      }
    }
  }

  .footer-auth-container {
    background-color: #000;
    color: #fff;
    border-radius: 1.5rem;
    position: relative;
    overflow: hidden;
    padding-top: 4rem;
    padding-bottom: 3.5rem;
  }

  .footer-auth-content {
    position: relative;
    z-index: 1;
  }

  .footer-auth-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.75;

    :deep(img) {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .benefit-list {
    display: flex;
  }

  @media (max-width: 720px) {
    padding: 0;

    .footer-auth-container {
      border-radius: 0;
    }

    .benefit-list {
      flex-direction: column;
    }
  }
}
</style>
