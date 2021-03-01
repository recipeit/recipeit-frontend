<template>
  <div class="page-header-user">
    <BaseMenu :hideOnClick="isAuthenticated">
      <template v-slot:toggle="{ focused }">
        <div :class="['page-header-user__avatar', { 'page-header-user__avatar--focused': focused }]">
          <img src="@/assets/avatar.jpg" alt="profile picture" />
        </div>
      </template>
      <template v-slot:dropdown>
        <BaseMenuList>
          <template v-if="!isAuthenticated">
            <BaseMenuRouterLink :to="{ name: 'login' }">Zaloguj się</BaseMenuRouterLink>
            <BaseMenuRouterLink :to="{ name: 'register' }">Utwórz konto</BaseMenuRouterLink>
            <BaseMenuSeparator></BaseMenuSeparator>
            <BaseMenuRouterLink :to="{ name: 'help' }">Pomoc</BaseMenuRouterLink>
          </template>
          <template v-else>
            <BaseMenuRouterLink :to="{ name: 'account' }">Moje konto</BaseMenuRouterLink>
            <BaseMenuRouterLink :to="{ name: 'help' }">Pomoc</BaseMenuRouterLink>
            <BaseMenuSeparator></BaseMenuSeparator>
            <BaseMenuLink color="red" @click="logout">Wyloguj się</BaseMenuLink>
          </template>
        </BaseMenuList>
      </template>
    </BaseMenu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    })
  }
}
</script>

<style lang="scss" scoped>
.page-header-user {
  &__avatar {
    height: $header-height;
    width: $header-height;
    border-radius: $header-height;
    background-color: $border;
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
}
</style>
