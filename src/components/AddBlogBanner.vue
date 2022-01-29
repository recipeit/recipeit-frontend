<template>
  <div class="banner-item">
    <BaseImageLazyload :src="url" class="banner-item-img" :style="{ width }" />
    <div class="banner-item-code-container">
      <code class="banner-item-code">
        {{ code }}
      </code>
      <button class="banner-item-copy" :class="{ copied }" @click="copyToClipboard()">
        {{ copied ? 'skopiowano do schowka' : 'kopiuj' }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

import { BASE_URL } from '@/configs/url'

import { useClipboard } from '@/plugins/clipboard'

export default {
  props: {
    url: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },
  setup(props) {
    // data
    const copied = ref(false)

    // computed
    const code = computed(() => {
      return `<a href="${BASE_URL}"><img src="${BASE_URL}${props.url}" alt="Recipeit"/></a>`
    })

    // methods
    const copyToClipboard = () => {
      const clipboard = useClipboard()
      copied.value = clipboard(code.value)
    }

    return {
      // data
      copied,
      // computed
      code,
      // methods
      copyToClipboard
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-item {
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  @media (min-width: 721px) {
    align-items: center;
    flex-direction: row;
  }

  .banner-item-img {
    margin-bottom: 8px;
    flex-shrink: 0;
    background-color: var(--color-image-background);
    max-width: 100%;

    @media (min-width: 721px) {
      margin-bottom: 0;
      margin-right: 24px;
    }

    :deep(img) {
      max-width: 100%;
    }
  }

  .banner-item-code-container {
    padding: 12px 16px;
    background-color: var(--color-image-background);
    border-radius: 12px;
    max-width: 100%;
  }

  .banner-item-code {
    display: block;
    overflow-wrap: break-word;
  }

  .banner-item-copy {
    text-decoration: none;
    font-weight: 700;
    color: var(--color-primary);
    background: none;
    border: none;
    padding: 0;
    font-size: 0.75rem;
    font-family: inherit;
    cursor: pointer;

    &.copied {
      color: var(--color-text-primary);
    }
  }
}
</style>
