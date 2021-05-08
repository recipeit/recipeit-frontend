<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Ustawienia ciasteczek</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div class="section-header">
        Wymagane
      </div>
      <div class="section">
        <BaseCheckbox :modelValue="true" :disabled="true">
          <template #label>
            <div>
              Logowanie
            </div>
            <div class="description">
              Dzięki tym ciastkom jesteś w stanie zalogować sie na swoje konto
            </div>
          </template>
        </BaseCheckbox>
      </div>
      <div class="section-header">
        Opcjonalne
      </div>
      <div class="section">
        <BaseCheckbox v-model="permissions" :value="'googleAnalytics'">
          <template #label>
            <div>
              Google Analytics
            </div>
            <div class="description">
              Dzięki tym ciastkom możemy badać aktywność naszych użytkowników w serwisie. Pozwala nam to szybciej znajdywać problemy i błędy
              oraz dopasowywać aplikację do użytkownikow.
            </div>
          </template>
        </BaseCheckbox>
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Zapisz
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
export default {
  setup() {
    const data = reactive({
      permissions: ['googleAnalytics']
    })

    const requiredPermission = true

    return {
      ...toRefs(data),
      requiredPermission
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-button {
  width: 100%;
}

.section-header {
  font-size: 0.875rem;
  font-weight: bold;
}

.section {
  margin: 1rem 0 1.5rem 0;

  &:last-child {
    margin-bottom: 0;
  }

  .description {
    font-size: 0.75rem;
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
  }
}
</style>
