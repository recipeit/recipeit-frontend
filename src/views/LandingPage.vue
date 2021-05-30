<template>
  <div class="landing-page">
    <Splash />

    <div class="landing-page-container you-know-container">
      <div class="you-know">Czy wiesz, że...</div>
      <div class="controls">
        <BaseLink tag="button" class="control-left" @click="scrollLeft()" :disabled="scrollLeftButtonDisabled">
          <BaseIcon icon="arrow-right" />
        </BaseLink>
        <BaseLink tag="button" class="control-right" @click="scrollRight()" :disabled="scrollRightButtonDisabled">
          <BaseIcon icon="arrow-right" />
        </BaseLink>
      </div>
    </div>
    <div class="statistic-cards" ref="statisticCards" @scroll="onScroll()">
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
          W polskich domach, w każdej sekundzie, do kosza wyrzucanych jest aż <b class="bold">92kg</b> jedzenia.
        </div>
      </div>
      <div class="statistic-card">
        <div class="statistic-card-title">
          <BaseIcon icon="grains" />
        </div>
        <div class="statistic-card-description">
          Najczęściej wyrzucamy <b class="bold">pieczywo</b> (62,9%), <b class="bold">świeże owoce</b> (57,4%) i
          <b class="bold">warzywa</b> (56,5%).
        </div>
      </div>
      <div class="statistic-card">
        <div class="statistic-card-title">
          <BaseIcon icon="clock" />
        </div>
        <div class="statistic-card-description">
          Głównymi powodami wyrzucania żywności to jej <b class="bold">zepsucie</b> i <b class="bold">przeterminowanie</b>.
        </div>
      </div>
    </div>
    <div class="landing-page-container data-container">
      Źródło: wyniki badań IOŚ-PIB, SGGW w ramach projektu PROM, 2020 r.
    </div>

    <div class="benefits-section">
      <div class="landing-page-container">
        <div class="benefits">
          <div class="benefit">
            <BaseIcon class="benefit-icon" icon="tableware" />
            <div class="benefit-title">Zainspiruj się</div>
            Z Recipeit poznasz nowe kuchnie i przepisy.
          </div>

          <div class="benefit">
            <BaseIcon class="benefit-icon" icon="money" />
            <div class="benefit-title">Oszczędź pieniądze</div>
            Recipeit pomoże Ci uniknąć marnowania jedzenia.
          </div>

          <div class="benefit">
            <BaseIcon class="benefit-icon" icon="clock" />
            <div class="benefit-title">Zaoszczędź swój czas</div>
            Wystarczy kilka chwil, by znaleźć przepis z Twoich składników.
          </div>
        </div>
      </div>
    </div>

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
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from '@vue/runtime-core'

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

    const statisticCards = ref(null)

    const scrollLeft = () => {
      const { value: el } = statisticCards

      const scrollByLeft = el.children[0].clientWidth

      el.scrollBy({
        left: -scrollByLeft,
        behavior: 'smooth'
      })
    }

    const scrollRight = () => {
      const { value: el } = statisticCards

      const scrollByLeft = el.children[0].clientWidth

      el.scrollBy({
        left: scrollByLeft,
        behavior: 'smooth'
      })
    }

    const scrollLeftButtonDisabled = ref(true)
    const scrollRightButtonDisabled = ref(null)

    const onScroll = () => {
      const { value: el } = statisticCards

      if (el.scrollLeft === 0 && !scrollLeftButtonDisabled.value) {
        scrollLeftButtonDisabled.value = true
      } else if (el.scrollLeft !== 0 && scrollLeftButtonDisabled.value) {
        scrollLeftButtonDisabled.value = null
      }

      if (el.scrollLeft === el.scrollWidth - el.offsetWidth) {
        if (!scrollRightButtonDisabled.value) {
          scrollRightButtonDisabled.value = true
        }
      } else {
        if (scrollRightButtonDisabled.value) {
          scrollRightButtonDisabled.value = null
        }
      }
    }

    onMounted(() => {
      onScroll()
    })

    return {
      sections,
      scrollLeft,
      scrollRight,
      statisticCards,
      scrollLeftButtonDisabled,
      scrollRightButtonDisabled,
      onScroll
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

.benefits-section {
  background-color: mix(#e2e9ed, #fff, 35%);
  margin: 4rem 0 0 0;
}

.benefits {
  display: flex;
}

.benefit {
  flex: 1;
  font-size: 0.875rem;
  text-align: center;
  color: var(--color-text-dark);
  padding: 1rem;
}

@media (max-width: 720px) {
  .benefits {
    // flex-wrap: wrap;
    // justify-content: center;
    flex-direction: column;
  }

  // .benefit {
  //   width: 50%;
  //   flex: initial;
  // }
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  // color: var(--color-text-dark);
}

.benefit-title {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  line-height: 1.15;
}

.you-know-container {
  margin-top: 4rem;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
}

.you-know {
  font-weight: bold;
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.controls {
  display: none;

  @include cursor-only {
    display: flex;
  }
}

.control-left {
  transform: rotate(180deg); // TODO add icon
  // visibility: hidden;
  // opacity: 0;
}

.control-left,
.control-right {
  font-size: 1.5rem;
  height: 1.5rem;
  width: 2.5rem;
  line-height: 1;

  &[disabled] {
    color: var(--color-text-secondary);
    pointer-events: none;
    opacity: 0.5;
  }
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

  @include cursor-only {
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }

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
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.1);
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
    color: var(--color-text-dark);

    .bold {
      font-weight: bold;
      color: var(--color-text-primary);
    }
  }
}

@media (max-width: 720px) {
  .statistic-card {
    max-width: 256px;
  }
}
</style>
