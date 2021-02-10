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
            class="header-login font-weight-bold text-uppercase f-20 d-block d-lg-none text-center mb-4 mb-lg-0"
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
        <b-col sm="9" class="mt-lg-3">
          <b-card-group>
            <b-card class="p-4 shadow-lg login-box">
              <div class="text-center text-white">
                <h1 class="header-login my-3">{{ $t("termandcon") }}</h1>
              </div>
              <b-card-body class="py-1">
                <div v-html="termandcon" class="p-3"></div>
              </b-card-body>
            </b-card>
          </b-card-group>
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
  </div>
</template>

<script>
import { required, email, minLength, helpers } from "vuelidate/lib/validators";
import InputTextIcon from "@/components/inputs/InputTextIcon";
import VueCookies from "vue-cookies";

const password = helpers.regex(
  "password",
  /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!]+)$/
);

export default {
  name: "Login",
  components: {
    InputTextIcon,
  },
  data() {
    return {
      imgLogo: "",
      termandcon: "",
      form: {
        email: "",
        password: "",
      },
      isLoading: false,
      isDisable: false,
    };
  },
  mounted: async function () {
    await this.getData();
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
    getData: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/setting/Logo`,
        null,
        this.$headers,
        null
      );
      this.imgLogo = resData.detail;

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/staticPage/terms-and-conditions-partner`,
        null,
        this.$headers,
        null
      );
      this.termandcon = data.detail;
    },
  },
};
</script>
