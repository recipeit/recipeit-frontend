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
            <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
              <BaseMenuLink :href="href" @click="navigate">Zaloguj się</BaseMenuLink>
            </router-link>
            <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
              <BaseMenuLink :href="href" @click="navigate">Utwórz konto</BaseMenuLink>
            </router-link>
            <BaseMenuSeparator></BaseMenuSeparator>
            <router-link :to="{ name: 'help' }" v-slot="{ href, navigate }" custom>
              <BaseMenuLink :href="href" @click="navigate">Pomoc</BaseMenuLink>
            </router-link>
          </template>
          <template v-else>
            <router-link :to="{ name: 'account' }" v-slot="{ href, navigate }" custom>
              <BaseMenuLink :href="href" @click="navigate">Moje konto</BaseMenuLink>
            </router-link>
            <router-link :to="{ name: 'help' }" v-slot="{ href, navigate }" custom>
              <BaseMenuLink :href="href" @click="navigate">Pomoc</BaseMenuLink>
            </router-link>
            <BaseMenuSeparator></BaseMenuSeparator>
            <BaseMenuLink color="red" @click="logout">Wyloguj się</BaseMenuLink>
          </template>
        </BaseMenuList>
      </template>
    </BaseMenu>
  </div>
</template>

<script>
import AuthModal from '@/components/modals/AuthModal'
import { mapGetters } from 'vuex'
import { markRaw } from 'vue'

export default {
  data: () => ({
    userLogin: {
      email: '',
      password: ''
    }
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    })
  },
  methods: {
    login() {
      this.$store.dispatch('user/login', this.userLogin)
    },
    logout() {
      this.$store.dispatch('user/logout')
    },
    showLoginModal() {
      this.$modal.show(markRaw(AuthModal), {}, {})
    },
    showRegisterModal() {
      this.$modal.show(markRaw(AuthModal), {}, {})
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
