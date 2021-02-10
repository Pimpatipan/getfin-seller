<template>
  <div>
    <b-modal
      v-model="showModal"
      ref="alertModal"
      hide-header
      hide-footer
      centered
      @hidden="hide"
    >
      <div class="modal-header px-0">
        <h3 class="font-weight-bold">{{ $t("changeTelephoneNumber") }}</h3>
        <button type="button" aria-label="Close" class="close " @click="hide">
          ×
        </button>
      </div>
      <div class="text-center">
        <p class="f-medium  f-18">
          
        </p>
      </div>
      <div class="">
        <div class="d-flex flex-column mt-3 form-input">
          <InputText
            v-if="!isValidateOTP"
            v-model="form.telephone"
            size="lg"
            :textFloat="$t('tel')"
            :placeholder="$t('tel')"
            type="text"
            name="telephone"
            isRequired
            isTextNumber
            isIconReverse
            :maxlength="10"
            :icon="['fas', 'phone']"
            @onkeypress="keyPressTelephone($event)"
            :isValidate="$v.form.telephone.$error"
            :v="$v.form.telephone"
          />
          <InputText
            v-if="isValidateOTP"
            v-model="form.OTP"
            size="lg"
            :textFloat="$t('enterOTP')"
            :placeholder="$t('enterOTP')"
            type="text"
            name="OTP"
            isRequired
            :maxlength="6"
            :icon="['fas', 'sms']"
            @onkeypress="keyPressOTP($event)"
            :isValidate="$v.form.OTP.$error"
            :v="$v.form.OTP"
          />
          <div v-if="isValidateOTP" class="text-center">
            <p class="mb-1 f-size-18">{{ form.telephone }}</p>
            <p class="mb-0 f-size-14">
              ( {{ $t("referenceCode") }}: {{ form.reference }} )
            </p>
          </div>
        </div>
        <!-- <div>
          <ModalTextLoading
            class="text-white mx-auto text-center"
            :isShow="isLoading"
          />
          <div v-if="errors" class="panel-error my-2">
            <p class="text-white text-center mb-0">
              {{ errors }}
            </p>
          </div>
        </div> -->
        <div class="d-flex flex-column mb-1">
          <b-button
            v-if="!isValidateOTP"
            block
            type="button"
            size="lg"
            variant="primary"
            @click="checkForm"
            :disabled="isLoading"
            class=" mt-3 font-weight-bold rounded-pill btn-send"
            >{{ $t("submit") }}</b-button
          >
          <b-button
            v-if="isValidateOTP"
            block
            type="button"
            size="lg"
            @click="submitValidateOTP"
            :disabled="isLoading"
            variant="primary"
            class=" mt-3 font-weight-bold rounded-pill btn-send"
            >{{ $t("submitOtp") }}</b-button
          >
          <div v-if="!isLoading" class="text-center">
            <div v-if="isValidateOTP" class="mt-3 mb-0  f-size-14">
              <p v-if="timeLeft == 'EXPIRED'" class="mb-0">
                <span class="cursor-pointer" @click="handleClickResend(2)">
                  <u>{{ $t("resend") }}</u>
                </span>
                <span class="mx-2"> | </span>
                <span @click="handleClickResend(1)" class="cursor-pointer">
                  <u>{{ $t("editTelephoneNumber") }}</u>
                </span>
              </p>
              <p class="mb-0" v-else>
                {{ $t("youCanResendIn") }} : {{ timeLeft }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="text-center" v-if="!isWatingOTP">
        <b-form-input
          v-model="telephone"
          placeholder="Enter your name"
        ></b-form-input>
      </div>
      <div v-else>
        <b-form-input
          v-model="otp"
          placeholder="ระบุ OTP ที่ได้รับ"
        ></b-form-input>

        <div class="mt-2 text-center">
          <span>{{ telephone }}</span>
        </div>
        <div class="text-center">
          <span>( รหัสอ้างอิง: {{ code }} ) </span>
        </div>
      </div>
      <div v-if="!isWatingOTP" class="mt-3 mx-auto text-center">
        <b-button variant="primary" :disabled="!telephone" @click="getOTP"
          >ยืนยัน</b-button
        >
      </div>
      <div v-else class="mt-3 text-center">
        <b-button variant="primary" :disabled="!otp" @click="sendOTP"
          >ยืนยัน OTP</b-button
        >
      </div>
      <div class="mt-2 text-center" v-if="isWatingOTP">
        <span v-if="timeLeft !== 'EXPIRED'"
          >สามารถส่งได้อีกครั้งใน {{ timeLeft }}</span
        >
        <span v-else>
          <u>
            ส่งอีกครั้ง
          </u>
          |
          <u>
            แก้ไขเบอร์มือถือ
          </u>
        </span>
      </div> -->
    </b-modal>
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import {
  required,
  minLength,
  requiredIf,
  integer
} from "vuelidate/lib/validators";
import InputText from "@/components/inputs/InputText";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";

export default {
  props: {
    text: {
      required: false,
      type: String
    }
  },
  components: {
    InputText,
    ModalAlert,
    ModalAlertError
  },
  data() {
    return {
      showModal: false,
      isWatingOTP: false,
      telephone: "",
      otp: null,
      code: null,
      modalMessage: "",
      disableOTP: false,
      time: null,
      timeLeft: "00:00",
      isValidateOTP: false,
      isLoading: false,
      errors: "",
      form: {
        telephone: "",
        OTP: "",
        type: 1,
        reference: ""
      }
    };
  },
  validations() {
    return {
      form: {
        telephone: { required, minLength: minLength(10), integer },
        OTP: {
          minLength: minLength(6),
          integer,
          required: requiredIf(function() {
            return this.isValidateOTP;
          })
        }
      }
    };
  },
  methods: {
    show() {
      this.showModal = true;
    },
    hide() {
      this.showModal = false;
    },
    checkForm: async function() {
      this.timeLeft = "00:00";
      this.$v.form.telephone.$touch();
      if (this.$v.form.telephone.$error) return;
      this.$v.form.telephone.$reset();
      this.errors = "";
      this.isLoading = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/OTP/Send`,
        null,
        this.$headers,
        this.form
      );
      this.isLoading = false;
      if (data.result == 1) {
        this.isValidateOTP = true;
        this.form.reference = data.detail.reference;
        this.isWatingOTP = true;
        this.onCountTime();
      } else {
        this.modalMessage = data.message;
        this.$refs.modalAlertError.show();
      }
    },
    onCountTime() {
      let countDownDate = new Date();
      countDownDate.setSeconds(countDownDate.getSeconds() + 180);
      countDownDate = countDownDate.getTime();

      let timerWait = setInterval(() => {
        let now = new Date().getTime();

        let distance = countDownDate - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.timeLeft = minutes + ":" + seconds + "";

        if (distance < 0) {
          clearInterval(timerWait);
          this.timeLeft = "EXPIRED";
          return;
        }
      }, 1000);
    },
    submitValidateOTP: async function() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;
      this.$v.form.$reset();
      this.errors = "";
      this.isLoading = true;

      let otp = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/OTP/Validate`,
        null,
        this.$headers,
        this.form
      );
      this.isLoading = false;
      if (otp.result == 1) {
        this.hide();
        // this.modalMessage = otp.message;
        this.$emit("handleSuccessOTP", this.form);
        // this.$refs.modalAlert.show();
      } else {
        this.modalMessage = otp.message;
        this.$refs.modalAlertError.show();
      }
      // await this.$axios
      //   .post(`${process.env.BASE_URL}/OTP/Validate`, this.form)
      //   .then(async data => {
      //     this.isLoading = false;
      //     if (data.result == 1) {
      //       this.$emit("set-waiting-otp", false);
      //       this.$emit("success-opt", this.form);
      //     } else {
      //       this.errors = data.message;
      //     }
      //   });
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
    keyPressTelephone(e) {
      this.isNumber(e);
    },
    keyPressOTP(e) {
      if (e.keyCode === 13) {
        this.submitValidateOTP();
      } else {
        this.isNumber(e);
      }
    },
    handleClickResend(flag) {
      this.form.OTP = "";
      this.form.reference = "";
      this.timeLeft = "00:00";
      if (flag == 1) {
        this.isValidateOTP = false;
      } else {
        this.checkForm();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-header {
  padding-top: 0;
  padding-bottom: 0;
  border-bottom: 0px solid #dee2e6;
}

.btn-send {
  background-color: #f3591f;
  border-color: #f3591f;
  transition: 0.3s;
}

.btn-send:hover {
  background-color: #fff;
  border-color: #f3591f;;
  color: #f3591f;
}
</style>
