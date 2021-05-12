<template>
  <sheet-modal-content>
    <div class="upper-icon-container">
      <BaseIcon class="upper-icon" weight="custom" icon="cookies" />
    </div>
    <BaseModalHeader @close="acceptAll()">
      <BaseModalTitle>Nasze ciasteczka są ręcznie robione</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <p class="paragraph">
        Klikając przycisk "Akceptuję" lub przycisk "X" akceptujesz wszystkie ciasteczka wykorzystywane do celów logowania, przesyłania
        formularzy, zapamiętywania Twoich preferencji oraz do celów analitycznych.
      </p>
      <p class="paragraph">
        Więcej informacji znajdziesz w naszej
        <router-link :to="{ name: 'privacy-policy' }" v-slot="{ href, navigate }" custom>
          <BaseLink :href="href" @click="navigate($event)" color="primary">polityce prywatności</BaseLink>.
        </router-link>
      </p>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="customizeOptions()">
        Opcje
      </BaseButton>
      <BaseButton class="submit-button" color="primary" raised @click="acceptAll()">
        Akceptuję
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { useModal } from '@/plugins/global-sheet-modal'
import CustomizeCookiesModal from './CustomizeCookiesModal'
import { markRaw } from '@vue/reactivity'
import GDPRService from '@/services/gdpr'

export default {
  setup(_, { emit }) {
    const modal = useModal()

    const acceptAll = () => {
      GDPRService.acceptAll()
      emit('close')
    }

    const customizeOptions = () => {
      modal.show(
        markRaw(CustomizeCookiesModal),
        {},
        {
          close: saved => {
            if (saved === true) emit('close')
          }
        }
      )
    }

    return {
      customizeOptions,
      acceptAll
    }
  }
}
</script>

<style lang="scss" scoped>
.upper-icon-container {
  position: relative;
  text-align: center;
  margin-bottom: -1rem;
}

.upper-icon {
  font-size: 4rem;
  padding: 1rem;
  border-radius: 4rem;
  color: var(--color-primary);
  background-color: var(--color-background-flyout);
  margin-top: -3rem;
  box-shadow: 0 16px 32px rgba(#000, 0.1);
}

.submit-button {
  width: 100%;
}

.paragraph {
  font-size: 0.75rem;
  margin: 0;

  & + & {
    margin-top: 1rem;
  }
}
</style>
