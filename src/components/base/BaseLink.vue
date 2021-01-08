<template>
  <component :is="tag" :class="classList">
    <slot />
  </component>
</template>

<script>
const tagOptions = ['a', 'button']
const colorOptions = [null, 'accent', 'dark']

export default {
  props: {
    tag: {
      type: String,
      validator: prop => tagOptions.includes(prop),
      default: 'a'
    },
    color: {
      type: String,
      validator: prop => colorOptions.includes(prop),
      default: null
    }
  },
  computed: {
    classList() {
      return ['link', this.color ? `link--color-${this.color}` : null]
    }
  }
}
</script>

<style lang="scss">
.link {
  @include transition(color);
  text-decoration: none;
  color: $text-primary;
  outline: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;

  &:hover,
  &:focus {
    color: $accent;
  }

  &:active {
    color: lighten($accent, 20);
  }

  &--color-dark {
    &:hover,
    &:focus {
      color: mix($text-primary, $text-secondary);
    }

    &:active {
      color: $text-secondary;
    }
  }

  &--color-accent {
    color: $accent;

    &:hover,
    &:focus {
      color: lighten($accent, 10);
    }

    &:active {
      color: lighten($accent, 20);
    }
  }

  &:not(:disabled) {
    cursor: pointer;
  }
}
</style>
