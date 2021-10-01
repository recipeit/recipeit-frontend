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
        <p class="description">Nie pozwól aby Twoje produkty się przeterminowały. Recipeit pokaże Ci, co możesz z nich przygotować</p>
        <div class="user-buttons">
          <router-link v-slot="{ href, navigate }" :to="{ name: 'register' }" custom>
            <BaseButton class="user-button user-button--main" tag="a" :href="href" @click="navigate($event)">
              Utwórz konto
            </BaseButton>
          </router-link>
          <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
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
import BackgroundUrl from '@/assets/img/splash.webp'

export default {
  components: {
    Logotype
  },
  setup: () => ({
    BackgroundUrl
  })
}
</script>

<style lang="scss" scoped>
.splash {
  min-height: 720px;
  position: relative;
  background-color: #000;
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
  position: relative;
  align-items: center;
  height: 48px;
}

.user-buttons {
  display: flex;
}

.user-button {
  & + & {
    margin-left: 1rem;
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
}

.h1 {
  font-size: 4rem;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 1.5rem;
}

.description {
  font-size: 0.875rem;
  color: rgba(#fff, 0.75);
  margin-bottom: 3rem;
  max-width: 380px;
}

.logotype {
  width: 128px;
  line-height: 1;

  :deep(.b) {
    fill: #fff;
  }
}

.background-image-container {
  overflow: hidden;
  position: absolute;
  max-width: 1280px;
  left: 50%;
  width: 100%;
  height: 100%;
  top: 0;
  transform: translateX(-50%);
  z-index: 0;
}

.background-image {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  height: 720px;
  width: 1280px;

  :deep(img) {
    object-fit: cover;
    height: 100%;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }
}

@media (max-width: 720px) {
  .splash {
    min-height: 600px;
    max-height: 850px;
    height: 100vh;
  }

  .content {
    padding: 0;
  }

  .header {
    padding: 2rem;
    height: calc(48px + 4rem);

    &::before {
      content: '';
      background: linear-gradient(rgba(#000, 0.5) 50%, rgba(#000, 0) 100%);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -2;
    }
  }

  .user-buttons {
    flex-direction: column;
    width: 100%;
  }

  .user-button {
    & + & {
      margin-left: 0;
      margin-top: 1rem;
    }
  }

  .main {
    flex: initial;
    position: relative;
    margin-top: auto;
    padding-top: 96px;
    position: sticky;
    bottom: 0;
    padding: 2rem;

    &::before {
      content: '';
      background: linear-gradient(rgba(#000, 0) 0%, rgba(#000, 0.5) 50%);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -2;
    }
  }

  .h1 {
    font-size: 2rem;
  }
  .background-image {
    left: 50%;
    transform: translate(-55%, -75%);
  }
}
</style>
