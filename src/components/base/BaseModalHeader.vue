<template>
  <div class="modal-header">
    <slot />
    <div class="modal-header__close" @click="$emit('close')">
      <BaseIcon icon="plus" />
    </div>
  </div>
</template>
