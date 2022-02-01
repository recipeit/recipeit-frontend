<template>
  <div class="landing-page" :style="elementStyle">
    <Splash />
    <Statistics />
    <Benefits />
    <Container>
      <Section
        v-for="(section, index) in sections"
        :key="index"
        :inverse="index % 2 === 0"
        :title="section.title"
        :image="section.image"
        :description="section.description"
      />
    </Container>
    <FooterAuth />
    <SocialMedia />
    <Container>
      <Footer :border="true" />
    </Container>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { useMeta } from 'vue-meta'

import { BASE_URL } from '@/configs/url'

import Benefits from '@/components/landingPage/Benefits.vue'
import Container from '@/components/landingPage/Container.vue'
import Footer from '@/components/landingPage/Footer.vue'
import FooterAuth from '@/components/landingPage/FooterAuth.vue'
import Section from '@/components/landingPage/Section.vue'
import SocialMedia from '@/components/landingPage/SocialMedia.vue'
import Splash from '@/components/landingPage/Splash.vue'
import Statistics from '@/components/landingPage/Statistics.vue'

import KitchenImage from '@/assets/img/landing-page/kitchen.webp'
import RecipesImage from '@/assets/img/landing-page/recipes.webp'
import RecipeImage from '@/assets/img/landing-page/recipe.webp'
import ShoppingImage from '@/assets/img/landing-page/shopping.webp'
import FiltersImage from '@/assets/img/landing-page/filters.webp'
import PlanImage from '@/assets/img/landing-page/plan.webp'
import FavouritesImage from '@/assets/img/landing-page/favourites.webp'

export default defineComponent({
  components: { Section, Splash, Footer, Container, Statistics, Benefits, FooterAuth, SocialMedia },

  setup() {
    useMeta({
      link: [{ rel: 'canonical', href: `${BASE_URL}` }],
      htmlAttrs: {
        'landing-page': true
      }
    })

    const sections = [
      {
        title: 'Dodaj swoje produkty',
        description:
          'Stwórz listę produktów, które masz w swojej kuchni. Możesz ją uzupełnić o szczegóły, takie jak ilość czy data ważności.',
        image: KitchenImage
      },
      {
        title: 'Sprawdź co możesz z nich przygotować',
        description:
          'Dzięki temu Twoje produkty się nie przeterminują. A jeżeli planuejsz drobne zakupy, Recipeit pokaże przepisy w których brakuje tylko paru składników.',
        image: RecipesImage
      },
      {
        title: 'Przygotuj posiłek',
        description: 'Na specjalnym widoku przepisu sprawdzisz jakich składników potrzebujesz i jak przygotować wybraną potrawę.',
        image: RecipeImage
      },
      {
        title: 'Stwórz listę zakupów',
        description:
          'Dodasz do niej produkty, których brakuje do przygotowania Twojego posiłku. Recipeit automatycznie podzieli je na kategorie, co pomoże skrócić wizytę w sklepie.',
        image: ShoppingImage
      },
      {
        title: 'Filtruj przepisy',
        description: 'Dzięki dedykowanym filtrom znajdziesz przepisy, które będą dokładnie odpowiadać Twoim potrzebom.',
        image: FiltersImage
      },
      {
        title: 'Zaplanuj przepis na później',
        description:
          'Stwórz swój plan na najbliższe dni. W ten sposób nie zapomnisz o potrawach, które chcesz przygotować, ani o zakupach, jakie będą potrzebne.',
        image: PlanImage
      },
      {
        title: 'Dodawaj do ulubionych',
        description: 'Lista ulubionych pozwoli Ci szybko wrócić do uwielbianych przepisów i przypomni jak je przygotować.',
        image: FavouritesImage
      }
    ]

    const elementStyle = ref(null)

    const onResizeWindow = () => {
      elementStyle.value = {
        '--half-width': `${Math.round(document.body.clientWidth / 2.0)}px`
      }
    }

    onBeforeMount(() => {
      window.addEventListener('resize', onResizeWindow)
    })

    onMounted(() => {
      onResizeWindow()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResizeWindow)
    })

    return {
      sections,
      elementStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.landing-page {
  min-height: 100vh;
}
</style>
