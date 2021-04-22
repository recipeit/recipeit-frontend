<template>
  <div class="section-title">
    <BaseIcon v-if="!!icon" class="section-title-icon" :icon="icon" />
    {{ title }}
    <BaseLink v-if="showAction" class="section-title-link" tag="button" color="primary" @click="$emit('action-click')">
      {{ actionText }}
    </BaseLink>
  </div>
</template>

<script>
export default {
  emits: ['action-click'],
  props: {
    icon: String,
    title: String,
    showAction: {
      type: Boolean,
      default: false
    },
    actionText: String
  }
}
</script>

<style lang="scss" scoped>
.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  display: flex;
  align-items: center;

  &-link {
    margin-left: auto;
    font-size: 12px;
  }

  &-icon {
    margin-right: 0.5rem;
    font-size: 1.5rem;
    color: var(--color-primary);
  }
}
</style>
