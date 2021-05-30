<template>
  <div class="landing-page">
    <Splash />

    <div class="landing-page-container you-know-container">
      <div class="you-know">Czy wiesz że...</div>
    </div>
    <div class="statistic-cards">
      <div class="statistic-card">
        <div class="statistic-card-title">
          <BaseIcon icon="home" />
        </div>
        <div class="statistic-card-description"><b class="bold">60%</b> marnowanej żywności pochodzi z gospodarstw domowych.</div>
      </div>
      <div class="statistic-card">
        <div class="statistic-card-title">
          <BaseIcon icon="trash" />
        </div>
        <div class="statistic-card-description">
          W polskich domach, w każdej sekundzie, do kosza wyrzucanych jest aż <b class="bold">92kg</b> żywności.
        </div>
      </div>
      <div class="statistic-card">
        <div class="statistic-card-title">
          <BaseIcon icon="grains" />
        </div>
        <div class="statistic-card-description">
          W koszu przeciętnego Polaka ląduje najczęściej <b class="bold">pieczywo</b> (62,9%), <b class="bold">świeże owoce</b> (57,4%) i
          <b class="bold">warzywa</b> (56,5%).
        </div>
      </div>
      <div class="statistic-card">
        <div class="statistic-card-title">
          <BaseIcon icon="clock" />
        </div>
        <div class="statistic-card-description">
          Najczęstszymi powodami wyrzucania żywności to jej <b class="bold">zepsucie</b> i <b class="bold">przeterminowanie</b>
        </div>
      </div>
    </div>
    <div class="landing-page-container data-container">
      Zródło: wyniki badań IOŚ-PIB, SGGW w ramach projektu PROM, 2020 r.
    </div>

    <div class="landing-page-container">
      <!-- <div>
        <div>60%</div>
        60% marnowanej żywności pochodzi z gospodarstw domowych.
      </div>
      <div>
        <div>92kg</div>
        W polskich domach, w każdej sekundzie do kosza wyrzucanych jest aż 92kg żywności.
      </div>
      <div>
        W koszu przeciętnego Polaka ląduje najczęściej pieczywo (62,9%), świeże owoce (57,4%) i warzywa (56,5%).
      </div>
      <div>
        Najczęstrzymi powodami wyrzucania żywności to jej zepsucie i przeterminowanie
      </div>
      <a href="https://bankizywnosci.pl/wp-content/uploads/2020/10/Raport_NieMarnujJedzenia_2020.pdf">ddd</a>
      <a href="https://ios.edu.pl/wp-content/uploads/2017/11/Pr%C3%B3ba-oszacowania-strat-i-marnotrawstwa%C5%BCywno%C5%9Bci-w-Polsce.pdf"
        >ddd</a
      > -->
      <!-- <a href="https://bankizywnosci.pl/ponad-53-polakow-przyznaje-ze-zdarza-im-sie-wyrzucic-zywnosc/">aaa</a> -->
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
import { onBeforeMount, onBeforeUnmount } from '@vue/runtime-core'

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

    onBeforeMount(() => {
      document.documentElement.setAttribute('landing-page', true)
    })

    onBeforeUnmount(() => {
      document.documentElement.removeAttribute('landing-page')
    })

    return {
      sections
    }
  }
}
</script>

<style lang="scss" scoped>
.landing-page {
  min-height: 100vh;
}

.landing-page-container {
  position: relative;
  max-width: 960px;
  padding: 2rem;
  margin: 0 auto;
}

.you-know-container {
  padding-bottom: 0;
}

.you-know {
  // margin-top: 2rem;
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
}

.data-container {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  padding-top: 0;
  padding-bottom: 0;
}

.statistic-cards {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1rem 0 2rem 0;
  // overflow: auto;
  // margin-top: -64px;

  padding-left: max(50vw - 480px, 1.5rem);
  padding-right: max(50vw - 480px, 1.5rem);
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  // overflow: auto;
  scroll-padding-left: max(50vw - 480px, 1.5rem);
  overflow-x: scroll;
  // transform: translateZ(0);
  flex-wrap: nowrap;

  &::after {
    content: '';
    display: block;
    /* background: red; */
    width: 20px;
    height: 20px;
    min-width: max(50vw - 480px - 1.5rem, 0.1px);
  }
}

.statistic-card {
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  // min-width: calc(100% / 3);

  max-width: calc(100% / 3 - 1rem);
  scroll-snap-align: start;
  scroll-snap-stop: always;
  width: 100%;
  flex-shrink: 0;

  .statistic-card-title {
    color: var(--color-primary);
    font-weight: bold;
    font-size: 2.5rem;
    line-height: 1;
  }

  .statistic-card-description {
    font-size: 0.875rem;
    margin-top: 0.5rem;

    .bold {
      font-weight: bold;
      // color: var(--color-primary);
    }
  }
}

@media (max-width: 720px) {
  .statistic-card {
    max-width: 256px;
  }
}
</style>
