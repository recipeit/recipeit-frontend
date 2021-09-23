<template>
  <AnonymousPage>
    <div class="contact">
      <h1 class="header">Kontakt</h1>
      <p>
        Chcesz się skontaktować? Napisz na
        <BaseLink :href="contactHref" class="link" color="primary">
          {{ CONTACT_MAIL_ADDRESS }}
        </BaseLink>
      </p>

      <h2 class="sub-header">Twórcy aplikacji</h2>
      <p>
        <b>Kamil Golec</b>, <b>Alicja Wołoszyn</b> i <b>Jakub Kozłowski</b>. To właśnie oni poświęcili swój czas i wiedzę na rozwój
        Recipeit. Bez nich aplikacja by nie powstała!
      </p>
    </div>
  </AnonymousPage>
</template>

<script>
import { useMeta } from 'vue-meta'
import AnonymousPage from '@/layouts/AnonymousPage'
import { CONTACT_MAIL_ADDRESS } from '@/configs/emails'

export default {
  components: { AnonymousPage },
  setup() {
    useMeta({
      title: 'Twórcy'
    })

    const contactHref = `mailto:${CONTACT_MAIL_ADDRESS}`

    return {
      contactHref,
      CONTACT_MAIL_ADDRESS
    }
  }
}
</script>

<style lang="scss" scoped>
.contact {
  font-size: 0.75rem;
  line-height: 1.75;

  .header {
    font-size: 1.25rem;
    margin: 0 0 1.5rem 0;
  }

  .sub-header {
    font-size: 1rem;
    margin: 3rem 0 1.5rem 0;
  }

  .list {
    list-style: disc;
    padding-inline-start: 40px;
  }

  .list-item {
    margin: 0.75rem 0;
  }

  .link {
    font-weight: 700;
  }
}
</style>
