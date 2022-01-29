<template>
  <div class="page-header-user">
    <BaseMenu>
      <template #toggle="{ focused }">
        <div :class="['page-header-user__avatar', { 'page-header-user__avatar--focused': focused }]">
          <BaseImageLazyload v-if="avatarSrc" :src="avatarSrc" alt="" />
          <span v-else class="no-avatar-icon" v-html="defaultAvatar" />
        </div>
      </template>
      <template #dropdown>
        <BaseMenuList>
          <BaseMenuRouterLink :to="{ name: APP_ACCOUNT }">Moje konto</BaseMenuRouterLink>
          <BaseMenuLink color="red" @click="logout()">Wyloguj się</BaseMenuLink>
        </BaseMenuList>
      </template>
    </BaseMenu>
  </div>
</template>

<script>
import { computed } from 'vue'

import defaultAvatar from '@/assets/img/avatar.svg?raw'

import { APP_ACCOUNT } from '@/router/names'

import { useUserStore } from '@/stores/user'

export default {
  setup() {
    // usings
    const userStore = useUserStore()

    // computed
    const avatarSrc = computed(() => {
      return userStore.userProfile?.imageUrl
    })

    // methods
    const logout = () => {
      userStore.logout(true)
    }

    return {
      // consts
      APP_ACCOUNT,
      defaultAvatar,
      // computed
      avatarSrc,
      // methods
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header-user {
  &__avatar {
    height: $header-height;
    width: $header-height;
    border-radius: $header-height;
    background-color: var(--color-border);
    overflow: hidden;
    box-shadow: 0 0 0 transparent;
    cursor: pointer;
    @include transition(box-shadow);

    &--focused {
      box-shadow: 0 0 0 8px rgba(0, 0, 0, 0.05);
    }

    :deep(img) {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .no-avatar-icon {
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: var(--color-text-primary);
    }
  }
}
</style>
