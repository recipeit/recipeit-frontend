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
  color: var(--color-text-primary);
  outline: 0;
  padding: 0;
  background-color: transparent;
  border: none;

  &:hover,
  &:focus {
    color: var(--color-accent);
  }

  &:active {
    color: var(--color-accent-lighter);
  }

  &--color-text-primary {
    &:hover,
    &:focus {
      color: mix($text-primary, $text-secondary);
    }

    &:active {
      color: var(--color-text-secondary);
    }
  }

  &--color-text-secondary {
    color: var(--color-text-secondary);

    &:hover,
    &:focus {
      color: mix($text-secondary, #fff, 75%);
    }

    &:active {
      color: mix($text-secondary, #fff, 50%);
    }
  }

  &--color-accent {
    color: var(--color-accent);

    &:hover,
    &:focus {
      color: var(--color-accent-lighter);
    }

    &:active {
      color: var(--color-accent-lightest);
    }
  }

  &--color-primary {
    color: var(--color-primary);

    &:hover,
    &:focus {
      color: var(--color-primary-lighter);
    }

    &:active {
      color: var(--color-primary-lightest);
    }
  }

  &--color-red {
    color: var(--color-red);

    &:hover,
    &:focus {
      color: var(--color-red-lighter);
    }

    &:active {
      color: var(--color-red-lightest);
    }
  }

  &:not(:disabled) {
    cursor: pointer;
  }
}
</style>
