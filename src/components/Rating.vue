<template>
  <div class="rating">
    <BaseIcon icon="star" class="rating-icon" />
    <div class="rating-value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: center;

  .rating-icon {
    font-size: 16px;
    color: var(--color-yellow);
    margin-right: 4px;
  }

  .rating-value {
    font-size: 12px;
    font-weight: 700;
  }
}
</style>
