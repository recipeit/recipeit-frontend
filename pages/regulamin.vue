<template>
  <div class="terms" v-html="TERMS_HTML" />
</template>

<script>
// import TERMS_HTML from "raw-loader!@/src/assets/docs/terms/terms_v1.html";

import { BASE_URL } from "@/src/configs/url";

import { TERMS } from "@/src/router/paths";

export default {
  layout: "anonymous",
  setup() {
    useMeta({
      title: "Regulamin",
      link: [{ rel: "canonical", href: `${BASE_URL}${TERMS}` }],
    });

    return {
      TERMS_HTML: "huhuhu",
    };
  },
};
</script>

<style lang="scss" scoped>
.terms {
  font-size: 0.75rem;
  line-height: 1.75;

  ::v-deep(h1) {
    font-size: 1.25rem;
  }

  ::v-deep(h2) {
    font-size: 1rem;
    margin: 1.5rem 0;
  }

  ::v-deep(h3) {
    font-size: 0.875rem;
    margin: 1.5rem 0;
  }

  ::v-deep(ol) {
    counter-reset: list;
  }

  ::v-deep(ol > li) {
    position: relative;
    list-style: none;
  }

  ::v-deep(ol > li::before) {
    position: absolute;
    left: -24px;
    content: counter(list, decimal) ". ";
    counter-increment: list;
    font-weight: bold;
  }

  ::v-deep(ul) {
    list-style: disc;
    padding-inline-start: 40px;
  }

  ::v-deep(ul > li) {
    margin: 0.75rem 0;
  }
}
</style>
