<template>
  <div class="layout__page__content my-account-page">
    <PageHeader :title="'Moje konto'"></PageHeader>

    <h3>Profil (edytuj)</h3>
    <h5>Avatar</h5>
    <h5>Email</h5>
    <h5>Nazwa</h5>
    <h5>Hasło</h5>

    <h3>Ustawienia</h3>
    <h5>Powiadomienia systemowe (tak|nie)</h5>
    <!-- <h5>Wygląd (dark|light|system)</h5> -->
    <div class="settings-row">
      <div class="settings-row__name">
        {{ $t('theme') }}
      </div>
      <div class="settings-row__value settings-row__value--theme">
        <BaseSelect :options="themes" :modelValue="selectedTheme" @update:modelValue="updateTheme($event)" :searchable="false">
          <template v-slot:label="{ option }">{{ $t(`themes.${option}`) }}</template>
          <template v-slot:option="{ option }">{{ $t(`themes.${option}`) }}</template>
        </BaseSelect>
      </div>
    </div>

    <h3>Ukryta zawartość</h3>
    <h5>Ukryte blogi (zarządzaj)</h5>
    <ul>
      <li v-for="blogId in hiddenBlogs" :key="blogId">{{ blogId }}</li>
    </ul>

    <h5>Ukryte przepisy (zarządzaj)</h5>
    <ul>
      <li v-for="recipeId in hiddenRecipes" :key="recipeId">{{ recipeId }}</li>
    </ul>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import { ref } from 'vue'
import userApi from '@/api/userApi'

const themes = ['dark', 'light', 'system']

export default {
  name: 'MyAccount',
  components: { PageHeader },
  beforeMount() {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme) {
      this.selectedTheme = currentTheme
    }
    userApi.getHiddenRecipes().then(({ data }) => {
      this.hiddenRecipes = data.recipeIds
    })
    userApi.getHiddenBlogs().then(({ data }) => {
      this.hiddenBlogs = data.blogIds
    })
  },
  setup() {
    const currentTheme = localStorage.getItem('theme') || 'system'
    const selectedTheme = ref(currentTheme)
    const hiddenRecipes = ref([])
    const hiddenBlogs = ref([])
    function updateTheme(value) {
      if (value && themes.includes(value)) {
        selectedTheme.value = value
        localStorage.setItem('theme', value)
        document.documentElement.setAttribute('theme', value)
      }
    }
    return {
      hiddenRecipes,
      hiddenBlogs,
      selectedTheme,
      updateTheme,
      themes
    }
  }
}
</script>

<style lang="scss" scoped>
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
    &--theme {
      width: 128px;
    }
  }
}
</style>
