<template>
  <div class="menu">
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

<style></style>
