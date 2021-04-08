<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle><BaseIcon class="header-icon" icon="invisible" weight="bold" />Ukryty przepis - co oznacza?</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <p class="paragraph">
        Ukryty przepis nie pojawia się w bazie przepisów oraz nie jest proponowany do wykonania z Twoich produków.
      </p>
      <p class="paragraph">
        Ukryć możesz zarówno pojedynczy przepis, jak i wszystkie przepisy danego twórcy.
      </p>
      <p class="paragraph">
        Listę ukrytych przepisów i blogów znajdziesz w
        <router-link :to="{ name: 'account' }" v-slot="{ href, navigate }" custom>
          <BaseLink :href="href" @click="navigate" color="primary">swoim koncie</BaseLink>
        </router-link>
      </p>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="contrast" @close="$emit('close')">
        Rozumiem
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
