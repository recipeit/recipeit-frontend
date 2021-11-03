<template>
  <div class="landing-page" :style="elementStyle">
    <Splash />
    <Statistics />
    <Benefits />
    <Container>
      <Section
        v-for="(section, index) in sections"
        :key="index"
        :inverse="index % 2 === 0"
        :title="section.title"
        :image="section.image"
        :description="section.description"
      />
    </Container>
    <FooterAuth />
    <SocialMedia />
    <Container>
      <Footer :border="true" />
    </Container>
  </div>
</template>

<script>
// import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
// import { useMeta } from "vue-meta";

import { BASE_URL } from "@/src/configs/url";

import Benefits from "@/src/components/landingPage/Benefits";
import Container from "@/src/components/landingPage/Container";
import Footer from "@/src/components/landingPage/Footer";
import FooterAuth from "@/src/components/landingPage/FooterAuth";
import Section from "@/src/components/landingPage/Section";
import SocialMedia from "@/src/components/landingPage/SocialMedia";
import Splash from "@/src/components/landingPage/Splash";
import Statistics from "@/src/components/landingPage/Statistics";

import imgKitchen from "@/src/assets/img/landing-page/kitchen.webp";
import imgRecipes from "@/src/assets/img/landing-page/recipes.webp";
import imgRecipe from "@/src/assets/img/landing-page/recipe.webp";
import imgShopping from "@/src/assets/img/landing-page/shopping.webp";
import imgFilters from "@/src/assets/img/landing-page/filters.webp";
import imgPlan from "@/src/assets/img/landing-page/plan.webp";
import imgFavourites from "@/src/assets/img/landing-page/favourites.webp";

export default {
  components: {
    Section,
    Splash,
    Footer,
    Container,
    Statistics,
    Benefits,
    FooterAuth,
    SocialMedia,
  },
  setup() {
    useMeta({
      link: [{ rel: "canonical", href: `${BASE_URL}` }],
      htmlAttrs: {
        "landing-page": true,
      },
    });

    const sections = [
      {
        title: "Dodaj swoje produkty",
        description:
          "Stwórz listę produktów, które masz w swojej kuchni. Możesz ją uzupełnić o szczegóły, takie jak ilość czy data ważności.",
        image: imgKitchen,
      },
      {
        title: "Sprawdź co możesz z nich przygotować",
        description:
          "Dzięki temu Twoje produkty się nie przeterminują. A jeżeli planuejsz drobne zakupy, Recipeit pokaże przepisy w których brakuje tylko paru składników.",
        image: imgRecipes,
      },
      {
        title: "Przygotuj posiłek",
        description:
          "Na specjalnym widoku przepisu sprawdzisz jakich składników potrzebujesz i jak przygotować wybraną potrawę.",
        image: imgRecipe,
      },
      {
        title: "Stwórz listę zakupów",
        description:
          "Dodasz do niej produkty, których brakuje do przygotowania Twojego posiłku. Recipeit automatycznie podzieli je na kategorie, co pomoże skrócić wizytę w sklepie.",
        image: imgShopping,
      },
      {
        title: "Filtruj przepisy",
        description:
          "Dzięki dedykowanym filtrom znajdziesz przepisy, które będą dokładnie odpowiadać Twoim potrzebom.",
        image: imgFilters,
      },
      {
        title: "Zaplanuj przepis na później",
        description:
          "Stwórz swój plan na najbliższe dni. W ten sposób nie zapomnisz o potrawach, które chcesz przygotować, ani o zakupach, jakie będą potrzebne.",
        image: imgPlan,
      },
      {
        title: "Dodawaj do ulubionych",
        description:
          "Lista ulubionych pozwoli Ci szybko wrócić do uwielbianych przepisów i przypomni jak je przygotować.",
        image: imgFavourites,
      },
    ];

    const elementStyle = ref(null);

    const onResizeWindow = () => {
      elementStyle.value = {
        "--half-width": `${Math.round(document.body.clientWidth / 2.0)}px`,
      };
    };

    onBeforeMount(() => {
      window.addEventListener("resize", onResizeWindow);
    });

    onMounted(() => {
      onResizeWindow();
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", onResizeWindow);
    });

    return {
      sections,
      elementStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.landing-page {
  min-height: 100vh;
}
</style>
