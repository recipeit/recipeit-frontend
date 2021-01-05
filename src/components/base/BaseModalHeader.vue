<template>
  <div class="modal-header">
    <slot />
    <div class="modal-header__close" @click="$emit('close')">
      <BaseIcon icon="close" />
    </div>
  </div>
</template>
