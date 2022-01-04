<template>
  {{ needRefresh }}
  <MessageContainer>
    <Message v-if="needRefresh">
      <div class="update-message-content">
        <div class="update-message-text">
          Dostępna jest aktualizacja aplikacji
        </div>
        <BaseButton color="primary" size="small" raised @click="update()">Odśwież</BaseButton>
      </div>
    </Message>
  </MessageContainer>
</template>

<script>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import MessageContainer from '@/components/MessageContainer.vue'
import Message from '@/components/Message.vue'

export default {
  components: { MessageContainer, Message },

  setup() {
    const { needRefresh, updateServiceWorker } = useRegisterSW()
    const update = async () => {
      await updateServiceWorker()
    }
    return { needRefresh, update, close }
  }
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
