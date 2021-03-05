<template>
  <button v-if="!anchorTag" v-blur-on-click class="button" :class="classList"><slot /></button>
  <a v-else v-blur-on-click class="button" :class="classList"><slot /></a>
</template>

<script>
export default {
  props: {
    color: {
      type: String
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
    }
  },
  computed: {
    classList() {
      return [
        this.color ? `button--${this.color}` : '',
        this.stroked ? 'button--stroked' : '',
        this.raised ? 'button--raised' : '',
        this.subtle ? 'button--subtle' : '',
        this.size === 'small' ? 'button--small' : ''
      ]
    }
  }
}
</script>

<style lang="scss">
@mixin button-raised($colorsMap) {
  $background: #{map-get($colorsMap, 'background')};
  $background-hover: #{map-get($colorsMap, 'background-hover')};
  $background-active: #{map-get($colorsMap, 'background-active')};
  $color: #{map-get($colorsMap, 'color')};

  background-color: $background;
  color: $color;
  // box-shadow: 0 12px 32px -16px $background;

  &:hover {
    // box-shadow: 0 12px 32px -16px $background;
    background-color: $background-hover;
    // transform: scale(1.05);
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

  &:hover {
    background-color: $background-hover;
  }

  &:active {
    background-color: $background-active;
  }
}

@mixin button-stroked($color) {
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
  transition: all 0.3s ease;
  cursor: pointer;

  &#{ $root }--small {
    font-weight: 500;
    height: 40px;
  }

  &#{ $root }--raised {
    background-color: var(--color-button-contrast);
    color: var(--color-button-contrast-text);

    &:hover {
      background-color: var(--color-button-contrast-hover);
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
      &#{ $root }--#{ $color } {
        @include button-subtle($value);
      }
    }
  }

  &#{ $root }--stroked {
    @include button-stroked(var(--color-text-primary));
    background-color: transparent;
    border: 1px solid var(--color-border);

    &:hover {
      border-color: var(--color-border-hover);
    }

    &:active {
      border-color: var(--color-border-active);
    }

    @each $color, $value in $button-stroked-variables {
      &#{ $root }--#{ $color } {
        @include button-stroked($value);
      }
    }
  }
}
</style>
