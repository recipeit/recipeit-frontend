<template>
  <div class="blog-details">
    <BaseImageLazyload class="avatar" :src="'https://sprm.org.pl/wp-content/uploads/2018/04/User-icon.png'" :alt="blog.name" />
    <div class="blog-info">
      <h1 class="blog-name">{{ blog.name }}</h1>
      <BaseLink :href="blog.url" class="blog-url" color="text-secondary">{{ blog.url }}</BaseLink>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    blog: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-details {
  display: flex;

  .avatar {
    height: 64px;
    width: 64px;
    border-radius: 64px;
    overflow: hidden;
    background-color: var(--color-image-background);

    ::v-deep(img) {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}

.blog-info {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 64px;
  flex: 1;
}

.blog-name {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.25;
}

.blog-url {
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
