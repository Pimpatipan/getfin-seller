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
            Welcome to Partner Center
          </h1>
          <div class="position-relative w-100 d-none d-lg-block">
            <div class="header-logo-box">
              <h1 class="m-0">Welcome to Partner Center</h1>

              <div class="lines-box text-center">
                <div class="lines w-100 mb-2"></div>
                <div class="lines w-50 m-auto"></div>
              </div>
            </div>
            <div class="header-logo-box-sub"></div>
          </div>
        </div>
        <b-col md="9" lg="6" class="login mt-lg-3">
          <!-- <div class="text-center mb-4">
            
            <h1 class="header-login font-weight-bold text-uppercase f-20">
              Partner Center
            </h1>
          </div> -->
          <b-card-group>
            <b-card class="p-4 shadow-lg login-box">
              <div class="text-center text-white">
                <h1 class="header-login my-4">Login</h1>
              </div>
              <b-card-body class="py-1">
                <b-form>
                  <div class="mb-4">
                    <div class="d-flex login-main-box">
                      <font-awesome-icon
                        icon="user"
                        class="logo-login my-auto mr-2"
                      />
                      <InputText
                        class="login-input w-100 m-0"
                        v-model="form.email"
                        textFloat="Email"
                        placeholder="Email"
                        type="email"
                        name="email"
                        isRequired
                        @onKeyup="submitFormOnInput"
                      />
                    </div>

                    <p
                      class="text-danger mt-2 text-center"
                      v-if="$v.form.email.$error"
                    >
                      This field can’t be empty.
                    </p>
                  </div>

                  <div class="mb-4">
                    <div class="d-flex login-main-box">
                      <font-awesome-icon
                        icon="lock"
                        class="logo-login my-auto mr-2"
                      />
                      <InputText
                        class="login-input w-100 m-0"
                        v-model="form.password"
                        textFloat="Password"
                        placeholder="Password"
                        type="password"
                        name="password"
                        isRequired
                        @onKeyup="submitFormOnInput"
                      />
                    </div>
                    <p
                      class="text-danger mt-2 text-center"
                      v-if="$v.form.password.$error"
                    >
                      This field can’t be empty.
                    </p>
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
                      <span class="f-14 text-underline">Forget password?</span>
                    </router-link>
                  </div>

                  <b-row>
                    <b-col class="text-center">
                      <b-button
                        type="button"
                        class="px-4 login-btn"
                        @click="checkForm"
                        :disabled="isDisable"
                        >Login</b-button
                      >
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
          <div class="mt-4 text-center">
            <router-link :to="'/register'" class="">
              <span class="f-14 text-underline">Become a Seller</span>
            </router-link>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import InputText from "@/components/inputs/InputText";
import VueCookies from "vue-cookies";

export default {
  name: "Login",
  components: {
    InputText,
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
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required },
      },
    };
  },
  mounted: async function () {
    await this.getLogo();
  },
  methods: {
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
