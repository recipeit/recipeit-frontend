<template>
  <AnonymousPage>
    <div class="creators">
      <h1 class="header">Twórcy aplikacji</h1>
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

export default {
  components: { AnonymousPage },
  setup() {
    useMeta({
      title: 'Twórcy'
    })
  }
}
</script>

<style lang="scss" scoped>
.creators {
  font-size: 0.75rem;
  line-height: 1.75;

  .header {
    font-size: 1.25rem;
  }

  .list {
    list-style: disc;
    padding-inline-start: 40px;
  }

  .list-item {
    margin: 0.75rem 0;
  }
}
</style>
