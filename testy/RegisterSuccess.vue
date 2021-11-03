<template>
  <div class="auth-main__content">
    <template v-if="secondEmailSent">
      <h1>Wysłaliśmy wiadomość jeszcze raz</h1>

      Sprawdź swoją skrzynkę pocztową. Może być konieczne sprawdzenie folderu ze
      spamem.

      <div>
        <NuxtLink v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton
            tag="a"
            class="login-button"
            :href="href"
            stroked
            @click="navigate($event)"
          >
            <BaseIcon
              class="login-button-icon"
              icon="arrow-left"
              weight="semi-bold"
            />
            Wróć do logowania
          </BaseButton>
        </NuxtLink>
      </div>
    </template>
    <template v-else>
      <h1>Potwierdź swoje konto</h1>

      Sprawdź swoją skrzynkę pocztową. Może być konieczne sprawdzenie folderu ze
      spamem.

      <div>
        <NuxtLink v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton
            tag="a"
            class="login-button"
            :href="href"
            stroked
            @click="navigate($event)"
          >
            <BaseIcon
              class="login-button-icon"
              icon="arrow-left"
              weight="semi-bold"
            />
            Wróć do logowania
          </BaseButton>
        </NuxtLink>
      </div>

      <div class="no-email-section">
        <span> Nie otrzymałeś wiadomości? </span>
        <BaseLink
          tag="button"
          color="primary"
          :disabled="sendingSecondEmail"
          @click="sendConfirmationEmail()"
          >Wyślij jeszcze raz</BaseLink
        >

        <ul v-if="errors" class="auth-main__content__errors">
          <li v-for="(error, index) in errors" :key="index">
            {{ $t(`errorCode.${error}`) }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
// import { reactive, toRefs } from "vue";
// import { useMeta } from "vue-meta";
// import { useRouter } from "vue-router";

import identityApi from "@/src/api/identityApi";

import { ERROR_ACTION_TAG_NAME } from "@/src/configs/error";
import { RECAPTCHA_ACTIONS } from "@/src/configs/recaptcha";
import { BASE_URL } from "@/src/configs/url";

import { AUTH_LOGIN } from "@/src/router/names";
import { AUTH_REGISTER_SUCCESS } from "@/src/router/paths";

import recaptcha from "@/src/services/recaptcha";

export default {
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    useMeta({
      title: "Udana rejestracja",
      link: [{ rel: "canonical", href: `${BASE_URL}${AUTH_REGISTER_SUCCESS}` }],
    });

    if (!props.email) {
      const router = useRouter();
      router.push({ name: AUTH_LOGIN });
    }

    const data = reactive({
      sendingSecondEmail: false,
      secondEmailSent: false,
      errors: null,
    });

    const sendConfirmationEmail = async () => {
      data.errors = null;
      data.sendingSecondEmail = true;

      try {
        const recaptchaToken = await recaptcha.execute(
          RECAPTCHA_ACTIONS.SEND_CONFIRMATION_EMAIL
        );

        try {
          await identityApi.sendConfirmationEmail({
            email: props.email,
            recaptchaToken,
          });
          data.secondEmailSent = true;
        } catch (error) {
          data.errors = error?.response?.data?.errors;
          this.$errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]:
              "auth.registerSuccess.sendingSecondConfirmationEmail",
          });
        }
      } catch (error) {
        data.errors = ["ERROR"];
        this.$errorHandler.captureError(error, {
          [ERROR_ACTION_TAG_NAME]:
            "auth.registerSuccess.sendingSecondConfirmationEmail.recaptcha",
        });
      } finally {
        data.sendingSecondEmail = false;
      }
    };

    return {
      ...toRefs(data),
      sendConfirmationEmail,
    };
  },
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 0.875rem;
  line-height: 1.25;
}

.login-button {
  margin-top: 1.5rem;

  .login-button-icon {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
}

.no-email-section {
  margin-top: 1.5rem;
}
</style>
