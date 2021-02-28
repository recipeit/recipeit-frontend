<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Moje konto'"></PageHeader>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  name: 'MyAccount',
  components: { PageHeader },
  data: () => ({})
}
</script>

<style lang="scss" scoped></style>
