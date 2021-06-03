<template>
  <div class="page-header-user">
    <BaseMenu>
      <template #toggle="{ focused }">
        <div :class="['page-header-user__avatar', { 'page-header-user__avatar--focused': focused }]">
          <BaseImageLazyload :src="userImageUrl" alt="" />
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
    const userImageUrl = computed(() => {
      return userProfile.value?.imageUrl || 'https://sprm.org.pl/wp-content/uploads/2018/04/User-icon.png'
    })

    const logout = () => {
      store.dispatch('user/logout', true)
    }

    return {
      APP_ACCOUNT,
      userProfile,
      userImageUrl,
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
  }
}
</style>
