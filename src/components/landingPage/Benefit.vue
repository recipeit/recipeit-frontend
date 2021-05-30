<template>
  <div class="benefit">
    <BaseIcon class="benefit-icon" :icon="icon" />
    <div class="benefit-title">{{ title }}</div>
    {{ description }}
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
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
.benefit {
  flex: 1;
  font-size: 0.875rem;
  text-align: center;
  color: var(--color-text-dark);
  padding: 1rem;

  .benefit-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .benefit-title {
    font-weight: bold;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
    line-height: 1.15;
  }

  @media (max-width: 720px) {
    padding-left: 0;
    padding-right: 0;
    text-align: left;
  }
}
</style>
