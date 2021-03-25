<template>
  <div class="day-plan" v-if="currentDay">
    <div class="day-plan__header">
      <BaseLink class="day-plan__header__button" @click="previousDay()">
        <BaseIcon icon="arrow-left" weight="semi-bold"></BaseIcon>
      </BaseLink>
      <span class="day-plan__header__title">
        <transition name="fade" mode="out-in">
          <span :key="currentDay.key">{{ currentDay.name }}</span>
        </transition>
      </span>
      <BaseLink class="day-plan__header__button" @click="nextDay()">
        <BaseIcon icon="arrow-right" weight="semi-bold"></BaseIcon>
      </BaseLink>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="currentDayPlan" :key="currentDay.key" class="day-plan__times-of-day">
        <div class="time-of-day" v-for="(recipes, key) in currentDayPlan" :key="key">
          <div class="time-of-day__title">{{ $t(`timeOfDay.${key}`) }}</div>
          <div class="time-of-day__recipes">
            <div href="#" class="time-of-day__recipe" v-for="recipe in recipes" :key="recipe.id">
              <router-link :to="{ name: 'recipe', params: { recipeId: recipe.recipeId } }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate" class="time-of-day__recipe__link">
                  {{ recipe.name }}
                </BaseLink>
              </router-link>
              <BaseLink tag="button" color="text-secondary" class="time-of-day__recipe__remove" @click="removePlannedRecipe(recipe.id)">
                <BaseIcon icon="close" weight="semi-bold"></BaseIcon>
              </BaseLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import dayjs from '@/functions/dayjs'
import recipeApi from '@/api/recipeApi'

export default {
  data() {
    return {
      currentDay: null,
      currentDayPlan: null
    }
  },
  beforeMount() {
    this.setDay(dayjs().startOf('day'))
  },
  methods: {
    setDay(day) {
      this.currentDay = {
        dayjs: day,
        key: day.format('YYYY-MM-DD'),
        name: day.calendar()
      }
      recipeApi.getPlannedRecipes(this.currentDay.key).then(resp => {
        console.log(resp)
        this.currentDayPlan = resp.data.dayPlan
      })
    },
    previousDay() {
      this.setDay(this.currentDay.dayjs.subtract(1, 'day'))
    },
    nextDay() {
      this.setDay(this.currentDay.dayjs.add(1, 'day'))
    },
    removePlannedRecipe(id) {
      console.log('removing planned recipe with id ', id)
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
    border-radius: 1rem;
    min-height: 2.5rem;
    padding: 0.25rem 0;
  }

  &__recipe {
    display: flex;

    &__link {
      display: block;
      padding: #{(2.5rem - 0.875rem) / 2 - 0.25rem} 1rem;
      font-size: 0.875rem;
      line-height: 1;
      flex: 1;
    }

    &__remove {
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      line-height: 1;
      height: 1rem;
    }
  }
}
</style>
