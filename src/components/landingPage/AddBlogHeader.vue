<template>
  <div class="footer-auth">
    <Container class="footer-auth-container">
      <div class="footer-auth-content">
        <h1 class="footer-auth-header">Dodaj blog</h1>
        <p class="footer-auth-description">
          Jeżeli tworzysz blog kulinarny, na którym publikujsz swoje przepisy, możesz dodać go do Recipeit. Poniżej znajduje się instrukcja,
          jak to zrobić.
        </p>
      </div>
      <BaseImageLazyload :src="BackgroundUrl" class="footer-auth-background" />
    </Container>
  </div>
</template>

<script>
import Container from './Container'
// import BackgroundUrl from '@/assets/img/add-blog.jpg'

export default {
  components: { Container },
  setup: () => ({
    BackgroundUrl:
      'https://image.shutterstock.com/shutterstock/photos/1896336256/display_1500/stock-photo-young-woman-using-a-tablet-computer-to-cook-in-her-kitchen-at-home-healthy-food-concept-1896336256.jpg'
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
    top: -20px;
    left: 40%;
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
      top: -80px;
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
