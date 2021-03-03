<template>
  <div class="navigation-bar">
    <router-link :to="{ name: 'home' }" class="navigation-bar__item">
      <BaseIcon icon="home" />
      <span>Kokpit</span>
    </router-link>
    <router-link :to="{ name: 'recipes' }" class="navigation-bar__item">
      <BaseIcon icon="cookbook" />
      <span>Przepisy</span>
    </router-link>
    <router-link :to="{ name: 'cook-it' }" class="navigation-bar__item">
      <BaseIcon icon="chefHat" />
      <span>Ugotuj to!</span>
    </router-link>
    <router-link :to="{ name: 'my-kitchen' }" class="navigation-bar__item">
      <BaseIcon icon="food" />
      <span>Moja kuchnia</span>
    </router-link>
    <router-link :to="{ name: 'shopping-list' }" class="navigation-bar__item">
      <BaseIcon icon="basket" />
      <span>Lista zakupów</span>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.navigation-bar {
  // position: sticky;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 28px 0;
  background-color: rgba(var(--color-background-rgb), 0.95);
  display: flex;
  justify-content: space-evenly;

  @supports (backdrop-filter: blur(20px)) {
    background-color: rgba(var(--color-background-rgb), 0.8);
    backdrop-filter: saturate(180%) blur(20px);
  }

  &__item {
    font-size: 1.75rem;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
    position: relative;
    line-height: 0;

    span {
      display: none;
    }

    &:hover {
      color: mix($text-primary, $text-secondary);
    }

    &:active {
      color: $text-secondary;
    }

    &:after {
      content: '';
      height: 2px;
      background-color: transparent;
      bottom: -10px;
      margin: auto;
      left: 50%;
      right: 50%;
      border-radius: 10px;
      position: absolute;
      transition: all 0.3s ease;
    }

    &.router-link-exact-active {
      color: var(--color-primary);
      // filter: drop-shadow(0 0 4px #fff);

      &:after {
        background-color: var(--color-primary);
        left: 0;
        right: 0;
      }
    }
  }
}
</style>
