<template>
  <div class="page-header-user">
    <BaseMenu :hideOnClick="userAuthenticatedLazy">
      <template #toggle="{ focused }">
        <div v-if="userAuthenticatedLazy" :class="['page-header-user__avatar', { 'page-header-user__avatar--focused': focused }]">
          <img :src="userProfile?.imageUrl || 'https://sprm.org.pl/wp-content/uploads/2018/04/User-icon.png'" alt="profile picture" />
        </div>
        <BaseLink v-else color="text-primary" class="page-header-user__anonymous-avatar">
          <BaseIcon icon="user" weight="semi-bold" />
        </BaseLink>
      </template>
      <template #dropdown>
        <BaseMenuList>
          <template v-if="!userAuthenticatedLazy">
            <BaseMenuRouterLink :to="{ name: AUTH_LOGIN }">Zaloguj się</BaseMenuRouterLink>
            <BaseMenuRouterLink :to="{ name: AUTH_REGISTER }">Utwórz konto</BaseMenuRouterLink>
            <BaseMenuSeparator />
            <BaseMenuRouterLink :to="{ name: APP_HELP }">Pomoc</BaseMenuRouterLink>
          </template>
          <template v-else>
            <BaseMenuRouterLink :to="{ name: APP_ACCOUNT }">Moje konto</BaseMenuRouterLink>
            <BaseMenuRouterLink :to="{ name: APP_HELP }">Pomoc</BaseMenuRouterLink>
            <BaseMenuSeparator />
            <BaseMenuLink color="red" @click="logout()">Wyloguj się</BaseMenuLink>
          </template>
        </BaseMenuList>
      </template>
    </BaseMenu>
  </div>
</template>

<script>
import { APP_ACCOUNT, APP_HELP, AUTH_LOGIN, AUTH_REGISTER } from '@/router/names'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      userProfile: state => state.user.userProfile,
      userAuthenticatedLazy: state => state.user.userAuthenticatedLazy
    })
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout', true)
    }
  },
  setup() {
    return {
      APP_ACCOUNT,
      APP_HELP,
      AUTH_LOGIN,
      AUTH_REGISTER
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

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__login-dropdown {
    padding: 12px 16px;

    &__login-button {
      margin-top: 16px;
      width: 100%;
    }
  }

  &__anonymous-avatar {
    width: $header-height;
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    cursor: pointer;
  }
}
</style>
