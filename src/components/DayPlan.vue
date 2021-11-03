<template>
  <div v-if="currentDay" class="day-plan">
    <SectionTitle
      icon="clock"
      title="Twój plan dnia"
      action-text="pokaż dzisiaj"
      :show-action="showBackToToday"
      @action-click="backToToday()"
    />
    <transition name="fade" mode="out-in">
      <div :key="currentDay.key">
        <div class="day-plan__new-header">
          <div class="new-header-list">
            <div
              v-for="day in daysList"
              :key="day.key"
              :class="[
                'new-header-day',
                {
                  'new-header-day--selected': currentDay.key === day.key,
                  'new-header-day--today': day.type === DayType.TODAY,
                  'new-header-day--before-today': day.type === DayType.PAST,
                },
              ]"
              @click="setDay(day.dayjs, 'fade')"
            >
              <div class="new-header-day-weekday">{{ day.weekday }}</div>
              <div class="new-header-day-monthday">{{ day.monthday }}</div>
            </div>
          </div>
        </div>

        <div v-if="currentDayPlan === null">wczytuję...</div>

        <div v-else-if="anyPlannedRecipesInDay" class="day-plan__times-of-day">
          <div
            v-for="(recipes, key) in currentDayPlan"
            :key="key"
            class="time-of-day"
          >
            <div class="time-of-day__title">{{ $t(`timeOfDay.${key}`) }}</div>
            <div class="time-of-day__recipes">
              <div
                v-for="recipe in recipes"
                :key="recipe.id"
                href="#"
                class="time-of-day__recipe"
              >
                <NuxtLink
                  v-slot="{ href, navigate }"
                  :to="{
                    path: '/przepis',
                    params: {
                      recipeId: recipe.recipeId,
                      recipeName: recipe.name,
                    },
                  }"
                  custom
                >
                  <BaseLink
                    :href="href"
                    class="time-of-day__recipe__link"
                    @click="navigate($event)"
                  >
                    {{ recipe.name }}
                  </BaseLink>
                </NuxtLink>
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
          <template
            v-if="
              currentDay.type === DayType.TODAY ||
              currentDay.type === DayType.THIS_WEEK
            "
          >
            <span v-if="currentDay.type === DayType.TODAY">
              Zaplanuj przepis na dzisiaj!
            </span>
            <span v-else> Zaplanuj przepis na ten dzień! </span>
            <NuxtLink
              v-slot="{ href, navigate }"
              :to="{ path: '/przepisy' }"
              custom
            >
              <BaseButton
                tag="a"
                :href="href"
                class="no-plans-message-button"
                raised
                color="primary"
                @click="navigate($event)"
              >
                <BaseIcon
                  class="no-plans-message-button-icon"
                  icon="search"
                  weight="semi-bold"
                />
                Przeglądaj przepisy
              </BaseButton>
            </NuxtLink>
          </template>

          <!-- WHEN CURRENT DAY IS IN PAST OR IN FAR FUTURE  -->
          <template
            v-else-if="
              currentDay.type === DayType.PAST ||
              currentDay.type === DayType.FAR_FUTURE
            "
          >
            Nie zaplanowałeś żadnego przepisu na ten dzień
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import userApi from "@/src/api/userApi";

import dayjs from "@/src/functions/dayjs";

import { useToast } from "@/src/plugins/toast";
import { ToastType } from "@/src/plugins/toast/toastType";

import { APP_RECIPES, APP_RECIPE } from "@/src/router/names";

import SectionTitle from "@/src/components/SectionTitle";

const SlideType = {
  PREVIOUS: "previous",
  NEXT: "next",
  FADE: "fade",
};

const DayType = {
  PAST: "PAST",
  TODAY: "TODAY",
  THIS_WEEK: "THIS_WEEK",
  FAR_FUTURE: "FAR_FUTURE",
};

export default {
  name: "DayPlan",
  components: { SectionTitle },
  async setup() {
    const toast = useToast();

    const data = reactive({
      daysList: [],
      currentDay: null,
      currentDayPlan: null,
      currendDaySlideType: null,
    });

    const anyPlannedRecipesInDay = computed(() => {
      const { currentDayPlan } = data;
      return (
        !!currentDayPlan &&
        Object.keys(currentDayPlan).length > 0 &&
        currentDayPlan.constructor === Object
      );
    });

    const noRecipesTemplateName = computed(() => {
      if (anyPlannedRecipesInDay.value || data.currentDay === null) return null;

      if (data.currentDay.type === "PAST") return "NO_RECIPES_IN_PAST";
      if (data.currentDay.type === "FAR_FUTURE")
        return "NO_RECIPES_IN_FAR_FUTURE";
      return "ADD_RECIPES";
    });

    const showBackToToday = computed(() => {
      return data.currentDay?.type !== DayType.TODAY;
    });

    const dayType = (day, today) => {
      if (day.isToday()) return "TODAY";
      if (day.isBefore(today, "day")) return "PAST";

      const lastValidDay = today.add(7, "days");
      if (!day.isBefore(lastValidDay, "day")) return "FAR_FUTURE";

      return "THIS_WEEK";
    };

    const backToToday = async () => {
      await setDay(dayjs().startOf("day"), SlideType.FADE);
    };

    const setDay = async (day, slideType) => {
      const today = dayjs().startOf("day");

      data.daysList = [
        day.subtract(1, "day"),
        day,
        day.add(1, "day"),
        day.add(2, "day"),
        day.add(3, "day"),
        day.add(4, "day"),
        day.add(5, "day"),
        day.add(6, "day"),
        day.add(7, "day"),
        day.add(8, "day"),
        day.add(9, "day"),
        day.add(10, "day"),
      ].map((day) => ({
        dayjs: day,
        key: day.format("YYYY-MM-DD"),
        weekday: day.format("ddd"),
        monthday: day.date(),
        type: dayType(day, today),
      }));
      data.currendDaySlideType = slideType;
      data.currentDay = {
        dayjs: day,
        key: day.format("YYYY-MM-DD"),
        name: day.calendar(),
        type: dayType(day, today),
      };
      data.currentDayPlan = null;

      console.log("O CO Z TYM CHODZI");
      console.log("co2");
      try {
        const { data: respData } = await userApi.getPlannedRecipes(
          data.currentDay.key
        );
        console.log("co", { respData });
        data.currentDayPlan = respData.dayPlan;
      } catch (e) {
        console.log("errr", e);
      }
    };

    const previousDay = () => {
      setDay(data.currentDay.dayjs.subtract(1, "day"), SlideType.PREVIOUS);
    };

    const nextDay = () => {
      setDay(data.currentDay.dayjs.add(1, "day"), SlideType.NEXT);
    };

    const removePlannedRecipe = (id, timeOfDay) => {
      userApi.removeRecipeFromPlanned(id).then((resp) => {
        if (resp.data) {
          toast.show("Usunięto zaplanowany przepis");

          const set = data.currentDayPlan[timeOfDay];
          if (set) {
            const index = set.findIndex((v) => v.id === id);
            if (index > -1) {
              data.currentDayPlan[timeOfDay].splice(index, 1);
            }
          }
        } else {
          toast.show("Wystąpił błąd podczas usuwania", ToastType.ERROR);
        }
      });
    };

    onBeforeMount(async () => {
      await backToToday();
    });

    return {
      ...toRefs(data),
      anyPlannedRecipesInDay,
      noRecipesTemplateName,
      showBackToToday,
      backToToday,
      setDay,
      previousDay,
      nextDay,
      removePlannedRecipe,
      APP_RECIPES,
      APP_RECIPE,
      DayType,
    };
  },
};
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
      padding: math.div(3.5rem - 1rem - 0.75rem, 2) 1.5rem;
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
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 64px;
      pointer-events: none;
      background: linear-gradient(
        to right,
        transparent,
        var(--color-background)
      );
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
