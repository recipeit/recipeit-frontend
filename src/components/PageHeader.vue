<template>
  <header v-if="search" class="page-header">
    <transition name="fahade">
      <div v-show="!opened" class="page-header__content">
        <BaseLink v-if="backButton" class="page-header__back-icon" color="text-primary" @click="$router.go(-1)">
          <BaseIcon icon="arrowLeft" weight="semiBold" />
        </BaseLink>

        <div class="page-header__title-container">
          <slot name="title">
            <h1>{{ title }}</h1>
          </slot>
        </div>

        <BaseLink class="page-header__search-icon" color="text-primary" @click="openSearch()">
          <BaseIcon icon="search" weight="semiBold" />
        </BaseLink>

        <PageHeaderUser />
      </div>
    </transition>

    <transition name="fahade">
      <div v-show="opened" class="page-header__search">
        <BaseIcon class="page-header__search__search-icon" icon="search" weight="semiBold" />

        <input
          ref="searchInput"
          placeholder="Szukaj przepisów"
          :value="searchValue"
          @input="updateSearch($event.target.value)"
          @blur="opened = false"
        />

        <BaseLink v-if="searchValue" class="page-header__search__clear-icon" color="text-primary" @click="searchValue = ''">
          <BaseIcon icon="close" weight="semiBold" />
        </BaseLink>
      </div>
    </transition>
  </header>
  <header v-else class="page-header">
    <div class="page-header__content">
      <div class="page-header__title-container">
        <slot name="title">
          <h1>{{ title }}</h1>
        </slot>
      </div>

      <PageHeaderUser />
    </div>
  </header>
</template>

<script>
import PageHeaderUser from './PageHeaderUser.vue'
export default {
  components: { PageHeaderUser },
  emits: ['update:modelValue'],
  props: {
    backButton: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    title: String,
    modelValue: String
  },
  data: component => ({
    opened: false,
    searchValue: component.modelValue
  }),
  methods: {
    openSearch() {
      if (this.opened) return
      this.opened = true
      this.$nextTick(() => {
        this.$refs.searchInput?.focus()
      })
    },
    updateSearch(newValue) {
      this.$emit('update:modelValue', newValue)
    }
  },
  watch: {
    modelValue(newValue) {
      this.searchValue = newValue
    }
  }
}
</script>

<style lang="scss" scoped>
.fahade {
  &-enter-active,
  &-leave-active {
    @include transition(opacity, 0.2s);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.page-header {
  position: relative;
  margin-bottom: 24px;
  min-height: $header-height;

  &__content {
    display: flex;
    gap: 12px;
  }

  &__title-container {
    flex: 1;
    min-height: $header-height;
    display: flex;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  &__search {
    $margin-fix: ($header-height - $header-search-height) / 2;
    // border: 1px solid var(--color-border);
    position: absolute;
    top: $margin-fix;
    left: $margin-fix;
    right: $margin-fix;
    bottom: $margin-fix;
    // height: 48px;
    border-radius: 2.5rem;
    padding: 0 16px;
    display: flex;
    align-items: center;
    line-height: 1rem;
    background-color: var(--color-background-flyout);
    box-shadow: 0 24px 48px -8px rgba(0, 0, 0, 0.3);

    &__search-icon {
      color: var(--color-text-secondary);
    }

    input {
      border: none;
      height: 100%;
      padding: 0 12px;
      flex: 1;
      color: inherit;
      font-family: inherit;
      outline: none;
      background: transparent;

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }

  &__back-icon,
  &__search-icon {
    width: $header-height;
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    cursor: pointer;
  }

  &__back-icon {
    margin-left: -($header-height - 1.25rem) / 2;
  }
}
</style>
