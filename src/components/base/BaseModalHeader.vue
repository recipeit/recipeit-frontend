<template>
  <div class="modal-header">
    <slot />
    <div class="modal-header__close-container">
      <BaseLink color="dark" @click="$emit('close')">
        <BaseIcon icon="close" />
      </BaseLink>
    </div>
  </div>
</template>
