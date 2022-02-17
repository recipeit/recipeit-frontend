<template>
  <SheetModalContent class="invisible-blog-info-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>
        <BaseIcon class="header-icon" icon="eye-hidden" weight="semi-bold" />
        Ukryty blog - co oznacza?
      </BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <p class="paragraph">
        Przepisy z ukrytego blogu nie pojawiają się w bazie przepisów oraz nie są proponowane do wykonania z Twoich produków.
      </p>
      <p class="paragraph">Ukryć możesz zarówno cały blog, jak i pojedynczy przepis.</p>
      <p class="paragraph">
        Listę ukrytych przepisów i blogów znajdziesz w
        <router-link v-slot="{ href, navigate }" :to="{ name: 'account', params: { closeModalAndGo: true } }" custom>
          <BaseLink :href="href" color="primary" @click="navigate($event)">swoim koncie</BaseLink>
        </router-link>
      </p>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">OK!</BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['close']
})
</script>

<style lang="scss" scoped>
.invisible-blog-info-modal {
  .submit-button {
    width: 100%;
  }

  .header-icon {
    color: var(--color-text-secondary);
    vertical-align: text-bottom;
    margin-right: 1rem;
    font-size: 1.5rem;
  }

  .paragraph {
    font-size: 0.875rem;
    margin: 0;
  }

  .paragraph + .paragraph {
    margin-top: 1rem;
  }
}
</style>
