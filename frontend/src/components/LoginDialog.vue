<template>
  <transition name="fade">
    <div
      class="bg-gray-500 bg-opacity-70 fixed top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center"
      v-if="showLogin"
    >
      <div
        class="bg-gray-500 text-white rounded-md transition-all w-2/3 md:w-1/2"
        id="logoutModal"
        tabindex="-1"
      >
        <div
          class="border-none shadow-lg relative flex flex-col w-full pointer-events-auto rounded-md justify-center items-center"
        >
          <h5 class="text-xl font-medium p-4">Connexion</h5>
          <div class="relative p-4">
            Veuillez rentrer votre addresse mail et votre mot de passe :
          </div>

          <Form
            method="POST"
            @submit="handleLogin"
            :validation-schema="schema"
            class="flex flex-col justify-center items-center w-full"
          >
            <label class="mb-1" for="email">Email</label>
            <Field
              id="email"
              v-model="user.email"
              type="text"
              name="email"
              class="border-2 mb-4 pl-2 rounded border-orange-500 bg-gray-500 focus:bg-gray-500 w-3/4"
            />
            <ErrorMessage name="email" class="text-orange-500 text-sm" />

            <label class="mb-1" for="password">Mot de passe</label>
            <div class="flex relative w-3/4" v-if="!showPassword">
              <Field
                id="password"
                v-model="user.password"
                type="password"
                name="password"
                class="border-2 w-full mb-4 pl-2 rounded border-orange-500 bg-gray-500 focus:bg-gray-500"
              />
              <div
                class="w-1/12 absolute right-0 y-0 pt-1 cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </div>
            </div>
            <div class="flex relative w-3/4" v-else>
              <Field
                id="password"
                v-model="user.password"
                type="text"
                name="password"
                class="border-2 w-full mb-4 pl-2 rounded border-m-orange-500 bg-gray-500 focus:bg-gray-500"
              />
              <div
                class="w-1/12 absolute right-0 y-0 pt-1 cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
            <ErrorMessage name="password" class="text-orange-500 text-sm" />

            <p class="text-orange-500 text-sm mb-3">{{ error_message }}</p>
          </Form>

          <div
            class="flex-col-reverse sm:flex-row flex items-center justify-end p-4 rounded-b-md"
          >
            <button type="button" class="btn-secondary" @click="closeLogin">
              Annuler
            </button>
            <button @click="handleLogin" class="btn-primary ml-1 mb-3 sm:mb-0">
              Connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useLoginDialogStore } from "../store/dialogs";
import { useUserDataStore } from "../store/userData";
import { mapState } from "pinia";

export default {
  setup() {
    const loginDialogStore = useLoginDialogStore();
    const userDataStore = useUserDataStore();

    return { loginDialogStore, userDataStore };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  data() {
    const schema = yup.object().shape({
      email: yup
        .string()
        .required("Il est nécessaire de fournir une adresse mail")
        .email("Cette adresse mail n'est pas valide"),
      password: yup.string().required("Il est nécessaire de fournir un mot de passe"),
    });
    return {
      user: {
        email: "",
        password: "",
      },
      errors: [],
      schema,
      showPassword: false,
      error_message: "",
    };
  },

  computed: {
    ...mapState(useLoginDialogStore, {
      showLogin: "loginDialog",
    }),
  },
  methods: {
    closeLogin() {
      this.loginDialogStore.closeLogin();
    },

    async handleLogin() {
      const [error, data] = await this.userDataStore.loginUser(this.user);

      if (error) {
        this.error_message = error;
      } else {
        this.loginDialogStore.closeLogin();
      }
    },

    goToLogin() {},
  },
};
</script>
