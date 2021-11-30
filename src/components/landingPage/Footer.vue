<template>
  <footer :class="{ footer: true, 'footer--bordered': border }">
    <div class="footer-logo">
      <Logotype class="logo" />
      <span class="copyright-text">
        {{ COPYRIGHT_TEXT }}
      </span>
    </div>
    <div class="footer-links">
      <BaseLink :href="ARTICLES_PATH" class="footer-link" color="text-secondary">
        Artykuły
      </BaseLink>
      <router-link v-slot="{ href, navigate }" :to="{ name: TERMS }" custom>
        <BaseLink :href="href" tag="span" class="footer-link" color="text-secondary" @click="navigate($event)">
          Regulamin
        </BaseLink>
      </router-link>
      <router-link v-slot="{ href, navigate }" :to="{ name: PRIVACY_POLICY }" custom>
        <BaseLink :href="href" tag="span" class="footer-link" color="text-secondary" @click="navigate($event)">
          Polityka prywatności
        </BaseLink>
      </router-link>
      <router-link v-slot="{ href, navigate }" :to="{ name: ADD_BLOG }" custom>
        <BaseLink :href="href" class="footer-link" color="text-secondary" @click="navigate($event)">
          Dodaj przepisy
        </BaseLink>
      </router-link>
      <router-link v-slot="{ href, navigate }" :to="{ name: CONTACT }" custom>
        <BaseLink :href="href" class="footer-link" color="text-secondary" @click="navigate($event)">
          Kontakt
        </BaseLink>
      </router-link>
    </div>
  </footer>
</template>

<script>
import { COPYRIGHT_TEXT } from '@/constants'

import { TERMS, PRIVACY_POLICY, ADD_BLOG, CONTACT } from '@/router/names'
import { ARTICLES as ARTICLES_PATH } from '@/router/paths'

import Logotype from '@/components/Logotype'

export default {
  components: { Logotype },
  props: {
    border: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    return {
      TERMS,
      PRIVACY_POLICY,
      ADD_BLOG,
      CONTACT,
      COPYRIGHT_TEXT,
      ARTICLES_PATH
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  color: var(--color-text-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.footer--bordered {
    border-top: 1px solid var(--color-border);
    padding-top: 32px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
  }

  .copyright-text {
    margin-left: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.25;
  }

  .logo {
    width: 96px;
    line-height: 1;

    :deep(.a) {
      fill: currentColor;
    }
  }

  .footer-links {
    margin: 0 -0.75rem;
  }

  .footer-link {
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.25;
    margin: 0.5rem 0.75rem;
    display: inline-block;
  }

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;

    .footer-links {
      margin-top: 1rem;
    }
  }
}
</style>
