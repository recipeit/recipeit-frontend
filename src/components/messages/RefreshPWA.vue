<template>
  <MessageContainer v-if="needRefresh">
    <Message>
      <div class="update-message-content">
        <div class="update-message-text">Dostępna jest aktualizacja aplikacji</div>
        <BaseButton color="primary" size="small" raised @click="update()">Odśwież</BaseButton>
      </div>
    </Message>
  </MessageContainer>
</template>

<script lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { defineComponent, watchEffect } from 'vue'

import MessageContainer from '@/components/MessageContainer.vue'
import Message from '@/components/Message.vue'

const subintervalMS = 60 * 1000
const intervalMS = 60 * 60 * 1000

export default defineComponent({
  components: { MessageContainer, Message },

  setup() {
    const { needRefresh, updateServiceWorker } = useRegisterSW({
      onRegistered(registration) {
        if (!registration) {
          return
        }

        let lastUpdated = Date.now()

        setInterval(() => {
          const now = Date.now()

          if (now - lastUpdated > intervalMS) {
            registration.update()
          }

          lastUpdated = now
        }, subintervalMS)
      }
    })

    let userInteracted = false
    let refreshing = false
    let setInteractionEvents: () => void
    let removeInteractionEvents: () => void

    const handleInteraction = () => {
      userInteracted = true
      removeInteractionEvents?.()
    }

    setInteractionEvents = () => {
      document.addEventListener('scroll', handleInteraction)
      document.body.addEventListener('keydown', handleInteraction)
      document.body.addEventListener('click', handleInteraction)
      document.body.addEventListener('touchstart', handleInteraction)
    }

    removeInteractionEvents = () => {
      document.removeEventListener('scroll', handleInteraction)
      document.body.removeEventListener('keydown', handleInteraction)
      document.body.removeEventListener('click', handleInteraction)
      document.body.removeEventListener('touchstart', handleInteraction)
    }

    setInteractionEvents()

    const update = async () => {
      if (refreshing) return

      try {
        refreshing = true
        await updateServiceWorker()
      } finally {
        refreshing = false
      }
    }

    watchEffect(() => {
      if (needRefresh.value && !userInteracted) {
        update()
      }
    })

    return {
      needRefresh,
      update
    }
  }
})
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
