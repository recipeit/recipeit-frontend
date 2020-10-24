<template>
  <div class="navigation-bar">
    <router-link :to="{ name: 'home' }">Kokpit</router-link>
    <router-link :to="{ name: 'recipes' }">Przepisy</router-link>
    <router-link :to="{ name: 'cook-it' }">Ugotuj to!</router-link>
    <router-link :to="{ name: 'my-kitchen' }">Moja kuchnia</router-link>
    <router-link :to="{ name: 'shopping-list' }">Lista zakupów</router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.navigation-bar {
  position: sticky;
  bottom: 0;
  padding: 32px;
  background-color: rgba(#fff, 0.95);

  @supports (backdrop-filter: blur(20px)) {
    background-color: rgba(#fff, 0.8);
    backdrop-filter: saturate(180%) blur(20px);
  }
}
</style>
