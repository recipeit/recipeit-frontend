<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Pomoc'" />

    <h3>FAQ</h3>

    <p>Nie znalazłeś odpowiedzi? <BaseLink :href="contactUsHref" color="primary">Napisz do nas!</BaseLink></p>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'

import { CONTACT_MAIL_ADDRESS } from '@/configs/emails'

import PageHeader from '@/components/PageHeader'

export default {
  name: 'Help',
  components: { PageHeader },
  setup() {
    useMeta({
      title: 'Pomoc'
    })

    const contactUsHref = `mailto:${CONTACT_MAIL_ADDRESS}`

    return {
      contactUsHref
    }
  }
}
</script>
