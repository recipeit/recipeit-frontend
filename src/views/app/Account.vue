<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Moje konto'" :backButton="true" :show-user="false" />

    <div class="profile">
      <div class="card">
        <div class="card-label">E-mail</div>
        <div class="card-value">{{ userProfile.email }}</div>

        <div class="card-label">Hasło</div>
        <div class="card-value">●●●●●●●●●●</div>
        <BaseLink tag="button" class="card-link" color="primary" @click="openChangePasswordModal()">zmień hasło</BaseLink>
      </div>
      <div class="avatar">
        <img :src="userProfile?.imageUrl || 'https://sprm.org.pl/wp-content/uploads/2018/04/User-icon.png'" alt="profile picture" />
      </div>
    </div>

    <h3>Preferencje</h3>
    <BaseLink tag="button" @click="openCustomizeCookiesModal()" class="card-link" color="primary">
      Zarządzaj ciasteczkami
    </BaseLink>
    <div class="settings-row">
      <div class="settings-row__value settings-row__value--theme">
        <BaseSelect placeholder="Motyw" :options="themes" :value="selectedTheme" @change="updateTheme($event)" :searchable="false">
          <template #label="{ option }">{{ $t(`themes.${option}`) }}</template>
          <template #option="{ option }">{{ $t(`themes.${option}`) }}</template>
        </BaseSelect>
      </div>
    </div>

    <h3>Ukryta zawartość</h3>
    <p>
      <router-link :to="{ name: 'hidden-blogs' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate($event)" class="card-link" color="primary">
          Zarządzaj ukrytymi blogami
        </BaseLink>
      </router-link>
    </p>
    <p>
      <router-link :to="{ name: 'hidden-recipes' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate($event)" class="card-link" color="primary">
          Zarządzaj ukrytymi przepisami
        </BaseLink>
      </router-link>
    </p>

    <h3>Inne</h3>
    <p>
      <router-link :to="{ name: 'terms', params: { returnUrl: $route.fullPath } }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate($event)" class="card-link" color="primary">
          Regulamin
        </BaseLink>
      </router-link>
    </p>
    <p>
      <router-link :to="{ name: 'privacy-policy', params: { returnUrl: $route.fullPath } }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate($event)" class="card-link" color="primary">
          Polityka prywatności
        </BaseLink>
      </router-link>
    </p>
    <p>
      <BaseLink tag="button" @click="openDeleteAccountModal()" class="card-link" color="red">
        Usuń konto
      </BaseLink>
    </p>
  </div>
</template>

<script>
import CustomizeCookiesModal from '@/components/modals/CustomizeCookiesModal'
import ChangePasswordModal from '@/components/modals/ChangePasswordModal'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal'
import DeleteAccountModal from '@/components/modals/DeleteAccountModal'
import PageHeader from '@/components/PageHeader'
import { markRaw, ref } from 'vue'
import { mapState, useStore } from 'vuex'

const themes = ['dark', 'light', 'system']

export default {
  name: 'MyAccount',
  components: { PageHeader },
  beforeMount() {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme) {
      this.selectedTheme = currentTheme
    }
  },
  computed: {
    ...mapState({
      hiddenRecipes: state => state.user.hiddenRecipeIds,
      hiddenBlogs: state => state.user.hiddenBlogIds,
      userProfile: state => state.user.userProfile
    })
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
    const store = useStore()
    const currentTheme = localStorage.getItem('theme') || 'system'
    const selectedTheme = ref(currentTheme)

    function updateTheme(value) {
      if (value && themes.includes(value)) {
        selectedTheme.value = value
        localStorage.setItem('theme', value)
        document.documentElement.setAttribute('theme', value)
      }
    }

    function unhideRecipe(recipeId) {
      store.dispatch('user/changeRecipeVisibility', { recipeId, visible: true })
    }

    function unhideBlog(blogId) {
      store.dispatch('user/changeBlogVisibility', { blogId, visible: true })
    }

    return {
      selectedTheme,
      updateTheme,
      unhideRecipe,
      unhideBlog,
      themes
    }
  }
}
</script>

<style lang="scss" scoped>
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

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
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
</style>
