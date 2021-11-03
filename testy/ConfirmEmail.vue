<template>
  <div class="auth-main__content">
    <h1>Potwierdź adres email</h1>

    <div v-if="state === 'LOADING'" class="wait">
      <Spinner class="wait-spinner" :show="true" />
      czekaj
    </div>

    <div v-else-if="state === 'SUCCESS'">
      Udało się! Teraz możesz się zalogować
      <div>
        <NuxtLink
          v-slot="{ href, navigate }"
          :to="{ name: 'login', params: { email } }"
          custom
        >
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
    </div>

    <div v-else>
      Coś poszło nie tak
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
    </div>
  </div>
</template>

<script>
// import { useMeta } from "vue-meta";

import identityApi from "@/src/api/identityApi";

import { ERROR_ACTION_TAG_NAME } from "@/src/configs/error";
import { BASE_URL } from "@/src/configs/url";

import { AUTH_CONFIRM_EMAIL } from "@/src/router/paths";

import Spinner from "@/src/components/Spinner";

export default {
  components: { Spinner },
  setup() {
    useMeta({
      title: "Potwierdź adres email",
      link: [{ rel: "canonical", href: `${BASE_URL}${AUTH_CONFIRM_EMAIL}` }],
    });
  },
  data: () => ({
    state: "LOADING",
    email: null,
  }),
  mounted() {
    this.state = "LOADING";
    const { email, token } = this.$route.query;

    if (email && token) {
      identityApi
        .confirmEmail({
          email,
          token,
        })
        .then((resp) => {
          if (resp.data.success) {
            this.state = "SUCCESS";
            this.email = email;
          } else {
            this.state = "ERROR";
          }
        })
        .catch((error) => {
          this.state = "ERROR";
          this.$errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: "auth.confirmEmail",
          });
        });
    } else {
      this.state = "ERROR";
      this.$errorHandler.captureError(new Error("missing email or token"), {
        [ERROR_ACTION_TAG_NAME]: "auth.confirmEmail.missingData",
      });
    }
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
// h1 {
//   margin-bottom: 8px;
// }

.login-button {
  margin-top: 1.5rem;

  .login-button-icon {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
}
</style>
