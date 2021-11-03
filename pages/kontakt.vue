<template>
  <div class="contact">
    <h1 class="header">Kontakt</h1>
    <p>
      Chcesz się skontaktować? Napisz na
      <BaseLink :href="CONTACT_HREF" class="link" color="primary">
        {{ CONTACT_MAIL_ADDRESS }}
      </BaseLink>
    </p>

    <h2 class="sub-header">Bądź na bieżąco</h2>
    <p class="social-list">
      <a
        target="_blank"
        class="social-logo"
        :href="FACEBOOK_PROFILE_URL"
        v-html="FacebookLogo"
      />
      <a
        target="_blank"
        class="social-logo"
        :href="INSTAGRAM_PROFILE_URL"
        v-html="InstagramLogo"
      />
    </p>

    <h2 class="sub-header">Twórcy aplikacji</h2>
    <p>
      <b>Kamil Golec</b>, <b>Alicja Wołoszyn</b> i <b>Jakub Kozłowski</b>. To
      właśnie oni poświęcili swój czas i wiedzę na rozwój Recipeit. Bez nich
      aplikacja by nie powstała!
    </p>
  </div>
</template>

<script>
import FacebookLogo from "@/src/assets/logos/facebook.svg?inline";
import InstagramLogo from "@/src/assets/logos/instagram.svg?inline";

import { CONTACT_MAIL_ADDRESS, CONTACT_HREF } from "@/src/configs/emails";
import {
  FACEBOOK_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
} from "@/src/configs/socialMedia";
import { BASE_URL } from "@/src/configs/url";

import { CONTACT } from "@/src/router/paths";

export default {
  layout: "anonymous",
  setup() {
    useMeta({
      title: "Kontakt",
      link: [{ rel: "canonical", href: `${BASE_URL}${CONTACT}` }],
    });

    return {
      CONTACT_MAIL_ADDRESS,
      CONTACT_HREF,
      FacebookLogo,
      InstagramLogo,
      FACEBOOK_PROFILE_URL,
      INSTAGRAM_PROFILE_URL,
    };
  },
};
</script>

<style lang="scss" scoped>
.contact {
  font-size: 0.75rem;
  line-height: 1.75;

  .header {
    font-size: 1.25rem;
    margin: 0 0 1.5rem 0;
  }

  .sub-header {
    font-size: 1rem;
    margin: 3rem 0 1.5rem 0;
  }

  .list {
    list-style: disc;
    padding-inline-start: 40px;
  }

  .list-item {
    margin: 0.75rem 0;
  }

  .link {
    font-weight: 700;
  }

  .social-list {
    display: flex;
    // justify-content: center;
    align-items: center;
    gap: 24px;
  }

  .social-logo {
    height: 32px;

    @include transition((opacity));

    @include cursor-only {
      &:hover,
      &:focus {
        opacity: 0.75;
      }
    }

    ::v-deep(svg) {
      height: 100%;
      width: auto;
    }
  }
}
</style>
