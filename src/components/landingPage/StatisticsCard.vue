<template>
  <div class="statistics-card">
    <BaseIcon class="statistics-card-icon" :icon="icon" />
    <div class="statistics-card-description" v-html="description" />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-card {
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  max-width: calc(100% / 3 - 4rem / 3);
  scroll-snap-align: start;
  scroll-snap-stop: always;
  width: 100%;
  flex-shrink: 0;

  .statistics-card-icon {
    color: var(--color-primary);
    font-size: 2.5rem;
  }

  .statistics-card-description {
    font-size: 0.875rem;
    margin-top: 0.5rem;
    color: var(--color-text-dark);

    :deep(b) {
      font-weight: bold;
      color: var(--color-text-primary);
    }
  }

  @media (max-width: 720px) {
    max-width: 256px;
    padding: 1.5rem;
  }
}
</style>
