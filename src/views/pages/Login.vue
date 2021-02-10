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
        <b-col md="9" lg="6" class="login mt-lg-3">
          <b-card-group>
            <b-card class="p-4 shadow-lg login-box">
              <div class="text-center text-white">
                <h1 class="header-login my-3">{{ $t("login") }}</h1>
              </div>
              <b-card-body class="py-1">
                <b-form>
                  <div class="mb-4">
                    <div class="d-flex align-items-baseline">
                      <font-awesome-icon icon="user" class="logo-login mr-2" />
                      <InputTextIcon
                        class="login-input w-100 m-0 loginInput"
                        v-model="form.email"
                        textFloat=""
                        :placeholder="$t('email')"
                        type="email"
                        name="email"
                        @onKeyup="submitFormOnInput"
                        :isValidate="$v.form.email.$error"
                        :v="$v.form.email"
                      />
                    </div>
                  </div>

                  <div class="mb-4">
                    <div class="d-flex align-items-baseline">
                      <font-awesome-icon icon="lock" class="logo-login mr-2" />
                      <InputTextIcon
                        class="login-input w-100 m-0 loginInput"
                        v-model="form.password"
                        textFloat=""
                        :placeholder="$t('password')"
                        type="password"
                        name="password"
                        @onKeyup="submitFormOnInput"
                        :isValidate="$v.form.password.$error"
                        :v="$v.form.password"
                        isShowPassword
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

                  <div class="mb-4 text-right forget-pass">
                    <router-link :to="'/forgetpassword'" class="">
                      <span class="f-14 text-underline"
                        >{{ $t("forgetPass") }}?</span
                      >
                    </router-link>
                  </div>

                  <b-row>
                    <b-col class="text-center">
                      <b-button
                        type="button"
                        class="px-4 login-btn"
                        @click="checkForm"
                        :disabled="isDisable"
                        >{{ $t("login") }}
                        <b-spinner class="align-middle w-1rem" v-if="isLogin"></b-spinner
                      ></b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
          <div class="mt-4 text-center">
            <router-link :to="'/register'" class="">
              <!-- <span class="f-14 text-underline">{{ $t("becomePartner") }}</span> -->

              <b-button type="button" class="px-4 become-partner f-14">{{
                $t("becomePartner")
              }}</b-button>
            </router-link>
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
      error: "",
      form: {
        email: "",
        password: "",
      },
      isLoading: false,
      isDisable: false,
      isLogin: false,
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required, password, minLength: minLength(6) },
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

      this.isLoading = true;
      this.isDisable = true;
      this.isLogin = true;
      this.error = "";
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/login`,
        null,
        null,
        this.form
      );
      this.isLoading = false;
      this.isDisable = false;
      this.isLogin = false;
      if (data.result == 1) {
        await this.$cookies.set(
          "seller-token",
          data.detail.token,
          60 * 60 * 24 * 30
        );
        await this.$cookies.set(
          "username",
          data.detail.userDetail.firstname +
            " " +
            data.detail.userDetail.lastname,
          60 * 60 * 24 * 30
        );
        window.location.href = "/";
      } else {
        this.error = data.message;
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
.become-partner {
  background-color: #ffb300;
  border-color: #ffb300;
  text-align: center;
  color: white;
  padding: 5px 15px;
}
.w-1rem {
  width: 1rem;
  height: 1rem;
}
</style>