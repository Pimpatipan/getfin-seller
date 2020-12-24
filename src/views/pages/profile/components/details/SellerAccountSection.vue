<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white px-4 pb-4">
        <b-col>
          <b-row class="my-3">
            <b-col class="d-flex align-items-md-center main-label">{{
              $t("sellerAccount")
            }}</b-col>
          </b-row>
          <b-row class="my-2">
            <b-col cols="6" lg="4" class="main-label">
              <span>{{ $t("sellerId") }} :</span>
            </b-col>
            <b-col cols="6" lg="6">
              <span>{{ form.seller.seller.id }}</span>
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('sellerName')"
                :placeholder="$t('sellerName')"
                type="text"
                name="sellerName"
                v-model="form.seller.firstname"
                isRequired
                :isValidate="$v.form.seller.firstname.$error"
                :v="$v.form.seller.firstname"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('sellerLastname')"
                :placeholder="$t('sellerLastname')"
                type="text"
                name="sellerName"
                v-model="form.seller.lastname"
                isRequired
                :isValidate="$v.form.seller.lastname.$error"
                :v="$v.form.seller.lastname"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('emailAddress')"
                :placeholder="$t('emailAddress')"
                type="text"
                name="sellerEmail"
                v-model="form.seller.email"
                isRequired
                :isValidate="$v.form.seller.email.$error"
                :v="$v.form.seller.email"
                :disabled="true"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('phoneNumber')"
                :placeholder="$t('phoneNumber')"
                type="text"
                name="sellerPhoneNumber"
                v-model="form.seller.telephone"
                isRequired
                :isValidate="$v.form.seller.telephone.$error"
                :v="$v.form.seller.telephone"
                :maxLength="10"
                @onKeypress="isNumber($event)"
                :disabled="true"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('displayNameTH')"
                :placeholder="$t('displayNameTH')"
                type="text"
                name="sellerDisplayName"
                v-model="form.seller.displayNameTranslation[0].name"
                isRequired
                :v="$v.form.seller.displayNameTranslation.$each.$iter[0].name"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('displayNameEN')"
                :placeholder="$t('displayNameEN')"
                type="text"
                name="sellerDisplayName"
                v-model="form.seller.displayNameTranslation[1].name"
                isRequired
                :v="$v.form.seller.displayNameTranslation.$each.$iter[1].name"
              />
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col class="d-flex justify-content-end"
              ><div class="w-100"><hr /></div
            ></b-col>
          </b-row>
          <b-row>
            <b-col>
              <label class="font-weight-bold">{{ $t("noteFromAdmin") }}</label>
              <p>{{ note }}</p> 
            </b-col>
          </b-row>
          <b-row class="">
            <b-col class="d-flex justify-content-end">
              <button
                :disabled="isDisable" 
                @click="checkForm(1)"
                type="button"
                class="btn btn-info btn-details-set ml-md-2 text-uppercase"
              >
                {{ $t("save") }}
              </button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>

    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import InputText from "../../../profile/components/inputs/InputText";
import { required } from "vuelidate/lib/validators";
export default {
  name: "user",
  props: {
    dataObject: {
      required: false,
      type: Object,
    },
    note: {
      required: false,
      type: String,
    },
  },
  components: {
    ModalAlert,
    ModalAlertError,
    InputText,
  },
  data() {
    return {
      id: "",
      sellerAccount: "",
      modalMessage: "",
      activeItem: "seller-account",
      isDisable: false,
      languageList: [],
      form: {
        seller: {
          firstname: "",
          lastname: "",
          telephone: "",
          birthday: "",
          isVerifyEmail: false,
          email: "",
          isConsent: false,
          memberTypeId: 1,
          genderId: 0,
          urlKey: null,
          influencerTypeId: 0,
          influencerTypeName: null,
          displayNameTranslation: [
            {
              languageId: 1,
              name: "",
            },
            {
              languageId: 2,
              name: "",
            },
          ],
        },
      },
      noteAdmin: "",
    };
  },
  validations: {
    form: {
      seller: {
        firstname: { required },
        lastname: { required },
        email: { required },
        telephone: { required },
        displayNameTranslation: {
          $each: {
            name: { required },
          },
        },
      },
    },
  },
  created: async function () {
    this.form.seller = this.dataObject;
    await this.getDatas();
  },
  watch: {
    dataObject: function () {
      this.form.seller = this.dataObject;
    },
    note: function () {
      this.noteAdmin = this.note;
    },
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
    reloadData() {
      this.$emit("reloadData");
    },
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
    getDatas: async function () {
      let languages = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/language`,
        null,
        this.$headers,
        null
      );
      if (languages.result == 1) {
        this.languageList = languages.detail;
      }
    },

    useSameLanguage() {},
    checkForm: async function (flag) {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        // await this.checkValidateTranslationList();
        return;
      }

       this.isDisable = true;
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    checkValidateTranslationList: async function () {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (
            this.$v.form.seller.displayNameTranslation.$each.$iter[index].$error
          ) {
            this.languageActive = this.$v.form.seller.displayNameTranslation.$model[
              index
            ].languageId;

            isError = true;
          }
        }
      });
    },
    submit: async function () {
      let data = await this.$callApi(
        "patch",
        `${this.$baseUrl}/api/Profile/General/Account`,
        null,
        this.$headers,
        this.form.seller
      );

      this.modalMessage = data.message;
      this.isDisable = false;

      if (data.result == 1) {
        this.$refs.modalAlert.show();
        // this.reloadData();
        // setTimeout(function () {
        //   window.location.reload();
        // }, 3000);

        this.reloadData();
        this.form.seller = this.dataObject;

        this.$hasChange = false;
      } else {
        this.$refs.modalAlertError.show();
        this.reloadData();
        this.form.seller = this.dataObject;
      }
    },
  },
};
</script>

<style scoped>
.menuactive {
  color: #ffb300 !important;
}
</style>
