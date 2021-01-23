<template>
  <component :is="tag" :class="classList">
    <slot />
  </component>
</template>

<script>
const tagOptions = ['a', 'button']
const colorOptions = [null, 'primary', 'accent', 'text-primary', 'text-secondary', 'red']

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

<style lang="scss" scoped>
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
    color: mix($accent, #fff, 50%);
  }

  &--color-text-primary {
    &:hover,
    &:focus {
      color: mix($text-primary, $text-secondary);
    }

    &:active {
      color: $text-secondary;
    }
  }

  &--color-text-secondary {
    color: $text-secondary;

    &:hover,
    &:focus {
      color: mix($text-secondary, #fff, 75%);
    }

    &:active {
      color: mix($text-secondary, #fff, 50%);
    }
  }

  &--color-accent {
    color: $accent;

    &:hover,
    &:focus {
      color: mix($accent, #fff, 75%);
    }

    &:active {
      color: mix($accent, #fff, 50%);
    }
  }

  &--color-primary {
    color: $primary;

    &:hover,
    &:focus {
      color: mix($primary, #fff, 75%);
    }

    &:active {
      color: mix($primary, #fff, 50%);
    }
  }

  &--color-red {
    color: $red;

    &:hover,
    &:focus {
      color: mix($red, #fff, 75%);
    }

    &:active {
      color: mix($red, #fff, 50%);
    }
  }

  &:not(:disabled) {
    cursor: pointer;
  }
}
</style>
