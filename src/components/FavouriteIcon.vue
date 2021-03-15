<template>
  <!-- <span v-if="isFavourite" class="favourite favourite--active" @click="$emit('removed')">
    <BaseIcon icon="heartFull" />
  </span>
  <span class="favourite" v-else @click="$emit('added')">
    <BaseIcon icon="heart" />
  </span> -->
  <BaseLink class="favourite" tag="button" @click="onClick()" :color="isFavourite ? 'red' : color">
    <BaseIcon :icon="isFavourite ? 'heartFull' : 'heart'" />
  </BaseLink>
</template>

<script>
export default {
  emits: ['added', 'removed'],
  props: {
    isFavourite: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'text-secondary'
    }
  },
  methods: {
    onClick() {
      if (this.isFavourite) {
        this.$emit('removed')
      } else {
        this.$emit('added')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.favourite {
  font-size: 1em;
  line-height: 0;
}
</style>
