<template>
  <SheetModalContent class="customize-cookies-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Ustawienia ciasteczek</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <BaseCheckbox class="checkbox" :model-value="true" :disabled="true">
        <template #label>
          <div>
            Wymagane ciasteczka
          </div>
          <div class="description">
            Te ciasteczka są używane m.in. do logowania, przesyłania formularzy czy zapamiętywania Twoich preferencji.
          </div>
        </template>
      </BaseCheckbox>

      <BaseCheckbox v-model="consents" class="checkbox" :value="COOKIES_ANALYTICS_COOKIE_NAME">
        <template #label>
          <div>
            Analityczne ciasteczka
          </div>
          <div class="description">
            Dzięki tym ciasteczkom możemy badać aktywność naszych użytkowników w serwisie z wykorzystaniem Google Analytics. Pozwala nam to
            szybciej znajdywać zaistniałe problemy oraz dopasowywać aplikację do użytkownikow.
          </div>
        </template>
      </BaseCheckbox>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="allowSelected()">
        Zapisz
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

import { COOKIES_ANALYTICS_COOKIE_NAME } from '@/configs/cookies'

import GDPRService from '@/services/gdpr'

export default defineComponent({
  emits: ['close'],
  setup(_, { emit }) {
    const data = reactive({
      consents: GDPRService.getAcceptedCookies()
    })

    const allowSelected = () => {
      GDPRService.acceptSelected(data.consents || [])
      emit('close', true)
    }

    return {
      ...toRefs(data),
      allowSelected,
      COOKIES_ANALYTICS_COOKIE_NAME
    }
  }
})
</script>

<style lang="scss" scoped>
.customize-cookies-modal {
  .submit-button {
    width: 100%;
  }

  .checkbox {
    .description {
      font-size: 0.75rem;
      margin-top: 0.5rem;
      color: var(--color-text-secondary);
    }
  }

  .checkbox + .checkbox {
    margin-top: 1rem;
  }
}
</style>
