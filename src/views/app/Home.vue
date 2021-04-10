<template>
  <div class="layout__page__content home-page">
    <!-- <PageHeader>
      <template v-slot:title>
        <h1 v-if="userProfile && userProfile.username" class="home-page__title">
          <span class="home-page__title__sub">{{ $t(welcomeType) }},</span>
          <span class="home-page__title__main">{{ userProfile.username }}</span>
        </h1>
        <h1 v-else class="home-page__title">
          <span>{{ $t(welcomeType) }}</span>
        </h1>
      </template>
    </PageHeader> -->
    <PageHeader :title="$t(welcomeType) + '!'"></PageHeader>

    <DayPlan>
      <template #title="{ backToToday, showBackToToday }">
        <div class="section-title">
          <BaseIcon class="section-title-icon" icon="clock" /> Twój plan dnia
          <transition name="fade">
            <BaseLink v-if="showBackToToday" class="section-title-link" tag="button" color="primary" @click="backToToday()">
              pokaż dzisiaj
            </BaseLink>
          </transition>
        </div>
      </template>
    </DayPlan>

    <div class="section-title"><BaseIcon class="section-title-icon" icon="heart" /> Ulubione</div>
    <HorizontalRecipesList :recipes="favouriteRecipes" />

    <div class="section-title"><BaseIcon class="section-title-icon" icon="star" /> Popularne kategorie</div>
    <div class="popular-categories-container">
      <ul class="popular-categories">
        <li class="popular-category-container">
          <a href="#" class="popular-category">Kuchnia włoska</a>
        </li>
        <li class="popular-category-container">
          <a href="#" class="popular-category">Dieta wegetariańska</a>
        </li>
        <li class="popular-category-container">
          <a href="#" class="popular-category">Makarony</a>
        </li>
        <li class="popular-category-container">
          <a href="#" class="popular-category">Ciasteczka</a>
        </li>
        <li class="popular-category-container">
          <a href="#" class="popular-category">Kuchnia tajska</a>
        </li>
        <li class="popular-category-container">
          <a href="#" class="popular-category">Kuchnia chińska</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import DayPlan from '@/components/DayPlan'
import HorizontalRecipesList from '@/components/HorizontalRecipesList'
import { mapGetters, mapState } from 'vuex'
import userApi from '@/api/userApi'

export default {
  components: { PageHeader, DayPlan, HorizontalRecipesList },
  name: 'Home',
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    ...mapState({
      userProfile: state => state.user.userProfile,
      recipes: state => state.recipes.recipes
    })
  },
  beforeMount() {
    userApi.getFavouriteRecipes().then(({ data }) => {
      this.favouriteRecipes = data
      // console.log(data)
    })
  },
  data() {
    const hour = new Date().getHours()
    const welcomeType = hour < 5 || hour > 16 ? 'welcome.evening' : hour < 12 ? 'welcome.morning' : 'welcome.afternoon'

    return {
      welcomeType,
      selectModel: null,
      selectModel2: null,
      selectModel3: null,
      selectOptions: ['Alaska', 'Alabama', 'Kalifornia'],
      selectOptions3: [
        { id: 1, name: 'Alaska' },
        { id: 2, name: 'Alabama' },
        { id: 3, name: 'Kalifornia' }
      ],
      favouriteRecipes: null
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  margin: 16px 0;
}
.home-page {
  &__title {
    font-size: 1.5rem;
    margin: 0;

    &__sub {
      font-size: 1rem;
      font-weight: 500;
      display: block;
    }
  }
}

.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  display: flex;
  align-items: center;

  &-link {
    margin-left: auto;
    font-size: 12px;
  }

  &-icon {
    margin-right: 0.5rem;
    font-size: 1.5rem;
    color: var(--color-primary);
  }
}

.popular-categories-container {
}
.popular-categories {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.popular-category-container {
  width: 50%;
  padding: 8px;
}

.popular-category {
  background-color: var(--color-image-background);
  color: inherit;
  text-decoration: none;
  display: block;
  height: 100%;
  width: 100%;
  display: flex;
  padding: 16px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;
  min-height: 96px;
  font-size: 0.875rem;
}
</style>
