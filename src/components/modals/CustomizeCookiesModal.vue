<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Ustawienia ciasteczek</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <BaseCheckbox class="checkbox" :modelValue="true" :disabled="true">
        <template #label>
          <div>
            Wymagane ciasteczka
          </div>
          <div class="description">
            Te ciasteczka są używane m.in. do logowania, przesyłania formularzy czy zapamiętywania Twoich preferencji.
          </div>
        </template>
      </BaseCheckbox>

      <BaseCheckbox class="checkbox" v-model="consents" :value="COOKIES_ANALYTICS_COOKIE_NAME">
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
  </sheet-modal-content>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { COOKIES_ANALYTICS_COOKIE_NAME } from '@/configs/cookies'
import GDPRService from '@/services/gdpr'

export default {
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
}
</script>

<style lang="scss" scoped>
.submit-button {
  width: 100%;
}

// .section-header {
//   font-size: 0.875rem;
//   font-weight: bold;
// }

.checkbox {
  // margin: 1rem 0 1.5rem 0;

  // &:last-child {
  //   margin-bottom: 0;
  // }
  & + & {
    margin-top: 1rem;
  }

  .description {
    font-size: 0.75rem;
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
  }
}
</style>
