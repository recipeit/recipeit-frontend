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
    <Container>
      <Footer :border="false" />
    </Container>
  </div>
</template>

<script>
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from '@vue/runtime-core'
import Splash from '@/components/landingPage/Splash'
import Section from '@/components/landingPage/Section'
import Footer from '@/components/landingPage/Footer'
import Container from '@/components/landingPage/Container'
import Statistics from '@/components/landingPage/Statistics'
import Benefits from '@/components/landingPage/Benefits'
import FooterAuth from '@/components/landingPage/FooterAuth'
import { useMeta } from 'vue-meta'

export default {
  components: { Section, Splash, Footer, Container, Statistics, Benefits, FooterAuth },
  setup() {
    useMeta({
      htmlAttrs: {
        'landing-page': true
      }
    })

    const sections = [
      {
        title: 'Dodaj swoje produkty',
        description:
          'Stwórz listę produktów, które masz w swojej kuchni. Możesz je uzupełnić o szczegóły, takie jak ilość czy data ważności!',
        image: require('@/assets/img/landing-page/kitchen.png')
      },
      {
        title: 'Sprawdź co możesz z nich przygotować',
        description:
          'Nie pozwól aby produkty, które kupiłeś, się przeterminowały. Recipeit pokaże Ci, co możesz przygotować z tego, co już masz!',
        image: require('@/assets/img/landing-page/recipes.png')
      },
      {
        title: 'Przygotuj posiłek',
        description:
          'Lista składników, liczba porcji, czas czy szczegółowa instrukcja przygotowania podzielona na osobne kroki. Wszystko to w Recipeit!',
        image: require('@/assets/img/landing-page/recipe.png')
      },
      {
        title: 'Stwórz listę zakupów',
        description: 'Czegos Ci brakuje? Chcesz ugotować danie, ale nie masz potrzebnych składników? Dodaj je do listy zakupów!',
        image: require('@/assets/img/landing-page/shopping.png')
      },
      {
        title: 'Filtruj przepisy',
        description:
          'Szukasz czegoś konkretnego? Masz na coś alergię? Potrzebujesz przepis z konkretnymi składnikami? Skorzystaj z dedykowanych filtrów!',
        image: require('@/assets/img/landing-page/filters.png')
      },
      {
        title: 'Zaplanuj przepis na później',
        description: 'Znalazłeś przepis, ale nie chcesz go przygotowywać już teraz? Dodaj go do planu dnia, bądź nawet tygodnia!',
        image: require('@/assets/img/landing-page/plan.png')
      },
      {
        title: 'Dodawaj do ulubionych',
        description:
          'Każdy ma taki przepis, który uwielbia często przygotowywać. Z listą ulubionych przepisów, ich znalezienie jest błyskawiczne!',
        image: require('@/assets/img/landing-page/favourites.png')
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
      // document.documentElement.setAttribute('landing-page', true)
    })

    onMounted(() => {
      onResizeWindow()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResizeWindow)
      // document.documentElement.removeAttribute('landing-page')
    })

    return {
      sections,
      elementStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.landing-page {
  min-height: 100vh;
}
</style>
