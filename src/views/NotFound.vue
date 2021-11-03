<template>
  <div class="not-found">
    <img
      class="not-found-image"
      src="@/src/assets/img/broccoli-sad.svg"
      alt=""
    />
    <span class="not-found-text">
      Ojjj... nie znaleźliśmy takiej strony
    </span>
    <NuxtLink v-slot="{ href, navigate }" :to="{ name: LANDING_PAGE }" custom>
      <BaseButton
        tag="a"
        :href="href"
        class="not-found-button"
        stroked
        @click="navigate($event)"
      >
        Wróć na stronę główną
      </BaseButton>
    </NuxtLink>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

import { BASE_URL } from "@/src/configs/url";

import { LANDING_PAGE } from "@/src/router/names";

export default {
  setup() {
    useMeta({
      title: "Nie znaleziono strony",
      link: [{ rel: "canonical", href: `${BASE_URL}/404` }],
    });

    return {
      LANDING_PAGE,
    };
  },
};
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
