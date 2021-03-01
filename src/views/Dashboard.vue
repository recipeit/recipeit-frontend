<template>
  <div class="layout__page">
    <router-view v-slot="{ Component }">
      <transition name="page-component-fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
  <NavigationBar />
</template>

<script>
import NavigationBar from '@/components/NavigationBar'

export default {
  components: {
    NavigationBar
  }
}
</script>
