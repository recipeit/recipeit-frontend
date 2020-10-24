<template>
  <div class="layout">
    <div class="layout__page">
      <router-view />
    </div>
    <NavigationBar />
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar'

export default {
  components: {
    NavigationBar
  }
}
</script>

<style lang="scss">
@import './styles/styles';

.layout {
  max-width: 460px;
  box-sizing: border-box;
  margin: 0 auto;
  background: white;
  min-height: 100%;
  box-shadow: 0 0 64px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  &__page {
    padding: 32px 32px 0 32px;
    flex: 1;
  }
}
</style>
