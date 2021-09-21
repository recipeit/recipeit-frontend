<template>
  <router-link :to="{ name: APP_BLOG, params: { blogId: blog.slug || blog.id, blogName: blog.name } }" v-slot="{ href, navigate }" custom>
    <a :href="href" @click="navigate($event)" class="hidden-blog">
      <BaseImageLazyload :src="avatarUrl" :errorPlaceholder="avatarErrorUrl" :alt="blog.name" class="hidden-blog__image" />
      <div class="hidden-blog__details">
        <div class="hidden-blog__name">{{ blog.name }}</div>
        <div class="hidden-blog__url">{{ blog.url }}</div>
      </div>
      <div class="hidden-blog__action">
        <button class="unhide" @click.prevent.stop="$emit('unhide')">
          <BaseIcon icon="eye" weight="semi-bold" />
        </button>
      </div>
    </a>
  </router-link>
</template>

<script>
import { APP_BLOG } from '@/router/names'
import { computed } from '@vue/reactivity'
import avatarErrorUrl from '@/assets/img/blog-avatar.webp'

export default {
  props: {
    blog: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const avatarUrl = computed(() => `/static/blogs/${props.blog.id}/avatar.webp`)

    return {
      APP_BLOG,
      avatarUrl,
      avatarErrorUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden-blog {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);

  &__image {
    height: 3rem;
    width: 3rem;
    border-radius: 3rem;
    overflow: hidden;
    background-color: var(--color-image-background);

    :deep(.image) {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }

  &__details {
    flex: 1;
    padding: 0 1rem;
    min-width: 0;
  }

  &__name,
  &__url {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__name {
    font-size: 0.875rem;
  }

  &__url {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  &__author {
    font-weight: bold;
  }

  &__action {
    .unhide {
      width: 32px;
      height: 32px;
      border-radius: 48px;
      background-color: var(--color-button-subtle-primary-background);
      color: var(--color-button-subtle-primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: none;
      // margin-right: -5px;
      cursor: pointer;
      @include transition((background-color));

      &:hover {
        background-color: var(--color-button-subtle-primary-background-hover);
      }

      &:active {
        background-color: var(--color-button-subtle-primary-background-active);
      }
    }
  }
}
</style>
