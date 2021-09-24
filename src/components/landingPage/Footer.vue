<template>
  <footer :class="{ footer: true, 'footer--bordered': border }">
    <div class="footer-logo">
      <Logotype class="logo" />
    </div>
    <div class="footer-links">
      <router-link :to="{ name: TERMS }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="footer-link" color="text-secondary">
          Regulamin
        </BaseLink>
      </router-link>
      <router-link :to="{ name: PRIVACY_POLICY }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="footer-link" color="text-secondary">
          Polityka prywatności
        </BaseLink>
      </router-link>
      <router-link :to="{ name: ADD_BLOG }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="footer-link" color="text-secondary">
          Dodaj blog
        </BaseLink>
      </router-link>
      <router-link :to="{ name: CONTACT }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="footer-link" color="text-secondary">
          Kontakt
        </BaseLink>
      </router-link>
    </div>
  </footer>
</template>

<script>
import { TERMS, PRIVACY_POLICY, ADD_BLOG, CONTACT } from '@/router/names'
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
      CONTACT
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
