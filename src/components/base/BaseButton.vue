<template>
  <component :is="tag" v-blur-on-click class="button" :class="classList">
    <slot />
    <Spinner class="button-spinner" :show="loading" />
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import Spinner from '@/components/Spinner.vue'

type BaseButtonTag = 'button' | 'a' | 'span'

export default defineComponent({
  components: { Spinner },

  props: {
    color: {
      type: String,
      default: ''
    },
    size: {
      type: String
    },
    stroked: {
      type: Boolean
    },
    raised: {
      type: Boolean
    },
    subtle: {
      type: Boolean
    },
    anchorTag: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String as PropType<BaseButtonTag>,
      default: 'button'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const classList = computed(() => {
      return [
        props.color ? `button--${props.color}` : '',
        props.stroked ? 'button--stroked' : '',
        props.raised ? 'button--raised' : '',
        props.subtle ? 'button--subtle' : '',
        props.size === 'small' ? 'button--small' : '',
        props.loading ? 'loading' : ''
      ]
    })

    return {
      classList
    }
  }
})
</script>

<style lang="scss" scoped>
@mixin button-raised($colorsMap) {
  $background: #{map-get($colorsMap, 'background')};
  $background-hover: #{map-get($colorsMap, 'background-hover')};
  $background-active: #{map-get($colorsMap, 'background-active')};
  $color: #{map-get($colorsMap, 'color')};

  background-color: $background;
  color: $color;
  // box-shadow: 0 12px 32px -16px $background;

  @include cursor-only {
    &:hover,
    &:focus {
      // box-shadow: 0 12px 32px -16px $background;
      background-color: $background-hover;
      // transform: scale(1.05);
    }
  }

  &:active {
    // box-shadow: 0 12px 32px -16px $background;
    background-color: $background-active;
    // transform: scale(1.05);
  }
}

@mixin button-subtle($colorsMap) {
  // $base-background-opacity: subtle-button-background-opacity($background);
  $background: #{map-get($colorsMap, 'background')};
  $background-hover: #{map-get($colorsMap, 'background-hover')};
  $background-active: #{map-get($colorsMap, 'background-active')};
  $color: #{map-get($colorsMap, 'color')};

  background-color: $background;
  color: $color;

  @include cursor-only {
    &:hover,
    &:focus {
      background-color: $background-hover;
    }
  }

  &:active {
    background-color: $background-active;
  }
}

@mixin button-stroked($colorsMap) {
  $color: #{map-get($colorsMap, 'color')};

  color: $color;
}

.button {
  $root: &;

  border-radius: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: var(--color-text-primary);
  padding: 12px 32px;
  font-family: inherit;
  font-weight: 600;
  font-size: 12px;
  box-sizing: border-box;
  text-decoration: none;
  @include transition(all);
  cursor: pointer;

  &#{ $root }--small {
    // font-weight: 500;
    height: 40px;
  }

  &#{ $root }--raised {
    background-color: var(--color-button-contrast);
    color: var(--color-button-contrast-text);

    @include cursor-only {
      &:hover,
      &:focus {
        background-color: var(--color-button-contrast-hover);
      }
    }

    &:active {
      background-color: var(--color-button-contrast-active);
    }
    // box-shadow: 0 12px 32px -16px $background;
    // @include button-raised($gray-light);

    @each $color, $value in $button-raised-variables {
      &#{ $root }--#{ $color } {
        @include button-raised($value);
      }
    }

    // :root[theme='dark'] & {
    //   @each $color, $value in $button-colors-dark {
    //     &#{ $root }--#{ $color } {
    //       @include button-raised($value);
    //       box-shadow: none;
    //     }
    //   }
    // }
  }

  &#{ $root }--subtle {
    // @include button-subtle($gray-light);
    color: var(--color-text-primary);

    @each $color, $value in $button-subtle-variables {
      @if ($color == 'disabled') {
        &[disabled] {
          @include button-subtle($value);
        }
      } @else {
        &#{ $root }--#{ $color } {
          @include button-subtle($value);
        }
      }
    }
  }

  &#{ $root }--stroked {
    color: var(--color-text-primary);
    background-color: transparent;
    border: 1px solid var(--color-border);

    @include cursor-only {
      &:not([disabled]):not(.loading):hover,
      &:not([disabled]):not(.loading):focus {
        border-color: var(--color-border-hover);
      }
    }

    &:not([disabled]):not(.loading):active {
      border-color: var(--color-border-active);
    }

    @each $color, $value in $button-stroked-variables {
      &#{ $root }--#{ $color } {
        @include button-stroked($value);
      }
    }
  }

  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &.loading {
    pointer-events: none;
  }

  .button-spinner {
    width: calc(2em + 0.75rem);
  }
}
</style>
