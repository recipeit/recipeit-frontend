<template>
  <Message>
    <div class="update-message-content">
      <div class="update-message-text">
        Dostępna jest aktualizacja aplikacji
      </div>
      <BaseButton color="primary" size="small" raised @click="$emit('update')"
        >Odśwież</BaseButton
      >
    </div>
  </Message>
</template>

<script>
import Message from "@/src/components/Message";

export default {
  components: { Message },
  emits: ["update"],
};
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
