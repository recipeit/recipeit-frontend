<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Moje konto'" :backButton="true" :show-user="false" />

    <!-- <h3>Profil</h3> -->

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
    <!-- 
    <h5>Avatar</h5>
    <h5>Email</h5>
    <h5>Nazwa</h5>
    <h5>Hasło</h5> -->

    <h3>Preferencje</h3>
    <!-- <h5>Powiadomienia systemowe (tak|nie)</h5> -->
    <!-- <h5>Wygląd (dark|light|system)</h5> -->
    <div class="settings-row">
      <!-- <div class="settings-row__name">
        {{ $t('theme') }}
      </div> -->
      <div class="settings-row__value settings-row__value--theme">
        <BaseSelect
          placeholder="Motyw"
          :options="themes"
          :modelValue="selectedTheme"
          @update:modelValue="updateTheme($event)"
          :searchable="false"
        >
          <template v-slot:label="{ option }">{{ $t(`themes.${option}`) }}</template>
          <template v-slot:option="{ option }">{{ $t(`themes.${option}`) }}</template>
        </BaseSelect>
      </div>
    </div>

    <h3>Ukryta zawartość</h3>
    <div>
      <BaseLink class="card-link" color="primary">Zarządzaj ukrytymi blogami</BaseLink>
    </div>
    <div>
      <BaseLink class="card-link" color="primary">Zarządzaj ukrytymi przepisami</BaseLink>
    </div>

    <!-- <h5>Ukryte blogi (zarządzaj)</h5>
    <ul>
      <li v-for="blogId in hiddenBlogs" :key="blogId" @click="unhideBlog(blogId)">{{ blogId }}</li>
    </ul>

    <h5>Ukryte przepisy (zarządzaj)</h5>
    <ul>
      <li v-for="recipeId in hiddenRecipes" :key="recipeId" @click="unhideRecipe(recipeId)">{{ recipeId }}</li>
    </ul> -->
  </div>
</template>

<script>
import ChangePasswordModal from '@/components/modals/ChangePasswordModal'
import PageHeader from '@/components/PageHeader'
import { markRaw, ref } from 'vue'
// import userApi from '@/api/userApi'
import { mapState, useStore } from 'vuex'
// import components from '@/components/base/icons'

const themes = ['dark', 'light', 'system']

export default {
  name: 'MyAccount',
  components: { PageHeader },
  beforeMount() {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme) {
      this.selectedTheme = currentTheme
    }
    // userApi.getHiddenRecipes().then(({ data }) => {
    //   this.hiddenRecipes = data.recipeIds
    // })
    // userApi.getHiddenBlogs().then(({ data }) => {
    //   this.hiddenBlogs = data.blogIds
    // })
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
        {}
      )
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
      // hiddenRecipes,
      // hiddenBlogs,
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

  &__name {
    flex: 1;
    display: flex;
    align-items: center;
    min-height: 48px;
  }

  &__value {
    flex: 1;
    // &--theme {
    //   width: 128px;
    // }
  }
}

.card {
  // background-color: var(--color-background-flyout);
  // box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.1);
  // padding: 1rem 1.5rem;
  // border-radius: 1.5rem;
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
