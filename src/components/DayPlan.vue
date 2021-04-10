<template>
  <div class="day-plan" v-if="currentDay">
    <!-- <div class="day-plan__header">
      <BaseLink tag="button" class="day-plan__header__button" @click="previousDay()">
        <BaseIcon icon="angle-left" weight="semi-bold"></BaseIcon>
      </BaseLink>
      <div class="day-plan__header__title-container">
        <transition :name="`day-plan-slide-${currendDaySlideType}`" mode="out-in">
          <div :class="['day-plan__header__title', { 'day-plan__header__title--today': currentDay.isToday }]" :key="currentDay.key">
            {{ currentDay.name }}
          </div>
        </transition>
      </div>
      <BaseLink tag="button" class="day-plan__header__button" @click="nextDay()">
        <BaseIcon icon="angle-right" weight="semi-bold"></BaseIcon>
      </BaseLink>
    </div> -->

    <div class="day-plan__new-header">
      <div class="new-header-list">
        <div class="new-header-day new-header-day">
          <div class="new-header-day-weekday">PT</div>
          <div class="new-header-day-monthday">9</div>
        </div>
        <div class="new-header-day new-header-day--selected">
          <div class="new-header-day-weekday">SOB</div>
          <div class="new-header-day-monthday">10</div>
        </div>
        <div class="new-header-day">
          <div class="new-header-day-weekday">NIE</div>
          <div class="new-header-day-monthday">11</div>
        </div>
        <div class="new-header-day">
          <div class="new-header-day-weekday">PON</div>
          <div class="new-header-day-monthday">12</div>
        </div>
        <div class="new-header-day">
          <div class="new-header-day-weekday">WT</div>
          <div class="new-header-day-monthday">13</div>
        </div>
        <div class="new-header-day">
          <div class="new-header-day-weekday">ŚR</div>
          <div class="new-header-day-monthday">14</div>
        </div>
        <!-- <div class="new-header-day">
          <div class="new-header-day-weekday">CZW</div>
          <div class="new-header-day-monthday">15</div>
        </div> -->
      </div>
    </div>

    <transition :name="`day-plan-slide-${currendDaySlideType}`" mode="out-in">
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
              <BaseLink
                tag="button"
                color="text-secondary"
                class="time-of-day__recipe__remove"
                @click="removePlannedRecipe(recipe.id, key)"
              >
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
import userApi from '@/api/userApi'
import { ToastType } from '@/plugins/toast/toastType'

const SlideType = {
  PREVIOUS: 'previous',
  NEXT: 'next',
  FADE: 'fade'
}

export default {
  data() {
    return {
      currentDay: null,
      currentDayPlan: null,
      currendDaySlideType: null
    }
  },
  beforeMount() {
    this.setDay(dayjs().startOf('day'), SlideType.FADE)
  },
  methods: {
    setDay(day, slideType) {
      this.currendDaySlideType = slideType
      this.currentDay = {
        dayjs: day,
        key: day.format('YYYY-MM-DD'),
        name: day.calendar(),
        isToday: day.isToday()
      }
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
.day-plan {
  &-slide-fade,
  &-slide-previous,
  &-slide-next {
    // &-enter-active,
    // &-leave-active {
    //   @include transition((opacity, transform));
    // }
    &-enter-active {
      @include transition((opacity, transform), 0.2s, ease-out);
    }
    &-leave-active {
      @include transition((opacity, transform), 0.2s, ease-in);
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
  }

  $transform-size: 3rem;

  &-slide-previous {
    &-enter-from {
      transform: translateX(-$transform-size);
    }
    &-leave-to {
      transform: translateX($transform-size);
    }
  }

  &-slide-next {
    &-enter-from {
      transform: translateX($transform-size);
    }
    &-leave-to {
      transform: translateX(-$transform-size);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-border);
    border-radius: 2rem;
    height: 3rem;
    padding: 0 0.25rem;
    user-select: none;

    &__button {
      height: 2.5rem;
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__title-container {
      flex: 1;
    }

    &__title {
      text-align: center;
      font-size: 0.875rem;

      &--today {
        font-weight: bold;
        color: var(--color-primary);
      }
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

    .new-header-day {
      border-radius: 1.25rem;
      padding: 1rem;
      text-align: center;
      line-height: 1;

      &--selected {
        background-color: var(--color-image-background);
      }

      .new-header-day-weekday {
        text-transform: uppercase;
        color: var(--color-text-secondary);
        font-size: 10px;
        font-weight: bold;
        margin-bottom: 0.25rem;
      }

      .new-header-day-monthday {
        color: var(--color-text-primary);
        font-size: 1.25rem;
      }
    }
  }
}
</style>
