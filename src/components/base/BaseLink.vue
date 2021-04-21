<template>
  <component v-blur-on-click :is="tag" :class="classList">
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
  @include transition((color, opacity));
  text-decoration: none;
  color: var(--color-link-color);
  outline: 0;
  padding: 0;
  background-color: transparent;
  border: none;

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus {
      color: var(--color-link-color-hover);
    }
  }

  &:active {
    color: var(--color-link-color-active);
  }

  &--color-text-primary {
    color: var(--color-link-text-primary-color);

    @media (hover: hover) and (pointer: fine) {
      &:hover,
      &:focus {
        color: var(--color-link-text-primary-color-hover);
      }
    }

    &:active {
      color: var(--color-link-text-primary-color-active);
    }
  }

  &--color-text-secondary {
    color: var(--color-link-text-secondary-color);

    @media (hover: hover) and (pointer: fine) {
      &:hover,
      &:focus {
        color: var(--color-link-text-secondary-color-hover);
      }
    }

    &:active {
      color: var(--color-link-text-secondary-color-active);
    }
  }

  &--color-accent {
    color: var(--color-link-accent-color);

    @media (hover: hover) and (pointer: fine) {
      &:hover,
      &:focus {
        color: var(--color-link-accent-color-hover);
      }
    }

    &:active {
      color: var(--color-link-accent-color-active);
    }
  }

  &--color-primary {
    color: var(--color-link-primary-color);

    @media (hover: hover) and (pointer: fine) {
      &:hover,
      &:focus {
        color: var(--color-link-primary-color-hover);
      }
    }

    &:active {
      color: var(--color-link-primary-color-active);
    }
  }

  &--color-red {
    color: var(--color-link-danger-color);

    @media (hover: hover) and (pointer: fine) {
      &:hover,
      &:focus {
        color: var(--color-link-danger-color-hover);
      }
    }

    &:active {
      color: var(--color-link-danger-color-active);
    }
  }

  &:not([disabled]) {
    cursor: pointer;
  }

  &[disabled] {
    opacity: 0.5;
  }
}
</style>
