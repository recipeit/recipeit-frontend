<template>
  <div class="landing-page">
    <Splash />
    <div class="landing-page-container">
      <Section
        v-for="(section, index) in sections"
        :key="index"
        :inverse="index % 2 === 0"
        :title="section.title"
        :description="section.description"
      />
      <Footer />
    </div>
  </div>
</template>

<script>
import Splash from '@/components/landingPage/Splash'
import Section from '@/components/landingPage/Section'
import Footer from '@/components/landingPage/Footer'
import { mapGetters } from 'vuex'

export default {
  components: { Section, Splash, Footer },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    })
  },
  setup() {
    const sections = [
      {
        title: 'Dodaj swoje produkty',
        description:
          'Stwórz listę produktów, które masz w swojej kuchni. Możesz ją uzupełnić o szczegóły, takie jak ilość, jednostka czy daty ważności!',
        image: ''
      },
      {
        title: 'Sprawdź co możesz z nich przygotować',
        description:
          'Nie pozwól aby produkty, które kupiłeś się przeterminowały! Aplikacja pokaże, co możesz przygotować z tego, co już masz!',
        image: ''
      },
      {
        title: 'Przygotuj potrawę',
        description:
          'Lista składników, liczba porcji, czas czy szczegółowa instrukcja przygotowania podzielona na osobne kroki. Wszystko to w Recipeit!',
        image: ''
      },
      {
        title: 'Stwórz listę zakupów',
        description: 'Czegos brakuje? Chcesz ugotować danie, ale nie masz potrzebnych składników? Stwórz listę zakupów!',
        image: ''
      },
      {
        title: 'Filtruj przepisy',
        description: 'Szukasz czegoś konkretnego? Masz na coś alergię? Szukasz przepisu z konkretnymi składnikami? Skorzystaj z filtrów!',
        image: ''
      },
      {
        title: 'Zaplanuj przepis na później',
        description: 'Znalazłeś przepis, ale nie chcesz go przygotowywać od razu? Stwórz swój plan dnia, bądź nawet tygodnia!',
        image: ''
      },
      {
        title: 'Dodawaj do ulubionych',
        description:
          'Posiadasz takie danie, które uwielbiasz przygotowywać? Z lista ulubionych przepisów, ich znalezienie jest błyskawiczne!',
        image: ''
      }
    ]

    return {
      sections
    }
  }
}
</script>

<style lang="scss" scoped>
$black: #000;
$gray: #90abb9;

$text-primary: $black;
$text-secondary: $gray;

.landing-page {
  background: #fff;
  min-height: 100vh;
  color: $text-primary;
}

.landing-page-container {
  max-width: 960px;
  padding: 2rem;
  margin: 0 auto;
}
</style>
