<template>
  <div class="footer-auth">
    <Container class="footer-auth-container">
      <div class="footer-auth-content">
        <h1 class="footer-auth-header">Dodaj przepisy</h1>
        <p class="footer-auth-description">
          Jeżeli tworzysz blog kulinarny, na którym publikujsz swoje przepisy, dodaj go do Recipeit i zdobądź nowych czytelników!
        </p>
      </div>
      <BaseImageLazyload :src="BackgroundUrl" class="footer-auth-background" />
    </Container>
  </div>
</template>

<script>
import BackgroundUrl from '@/assets/img/add-blog-new.jpg'

import Container from '@/components/landingPage/Container'

export default {
  components: { Container },
  setup: () => ({
    BackgroundUrl
  })
}
</script>

<style lang="scss" scoped>
$background: #dfe5ec;
$color: #000;

.footer-auth {
  padding: 0 2rem;
  // text-align: center;

  .footer-auth-header {
    font-size: 2rem;
    color: $color;
    line-height: 1.15;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }

  .footer-auth-description {
    font-size: 0.75rem;
    color: rgba($color, 0.75);
    margin: 0;
  }

  .footer-auth-container {
    background-color: $background;
    color: $color;
    border-radius: 1.5rem;
    position: relative;
    overflow: hidden;
    padding: 4rem 3rem;
    max-width: calc(960px - 4rem);
    // padding-top: 4rem;
    // padding-bottom: 4rem;
  }

  .footer-auth-content {
    position: relative;
    z-index: 1;
    margin-right: 50%;
  }

  .footer-auth-background {
    position: absolute;
    top: -64px;
    left: 45%;
    right: 0;
    bottom: 0;
    // opacity: 0.75;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 200px;
      background: linear-gradient(to right, $background, rgba($background, 0));
    }

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
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .footer-auth-content {
      margin-right: 30%;
    }

    .footer-auth-background {
      left: 0;
      top: -120px;
      transform: translate(35%);

      :deep(img) {
        object-position: 50% calc(50% + 32px);
      }
    }

    .benefit-list {
      flex-direction: column;
    }
  }
}
</style>
