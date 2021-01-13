<template>
  <div class="layout__page__content">
    <h1>
      <span style="font-weight: 500">{{ $t(welcomeType) }},</span> Kamil!
    </h1>
    <!-- <base-link color="primary">Kliknij we mnie</base-link> -->
    <base-select
      placeholder="Wybierz stan"
      class="base-select"
      :searchable="true"
      v-model="selectModel"
      :options="selectOptions"
    ></base-select>
    <base-select placeholder="Wybierz stan" class="base-select" v-model="selectModel2" :options="selectOptions"></base-select>
    <base-select
      placeholder="Wybierz stan"
      class="base-select"
      v-model="selectModel3"
      :options="selectOptions3"
      trackBy="id"
      label="name"
    ></base-select>
    {{ selectModel3 }}
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
      selectModel3: null,
      selectOptions: ['Alaska', 'Alabama', 'Kalifornia'],
      selectOptions3: [
        { id: 1, name: 'Alaska' },
        { id: 2, name: 'Alabama' },
        { id: 3, name: 'Kalifornia' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  margin: 16px 0;
}
</style>
