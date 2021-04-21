<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle><BaseIcon class="header-icon" icon="eye-hidden" weight="semi-bold" />Ukryty blog - co oznacza?</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <p class="paragraph">
        Przepisy z ukrytego blogu nie pojawiają się w bazie przepisów oraz nie są proponowane do wykonania z Twoich produków.
      </p>
      <p class="paragraph">
        Ukryć możesz zarówno pojedynczy przepis, jak i wszystkie przepisy danego twórcy.
      </p>
      <p class="paragraph">
        Listę ukrytych przepisów i blogów znajdziesz w
        <router-link :to="{ name: 'account', params: { closeModalAndGo: true } }" v-slot="{ href, navigate }" custom>
          <BaseLink :href="href" @click="navigate($event)" color="primary">swoim koncie</BaseLink>
        </router-link>
      </p>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        OK!
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
export default {
  emits: ['close']
}
</script>

<style lang="scss" scoped>
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

  & + & {
    margin-top: 1rem;
  }
}
</style>
