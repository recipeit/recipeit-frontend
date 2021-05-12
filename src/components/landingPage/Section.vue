<template>
  <section :class="{ section: true, 'section--inverse': inverse }">
    <div class="section-text">
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-description">{{ description }}</p>
    </div>
    <div class="section-image">
      <BaseImageLazyload
        class="image"
        src="https://thumbs.dreamstime.com/b/perspective-smartphone-mockup-shadow-ccw-rotated-white-background-isometric-smartphones-front-back-side-one-above-105813174.jpg"
      />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    image: String,
    inverse: Boolean
  }
}
</script>

<style lang="scss" scoped>
.section {
  align-items: center;
  display: flex;
  margin: 96px 0;

  &--inverse {
    flex-direction: row-reverse;
  }

  @media (max-width: 720px) {
    flex-direction: column;
    text-align: center;
  }

  &-text {
    flex: 1;
  }

  &-title {
    margin-top: 0;
    font-size: 2rem;
    line-height: 1.15;
  }

  &-description {
    font-size: 0.875rem;
  }

  &-image {
    flex: 1;
  }

  .image {
    width: 100%;

    ::v-deep(img) {
      width: 100%;
    }
  }
}
</style>
