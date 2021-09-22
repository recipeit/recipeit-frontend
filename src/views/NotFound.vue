<template>
  <div class="not-found">
    <img class="not-found-image" src="@/assets/img/broccoli-sad.svg" alt="" />
    <span class="not-found-text">
      Ojjj... nie znaleźliśmy takiej strony
    </span>
    <router-link :to="{ name: LANDING_PAGE }" v-slot="{ href, navigate }" custom>
      <BaseButton tag="a" :href="href" @click="navigate($event)" class="not-found-button" stroked>
        Wróć na stronę główną
      </BaseButton>
    </router-link>
  </div>
</template>

<script>
import { LANDING_PAGE } from '@/router/names'

export default {
  setup() {
    return {
      LANDING_PAGE
    }
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .not-found-image {
    width: 96px;
  }

  .not-found-text {
    margin-top: 16px;
  }

  .not-found-button {
    margin-top: 16px;
  }
}
</style>
