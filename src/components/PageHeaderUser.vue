<template>
  <div class="page-header-user">
    <BaseMenu>
      <template #toggle="{ focused }">
        <div :class="['page-header-user__avatar', { 'page-header-user__avatar--focused': focused }]">
          <BaseImageLazyload v-if="avatarSrc" :src="avatarSrc" alt="" />
          <span v-else v-html="defaultAvatar" class="no-avatar-icon" />
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
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import defaultAvatar from '@/assets/img/avatar.svg?inline'
import { APP_ACCOUNT } from '@/router/names'

export default {
  setup() {
    const store = useStore()

    const userProfile = computed(() => store.state.user.userProfile)
    const avatarSrc = computed(() => {
      return userProfile.value?.imageUrl
    })

    const logout = () => {
      store.dispatch('user/logout', true)
    }

    return {
      APP_ACCOUNT,
      userProfile,
      avatarSrc,
      defaultAvatar,
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
