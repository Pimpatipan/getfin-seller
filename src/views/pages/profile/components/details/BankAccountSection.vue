<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white px-4 pb-4">
        <b-col>
          <b-row class="my-3">
            <b-col class="d-flex align-items-md-center main-label">{{
              $t("bankAccount")
            }}</b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('accountName')"
                :placeholder="$t('accountName')"
                type="text"
                name="accountName"
                v-model="form.bankAccount.accountName"
                isRequired
                :isValidate="$v.form.bankAccount.accountName.$error"
                :v="$v.form.bankAccount.accountName"
                 :disabled="isApproveEdit"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('accountNumber')"
                :placeholder="$t('accountNumber')"
                type="text"
                name="accountNo"
                v-model="form.bankAccount.accountNo"
                isRequired
                :isValidate="$v.form.bankAccount.accountNo.$error"
                :v="$v.form.bankAccount.accountNo"
                 :disabled="isApproveEdit"
              />
            </b-col>
          </b-row>

          <b-row class="">
            <b-col>
              <!-- <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('bank')"
                :placeholder="$t('bank')"
                type="text"
                name="bank"
                v-model="form.bankAccount.bankName"
                isRequired
                :isValidate="$v.form.bankAccount.bankName.$error"
                :v="$v.form.bankAccount.bankName"
              /> -->
              <InputSelect
                class=""
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :title="$t('bank')"
                name="bank"
                valueField="id"
                textField="name"
                v-bind:options="bankLists"
                v-model="form.bankAccount.bankId"
                @onDataChange="handleChangeBankName"
                isRequired
                :isValidate="$v.form.bankAccount.bankId.$error"
                :v="$v.form.bankAccount.bankId"
                 :disabled="isApproveEdit"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <UploadFile
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('bankDocument')"
                :placeholder="$t('bankDocument')"
                format="all"
                :fileName="filename"
                :text="$t('supportFile')"
                v-model="form.bankAccount.bankInformationDocumentFile"
                v-on:onFileChange="onFileChange"
                v-on:delete="deleteFile"
                name="bankDocument"
                isRequired
                :isValidate="$v.form.bankAccount.bankInformationDocument.$error"
                :v="$v.form.bankAccount.bankInformationDocument"
                :cantEdit="isApproveEdit"
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
                @click="checkForm(0)"
                type="button"
                class="btn btn-info btn-details-set ml-md-2 text-uppercase"
                v-if="!isApproveEdit"
              >
                {{ $t("save") }}
              </button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>
    <!-- Modal -->
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import InputText from "../../../profile/components/inputs/InputText";
import InputSelect from "../../../profile/components/inputs/InputSelect";
import UploadFile from "../../../profile/components/inputs/UploadFile";
import { required } from "vuelidate/lib/validators";
export default {
  name: "user",
  props: {
    dataObject: {
      required: false,
      type: Object,
    },
    isApprove: {
      required: false,
      type: Boolean,
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
    UploadFile,
    InputSelect,
  },
  data() {
    return {
      // profileData: this.profile,
      modalMessage: "",
      isDisable: false,
      filename: "",
      activeItem: "seller-account",
      bankLists: [],
      form: {
        bankAccount: {
          id: 0,
          bankId: 0,
          bankName: "",
          accountName: null,
          accountNo: "",
          status: 0,
          imageUrl: "",
          sortOrder: 0,
          sellerId: 0,
          bankInformationDocument: "",
          bankInformationDocumentFile: null,
        },
      },
      isApproveEdit: false,
      noteAdmin: "",
    };
  },
  validations: {
    form: {
      bankAccount: {
        accountName: { required },
        accountNo: { required },
        bankId: { required },
        bankInformationDocument: { required },
      },
    },
  },
  created: async function () {
    this.form.bankAccount = this.dataObject;
    this.filename = this.dataObject.bankInformationDocument;
    this.isApproveEdit = this.isApprove;
    //this.form.bankAccount.bankInformationDocument = "";
    await this.getBankAccounts();
  },
  watch: {
    dataObject: function () {
      this.form.bankAccount = this.dataObject;
      this.filename = this.dataObject.bankInformationDocument;
      // this.form.bankAccount.bankInformationDocument = "";
    },
    note: function () {
      this.noteAdmin = this.note;
    },
  },
  methods: {
    reloadData() {
      this.$emit("reloadData");
    },
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
    deleteFile() {
      this.form.file = null;
      this.filename = null;
      this.isDisable = true;
    },
    getBankAccounts: async function () {
      let banklists = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/bank/list`,
        null,
        this.$headers,
        null
      );
      if (banklists.result == 1) {
        let list = [{ id: null, name: `${this.$t("selectBank")}` }];
        let datalist = banklists.detail.dataList;
        this.bankLists = list.concat(datalist);

        if (this.form.bankAccount.bankId == 0) {
          this.form.bankAccount.bankId = null;
        }
      }
    },
    onFileChange(file) {
      this.filename = file.name;
      this.dataObject.bankInformationDocument = file.name;
      this.isDisable = false;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.bankAccount.bankInformationDocumentFile = reader.result;
      };
    },
    handleChangeBankName: async function (value) {
      this.form.bankAccount.bankId = value;
      let name = this.bankLists.find((item) => item.id === value).name;
      this.form.bankAccount.bankName = name;
    },
    checkForm: async function (flag) {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        return;
      }
      //this.modalAlertShow = false;
      this.isDisable = true;
      this.flag = flag;
      this.submit();
    },
    submit: async function () {
      let data = await this.$callApi(
        "patch",
        `${this.$baseUrl}/api/Profile/General/BankAccount`,
        null,
        this.$headers,
        this.form.bankAccount
      );

      this.modalMessage = data.message;
      this.isDisable = false;
      if (data.result == 1) {
        this.$refs.modalAlert.show();
        // setTimeout(function () {
        //   window.location.reload();
        // }, 3000);
        this.$hasChange = false;
        this.reloadData();
      } else {
        this.$refs.modalAlertError.show();
        this.reloadData();
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
