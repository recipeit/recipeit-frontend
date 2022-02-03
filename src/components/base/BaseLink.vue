<template>
  <component :is="tag" v-blur-on-click :class="classList">
    <slot />
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { BaseLinkColor, BaseLinkTag } from '@/typings/link'

export default defineComponent({
  props: {
    tag: {
      type: String as PropType<BaseLinkTag>,
      default: 'a'
    },
    color: {
      type: String as PropType<BaseLinkColor>,
      default: null
    }
  },

  setup(props) {
    const classList = computed(() => {
      return ['link', props.color ? `link--color-${props.color}` : null]
    })

    return {
      classList
    }
  }
})
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

  @include cursor-only {
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

    @include cursor-only {
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

    @include cursor-only {
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

    @include cursor-only {
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

    @include cursor-only {
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

    @include cursor-only {
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
