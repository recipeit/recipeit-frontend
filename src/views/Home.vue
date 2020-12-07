<template>
  <div class="layout__page__content">
    <h1>
      <span style="font-weight: 500">{{ $t(welcomeType) }},</span> Kamil!
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    const hour = new Date().getHours()
    const welcomeType = hour < 5 || hour > 16 ? 'welcome.evening' : hour < 12 ? 'welcome.morning' : 'welcome.afternoon'

    return {
      welcomeType
    }
  }
}
</script>

<style lang="scss" scoped></style>
