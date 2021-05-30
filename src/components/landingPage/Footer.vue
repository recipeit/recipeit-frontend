<template>
  <footer class="footer">
    <div class="footer-logo">
      <Logotype class="logo" />
    </div>
    <div class="links">
      <router-link :to="{ name: 'terms' }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="link" color="text-secondary">
          Regulamin
        </BaseLink>
      </router-link>
      <router-link :to="{ name: 'privacy-policy' }" #default="{ href, navigate}" custom>
        <BaseLink :href="href" @click="navigate($event)" class="link" color="text-secondary">
          Polityka prywatności
        </BaseLink>
      </router-link>
      <BaseLink :href="contactHref" class="link" color="text-secondary">
        Kontakt
      </BaseLink>
    </div>
  </footer>
</template>

<script>
import { CONTACT_MAIL_ADDRESS } from '@/configs/emails'
import Logotype from '@/components/Logotype'

export default {
  components: { Logotype },
  setup() {
    const contactHref = `mailto:${CONTACT_MAIL_ADDRESS}`

    return {
      contactHref
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding-top: 32px;
  color: var(--color-text-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;

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
  font-size: 0.875rem;
  line-height: 1.25;

  @media (max-width: 720px) {
    font-size: 0.75rem;
  }

  & + & {
    margin-left: 1rem;
  }
}
</style>
