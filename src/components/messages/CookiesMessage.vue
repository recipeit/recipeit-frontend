<template>
  <Message>
    <div class="cookies-message-content">
      <div class="cookies-message-text">
        <div class="cookies-message-title">
          Korzystamy z ciasteczek
        </div>
        Aby umożliwić funkcjonowanie serwisu, wykorzystujemy ciasteczka do logowania oraz do celów analitycznych, dzięki którym możemy
        poprawiać nasze usługi
      </div>
      <div class="cookies-message-buttons">
        <BaseLink class="customize-button" tag="button" color="primary">opcje</BaseLink>
        <BaseButton @click="acceptAll()" class="accept-button" color="primary" size="small" raised>Akceptuję</BaseButton>
      </div>
    </div>
  </Message>
</template>

<script>
import Message from '@/components/Message'
import cookie from 'js-cookie'
import { COOKIES_MESSAGE_COOKIE_NAME } from '@/configs/cookies'

export default {
  emits: ['close'],
  components: { Message },
  setup(_, { emit }) {
    const acceptAll = () => {
      cookie.set(COOKIES_MESSAGE_COOKIE_NAME, true, 365)
      emit('close')
    }

    return {
      acceptAll
    }
  }
}
</script>

<style lang="scss" scoped>
.cookies-message-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 721px) {
    flex-direction: row;
  }

  .cookies-message-text {
    margin-right: 1rem;
    font-size: 0.75rem;

    .cookies-message-title {
      font-size: 0.875rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
  }

  .cookies-message-buttons {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-left: auto;
    margin-top: 1rem;

    @media (min-width: 721px) {
      margin-left: 0;
      margin-top: 0;
    }

    .customize-button {
      font-size: 0.75rem;
      font-weight: bold;
      padding: 1rem;
    }
  }
}
</style>
