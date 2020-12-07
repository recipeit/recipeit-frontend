<template>
  <span v-if="isFavourite" class="favourite favourite--active" @click="$emit('removed')">
    <BaseIcon icon="heartFull" />
  </span>
  <span class="favourite" v-else @click="$emit('added')">
    <BaseIcon icon="heart" />
  </span>
</template>

<script>
export default {
  props: {
    isFavourite: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.favourite {
  font-size: 1em;
  line-height: 0;
  color: $text-secondary;
  cursor: pointer;

  &--active {
    color: $red;
  }
}
</style>
