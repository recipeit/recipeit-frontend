<template>
  <div class="banner-item">
    <BaseImageLazyload :src="url" class="banner-item-img" :style="{ width, height }" />
    <div class="banner-item-code-container">
      <code class="banner-item-code">
        {{ code }}
      </code>
      <button @click="copyToClipboard()" class="banner-item-copy" :class="{ copied }">
        {{ copied ? 'skopiowano do schowka' : 'kopiuj' }}
      </button>
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      copied: false
    }
  },
  computed: {
    code() {
      return `<a href="https://recipeit.pl"><img src="${this.url}" alt="Recipeit"/></a>`
    }
  },
  methods: {
    copyToClipboard() {
      this.copied = this.$clipboard(this.code)
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
}

.banner-item-img {
  margin-bottom: 8px;
  flex-shrink: 0;
  background-color: var(--color-image-background);

  @media (min-width: 721px) {
    margin-bottom: 0;
    margin-right: 24px;
  }
}

.banner-item-code-container {
  padding: 12px 16px;
  background-color: var(--color-image-background);
  border-radius: 12px;
}

.banner-item-code {
  display: block;
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
</style>
