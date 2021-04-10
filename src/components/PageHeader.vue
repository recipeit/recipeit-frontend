<template>
  <header class="page-header">
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
  props: {
    backButton: {
      type: Boolean,
      default: false
    },
    title: String
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
    font-size: 1.25rem;
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
