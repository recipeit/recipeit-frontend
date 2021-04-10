<template>
  <div class="layout__page__content home-page">
    <PageHeader>
      <template v-slot:title>
        <h1 v-if="userProfile && userProfile.username" class="home-page__title">
          <span class="home-page__title__sub">{{ $t(welcomeType) }},</span>
          <span class="home-page__title__main">{{ userProfile.username }}</span>
        </h1>
        <h1 v-else class="home-page__title">
          <span>{{ $t(welcomeType) }}</span>
        </h1>
      </template>
    </PageHeader>
    <!-- <template v-if="isAuthenticated"> -->
    <DayPlan></DayPlan>
    <p>Ulubione</p>
    <HorizontalRecipesList :recipes="favouriteRecipes" />
    <p>
      Popularne kategorie
    </p>
    <!-- </template>

    <LoginBeforeEnter v-else></LoginBeforeEnter> -->
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
</style>
