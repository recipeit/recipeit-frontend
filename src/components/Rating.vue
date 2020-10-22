<template>
  <div class="rating">
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
  &__value {
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
