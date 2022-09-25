<template>
  <div class="recipes-errors">
    <div class="recipes-errors-message">Wystąpił błąd podczas wczytywania</div>
    <BaseButton stroked @click="buttonClickHandler()">Spróbuj ponownie</BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['fetch'],

  setup(_, { emit }) {
    const buttonClickHandler = () => {
      emit('fetch')
    }

    return {
      buttonClickHandler
    }
  }
})
</script>

<style lang="scss">
.recipes-errors {
  text-align: center;
  margin: 48px 0;

  .recipes-errors-message {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
}
</style>
