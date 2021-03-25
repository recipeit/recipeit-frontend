<template>
  <div class="day-plan">
    <div class="day-plan__header">
      <BaseLink class="day-plan__header__button" @click="previousDay()">
        <BaseIcon icon="arrow-left" weight="semi-bold"></BaseIcon>
      </BaseLink>
      <span class="day-plan__header__title">{{ currentDay.calendar() }}</span>
      <BaseLink class="day-plan__header__button" @click="nextDay()">
        <BaseIcon icon="arrow-right" weight="semi-bold"></BaseIcon>
      </BaseLink>
    </div>
    <div class="day-plan__times-of-day">
      <div class="time-of-day" v-for="(recipes, key) in currentDayPlan" :key="key">
        <div class="time-of-day__title">{{ $t(`timeOfDay.${key}`) }}</div>
        <div class="time-of-day__recipes">
          <BaseLink href="#" class="time-of-day__recipe" v-for="recipe in recipes" :key="recipe.id">
            {{ recipe.name }}
          </BaseLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/functions/dayjs'

export default {
  data() {
    return {
      currentDay: null,
      currentDayPlan: {
        BREAKFAST: [
          {
            id: '8918255a-78c1-4ebc-af6a-c083b521b7bf',
            name: 'Naleśniki po bolońsku',
            authorName: 'aliszjaw',
            blogName: 'Kwestia Smaku'
          },
          {
            id: '2b290e8d-ba83-4ef0-aac9-3d5d11aad358',
            name: 'Ciasto marchewkowe z orzechami',
            authorName: 'Alicja',
            blogName: 'czekoladowa muffinka'
          }
        ],
        ELEVENSES: [],
        LUNCH: [],
        DINNER: [
          {
            id: 'b9785b32-c4a0-4d13-adfe-cde5b2eecf7d',
            name: 'Quesadilla z batatami i chorizo',
            authorName: 'Marta',
            blogName: 'Kuchnia Marty'
          }
        ],
        SUPPER: [],
        SNACK: []
      }
    }
  },
  beforeMount() {
    this.setDay(dayjs().startOf('day'))
  },
  methods: {
    setDay(day) {
      this.currentDay = day
    },
    previousDay() {
      this.currentDay = this.currentDay.subtract(1, 'day')
    },
    nextDay() {
      this.currentDay = this.currentDay.add(1, 'day')
    }
  }
}
</script>

<style lang="scss" scoped>
.day-plan {
  &__header {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-border);
    border-radius: 2rem;
    height: 3rem;
    padding: 0 0.25rem;

    &__button {
      height: 2.5rem;
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__title {
      flex: 1;
      text-align: center;
      font-size: 0.875rem;
    }
  }
}

.time-of-day {
  margin-top: 1rem;

  &__title {
    font-weight: bold;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }

  &__recipes {
    background-color: var(--color-background-flyout);
    border-radius: 0.5rem;
    min-height: 2.5rem;
  }

  &__recipe {
    font-size: 0.875rem;
    line-height: 1;
    padding: (2.5rem - 0.875rem)/2 1rem;
    display: block;
  }
}
</style>
