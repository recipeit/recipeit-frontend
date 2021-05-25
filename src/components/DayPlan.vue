<template>
  <div class="day-plan" v-if="currentDay">
    <SectionTitle
      icon="clock"
      title="Twój plan dnia"
      actionText="pokaż dzisiaj"
      :showAction="showBackToToday"
      @action-click="backToToday()"
    />
    <transition name="fade" mode="out-in">
      <div :key="currentDay.key">
        <div class="day-plan__new-header">
          <div class="new-header-list">
            <div
              @click="setDay(day.dayjs, 'fade')"
              v-for="day in daysList"
              :key="day.key"
              :class="[
                'new-header-day',
                {
                  'new-header-day--selected': currentDay.key === day.key,
                  'new-header-day--today': day.type === DayType.TODAY,
                  'new-header-day--before-today': day.type === DayType.PAST
                }
              ]"
            >
              <div class="new-header-day-weekday">{{ day.weekday }}</div>
              <div class="new-header-day-monthday">{{ day.monthday }}</div>
            </div>
          </div>
        </div>

        <div v-if="currentDayPlan === null">
          wczytuję...
        </div>

        <div v-else-if="anyPlannedRecipesInDay" class="day-plan__times-of-day">
          <div class="time-of-day" v-for="(recipes, key) in currentDayPlan" :key="key">
            <div class="time-of-day__title">{{ $t(`timeOfDay.${key}`) }}</div>
            <div class="time-of-day__recipes">
              <div href="#" class="time-of-day__recipe" v-for="recipe in recipes" :key="recipe.id">
                <router-link :to="{ name: APP_RECIPE, params: { recipeId: recipe.recipeId } }" v-slot="{ href, navigate }" custom>
                  <BaseLink :href="href" @click="navigate($event)" class="time-of-day__recipe__link">
                    {{ recipe.name }}
                  </BaseLink>
                </router-link>
                <BaseLink
                  tag="button"
                  color="text-secondary"
                  class="time-of-day__recipe__remove"
                  @click="removePlannedRecipe(recipe.id, key)"
                >
                  <BaseIcon icon="close" weight="semi-bold" />
                </BaseLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else key="no-plans" class="no-plans-message">
          <!-- WHEN CURRENT DAY IS NEXT 7 DAYS INCLUDING TODAY -->
          <template v-if="currentDay.type === DayType.TODAY || currentDay.type === DayType.THIS_WEEK">
            Zaplanuj przepis na ten dzień!
            <router-link :to="{ name: APP_COOK_IT }" v-slot="{ href, navigate }" custom>
              <BaseButton tag="a" :href="href" @click="navigate($event)" class="no-plans-message-button" raised color="primary">
                <BaseIcon class="no-plans-message-button-icon" icon="search" weight="semi-bold" />
                Przeglądaj przepisy
              </BaseButton>
            </router-link>
          </template>

          <!-- WHEN CURRENT DAY IS IN PAST OR IN FAR FUTURE  -->
          <template v-else-if="currentDay.type === DayType.PAST || currentDay.type === DayType.FAR_FUTURE">
            Nie zaplanowałeś żadnego przepisu na ten dzień
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import dayjs from '@/functions/dayjs'
import userApi from '@/api/userApi'
import { ToastType } from '@/plugins/toast/toastType'
import SectionTitle from '@/components/SectionTitle'
import { APP_COOK_IT, APP_RECIPE } from '@/router/names'

const SlideType = {
  PREVIOUS: 'previous',
  NEXT: 'next',
  FADE: 'fade'
}

const DayType = {
  PAST: 'PAST',
  TODAY: 'TODAY',
  THIS_WEEK: 'THIS_WEEK',
  FAR_FUTURE: 'FAR_FUTURE'
}

export default {
  components: { SectionTitle },
  setup() {
    return {
      APP_COOK_IT,
      APP_RECIPE,
      DayType
    }
  },
  data() {
    return {
      daysList: [],
      currentDay: null,
      currentDayPlan: null,
      currendDaySlideType: null
    }
  },
  beforeMount() {
    this.backToToday()
  },
  computed: {
    anyPlannedRecipesInDay() {
      const { currentDayPlan } = this
      return !!currentDayPlan && Object.keys(currentDayPlan).length > 0 && currentDayPlan.constructor === Object
    },
    noRecipesTemplateName() {
      if (this.anyPlannedRecipesInDay || this.currentDay === null) return null

      if (this.currentDay.type === 'PAST') return 'NO_RECIPES_IN_PAST'
      if (this.currentDay.type === 'FAR_FUTURE') return 'NO_RECIPES_IN_FAR_FUTURE'
      return 'ADD_RECIPES'
    },
    showBackToToday() {
      return this.currentDay && this.currentDay.type !== DayType.TODAY
    }
  },
  methods: {
    dayType(day, today) {
      if (day.isToday()) return 'TODAY'
      if (day.isBefore(today, 'day')) return 'PAST'

      const lastValidDay = today.add(7, 'days')
      if (!day.isBefore(lastValidDay, 'day')) return 'FAR_FUTURE'

      return 'THIS_WEEK'
    },
    backToToday() {
      this.setDay(dayjs().startOf('day'), SlideType.FADE)
    },
    setDay(day, slideType) {
      const today = dayjs().startOf('day')

      this.daysList = [
        day.subtract(1, 'day'),
        day,
        day.add(1, 'day'),
        day.add(2, 'day'),
        day.add(3, 'day'),
        day.add(4, 'day'),
        day.add(5, 'day'),
        day.add(6, 'day'),
        day.add(7, 'day'),
        day.add(8, 'day'),
        day.add(9, 'day'),
        day.add(10, 'day')
      ].map(day => ({
        dayjs: day,
        key: day.format('YYYY-MM-DD'),
        weekday: day.format('ddd'),
        monthday: day.date(),
        type: this.dayType(day, today)
      }))
      this.currendDaySlideType = slideType
      this.currentDay = {
        dayjs: day,
        key: day.format('YYYY-MM-DD'),
        name: day.calendar(),
        type: this.dayType(day, today)
      }
      this.currentDayPlan = null
      userApi.getPlannedRecipes(this.currentDay.key).then(resp => {
        this.currentDayPlan = resp.data.dayPlan
      })
    },
    previousDay() {
      this.setDay(this.currentDay.dayjs.subtract(1, 'day'), SlideType.PREVIOUS)
    },
    nextDay() {
      this.setDay(this.currentDay.dayjs.add(1, 'day'), SlideType.NEXT)
    },
    removePlannedRecipe(id, timeOfDay) {
      userApi.removeRecipeFromPlanned(id).then(resp => {
        if (resp.data) {
          this.$toast.show('Usunięto zaplanowany przepis')

          const set = this.currentDayPlan[timeOfDay]
          if (set) {
            const index = set.findIndex(v => v.id === id)
            if (index > -1) {
              this.currentDayPlan[timeOfDay].splice(index, 1)
            }
          }
        } else {
          this.$toast.show('Wystąpił błąd podczas usuwania', ToastType.ERROR)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.time-of-day {
  margin-top: 1rem;

  &__title {
    font-weight: bold;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
    margin-left: 1.5rem;
  }

  &__recipes {
    background-color: var(--color-background-flyout);
    box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
    min-height: 3.5rem;
    padding: 0.5rem 0;
  }

  &__recipe {
    display: flex;

    &__link {
      display: block;
      padding: #{(3.5rem - 1rem - 0.75rem) / 2} 1.5rem;
      padding-right: 0;
      font-size: 0.75rem;
      font-weight: bold;
      line-height: 1;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__remove {
      padding: 0.75rem;
      padding-right: 1.5rem;
      font-size: 1rem;
      line-height: 1;
      height: 2.5rem;
    }
  }
}

.day-plan__new-header {
  .new-header-list {
    display: flex;
    overflow: hidden;
    position: relative;
    gap: 8px;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 64px;
      pointer-events: none;
      background: linear-gradient(to right, transparent, var(--color-background));
    }

    .new-header-day {
      border-radius: 1.25rem;
      padding: 1rem 0;
      text-align: center;
      line-height: 1;
      width: 50px;
      flex-shrink: 0;
      cursor: pointer;

      &--selected {
        background-color: var(--color-image-background);
        cursor: initial;
      }

      &--today {
        // .new-header-day-monthday {
        color: var(--color-primary);
        // }
      }

      &--before-today {
        .new-header-day-monthday {
          color: var(--color-text-secondary);
        }
      }

      .new-header-day-weekday {
        text-transform: uppercase;
        color: var(--color-text-secondary);
        font-size: 10px;
        font-weight: bold;
        margin-bottom: 0.25rem;
      }

      .new-header-day-monthday {
        // color: var(--color-text-primary);
        font-size: 1.25rem;
      }
    }
  }
}

.no-plans-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;

  &-button {
    margin-top: 1rem;

    &-icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
}
</style>
