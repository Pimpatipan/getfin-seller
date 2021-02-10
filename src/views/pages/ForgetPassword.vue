<template>
  <div class="d-flex align-items-center min-vh-100 login-container">
    <b-container>
      <b-row class="justify-content-center">
        <div class="w-100 px-xl-5 d-lg-flex header-login-box">
          <div
            class="logoLogin mr-lg-5"
            v-bind:style="{
              'background-image': 'url(' + imgLogo + ')',
            }"
          ></div>
          <h1
            class="header-login font-weight-bold text-uppercase f-20 d-block d-lg-none text-center mb-5 mb-lg-0"
          >
            {{ $t("welcome") }}
          </h1>
          <div class="position-relative w-100 d-none d-lg-block">
            <div class="header-logo-box">
              <h1 class="m-0">{{ $t("welcome") }}</h1>

              <div class="lines-box text-center">
                <div class="lines w-100 mb-2"></div>
                <div class="lines w-50 m-auto"></div>
              </div>
            </div>
            <div class="header-logo-box-sub"></div>
          </div>
        </div>
        <b-col md="9" lg="6" class="login">
          <!-- <div class="text-center mb-4">
            <div
              class="imgLogo"
              v-bind:style="{
                'background-image': 'url(' + imgLogo + ')',
              }"
            ></div>
            <h1 class="header-login font-weight-bold text-uppercase f-20">
              Partner Center
            </h1>
          </div> -->
          <b-card-group>
            <b-card class="forgetpass-box shadow-lg login-box">
              <div class="text-center">
                <h1 class="header-login mb-5">{{ $t("forgetPass") }}</h1>
              </div>
              <b-card-body class="py-1">
                <b-form onSubmit="return false;">
                  <div class="mb-4">
                    <div class="d-flex align-items-baseline">
                      <font-awesome-icon icon="user" class="logo-login mr-2" />
                      <InputTextIcon
                        class="login-input w-100 m-0"
                        v-model="form.email"
                        textFloat=""
                        :placeholder="$t('email')"
                        type="email"
                        name="email"
                        isRequired
                        @onKeyup="submitFormOnInput"
                        :isValidate="$v.form.email.$error"
                      :v="$v.form.email"
                      />
                    </div>
                  </div>

                  <b-row v-if="error != ''" class="m-2 text-center">
                    <span class="text-danger w-100">
                      {{ error }}
                      <br />
                      {{ " " }}
                    </span>
                  </b-row>

                  <b-row class="mt-5 text-center">
                    <b-col>
                      <b-button
                        type="button"
                        class="px-4 login-btn"
                        @click="checkForm"
                        :disabled="isDisable"
                        >{{ $t("submit") }}</b-button
                      >
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
          <div class="mt-3 text-center">
            <span class="f-12">
              {{ $t("alreadyHasAcc") }}?
              <router-link :to="'/login'" class="">
                <span class="text-underline">{{ $t("login") }}</span>
              </router-link>
            </span>
          </div>
        </b-col>
        <div class="text-center mt-3 col-12">
          <span
            :class="['pointer', $language == 'th' ? 'menuactive' : '']"
            @click="changeLanguage('th')"
            >ไทย</span
          >
          |
          <span
            :class="['pointer', $language == 'en' ? 'menuactive' : '']"
            @click="changeLanguage('en')"
            >English</span
          >
        </div>
      </b-row>
    </b-container>

    <ModalLoading ref="modalLoading" :hasClose="false" />
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import InputTextIcon from "@/components/inputs/InputTextIcon";
import VueCookies from "vue-cookies";
import ModalLoading from "@/components/modal/alert/ModalLoading";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";

export default {
  name: "ForgetPassword",
  components: {
    InputTextIcon,
    ModalLoading,
    ModalAlert,
    ModalAlertError,
  },
  data() {
    return {
      imgLogo: "",
      error: "",
      form: {
        email: "",
      },
      isLoading: false,
      isDisable: false,
      modalMessage: "",
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
      },
    };
  },
  mounted: async function () {
    await this.getLogo();
  },
  methods: {
    changeLanguage(value) {
      this.language = value;
      this.$cookies.set(
        "language",
        value,
        60 * 60 * 24 * 365,
        "/",
        this.$cookiesDomain
      );
      location.reload();
    },
    getLogo: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/setting/Logo`,
        null,
        this.$headers,
        null
      );
      this.imgLogo = resData.detail;
    },
    checkForm: async function () {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;
      this.$refs.modalLoading.show();
      this.isLoading = true;
      this.isDisable = true;
      this.error = "";

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/forgotPassword`,
        null,
        null,
        this.form
      );
      this.isLoading = false;
      this.isDisable = false;
      this.modalMessage = data.message || data.detail;

      if (data.result == 1) {
        this.$refs.modalLoading.hide();
        this.$refs.modalAlert.show();

        setTimeout(function () {
          window.location.href = "/login";
        }, 3000);
      } else {
        this.$refs.modalLoading.hide();
        this.$refs.modalAlertError.show();
      }
    },
    submitFormOnInput: function (e) {
      if (e.keyCode === 13) {
        this.checkForm();
      }
    },
  },
};
</script>

<style scoped>
.forgetpass-box {
  padding: 75px 25px;
}
</style>