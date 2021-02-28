<template>
  <div class="rating">
    <BaseIcon icon="star" class="rating__icon" />
    <div class="rating__value">{{ value }}</div>
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

  &__icon {
    font-size: 16px;
    color: $yellow;
    margin-right: 4px;
  }

  &__value {
    font-size: 12px;
    font-weight: 700;
  }
}
</style>
