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

export default {
  components: { Section, Splash, Footer },
  setup() {
    const sections = [
      {
        title: 'Dodaj swoje produkty',
        description:
          'Stwórz listę produktów, które masz w swojej kuchni. Możesz je uzupełnić o szczegóły, takie jak ilość czy data ważności!',
        image: ''
      },
      {
        title: 'Sprawdź co możesz z nich przygotować',
        description:
          'Nie pozwól aby produkty, które kupiłeś, się przeterminowały. Recipeit pokaże Ci, co możesz przygotować z tego, co już masz!',
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
        description: 'Czegos Ci brakuje? Chcesz ugotować danie, ale nie masz potrzebnych składników? Dodaj je do listy zakupów!',
        image: ''
      },
      {
        title: 'Filtruj przepisy',
        description:
          'Szukasz czegoś konkretnego? Masz na coś alergię? Potrzebujesz przepis z konkretnymi składnikami? Skorzystaj z dedykowanych filtrów!',
        image: ''
      },
      {
        title: 'Zaplanuj przepis na później',
        description: 'Znalazłeś przepis, ale nie chcesz go przygotowywać już teraz? Dodaj go do planu dnia, bądź nawet tygodnia!',
        image: ''
      },
      {
        title: 'Dodawaj do ulubionych',
        description:
          'Każdy ma taki przepis, który uwielbia często przygotowywać. Z listą ulubionych przepisów, ich znalezienie jest błyskawiczne!',
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
