<template>
  <SheetModalContent>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle class="title"
        >Czy na pewno chcesz usunąć konto?</BaseModalTitle
      >
    </BaseModalHeader>
    <BaseModalBody>
      <p class="message">
        <b>Nieodwracalnie</b> utracisz m.in. listy zakupów, Twoje produkty, Twój
        plan dnia czy listę ulubionych przepisów.
      </p>
      <p class="message">
        Jeżeli dalej chcesz usunąć swoje konto, wprowadź kod
        <b class="code">{{ code }}</b> w poniższe pole.
      </p>
      <Form
        :id="formID"
        class="form"
        :validation-schema="schema"
        @submit="deleteAccount($event)"
      >
        <BaseInput
          class="form-row"
          label="E-mail"
          type="text"
          :disabled="true"
          :value="email"
        />
        <Field v-slot="{ field, errors }" name="code">
          <BaseInput
            class="form-row"
            label="Kod"
            type="text"
            v-bind="field"
            :errors="errors"
          />
        </Field>
      </Form>
      <div v-for="(error, i) in errors" :key="i" class="error">
        {{ error }}
      </div>

      <RecaptchaBranding class="recaptcha-branding" />
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Nie chcę
      </BaseButton>
      <BaseButton
        class="submit-button"
        raised
        color="danger"
        :form="formID"
        :loading="sending"
      >
        {{ "Usuń konto" }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script>
import { Field, Form } from "vee-validate";
// import { onBeforeMount, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import * as Yup from "yup";

import identityApi from "@/src/api/identityApi";

import { RECAPTCHA_ACTIONS } from "@/src/configs/recaptcha";

import uniqueID from "@/src/functions/uniqueID";

import recaptcha from "@/src/services/recaptcha";

import RecaptchaBranding from "@/src/components/RecaptchaBranding";

export default {
  components: { RecaptchaBranding, Field, Form },
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, component) {
    const store = useStore();
    const formID = "form-" + uniqueID().getID();
    const data = reactive({
      sending: false,
      errors: [],
      code: "",
    });

    const schema = Yup.object().shape({
      code: Yup.string()
        .test({
          name: "codeMatches",
          message: "Wprowadź prawidłowy kod",
          test: (value) =>
            value !== undefined
              ? value.toUpperCase() === data.code.toUpperCase()
              : true,
        })
        .required("REQUIRED"),
    });

    const generateCode = () => {
      return Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase();
    };

    const deleteAccount = () => {
      data.sending = true;
      data.errors = [];

      recaptcha
        .execute(RECAPTCHA_ACTIONS.DELETE_ACCOUNT)
        .then((recaptchaToken) => {
          identityApi
            .deleteAccount({ recaptchaToken })
            .then(() => {
              component.emit("close", { success: true });
              store.dispatch("user/logout");
            })
            .catch((error) => {
              data.code = generateCode();
              const errors = error?.response?.data?.errors;
              if (errors) {
                data.errors = errors;
              }
            })
            .finally(() => {
              data.sending = false;
            });
        })
        .catch(() => {
          data.sending = false;
        });
    };

    onBeforeMount(async () => {
      data.code = generateCode();
      await recaptcha.init();
    });

    return {
      ...toRefs(data),
      generateCode,
      deleteAccount,
      schema,
      formID,
    };
  },
};
</script>

<style lang="scss" scoped>
.submit-button {
  width: 100%;

  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}

.title {
  color: var(--color-red);
}

.message {
  margin: 0;
  font-size: 0.875rem;

  & + & {
    margin-top: 1rem;
  }
}

.code {
  font-weight: bold;
  color: var(--color-red);
  pointer-events: none;
  user-select: none;
}

.form {
  margin-top: 1.5rem;
}

.recaptcha-branding {
  margin-top: 1rem;
}
</style>
