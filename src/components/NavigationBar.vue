<template>
  <div class="navigation-bar">
    <router-link :to="{ name: 'home' }" class="navigation-bar__item">
      <BaseIcon class="navigation-bar__item__icon" icon="home" />
      <span>Kokpit</span>
    </router-link>
    <router-link :to="{ name: 'recipes' }" class="navigation-bar__item">
      <BaseIcon class="navigation-bar__item__icon" icon="cookbook" />
      <span>Przepisy</span>
    </router-link>
    <router-link :to="{ name: 'cook-it' }" class="navigation-bar__item">
      <!-- <BaseIcon class="navigation-bar__item__icon"icon="chef-hat" weight="fill" /> -->
      <BaseIcon class="navigation-bar__item__icon" icon="chef-hat" />
      <span>Ugotuj to!</span>
    </router-link>
    <router-link :to="{ name: 'my-kitchen' }" class="navigation-bar__item">
      <BaseIcon class="navigation-bar__item__icon" icon="food" />
      <span>Moja kuchnia</span>
    </router-link>
    <router-link :to="{ name: 'shopping-list' }" class="navigation-bar__item">
      <BaseIcon class="navigation-bar__item__icon" icon="basket" />
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
  // padding: 28px 0;
  padding: 0 5%;
  background-color: rgba(var(--color-background-rgb), 0.95);
  display: flex;
  justify-content: space-evenly;

  @supports (backdrop-filter: blur(20px)) {
    background-color: rgba(var(--color-background-rgb), 0.8);
    backdrop-filter: saturate(180%) blur(8px);
  }

  &__item {
    flex: 1;
    padding: 28px 0;
    text-align: center;
    font-size: 1.5rem;
    color: var(--color-link-text-primary-color);
    // transition: color 0.3s ease;
    position: relative;
    line-height: 0;
    // @include transition((color, transform));

    &__icon {
      @include transition((color, transform));
    }

    span {
      display: none;
    }

    &:hover {
      color: var(--color-link-text-primary-color-hover);
    }

    &:active {
      color: var(--color-link-text-primary-color-active);
    }

    // &:after {
    //   content: '';
    //   height: 2px;
    //   background-color: transparent;
    //   bottom: -10px;
    //   margin: auto;
    //   left: 50%;
    //   right: 50%;
    //   border-radius: 10px;
    //   position: absolute;
    //   transition: all 0.3s ease;
    // }

    &.router-link-exact-active &__icon {
      color: var(--color-primary);
      transform: scale(1.5);

      // ::v-deep(svg) {
      // }
      // filter: drop-shadow(0 0 4px #fff);

      // &:after {
      //   background-color: var(--color-primary);
      //   left: 0;
      //   right: 0;
      // }
    }
  }
}
</style>
