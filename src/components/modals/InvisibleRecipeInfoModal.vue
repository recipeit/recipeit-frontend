<template>
  <SheetModalContent class="invisible-recipe-info-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle><BaseIcon class="header-icon" icon="eye-hidden" weight="semi-bold" />Ukryty przepis - co oznacza?</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <p class="paragraph">Ukryty przepis nie pojawia się w bazie przepisów oraz nie jest proponowany do wykonania z Twoich produków.</p>
      <p class="paragraph">Ukryć możesz zarówno pojedynczy przepis, jak i wszystkie przepisy danego twórcy.</p>
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
.invisible-recipe-info-modal {
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
