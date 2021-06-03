<template>
  <div class="page-header-user">
    <BaseMenu>
      <template #toggle="{ focused }">
        <div :class="['page-header-user__avatar', { 'page-header-user__avatar--focused': focused }]">
          <BaseIcon v-if="userProfile && !userProfile.imageUrl" class="no-avatar-icon" icon="user" weight="semi-bold" />
          <BaseImageLazyload v-else :src="userProfile?.imageUrl" alt="" />
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
import { APP_ACCOUNT } from '@/router/names'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.user.userProfile)

    const logout = () => {
      store.dispatch('user/logout', true)
    }

    return {
      APP_ACCOUNT,
      userProfile,
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
      font-size: 1.25rem;
      color: var(--color-text-secondary);
    }
  }
}
</style>
