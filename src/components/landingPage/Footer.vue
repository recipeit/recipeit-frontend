<template>
  <footer :class="{ footer: true, 'footer--bordered': border }">
    <div class="footer-logo">
      <Logotype class="logo" />
    </div>
    <div class="links">
      <router-link :to="{ name: TERMS }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="link" color="text-secondary">
          Regulamin
        </BaseLink>
      </router-link>
      <router-link :to="{ name: PRIVACY_POLICY }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="link" color="text-secondary">
          Polityka prywatności
        </BaseLink>
      </router-link>
      <router-link :to="{ name: ADD_BLOG }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="link" color="text-secondary">
          Dodaj blog
        </BaseLink>
      </router-link>
      <BaseLink :href="contactHref" class="link" color="text-secondary">
        Kontakt
      </BaseLink>
    </div>
  </footer>
</template>

<script>
import { TERMS, PRIVACY_POLICY, ADD_BLOG } from '@/router/names'
import { CONTACT_MAIL_ADDRESS } from '@/configs/emails'
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
    const contactHref = `mailto:${CONTACT_MAIL_ADDRESS}`

    return {
      contactHref,
      TERMS,
      PRIVACY_POLICY,
      ADD_BLOG
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

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.logo {
  width: 96px;

  ::v-deep(.a) {
    fill: currentColor;
  }
}

.link {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25;

  @media (max-width: 720px) {
    font-size: 0.75rem;
  }

  & + & {
    margin-left: 1.5rem;
  }
}
</style>
