<template>
  <div class="statistics">
    <Container class="header-container">
      <div class="header">Czy wiesz, że...</div>
      <div class="controls">
        <BaseLink tag="button" class="control-left" @click="scrollLeft()" :disabled="scrollLeftButtonDisabled">
          <BaseIcon icon="arrow-right" />
        </BaseLink>
        <BaseLink tag="button" class="control-right" @click="scrollRight()" :disabled="scrollRightButtonDisabled">
          <BaseIcon icon="arrow-right" />
        </BaseLink>
      </div>
    </Container>
    <div class="statistics-cards" ref="statisticCards" @scroll="onScroll()">
      <StatisticsCard v-for="(statistic, index) in statistics" :key="index" :icon="statistic.icon" :description="statistic.description" />
    </div>
    <Container class="statistics-footer-container">
      Źródło: wyniki badań IOŚ-PIB, SGGW w ramach projektu PROM, 2020 r.
    </Container>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/runtime-core'
import Container from './Container'
import StatisticsCard from './StatisticsCard'

export default {
  components: { Container, StatisticsCard },
  setup() {
    const statistics = [
      {
        icon: 'home',
        description: '<b>60%</b> marnowanej żywności pochodzi z gospodarstw domowych.'
      },
      {
        icon: 'trash',
        description: 'W polskich domach, w każdej sekundzie, do kosza wyrzucanych jest aż <b>92kg</b> jedzenia.'
      },
      {
        icon: 'grains',
        description: 'Najczęściej wyrzucamy <b>pieczywo</b> (62,9%), <b>świeże owoce</b> (57,4%) i <b>warzywa</b> (56,5%).'
      },
      {
        icon: 'clock',
        description: 'Głównymi powodami wyrzucania żywności to jej <b>zepsucie</b> i <b>przeterminowanie</b>.'
      }
    ]

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
      statistics,
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
.header-container {
  margin-top: 4rem;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
}

.header {
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

.statistics-footer-container {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  padding-top: 0;
  padding-bottom: 0;
}

.statistics-cards {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  padding: 1rem 0 2rem 0;

  padding-left: max(var(--half-width) - 480px, 2rem);
  padding-right: max(var(--half-width) - 480px, 2rem);
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scroll-padding-left: max(var(--half-width) - 480px, 2rem);
  overflow-x: scroll;
  flex-wrap: nowrap;

  @include cursor-only {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &::after {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    min-width: max(var(--half-width) - 480px - 1.5rem, 0.1px);
  }
}
</style>
