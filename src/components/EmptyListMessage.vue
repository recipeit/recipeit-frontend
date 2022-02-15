<template>
  <div class="empty-list-message">
    <img class="message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
    <p class="message-title">{{ title }}</p>
    <BaseButton v-if="buttonText" class="message-button" stroked @click="buttonClickHandler()">{{ buttonText }}</BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    }
  },

  emits: ['button-click'],

  setup(_, { emit }) {
    const buttonClickHandler = () => {
      emit('button-click')
    }

    return {
      buttonClickHandler
    }
  }
})
</script>

<style lang="scss">
.empty-list-message {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  flex: 1;
  line-height: 2.25;

  .message-image {
    width: 96px;
  }

  .message-title {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .message-button {
    margin-top: 1rem;
  }
}
</style>
