<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Moje konto'"></PageHeader>

    <h3>Profil (edytuj)</h3>
    <h5>Avatar</h5>
    <h5>Email</h5>
    <h5>Nazwa</h5>
    <h5>Hasło</h5>

    <h3>Ustawienia</h3>
    <h5>Powiadomienia systemowe (tak|nie)</h5>
    <h5>Wygląd (dark|light|system)</h5>

    <h3>Ukryta zawartość</h3>
    <h5>Ukryte blogi (zarządzaj)</h5>
    <h5>Ukryte przepisy (zarządzaj)</h5>
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
