<template>
  <div class="auth-main__content">
    <template v-if="state === 'BEFORE'">
      <h1>Zmiana hasła</h1>

      <Form :validation-schema="schema" @submit="resetPassword($event)">
        <BaseInput
          class="form-row"
          label="E-mail"
          type="text"
          :value="email"
          :disabled="true"
        />
        <Field v-slot="{ field, errors }" name="password" type="password">
          <BaseInput
            class="form-row"
            label="Hasło"
            type="password"
            v-bind="field"
            :errors="errors"
          />
        </Field>
        <Field
          v-slot="{ field, errors }"
          name="confirmPassword"
          type="password"
        >
          <BaseInput
            class="form-row"
            label="Potwierdź hasło"
            type="password"
            v-bind="field"
            :errors="errors"
          />
        </Field>
        <BaseButton
          class="form-row auth-main__content__submit"
          raised
          color="primary"
          type="submit"
          >Zmień hasło</BaseButton
        >
      </Form>
    </template>

    <template v-else-if="state === 'SENDING'">
      <h1>Zmiana hasła</h1>

      <div class="wait">
        <Spinner class="wait-spinner" :show="true" />
        czekaj
      </div>
    </template>

    <template v-else-if="state === 'SUCCESS'">
      <h1>Hasło zostało zmienione</h1>

      <div>
        <NuxtLink v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton
            tag="a"
            class="login-button"
            :href="href"
            raised
            color="primary"
            @click="navigate($event)"
          >
            Zaloguj się
          </BaseButton>
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <h1>Wystąpił błąd</h1>

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
  </div>
</template>

<script>
import { Field, Form } from "vee-validate";
// import { useMeta } from "vue-meta";
import * as Yup from "yup";

import identityApi from "@/src/api/identityApi";

import { ERROR_ACTION_TAG_NAME } from "@/src/configs/error";
import { RECAPTCHA_ACTIONS } from "@/src/configs/recaptcha";
import {
  confirmNewPasswordSchema,
  newPasswordSchema,
} from "@/src/configs/schemas";
import { BASE_URL } from "@/src/configs/url";

import { AUTH_RESET_PASSWORD } from "@/src/router/paths";

import recaptcha from "@/src/services/recaptcha";

import Spinner from "@/src/components/Spinner";

export default {
  components: {
    Field,
    Form,
    Spinner,
  },
  setup() {
    useMeta({
      title: "Resetowanie hasła",
      link: [{ rel: "canonical", href: `${BASE_URL}${AUTH_RESET_PASSWORD}` }],
    });

    const schema = Yup.object({
      password: newPasswordSchema(),
      confirmPassword: confirmNewPasswordSchema(),
    });

    return {
      schema,
    };
  },
  data: () => ({
    state: "BEFORE",
    email: null,
    token: null,
  }),
  beforeMount() {
    this.state = "BEFORE";

    const { email, token } = this.$route.query;
    this.email = email;
    this.token = token;

    if (!email || !token) {
      this.state = "ERROR";
    }
  },
  methods: {
    resetPassword({ password, confirmPassword }) {
      this.state = "SENDING";

      recaptcha
        .execute(RECAPTCHA_ACTIONS.RESET_PASSWORD)
        .then((recaptchaToken) => {
          identityApi
            .resetPassword({
              email: this.email,
              token: this.token,
              password: password,
              confirmPassword: confirmPassword,
              recaptchaToken: recaptchaToken,
            })
            .then((resp) => {
              if (resp.data.success) {
                this.state = "SUCCESS";
              } else {
                this.state = "ERROR";
              }
            })
            .catch((error) => {
              this.state = "ERROR";
              this.$errorHandler.captureError(error, {
                [ERROR_ACTION_TAG_NAME]: "auth.resetPassword",
              });
            });
        })
        .catch((error) => {
          this.state = "ERROR";
          this.$errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: "auth.resetPassword.recaptcha",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.wait {
  display: flex;
  align-items: center;

  .wait-spinner {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }
}
// form {
// margin-bottom: 16px;
// }
h1 {
  margin-bottom: 1.5rem;
}

.login-button {
  margin-top: 1.5rem;

  .login-button-icon {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
}
</style>
