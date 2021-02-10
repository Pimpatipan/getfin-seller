<template>
  <div class="d-flex align-items-center min-vh-100 login-container">
    <b-container>
      <b-row class="justify-content-center px-xl-5 py-4">
        <div class="w-100 px-xl-5 d-lg-flex header-login-box">
          <div
            class="logoLogin mr-lg-5"
            v-bind:style="{
              'background-image': 'url(' + imgLogo + ')'
            }"
          ></div>
          <h1
            class="header-login font-weight-bold text-uppercase f-20 d-block d-lg-none text-center mb-3 mb-lg-0"
          >
            Register to be our Partner
          </h1>
          <div class="position-relative w-100 d-none d-lg-block">
            <div class="header-logo-box">
              <h1 class="m-0">Register to be our Partner</h1>

              <div class="lines-box text-center">
                <div class="lines w-100 mb-2"></div>
                <div class="lines w-50 m-auto"></div>
              </div>
            </div>
            <div class="header-logo-box-sub"></div>
          </div>
        </div>
        <b-col md="9" lg="6" class="text-center">
          <div v-html="data" class="regisdata"></div>
        </b-col>
        <b-col md="9" lg="6" class="mt-4 mt-lg-0">
          <b-card-group>
            <b-card class="p-4 shadow-lg login-box">
              <b-card-body class="py-1 px-0">
                <b-form>
                  <b-row>
                    <b-col md="6">
                      <InputTextIcon
                        class
                        :textFloat="$t('name')"
                        :placeholder="$t('name')"
                        type="text"
                        name="name"
                        isRequired
                        @onKeyup="submitFormOnInput"
                        v-model="form.firstname"
                        :isValidate="$v.form.firstname.$error"
                        :v="$v.form.firstname"
                    /></b-col>
                    <b-col md="6" class="mt-3 mt-md-0">
                      <InputTextIcon
                        class
                        :textFloat="$t('sellerLastname')"
                        :placeholder="$t('sellerLastname')"
                        type="text"
                        name="lastname"
                        isRequired
                        @onKeyup="submitFormOnInput"
                        v-model="form.lastname"
                        :isValidate="$v.form.lastname.$error"
                        :v="$v.form.lastname"
                    /></b-col>
                  </b-row>

                  <div class="my-4">
                    <InputTextIcon
                      class
                      :textFloat="$t('email')"
                      :placeholder="$t('email')"
                      type="email"
                      name="email"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.email"
                      :isValidate="$v.form.email.$error"
                      :v="$v.form.email"
                    />
                  </div>

                  <b-row>
                    <b-col md="6">
                      <InputTextIcon
                        class
                        :textFloat="$t('password')"
                        :placeholder="$t('password')"
                        type="password"
                        name="pass"
                        isRequired
                        @onKeyup="submitFormOnInput"
                        v-model="form.password"
                        :isValidate="$v.form.password.$error"
                        :v="$v.form.password"
                        isShowPassword
                    /></b-col>
                    <b-col md="6" class="mt-3 mt-md-0">
                      <InputTextIcon
                        class
                        :textFloat="$t('conpassword')"
                        :placeholder="$t('conpassword')"
                        type="password"
                        name="conpass"
                        isRequired
                        @onKeyup="submitFormOnInput"
                        v-model="form.confirmPassword"
                        :isValidate="$v.form.confirmPassword.$error"
                        :v="$v.form.confirmPassword"
                        isShowPassword
                    /></b-col>
                  </b-row>

                  <b-row class="mt-4">
                    <b-col md="6">
                      <div class="mb-0 d-flex">
                        <div class="w-75">
                          <InputTextIcon
                            class="w-100"
                            :textFloat="$t('phoneNumber')"
                            :placeholder="$t('phoneNumber')"
                            type="text"
                            name="phone"
                            isRequired
                            @onKeyup="submitFormOnInput"
                            v-model="form.telephone"
                            :isValidate="$v.form.telephone.$error"
                            :v="$v.form.telephone"
                            :maxLength="10"
                            @onKeypress="isNumber($event)"
                          />
                        </div>
                        <div class="mt-auto ml-auto">
                          <b-button
                            class="f-12 mt-auto ml-2 btn-yellow"
                            variant="primary"
                            @click="getOTP"
                            :disabled="disableOTP"
                            >{{ time }}</b-button
                          >
                        </div>
                      </div>
                      <span class="text-secondary f-12 m-0" v-if="code != ''">
                        ( Ref. {{ code }} )</span
                      ></b-col
                    >
                    <b-col md="6" class="mt-3 mt-md-0">
                      <div class="mb-4">
                        <InputTextIcon
                          textFloat="OTP"
                          placeholder="OTP"
                          type="text"
                          name="OTP"
                          isRequired
                          v-model="otp"
                          :maxLength="6"
                          @onKeypress="isNumber($event)"
                        />
                        <span class="text-secondary f-12">{{
                          $t("receiveOtp")
                        }}</span>
                      </div></b-col
                    >
                  </b-row>

                  <div class="mb-4">
                    <InputTextIcon
                      class
                      :textFloat="$t('shopName')"
                      :placeholder="$t('shopName')"
                      type="text"
                      name="shop"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.displayName"
                      :isValidate="$v.form.displayName.$error"
                      :v="$v.form.displayName"
                    />
                  </div>

                  <b-row v-if="error != ''" class="m-2 text-center">
                    <span class="text-danger w-100">
                      {{ error }}
                      <br />
                      {{ " " }}
                    </span>
                  </b-row>

                  <div>
                    <b-form-checkbox
                      id="checkbox-1"
                      name="checkbox-1"
                      v-model="accept"
                      >{{ $t("iaccept") }}
                      <router-link :to="'/termandcondition'" class="" target="_blank">
                        <span class="text-underline pointer">{{
                          $t("termandcon")
                        }}</span>
                      </router-link>
                      {{ $t("and") }}
                      <router-link :to="'/privacypolicy'" class="" target="_blank">
                        <span class="text-underline pointer">{{
                          $t("privacy")
                        }}</span>
                      </router-link>
                    </b-form-checkbox>
                  </div>

                  <b-row class="mt-4 text-center">
                    <b-col>
                      <b-button
                        type="button"
                        class="px-4 login-btn"
                        :disabled="!accept"
                        @click="checkForm"
                        >{{ $t("register") }}</b-button
                      >
                    </b-col>
                  </b-row>

                  <div class="mt-3 text-center">
                    <span class="f-12">
                      {{ $t("alreadyHasAcc") }}?
                      <router-link :to="'/login'" class="">
                        <span class="text-underline">{{ $t("login") }}</span>
                      </router-link>
                    </span>
                  </div>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
        <div class="text-center mt-3">
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
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />

    <b-modal
      ref="alertModal"
      id="alertModal"
      hide-header
      hide-footer
      centered
      body-class="p-4"
    >
      <!-- <div class="modal-header border-0"></div> -->
      <div class="text-center">
        <div v-html="dataModal" class="py-3"></div>

        <div>
          <b-button
            type="button"
            class="px-4 login-btn"
            @click="$bvModal.hide('alertModal')"
            >Close</b-button
          >
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  required,
  numeric,
  minValue,
  requiredIf,
  minLength,
  sameAs,
  email,
  helpers
} from "vuelidate/lib/validators";
import InputTextIcon from "@/components/inputs/InputTextIcon";
import VueCookies from "vue-cookies";
import ModalLoading from "@/components/modal/alert/ModalLoading";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
const password = helpers.regex(
  "password",
  /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
);
export default {
  name: "Register",
  components: {
    InputTextIcon,
    ModalLoading,
    ModalAlertError
  },
  data() {
    return {
      accept: false,
      error: "",
      dataModal: "",
      imgLogo: "",
      otp: "",
      code: "",
      disableOTP: false,
      time: null,
      modalMessage: "",
      data: "",
      termandcon: "",
      privacypolicy: "",
      setTimer: null,
      form: {
        email: "",
        password: "",
        confirmPassword: "",
        telephone: "",
        displayName: "",
        firstname: "",
        lastname: ""
      }
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: {
          required,
          password,
          minLength: minLength(6)
        },
        confirmPassword: {
          required,
          password,
          minLength: minLength(6),
          sameAsPassword: sameAs("password")
        },
        telephone: { required },
        displayName: { required },
        firstname: { required },
        lastname: { required }
      }
    };
  },
  mounted: async function() {
    this.time = this.$t("requestOtp");
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
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    getData: async function() {
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

      let dataPc = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/staticPage/privacy-policy-partner`,
        null,
        this.$headers,
        null
      );
      this.privacypolicy = dataPc.detail;

      let dataRes = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/staticPage/register`,
        null,
        this.$headers,
        null
      );
      this.data = dataRes.detail;
    },
    showModal(type) {
      if (type == 1) this.dataModal = this.termandcon;
      else this.dataModal = this.privacypolicy;

      this.$refs.alertModal.show();
    },
    checkForm: async function() {
      //this.$v.form.$touch();
      //if (this.$v.form.$error) return;

      if (this.otp == "") {
        this.modalMessage = this.$t("otpError");
        this.$refs.modalAlertError.show();
        return;
      } else {
        let request = {
          telephone: this.form.telephone,
          OTP: this.otp,
          Reference: this.code,
          type: 1
        };

        this.setTimeCoundown(0);

        let otp = await this.$callApi(
          "post",
          `${this.$baseUrl}/api/OTP/Validate`,
          null,
          this.$headers,
          request
        );
        this.modalMessage = otp.message;
        if (otp.result == 1) {
          this.$refs.modalLoading.show();
          this.error = "";
          let data = await this.$callApi(
            "post",
            `${this.$baseUrl}/api/register`,
            null,
            null,
            this.form
          );
          if (data.result == 1) {
            await this.$cookies.set(
              "seller-token",
              data.detail,
              60 * 60 * 24 * 30
            );
            await this.$cookies.set(
              "username",
              this.form.firstname + " " + this.form.lastname,
              60 * 60 * 24 * 30
            );
            window.location.href = "/profile/general";
          } else {
            this.$refs.modalLoading.hide();
            this.error = data.detail[0];
            this.time = clearInterval(setInterval(0, 1000));
            this.disableOTP = false;
            this.time = this.$t("requestOtp");
          }
        } else {
          this.$refs.modalAlertError.show();
        }
      }
    },
    submitFormOnInput: function(e) {
      if (e.keyCode === 13) {
        this.checkForm();
      }
    },
    setTimeCoundown(time) {
      this.disableOTP = true;

      var timer = time,
        minutes,
        seconds;

      if (time == 0) {
        clearInterval(this.setTimer);
        this.disableOTP = false;
        this.time = "Request OTP";
      } else {
        this.setTimer = setInterval(() => {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          this.time = minutes + ":" + seconds;

          if (--timer < 0) {
            clearInterval(x);
            this.disableOTP = false;
            this.time = "Request OTP";
          }
        }, 1000);
      }
    },
    getOTP: async function() {
      if (this.form.telephone == "") {
        this.modalMessage = this.$t("telError");
        this.$refs.modalAlertError.show();
        return;
      }

      let request = {
        telephone: this.form.telephone,
        type: 1
      };

      this.setTimeCoundown(180);

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/OTP/Send`,
        null,
        this.$headers,
        request
      );
      if (data.result == 1) {
        this.code = data.detail.reference;
      }
    }
  }
};
</script>

<style scoped>
.w-75 {
  width: 75%;
}
.termandcondition {
  white-space: pre-line;
  font-family: "Kanit-Regular" !important;
  height: 400px;
}

::v-deep img {
  max-width: 100% !important;
  height: auto;
}

.btn-yellow {
  background: #ffb300;
  border-color: #ffb300;
}

.regisdata {
  overflow: auto;
  max-height: 650px;
}
</style>
