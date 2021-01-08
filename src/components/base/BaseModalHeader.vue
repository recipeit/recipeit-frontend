<template>
  <div class="modal-header">
    <slot />
    <BaseLink color="dark" class="modal-header__close" @click="$emit('close')">
      <BaseIcon icon="close" />
    </BaseLink>
  </div>
</template>
