<template>
  <div class="recaptcha-branding">
    Ta strona jest chroniona przez reCAPTCHA i obowiązują ją
    <BaseLink class="recaptcha-branding-link" href="https://policies.google.com/privacy" color="text-secondary"
      >Polityka prywatności</BaseLink
    >
    i
    <BaseLink class="recaptcha-branding-link" href="https://policies.google.com/terms" color="text-secondary"
      >Warunki korzystania z usług</BaseLink
    >
    Google.
  </div>
</template>

<style lang="scss" scoped>
.recaptcha-branding {
  color: var(--color-text-secondary);
  font-size: 0.625rem;
  line-height: 1.5;

  .recaptcha-branding-link {
    font-weight: bold;
  }
}
</style>
