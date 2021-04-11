<template>
  <div class="layout__page__content">
    <PageHeader title="Ukryte blogi" :backButton="true" />
    <div v-if="hiddenBlogs === null">
      ...wczytuje
    </div>
    <ul v-else-if="hiddenBlogs.length > 0">
      <li v-for="blog in hiddenBlogs" :key="blog.id">{{ blog.name }}</li>
    </ul>
    <div v-else>
      Nie ukryłeś jeszcze żadnego blogu
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    hiddenBlogs: null
  }),
  beforeMount() {
    userApi.getHiddenBlogs().then(({ data }) => {
      this.hiddenBlogs = data.blogs || []
    })
  }
}
</script>

<style lang="scss" scoped></style>
