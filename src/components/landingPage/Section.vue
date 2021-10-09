<template>
  <section :class="{ section: true, 'section--inverse': inverse }">
    <div class="section-text">
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-description">{{ description }}</p>
    </div>
    <div class="section-image">
      <BaseImageLazyload class="image" :src="image" />
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

  &:last-child {
    margin-bottom: 48px;
  }

  .section-text {
    flex: 1;
    margin: 0 16px 0 0;
  }

  .section-title {
    margin-top: 0;
    font-size: 2rem;
    line-height: 1.15;
  }

  .section-description {
    font-size: 0.875rem;
    color: var(--color-text-dark);
  }

  .section-image {
    flex: 1;
    height: 720px;
    text-align: right;

    :deep(img) {
      height: 100%;
      object-fit: contain;
      border-radius: 2rem;
      box-shadow: 0 24px 64px -8px rgba(0, 0, 0, 0.1);
    }
  }

  .image {
    height: 100%;
  }

  &.section--inverse {
    flex-direction: row-reverse;

    .section-image {
      text-align: left;
    }

    .section-text {
      margin: 0 0 0 16px;
    }
  }

  @media (max-width: 720px) {
    &,
    &.section--inverse {
      flex-direction: column;
      align-items: flex-start;

      .section-text {
        margin: 0;
      }

      .image {
        height: auto;
        width: 100%;
      }

      .section-image {
        flex: initial;
        height: auto;
        width: 240px;
        margin-top: 1rem;

        :deep(img) {
          height: auto;
          width: 100%;
          border-radius: 1.5rem;
        }
      }
    }
  }
}
</style>
