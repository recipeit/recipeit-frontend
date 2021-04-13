<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Pomoc'" />

    <h3>FAQ</h3>

    <p>Nie znalazłeś odpowiedzi? <BaseLink href="mailto:pomoc@recipeit.pl" color="primary">Napisz do nas!</BaseLink></p>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  name: 'Help',
  components: { PageHeader },
  data: () => ({})
}
</script>

<style lang="scss" scoped></style>
