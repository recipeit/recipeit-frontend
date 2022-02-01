<template>
  <div class="modal-header">
    <slot />
    <div class="modal-header__close-container">
      <BaseLink color="text-primary" @click="$emit('close')">
        <BaseIcon icon="close" />
      </BaseLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['close']
})
</script>
