<template>
  <footer class="footer">
    <div class="footer-logo">
      <Logotype class="logo" />
    </div>
    <div class="links">
      <router-link class="link" :to="{ name: 'terms' }">
        Regulamin
      </router-link>
      <router-link class="link" :to="{ name: 'privacy-policy' }">
        Polityka prywatności
      </router-link>
      <a class="link" href="mailto:kontakt@recipeit.pl">
        Kontakt
      </a>
    </div>
  </footer>
</template>

<script>
import Logotype from '@/components/Logotype'

export default {
  components: { Logotype }
}
</script>

<style lang="scss" scoped>
$black: #000;
$gray: #90abb9;
$gray-light: #e2e9ed;

$text-primary: $black;
$text-secondary: $gray;

.footer {
  border-top: 1px solid $gray-light;
  padding-top: 32px;
  color: $gray;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 720px) {
    flex-direction: column;
    text-align: center;
  }
}

.logo {
  width: 96px;

  ::v-deep(.a) {
    fill: $gray;
  }
}

.links {
}

.link {
  color: $gray;
  font-size: 0.875rem;
  line-height: 1.25;
  text-decoration: none;
  @include transition((color));

  @media (max-width: 720px) {
    font-size: 0.75rem;
  }

  &:hover {
    color: lighten($gray, 10);
  }

  &:active {
    color: lighten($gray, 20);
  }

  & + & {
    margin-left: 1rem;
  }
}
</style>
