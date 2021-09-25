<template>
  <div class="navigation-bar">
    <router-link :to="{ name: APP_HOME }" class="logo-link">
      <Logotype class="logo" />
    </router-link>
    <router-link :to="{ name: APP_HOME }" class="navigation-bar__item">
      <BaseIcon class="item-icon" icon="home" />
      <span class="item-name">Start</span>
    </router-link>
    <router-link :to="{ name: APP_RECIPES }" class="navigation-bar__item">
      <BaseIcon class="item-icon" icon="cookbook" />
      <span class="item-name">Przepisy</span>
    </router-link>
    <router-link :to="{ name: APP_COOK_IT }" class="navigation-bar__item">
      <!-- <BaseIcon class="item-icon"icon="chef-hat" weight="fill" /> -->
      <BaseIcon class="item-icon" icon="chef-hat" />
      <span class="item-name">Ugotuj to!</span>
    </router-link>
    <router-link :to="{ name: APP_MY_KITCHEN }" class="navigation-bar__item">
      <NavigationBarAnimatedIcon ref="myKitchenIcon">
        <BaseIcon class="item-icon" icon="food" />
      </NavigationBarAnimatedIcon>
      <span class="item-name">Kuchnia</span>
    </router-link>
    <router-link :to="{ name: APP_SHOPPING_LIST }" class="navigation-bar__item">
      <NavigationBarAnimatedIcon ref="shoppingListIcon">
        <BaseIcon class="item-icon" icon="basket" />
      </NavigationBarAnimatedIcon>
      <span class="item-name">Zakupy</span>
    </router-link>
  </div>
</template>

<script>
import Logotype from '@/components/Logotype'
import { APP_COOK_IT, APP_HOME, APP_MY_KITCHEN, APP_RECIPES, APP_SHOPPING_LIST } from '@/router/names'
import NavigationBarAnimatedIcon from '@/components/NavigationBarAnimatedIcon'
import { ref } from '@vue/reactivity'
import eventHub from '@/services/eventHub'
import { useRoute } from 'vue-router'

export default {
  components: {
    Logotype,
    NavigationBarAnimatedIcon
  },
  setup() {
    const route = useRoute()

    const myKitchenIcon = ref(null)
    const shoppingListIcon = ref(null)

    const runAddToKitchenAnimation = () => {
      if (route.name !== APP_MY_KITCHEN) {
        myKitchenIcon.value?.startAnimation()
      }
    }
    const runAddToShoppingListAnimation = () => {
      if (route.name !== APP_SHOPPING_LIST) {
        shoppingListIcon.value?.startAnimation()
      }
    }

    eventHub.$on('add-to-kitchen', runAddToKitchenAnimation)
    eventHub.$on('add-to-shopping-list', runAddToShoppingListAnimation)

    return {
      APP_HOME,
      APP_RECIPES,
      APP_COOK_IT,
      APP_MY_KITCHEN,
      APP_SHOPPING_LIST,
      runAddToKitchenAnimation,
      runAddToShoppingListAnimation,
      myKitchenIcon,
      shoppingListIcon
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-link {
  display: none;

  @media (min-width: 721px) {
    display: block;
    width: 128px;
    padding: 4px 0;
    margin-bottom: 1rem;
    color: var(--color-max-contrast);
  }
}

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
    padding: 16px 0;
    text-align: center;
    font-size: 1.5rem;
    color: var(--color-link-text-primary-color);
    // transition: color 0.3s ease;
    position: relative;
    line-height: 0;
    text-decoration: none;

    @include transition((color));

    .item-icon {
      @include transition((color, transform));
    }

    .item-name {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      line-height: 1;
      font-size: 0.625rem;
      font-weight: 600;
      opacity: 0.75;
      margin-top: 0.5rem;
      height: 1.5em;
      padding: 0 0.25rem;
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

    &.router-link-exact-active {
      color: var(--color-primary);

      .item-icon {
        transform: scale(1.2);
      }
    }
  }

  @media (min-width: 721px) {
    position: static;
    flex-direction: column;
    justify-content: flex-start;
    padding: 48px 0 48px 32px;

    &__item {
      flex: unset;
      text-align: left;
      padding: 1rem 0;
      display: flex;
      align-items: center;

      .item-name {
        display: inline-block;
        margin: 0 0 0 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: left;
        padding: 0;
        opacity: 1;
        height: auto;
      }

      .item-icon {
        color: var(--color-text-secondary);
      }

      &.router-link-exact-active {
        .item-icon {
          transform: none;
          color: var(--color-primary);
        }
      }
    }
  }
}
</style>
