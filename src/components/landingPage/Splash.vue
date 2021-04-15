<template>
  <section class="splash">
    <div class="background-image-container">
      <BaseImageLazyload :src="BackgroundUrl" class="background-image" />
    </div>
    <div class="content">
      <header class="header">
        <Logotype class="logotype" />
      </header>
      <div class="main">
        <h1 class="h1">Znajdź przepis<br />z tego co masz!</h1>
        <p class="description">Nie pozwól aby Twoje produkty się przeterminowały. Recipeit pokaże Ci, co możesz z nich przygotować!</p>
        <div class="user-buttons">
          <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="user-button user-button--main" tag="a" :href="href" @click="navigate($event)">
              Utwórz konto
            </BaseButton>
          </router-link>
          <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
            <BaseButton class="user-button user-button--secondary" tag="a" :href="href" @click="navigate($event)">
              Zaloguj się
            </BaseButton>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logotype from '@/components/Logotype'
import BackgroundUrl from '@/assets/img/splash.jpg'

export default {
  components: { Logotype },
  setup: () => ({ BackgroundUrl })
}
</script>

<style lang="scss" scoped>
// @use '../../styles/non-rendered/theme-light-variables' as variables;

.splash {
  min-height: 720px;
  position: relative;
  background-color: #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content {
  position: relative;
  max-width: 960px;
  width: 100%;
  padding: 2rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  z-index: 1;
  flex: 1;
}

.header {
  display: flex;

  align-items: center;
  height: 48px;
}

.user-buttons {
  display: flex;

  @media (max-width: 720px) {
    flex-direction: column;
    max-width: 256px;
    width: 100%;
    // margin: 0 auto;
  }
}

.user-button {
  & + & {
    margin-left: 1rem;

    @media (max-width: 720px) {
      margin-left: 0;
      margin-top: 1rem;
    }
  }

  &--main {
    background-color: $light-theme-primary;
    color: #ffff;
  }

  &--secondary {
    border: 1px solid rgba(#fff, 0.35);
    color: #fff;
    @include transition('border-color');

    &:hover {
      border-color: rgba(#fff, 0.45);
    }
  }
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  @media (max-width: 720px) {
    align-items: center;
  }
}

.h1 {
  font-size: 4rem;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 1.5rem;

  @media (max-width: 720px) {
    text-align: center;
    font-size: 2rem;
  }
}

.description {
  font-size: 0.875rem;
  color: rgba(#fff, 0.75);
  margin-bottom: 3rem;
  max-width: 380px;

  @media (max-width: 720px) {
    text-align: center;
    // margin: 0 auto;
    // font-size: 2rem;
  }
}

.logotype {
  width: 128px;
  line-height: 1;

  // ::v-deep(.a),
  ::v-deep(.b) {
    fill: #fff;
  }
}

.background-image-container {
  position: absolute;
  max-width: 1280px;
  left: 50%;
  width: 100%;
  height: 100%;
  top: 0;
  transform: translateX(-50%);
  z-index: 0;

  .background-image {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    height: 720px;
    width: 1280px;

    @media (max-width: 720px) {
      left: 50%;
      transform: translate(-50%, -50%);
    }

    ::v-deep(img) {
      object-fit: cover;
      object-position: left;
      height: 100%;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;

      @media (max-width: 720px) {
        opacity: 0.5;
      }
    }
  }
}
</style>
