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
import BackgroundUrl from '@/assets/img/add-blog.jpg'

export default {
  components: { Container },
  setup: () => ({
    BackgroundUrl
  })
}
</script>

<style lang="scss" scoped>
.footer-auth {
  // padding: 0 1.5rem;
  // text-align: center;

  .footer-auth-header {
    font-size: 2rem;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }

  .footer-auth-description {
    font-size: 0.75rem;
    color: rgba(#fff, 0.75);
    margin: 0;
  }

  .footer-auth-container {
    background-color: #000;
    color: #fff;
    border-radius: 1.5rem;
    position: relative;
    overflow: hidden;
    padding: 4rem 3rem;
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
    top: 0;
    left: 40%;
    right: 0;
    bottom: 0;
    // opacity: 0.75;

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
