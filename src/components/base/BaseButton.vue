<template>
  <button v-if="!anchorTag" class="button" :class="classList"><slot /></button>
  <a v-else class="button" :class="classList"><slot /></a>
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
@mixin button-raised($background) {
  background-color: $background;
  color: get-contrast-color($background);
  box-shadow: 0 12px 32px -16px $background;

  &:hover {
    // box-shadow: 0 12px 32px -16px $background;
    background-color: lighten($background, 10);
    // transform: scale(1.05);
  }

  &:active {
    // box-shadow: 0 12px 32px -16px $background;
    background-color: lighten($background, 20);
    // transform: scale(1.05);
  }
}

@mixin button-subtle($background) {
  $base-background-opacity: subtle-button-background-opacity($background);

  background-color: rgba($background, $base-background-opacity);
  color: $background;

  &:hover {
    background-color: rgba($background, $base-background-opacity + 0.05);
  }

  &:active {
    background-color: rgba($background, $base-background-opacity + 0.1);
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
  color: $text-primary;
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
    @include button-raised($gray-light);

    @each $color, $value in $button-colors {
      &#{ $root }--#{ $color } {
        @include button-raised($value);
      }
    }
  }

  &#{ $root }--subtle {
    @include button-subtle($gray-light);
    color: $text-primary;

    @each $color, $value in $button-colors {
      &#{ $root }--#{ $color } {
        @include button-subtle($value);
      }
    }
  }

  &#{ $root }--stroked {
    @include button-stroked($text-primary);
    background-color: transparent;
    border: 1px solid $border;

    &:hover {
      border-color: darken($border, 15);
    }

    &:active {
      border-color: darken($border, 30);
    }

    @each $color, $value in $button-colors {
      &#{ $root }--#{ $color } {
        @include button-stroked($value);
      }
    }
  }
}
</style>
