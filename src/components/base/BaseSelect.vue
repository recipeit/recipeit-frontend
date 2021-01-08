<template>
  <div class="select">
    <!-- {{ searchable }} -->
    <div
      :tabindex="searchable ? -1 : 1"
      @focus="open()"
      @blur="searchable ? false : hide()"
      :class="['select__input', { 'select__input--selected': modelValue !== null }]"
    >
      <span
        :class="[
          'select__input__placeholder',
          { 'select__input__placeholder--small': searchable ? opened || modelValue !== null : modelValue !== null }
        ]"
        >Wybierz jednostkę</span
      >
      <template v-if="searchable">
        <input
          v-show="opened"
          class="select__input__input"
          ref="search"
          tabindex="1"
          @focus.prevent="open()"
          @blur.prevent="hide()"
          :value="search"
        />
      </template>
      <span v-if="searchable ? !opened && modelValue !== null : modelValue !== null" class="select__input__value">
        {{ modelValue }}
      </span>
    </div>
    <transition name="fade">
      <div v-show="opened" class="select__options">
        <ul>
          <li v-for="option in options" :key="option" @click="selectOption(option)">{{ option }}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    searchable: {
      type: Boolean,
      default: false
    },
    modelValue: { default: null },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      search: '',
      opened: false
    }
  },
  methods: {
    open() {
      this.opened = true
      if (this.searchable) {
        this.$nextTick(() => this.$refs.search && this.$refs.search.focus())
      } else {
        this.$el.focus()
      }
    },
    hide() {
      this.opened = false
    },
    selectOption(newValue) {
      if (this.searchable) {
        this.search = ''
      }
      this.$emit('update:modelValue', newValue === this.modelValue ? null : newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.select {
  position: relative;

  &__input {
    position: relative;
    height: 48px;
    border-bottom: 2px solid $border;
    overflow: hidden;
    cursor: pointer;

    &__placeholder {
      position: absolute;
      height: 48px;
      display: flex;
      align-items: center;
      color: $text-secondary;
      // transform-origin: top left;
      @include transition((height, font-size, color));

      &--small {
        height: 12px;
        font-size: 12px;
        color: $text-primary;
        font-weight: bold;
        // transform: scale(0.75);
      }
    }

    &__input {
      display: block;
      height: 48px;
      display: flex;
      align-items: center;
      // margin-top: 6px;
      border: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      padding: 0;
      padding-top: 6px;
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }

    &__value {
      box-sizing: border-box;
      width: 100%;
      display: block;
      height: 48px;
      display: flex;
      align-items: center;
      padding-top: 6px;
      // margin-top: 6px;
    }

    // &--selected &__placeholder {
    //   height: 12px;
    //   font-size: 12px;
    //   color: $text-primary;
    //   font-weight: bold;
    //   // transform: scale(0.75);
    // }
  }

  &__options {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    padding: 8px 0;
    z-index: 1000;

    li {
      padding: 8px 16px;
      cursor: pointer;
      @include transition((background));

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>
