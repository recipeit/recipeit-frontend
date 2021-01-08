<template>
  <div class="layout__page__content">
    <h1>
      <span style="font-weight: 500">{{ $t(welcomeType) }},</span> Kamil!
    </h1>
    <!-- <base-link color="accent">Kliknij we mnie</base-link> -->
    <base-select class="base-select" :searchable="true" v-model="selectModel" :options="selectOptions"></base-select>
    <base-select class="base-select" v-model="selectModel2" :options="selectOptions"></base-select>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    const hour = new Date().getHours()
    const welcomeType = hour < 5 || hour > 16 ? 'welcome.evening' : hour < 12 ? 'welcome.morning' : 'welcome.afternoon'

    return {
      welcomeType,
      selectModel: null,
      selectModel2: null,
      selectOptions: ['Alaska', 'Alabama', 'Kalifornia']
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  margin: 16px 0;
}
</style>
