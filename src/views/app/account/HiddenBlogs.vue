<template>
  <div class="layout__page__content">
    <PageHeader title="Ukryte blogi" :back-button="true" />
    <div v-if="hiddenBlogs === null">
      ...wczytuje
    </div>
    <ul v-else-if="hiddenBlogs.length > 0" class="blogs-list">
      <li v-for="blog in hiddenBlogs" :key="blog.id" class="blogs-list-item">
        <HiddenBlog :blog="blog" @unhide="unhideBlog(blog.id)" />
      </li>
    </ul>
    <div v-else>
      Nie ukryłeś jeszcze żadnego blogu
    </div>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

import userApi from "@/src/api/userApi";

import HiddenBlog from "@/src/components/HiddenBlog";
import PageHeader from "@/src/components/PageHeader";

export default {
  components: {
    PageHeader,
    HiddenBlog,
  },
  setup() {
    useMeta({
      title: "Ukryte blogi",
    });
  },
  data: () => ({
    hiddenBlogs: null,
  }),
  beforeMount() {
    userApi.getHiddenBlogs().then(({ data }) => {
      this.hiddenBlogs = data.blogs || [];
    });
  },
  methods: {
    unhideBlog(id) {
      this.$store
        .dispatch("user/changeBlogVisibility", { blogId: id, visible: true })
        .then(() => {
          const index = this.hiddenBlogs.findIndex((v) => v.id === id);
          this.hiddenBlogs.splice(index, 1);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.blogs-list-item {
  & + & {
    margin-top: 1rem;
  }
}
</style>
