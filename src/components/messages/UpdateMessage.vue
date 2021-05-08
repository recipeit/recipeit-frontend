<template>
  <Message>
    <div class="update-message-content">
      <div class="update-message-text">
        Dostępna jest aktualizacja aplikacji
      </div>
      <BaseButton @click="$emit('update')" color="primary" size="small" raised>Odśwież</BaseButton>
    </div>
  </Message>
</template>

<script>
import Message from '@/components/Message'

export default {
  emits: ['update'],
  components: { Message }
}
</script>

<style lang="scss" scoped>
.update-message-content {
  padding: 1.5rem;
  display: flex;
  align-items: center;

  .update-message-text {
    font-size: 0.875rem;
    margin-right: 1.5rem;
  }
}
</style>
