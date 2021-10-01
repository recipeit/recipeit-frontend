<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Moje konto'" :back-button="true" :show-user="false" />

    <div class="profile">
      <div class="card">
        <div class="card-label">E-mail</div>
        <div class="card-value">{{ userProfile.email }}</div>

        <div class="card-label">Hasło</div>
        <div class="card-value">●●●●●●●●●●</div>
        <BaseLink tag="button" class="card-link" color="primary" @click="openChangePasswordModal()">zmień hasło</BaseLink>
      </div>
      <div class="avatar">
        <BaseImageLazyload v-if="avatarSrc" :src="avatarSrc" alt="" />
        <span v-else class="no-avatar-icon" v-html="defaultAvatar" />
      </div>
    </div>

    <h3>Preferencje</h3>
    <BaseLink tag="button" class="card-link" color="primary" @click="openCustomizeCookiesModal()">
      Zarządzaj ciasteczkami
    </BaseLink>
    <div class="settings-row">
      <div class="settings-row__value settings-row__value--theme">
        <BaseSelect placeholder="Motyw" :options="THEMES" :value="selectedTheme" :searchable="false" @change="updateTheme($event)">
          <template #label="{ option }">{{ $t(`themes.${option}`) }}</template>
          <template #option="{ option }">{{ $t(`themes.${option}`) }}</template>
        </BaseSelect>
      </div>
    </div>

    <h3>Ukryta zawartość</h3>
    <p>
      <router-link v-slot="{ href, navigate }" :to="{ name: 'hidden-blogs' }" custom>
        <BaseLink :href="href" class="card-link" color="primary" @click="navigate($event)">
          Zarządzaj ukrytymi blogami
        </BaseLink>
      </router-link>
    </p>
    <p>
      <router-link v-slot="{ href, navigate }" :to="{ name: 'hidden-recipes' }" custom>
        <BaseLink :href="href" class="card-link" color="primary" @click="navigate($event)">
          Zarządzaj ukrytymi przepisami
        </BaseLink>
      </router-link>
    </p>

    <h3>Inne</h3>
    <p>
      <router-link v-slot="{ href, navigate }" :to="{ name: 'contact', params: { returnUrl: $route.fullPath } }" custom>
        <BaseLink :href="href" class="card-link" color="primary" @click="navigate($event)">
          Kontakt
        </BaseLink>
      </router-link>
    </p>
    <p>
      <router-link v-slot="{ href, navigate }" :to="{ name: 'terms', params: { returnUrl: $route.fullPath } }" custom>
        <BaseLink :href="href" class="card-link" color="primary" @click="navigate($event)">
          Regulamin
        </BaseLink>
      </router-link>
    </p>
    <p>
      <router-link v-slot="{ href, navigate }" :to="{ name: 'privacy-policy', params: { returnUrl: $route.fullPath } }" custom>
        <BaseLink :href="href" class="card-link" color="primary" @click="navigate($event)">
          Polityka prywatności
        </BaseLink>
      </router-link>
    </p>
    <p>
      <BaseLink tag="button" class="card-link" color="red" @click="openDeleteAccountModal()">
        Usuń konto
      </BaseLink>
    </p>

    <div class="footer-logo">
      <Logotype class="logo" />
      <span class="copyright-text">
        {{ COPYRIGHT_TEXT }}
      </span>
    </div>
  </div>
</template>

<script>
import { markRaw, ref } from '@vue/runtime-core'
import { mapState, useStore } from 'vuex'
import { useMeta } from 'vue-meta'

import defaultAvatar from '@/assets/img/avatar.svg?inline'
import CustomizeCookiesModal from '@/components/modals/CustomizeCookiesModal'
import ChangePasswordModal from '@/components/modals/ChangePasswordModal'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal'
import DeleteAccountModal from '@/components/modals/DeleteAccountModal'
import PageHeader from '@/components/PageHeader'
import Logotype from '@/components/Logotype'
import { THEMES } from '@/configs/theme'
import { COPYRIGHT_TEXT } from '@/constants'

export default {
  name: 'MyAccount',
  components: { PageHeader, Logotype },
  computed: {
    ...mapState({
      hiddenRecipes: state => state.user.hiddenRecipeIds,
      hiddenBlogs: state => state.user.hiddenBlogIds,
      userProfile: state => state.user.userProfile
    }),
    avatarSrc() {
      return this.userProfile?.imageUrl
    }
  },
  methods: {
    openChangePasswordModal() {
      this.$modal.show(
        markRaw(ChangePasswordModal),
        {
          email: this.userProfile.email
        },
        {
          close: response => {
            if (response?.openForgotPasswordModal) {
              this.openForgotPasswordModal()
            }
          }
        }
      )
    },
    openForgotPasswordModal() {
      this.$modal.show(
        markRaw(ForgotPasswordModal),
        {
          email: this.userProfile.email
        },
        {}
      )
    },
    openDeleteAccountModal() {
      this.$modal.show(
        markRaw(DeleteAccountModal),
        {
          email: this.userProfile.email
        },
        {}
      )
    },
    openCustomizeCookiesModal() {
      this.$modal.show(markRaw(CustomizeCookiesModal), {}, {})
    }
  },
  setup() {
    useMeta({
      title: 'Moje konto'
    })

    const store = useStore()
    const currentTheme = store.state.user.theme
    const selectedTheme = ref(currentTheme)

    function updateTheme(value) {
      if (value && THEMES.includes(value)) {
        selectedTheme.value = value
        store.dispatch('user/setTheme', value)
      }
    }

    function unhideRecipe(recipeId) {
      store.dispatch('user/changeRecipeVisibility', { recipeId, visible: true })
    }

    function unhideBlog(blogId) {
      store.dispatch('user/changeBlogVisibility', { blogId, visible: true })
    }

    return {
      COPYRIGHT_TEXT,
      selectedTheme,
      updateTheme,
      unhideRecipe,
      unhideBlog,
      THEMES,
      defaultAvatar
    }
  }
}
</script>

<style lang="scss" scoped>
.my-account-page {
  h3 {
    font-size: 0.875rem;
    font-weight: bold;
    margin-top: 3rem;
  }

  .settings-row {
    display: flex;
    font-size: 0.875rem;
    margin-top: 1rem;

    &__name {
      flex: 1;
      display: flex;
      align-items: center;
      min-height: 48px;
    }

    &__value {
      flex: 1;
    }
  }

  .card-label {
    font-size: 12px;
    color: var(--color-text-secondary);

    &:not(:first-child) {
      margin-top: 0.5rem;
    }
  }

  .card-value {
    font-size: 14px;

    &--disabled {
      color: var(--color-text-secondary);
    }
  }

  .profile {
    display: flex;

    .avatar {
      height: 64px;
      width: 64px;
      border-radius: 64px;
      overflow: hidden;
      background-color: var(--color-border);

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
        font-size: 1.75rem;
        color: var(--color-text-secondary);
      }
    }

    .card {
      margin-right: 16px;
      flex: 1;
    }
  }

  .card-link {
    font-weight: bold;
    font-size: 0.75rem;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
    border-top: 1px solid var(--color-border);
    padding: 32px 0;
    margin-top: 32px;

    .copyright-text {
      margin-left: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.25;
    }

    .logo {
      width: 96px;
      line-height: 1;

      :deep(.a) {
        fill: currentColor;
      }
    }
  }
}
</style>
