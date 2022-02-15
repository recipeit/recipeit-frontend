<template>
  <div class="empty-list-message">
    <img class="message-image" :src="broccoliUrl" alt="" />
    <p v-if="$slots.title" class="message-title">
      <slot name="title" />
    </p>
    <slot name="button">
      <BaseButton v-if="buttonText" class="message-button" stroked @click="buttonClickHandler()">{{ buttonText }}</BaseButton>
    </slot>
    <p v-if="$slots.sub" class="message-details">
      <slot name="details" />
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import BroccoliHappyUrl from '@/assets/img/broccoli-happy.svg?url'
import BroccoliSadUrl from '@/assets/img/broccoli-sad.svg?url'

export default defineComponent({
  props: {
    buttonText: {
      type: String,
      default: ''
    },
    broccoli: {
      type: String as PropType<'happy' | 'sad'>,
      default: 'sad'
    }
  },

  emits: ['button-click'],

  setup(props, { emit }) {
    const broccoliUrl = computed(() => {
      return props.broccoli === 'happy' ? BroccoliHappyUrl : BroccoliSadUrl
    })

    const buttonClickHandler = () => {
      emit('button-click')
    }

    return {
      broccoliUrl,
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
    margin-top: 1rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .message-details {
    font-size: 0.75rem;

    :deep(.message-link) {
      font-weight: bold;
    }
  }
}
</style>
