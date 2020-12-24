<template>
  <div class="d-flex align-items-center min-vh-100 login-container">
    <b-container>
      <b-row class="justify-content-center px-5 py-4">
        <div class="w-100 px-xl-5 d-lg-flex header-login-box">
          <div
            class="logoLogin mr-lg-5"
            v-bind:style="{
              'background-image': 'url(' + imgLogo + ')',
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
        <b-col md="9" lg="6" class=" text-center">
          <div v-html="data" class=""></div>
        </b-col>
        <b-col md="9" lg="6" class="mt-4 mt-lg-0">
          <!-- <div class="text-center my-3">
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
            <b-card class="p-4 shadow-lg login-box">
              <b-card-body class="py-1 px-0">
                <b-form>
                  <div class="mb-4">
                    <InputTextIcon
                      class
                      textFloat="Name"
                      placeholder="Name"
                      type="text"
                      name="name"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.firstname"
                      :isValidate="$v.form.firstname.$error"
                      :v="$v.form.firstname"
                    />
                  </div>

                  <div class="mb-4">
                    <InputTextIcon
                      class
                      textFloat="Lastname"
                      placeholder="Lastname"
                      type="text"
                      name="lastname"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.lastname"
                      :isValidate="$v.form.lastname.$error"
                      :v="$v.form.lastname"
                    />
                  </div>

                  <div class="mb-4">
                    <InputTextIcon
                      class
                      textFloat="Email address"
                      placeholder="Email address"
                      type="email"
                      name="email"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.email"
                      :isValidate="$v.form.email.$error"
                      :v="$v.form.email"
                    />
                  </div>

                  <div class="mb-4">
                    <InputTextIcon
                      class
                      textFloat="Password"
                      placeholder="Password"
                      type="password"
                      name="pass"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.password"
                      :isValidate="$v.form.password.$error"
                      :v="$v.form.password"
                    />
                  </div>

                  <div class="mb-4">
                    <InputTextIcon
                      class
                      textFloat="Confirm password"
                      placeholder="Confirm password"
                      type="password"
                      name="conpass"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.confirmPassword"
                      :isValidate="$v.form.confirmPassword.$error"
                      :v="$v.form.confirmPassword"
                    />
                  </div>

                  <div class="mb-4">
                    <InputTextIcon
                      class
                      textFloat="Display / Shop name"
                      placeholder="Display / Shop name"
                      type="text"
                      name="shop"
                      isRequired
                      @onKeyup="submitFormOnInput"
                      v-model="form.displayName"
                      :isValidate="$v.form.displayName.$error"
                      :v="$v.form.displayName"
                    />
                  </div>

                  <div class="mb-4 d-flex">
                    <InputTextIcon
                      class="w-100"
                      textFloat="Phone number"
                      placeholder="Phone number"
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
                    <b-button
                      class="nowrap ml-2"
                      variant="primary"
                      @click="getOTP"
                      :disabled="disableOTP"
                      >{{ time }}</b-button
                    >
                  </div>

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
                    <span class="text-secondary"
                      >You will recieve an OTP in 3 min.</span
                    >
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
                      ><span
                        class="text-underline pointer"
                        @click="$bvModal.show('alertModal')"
                        >Accept Terms & Conditions</span
                      >
                    </b-form-checkbox>
                  </div>

                  <b-row class="mt-4 text-center">
                    <b-col>
                      <b-button
                        type="button"
                        class="px-4 login-btn"
                        :disabled="!accept"
                        @click="checkForm"
                        >Register</b-button
                      >
                    </b-col>
                  </b-row>

                  <div class="mt-3 text-center">
                    <span class="f-12">
                      Already have an account?
                      <router-link :to="'/login'" class="">
                        <span class="text-underline">Login</span>
                      </router-link>
                    </span>
                  </div>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
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
      <div class="modal-header border-0"></div>
      <div class="text-center">
        <pre class="text-left termandcondition f-16">
       <b>ข้อกำหนดและเงื่อนไขการใช้เว็บไซต์ Getfin Seller Center</b>

<b>ข้อสำคัญ</b>

เวอริเต้ ขอขอบพระคุณที่ท่านเข้าเยี่ยมชมเว็บไซต์ Getfin Seller Center (“เว็ปไซต์”) ขอท่านได้โปรดอ่านข้อกำหนดและเงื่อนไขฉบับนี้ (“ข้อกำหนดการใช้”) ก่อนการใช้งานเว็บไซต์ ซึ่งดำเนินการโดย บริษัท เกทฟิน จำกัด เลขที่ 75/57 ซ.สุขุมวิท19 (วัฒนา) ถ.สุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร ประเทศไทย 10110 (“บริษัทฯ”)

โดยการใช้งานเว็บไซต์นี้ ท่านได้ยอมรับข้อกำหนดการใช้ ที่บริษัทฯเป็นผู้ให้บริการการเข้าใช้งานแก่ท่าน บริษัทฯอาจเปลี่ยนแปลงข้อกำหนดการใช้ฉบับนี้ได้เป็นครั้งคราว ดังนั้น ขอให้ท่านได้โปรดทำความเข้าใจข้อกำหนดการใช้ทุกครั้งที่มีการใช้งานเว็บไซต์นี้ ทั้งนี้ ท่านตกลงปฏิบัติตามการเปลี่ยนแปลงในข้อตกลงและผูกผันตนกับข้อกำหนดการใช้ทุกครั้งที่มีการเปลี่ยนแปลง หากเวลาใดก็ตาม ท่านไม่ประสงค์จะยอมรับในข้อกำหนดการใช้นี้ ท่านก็ไม่อาจจะใช้งานเว็บไซต์นี้ได้

<b>การไม่รับประกันรับรอง</b>

ขณะที่บริษัทฯได้ใช้ความมานะอุสาหะ ที่จะรวบรวมและนำเสนอข้อมูลที่ได้มาจากหลายแหล่งที่เชื่อถือได้เพื่อจะให้ข้อมูลที่ปรากฏบนเว็บไซต์ออกมาถูกต้องและสมบูรณ์ แต่บริษัทฯไม่สามารถรับประกัน หรือ รับรองว่า ข้อมูล หรือ เนื้อหาทุกอย่างที่ปรากฎบนเว็บไซต์นั้นจะถูกต้อง ครบถ้วนสมบูรณ์ ท่านจะต้องใช้วิจารณญาณด้วยตนเอง

<b>การเชื่อมโยงเว็บไซต์</b>

การเชื่อมโยงไปยังเว็บไซต์อื่นเป็นเพียงการให้บริการเพื่ออำนวยความสะดวกแก่ท่านเท่านั้น บริษัทฯมิได้มีส่วนเกี่ยวข้องหรือมีอำนาจควบคุม รับรอง ความถูกต้อง ความน่าเชื่อถือ ตลอดจนความรับผิดชอบในเนื้อหาข้อมูลของเว็บไซต์นั้นๆ และ บริษัทฯ ไม่รับผิดชอบต่อเนื้อหาใดๆ ที่แสดงบนเว็บไซต์อื่นที่เชื่อมโยงมายังเว็บไซต์ของบริษัท หรือต่อความเสียหาย ใดๆ ที่เกิดขึ้นจากการเข้าเยี่ยมชมเว็บไซต์ดังกล่าว

<b>ทรัพย์สินทางปัญญา</b>

เว็บไซต์นี้ รวมถึง ข้อความ เนื้อหา ซอฟท์แวร์ วีดิโอ ดนตรี เสียง กราฟฟิก รูปภาพ งานแสดง งานศิลปะ ภาพวาด ชื่อ โลโก้ เครื่องหมายการค้า เครื่องหมายบริการ หรือวัสดุอื่นๆ และให้รวมถึง เนื้อหาที่บริษัทฯเป็นเจ้าของและเนื้อหาที่ควบคุมโดยบริษัทฯ ตลอดจนเนื้อหาที่เป็นเจ้าของ หรือ ถูกควบคุมโดยบุคคลที่สาม และได้รับอนุญาตจากบริษัทฯแล้ว ซึ่งเป็นทรัพย์สินทางปัญญาของบริษัทฯ และต่อไปจะเรียกว่า “เนื้อหา” ท่านไม่มีสิทธิกระทำการใด ๆ อันเป็นการละเมิดต่อเนื้อหา เว้นแต่ได้รับความยินยอมเป็น ลายลักษณ์อักษรจากบริษัทฯ เป็นการล่วงหน้า

<b>การอนุญาตให้ดาวน์โหลด</b>

ท่าน ไม่มีสิทธิดาวน์โหลด เนื้อหาในเว็บไซต์นี้ เว้นแต่จะได้รับอนุญาตเป็นลายลักษณ์อักษรจากบริษัทฯ

<b>การไม่รับรอง</b>

บริษัทฯ ไม่รับผิดชอบต่อความเสียหายใด ๆ ที่เกิดขึ้นกับท่านหรือบุคคลภายนอกไม่ว่าทางตรงหรือทางอ้อมต่อการใช้งานเว็บไซต์นี้ของท่าน

<b>การเปลี่ยนแปลงเว็บไซต์</b>

บริษัทฯ มีสิทธิในการระงับการเผยแพร่ เปลี่ยนแปลง แก้ไข ยกเลิกหรือปรับปรุงเนื้อหาเมื่อใดก็ได้โดยไม่จำต้องแจ้งให้ทราบล่วงหน้า

<b>ความชดใช้สินไหมทดแทน</b>

หากบริษัทฯ ได้รับความเสียหายใดๆ อันเนื่องมาจากการใช้งานเว็บไซต์ของท่านที่ไม่เป็นไปตามข้อกำหนดและเงื่อนไขการใช้เว็บไซต์นี้ ท่านตกลงยินยอมชดใช้ค่าเสียหายใด ๆ ให้แก่บริษัทฯ

<b>นโยบายการคุ้มครองข้อมูลส่วนบุคคล</b>

รายละเอียดเกี่ยวกับนโยบายการคุ้มครองข้อมูลส่วนบุคคลสำหรับท่าน โปรดศึกษาได้จากนโยบายคุ้มครองข้อมูลส่วนบุคคลของบริษัทฯ (Personal Data Protection Policy) ของบริษัทฯ

<b>กฎหมายที่ใช้บังคับ</b>

การตีความ และการบังคับตามเงื่อนไขการให้บริการฉบับนี้ ให้เป็นไปตามกฎหมายไทย

ปรับปรุงล่าสุด วันที่ 24 กพ. 2563
</pre>

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
} from "vuelidate/lib/validators";
import InputTextIcon from "@/components/inputs/InputTextIcon";
import VueCookies from "vue-cookies";
import ModalLoading from "@/components/modal/alert/ModalLoading";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";

export default {
  name: "Register",
  components: {
    InputTextIcon,
    ModalLoading,
    ModalAlertError,
  },
  data() {
    return {
      accept: false,
      error: "",
      imgLogo: "",
      otp: "",
      code: "",
      disableOTP: false,
      time: null,
      modalMessage: "",
      data: "",
      form: {
        email: "",
        password: "",
        confirmPassword: "",
        telephone: "",
        displayName: "",
        firstname: "",
        lastname: "",
      },
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: {
          required,
          minLength: minLength(6),
        },
        confirmPassword: {
          required,
          minLength: minLength(6),
          sameAsPassword: sameAs("password"),
        },
        telephone: { required },
        displayName: { required },
        firstname: { required },
        lastname: { required },
      },
    };
  },
  mounted: async function () {
    await this.getLogo();
    this.time = "Request OTP";
  },
  methods: {
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
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

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/staticPage/Register`,
        null,
        this.$headers,
        null
      );
      this.data = data.detail;
    },
    checkForm: async function () {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      if (this.otp == "") {
        this.modalMessage = "Invalid OTP. Please enter valid OTP";
        this.$refs.modalAlertError.show();
        return;
      } else {
        let request = {
          telephone: this.form.telephone,
          OTP: this.otp,
          Reference: this.code,
          type: 1,
        };

        let otp = await this.$callApi(
          "post",
          `https://dev-getfin-api.dosetech.co/api/OTP/Validate`,
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
          }
        }
        else {
          this.$refs.modalAlertError.show();
        }
      }
    },
    submitFormOnInput: function (e) {
      if (e.keyCode === 13) {
        this.checkForm();
      }
    },
    getOTP: async function () {
      if (this.form.telephone == "") {
        this.modalMessage = "Please enter your telephone number";
        this.$refs.modalAlertError.show();
        return;
      }

      let request = {
        telephone: this.form.telephone,
        type: 1,
      };

      this.disableOTP = true;

      var timer = 180,
        minutes,
        seconds;

      var x = setInterval(() => {
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

      let data = await this.$callApi(
        "post",
        `https://dev-getfin-api.dosetech.co/api/OTP/Send`,
        null,
        this.$headers,
        request
      );
      if (data.result == 1) {
        this.code = data.detail.reference;
      }
    },
  },
};
</script>

<style scoped>
.termandcondition {
  white-space: pre-line;
  font-family: "Kanit-Regular" !important;
  height: 400px;
}

::v-deep img {
    max-width: 100% !important;
    height: auto;
}
</style>
