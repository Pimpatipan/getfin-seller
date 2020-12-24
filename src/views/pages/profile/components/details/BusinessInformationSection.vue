<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white px-4 pb-4">
        <b-col>
          <b-row class="my-3">
            <b-col class="d-flex align-items-md-center main-label">{{
              $t("businessInformation")
            }}</b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('companyName')"
                :placeholder="$t('companyName')"
                type="text"
                name="companyName"
                v-model="form.businessInformation.name"
                isRequired
                :isValidate="$v.form.businessInformation.name.$error"
                :v="$v.form.businessInformation.name"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('houseNo')"
                :placeholder="$t('houseNo')"
                type="text"
                name="houseNo"
                v-model="form.businessInformation.houseNo"
                isRequired
                :isValidate="$v.form.businessInformation.houseNo.$error"
                :v="$v.form.businessInformation.houseNo"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('building')"
                :placeholder="$t('building')"
                type="text"
                name="building"
                v-model="form.businessInformation.buildingVillage"
                isRequired
                :isValidate="$v.form.businessInformation.buildingVillage.$error"
                :v="$v.form.businessInformation.buildingVillage"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('road')"
                :placeholder="$t('road')"
                type="text"
                name="road"
                v-model="form.businessInformation.roadAlley"
                isRequired
                :isValidate="$v.form.businessInformation.roadAlley.$error"
                :v="$v.form.businessInformation.roadAlley"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputSelect
                class=""
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :title="$t('province')"
                name="province"
                valueField="id"
                textField="name"
                v-bind:options="province"
                v-model="form.businessInformation.provinceId"
                @onDataChange="handleChangeProvince"
                isRequired
                :isValidate="$v.form.businessInformation.provinceId.$error"
                :v="$v.form.businessInformation.provinceId"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputSelect
                class=""
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :title="$t('district')"
                name="district"
                valueField="id"
                textField="name"
                v-bind:options="districts"
                v-model="form.businessInformation.districtId"
                @onDataChange="handleChangeDistrict"
                isRequired
                :isValidate="$v.form.businessInformation.districtId.$error"
                :v="$v.form.businessInformation.districtId"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputSelect
                class=""
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :title="$t('subdistrict')"
                name="subdistrict"
                valueField="id"
                textField="name"
                v-bind:options="subdistricts"
                v-model="form.businessInformation.subdistrictId"
                @onDataChange="handleChangeSubDistrict"
                isRequired
                :isValidate="$v.form.businessInformation.subdistrictId.$error"
                :v="$v.form.businessInformation.subdistrictId"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('businnerRegisNum')"
                :placeholder="$t('businnerRegisNum')"
                type="text"
                name="sellerId"
                text=""
                filename=""
                :maxLength="13"
                @onKeypress="isNumber($event)"
                v-model="form.businessInformation.businessRegistrationNo"
                isRequired
                :isValidate="
                  $v.form.businessInformation.businessRegistrationNo.$error
                "
                :v="$v.form.businessInformation.businessRegistrationNo"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col>
              <UploadFile
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('businessDocument')"
                :placeholder="$t('businessDocument')"
                format="file"
                :fileName="businessInfoName"
                :text="$t('supportFile')"
                v-model="
                  form.businessInformation.businessInformationDocumentFile
                "
                name="businessDocument"
                v-on:onFileChange="onBusinessInfoChange"
                v-on:delete="deleteBusinessDocumentFile"
                isRequired
                :isValidate="
                  $v.form.businessInformation.businessInformationDocument.$error
                "
                :v="$v.form.businessInformation.businessInformationDocument"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <UploadFile
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('taxDocument')"
                :placeholder="$t('taxDocument')"
                format="all"
                :fileName="taxRegisterName"
                :text="$t('supportFile')"
                v-model="form.businessInformation.taxRegistrationDocumentFile"
                name="businessDocument"
                v-on:onFileChange="onTaxRegisterChange"
                v-on:delete="deleteTaxRegisterFile"
                isRequired
                :isValidate="
                  $v.form.businessInformation.taxRegistrationDocument.$error
                "
                :v="$v.form.businessInformation.taxRegistrationDocument"
              />
            </b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputSelect
                class=""
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :title="$t('companyProvince')"
                valueField="id"
                textField="name"
                name="Province"
                v-bind:options="province"
                v-model="form.businessInformation.companyProvinceId"
                @onDataChange="handleChangeCompanyProvince"
                isRequired
                :isValidate="
                  $v.form.businessInformation.companyProvinceId.$error
                "
                :v="$v.form.businessInformation.companyProvinceId"
              />
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col lg="4">
              <label class="main-label mt-2">{{ $t("vatEnterprice") }}</label>
            </b-col>
            <b-col lg="6">
              <b-form-group label="" class="mt-2">
                <b-form-radio-group
                  id="radio-group-1"
                  v-model="form.businessInformation.vat"
                  :options="options"
                  :isValidate="$v.form.businessInformation.vat.$error"
                  :v="$v.form.businessInformation.vat"
                  name="radio-options"
                ></b-form-radio-group>
              </b-form-group>
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
    <!-- Modal -->
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import InputText from "../../../profile/components/inputs/InputText";
import UploadFile from "../../../profile/components/inputs/UploadFile";
import InputSelect from "../../../profile/components/inputs/InputSelect";
import { required, minLength } from "vuelidate/lib/validators";

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
    UploadFile,
    InputSelect,
  },
  data() {
    return {
      sellerAccount: "",
      isDisable: false,
      modalMessage: "",
      businessInfoName: "",
      taxRegisterName: "",
      activeItem: "seller-account",
      businessDocument: "",
      selected: "first",
      options: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],

      form: {
        businessInformation: {
          id: 0,
          name: "",
          houseNo: "",
          buildingVillage: "",
          roadAlley: "",
          provinceId: 111,
          companyProvinceId: 111,
          districtId: 17,
          subdistrictId: 69,
          businessRegistrationNo: "",
          businessInformationDocument: "",
          businessInformationDocumentFile: "",
          taxRegistrationDocument: "",
          taxRegistrationDocumentFile: "",
          vat: false,
        },
      },
      province: [],
      districts: [],
      subdistricts: [],
      noteAdmin: "",
    };
  },
  validations: {
    form: {
      businessInformation: {
        name: { required },
        houseNo: { required },
        buildingVillage: { required },
        roadAlley: { required },
        provinceId: { required },
        companyProvinceId: { required },
        districtId: { required },
        subdistrictId: { required },
        businessRegistrationNo: { required, minLength: minLength(13) },
        businessInformationDocument: { required },
        taxRegistrationDocument: { required },
        vat: { required },
      },
    },
  },
  created: async function () {
    this.form.businessInformation = this.dataObject;
    this.businessInfoName = this.dataObject.businessInformationDocument;
    this.taxRegisterName = this.dataObject.taxRegistrationDocument;
    // if (this.form.businessInformation.provinceId === 0) {
    //   this.form.businessInformation.provinceId = 111;
    //   this.form.businessInformation.districtId = 17;
    //   this.form.businessInformation.subdistrictId = 69;
    //   this.form.businessInformation.companyProvinceId = 111;
    // }
    if (this.form.businessInformation.provinceId == 0) {
      await this.getProvinces(1);
    } else {
      await this.getProvinces(0);
    }

    //await this.getDistrict(1);
    //await this.getSubDistrict(1);
  },
  watch: {
    dataObject: function () {
      this.form.businessInformation = this.dataObject;
      this.businessInfoName = this.dataObject.businessInformationDocument;
      this.taxRegisterName = this.dataObject.taxRegistrationDocument;
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
    deleteBusinessDocumentFile() {
      this.form.businessInformation.businessInformationDocumentFile = null;
      this.form.businessInformation.businessInformationDocument = "";
      this.businessInfoName = "";
      this.isDisable = true;
    },
    deleteTaxRegisterFile() {
      this.form.businessInformation.taxRegistrationDocument = "";
      this.form.businessInformation.taxRegistrationDocumentFile = null;
      this.taxRegisterName = "";
      this.isDisable = true;
    },
    onBusinessInfoChange(file) {
      this.businessInfoName = file.name;
      this.form.businessInformation.businessInformationDocument = file.name;
      this.isDisable = false;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.businessInformation.businessInformationDocumentFile =
          reader.result;
      };
    },
    onTaxRegisterChange(file) {
      this.taxRegisterName = file.name;
      this.form.businessInformation.taxRegistrationDocument = file.name;
      this.isDisable = false;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.businessInformation.taxRegistrationDocumentFile =
          reader.result;
      };
    },
    checkForm: async function (flag) {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        return;
      }
      this.isDisable = true;
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function () {
      let params = {
        id: this.form.businessInformation.id,
        name: this.form.businessInformation.name,
        houseNo: this.form.businessInformation.houseNo,
        buildingVillage: this.form.businessInformation.buildingVillage,
        roadAlley: this.form.businessInformation.roadAlley,
        provinceId: this.form.businessInformation.provinceId,
        companyProvinceId: this.form.businessInformation.companyProvinceId,
        districtId: this.form.businessInformation.districtId,
        subdistrictId: this.form.businessInformation.subdistrictId,
        businessRegistrationNo: this.form.businessInformation
          .businessRegistrationNo,
        businessInformationDocument: this.form.businessInformation
          .businessInformationDocument,
        businessInformationDocumentFile: this.form.businessInformation
          .businessInformationDocumentFile,
        taxRegistrationDocument: this.form.businessInformation
          .taxRegistrationDocument,
        taxRegistrationDocumentFile: this.form.businessInformation
          .taxRegistrationDocumentFile,
        vat: this.form.businessInformation.vat,
      };
      let data = await this.$callApi(
        "patch",
        `${this.$baseUrl}/api/Profile/General/BussinessInformation`,
        null,
        this.$headers,
        params
      );

      this.modalMessage = data.message;
      this.isDisable = false;
      if (data.result == 1) {
        //this.reloadData();
        this.$refs.modalAlert.show();
        this.reloadData();
        // setTimeout(function () {
        //   window.location.reload();
        // }, 3000);
        this.$hasChange = false;
      } else {
        this.reloadData();
        this.$refs.modalAlertError.show();
      }
    },
    getProvinces: async function (flag) {
      let provinces = await this.$callApi(
        "get",
        `https://dev-getfin-api.dosetech.co/api/Address/Provinces`,
        null,
        this.$headers,
        null
      );
      if (provinces.result == 1) {
        let list = [{ id: null, name: `${this.$t("selectProvince")}` }];
        let datalist = provinces.detail;
        this.province = list.concat(datalist);
        if (flag == 1) {
          this.form.businessInformation.provinceId = null;
          this.form.businessInformation.companyProvinceId = null;
          this.getDistrict(1);
        } else {
          this.getDistrict(0);
        }
      }
    },
    getDistrict: async function (flag) {
      let provinceId = this.form.businessInformation.provinceId;
      if (!this.form.businessInformation.provinceId) {
        provinceId = 0;
      }
      let district = await this.$callApi(
        "get",
        `https://dev-getfin-api.dosetech.co/api/Address/Districts/` +
          provinceId,
        null,
        this.$headers,
        null
      );
      if (district.result == 1) {
        let list = [{ id: null, name: `${this.$t("selectDistrict")}` }];
        let datalist = district.detail;
        this.districts = list.concat(datalist);
        if (flag == 1) {
          this.form.businessInformation.districtId = null;
          this.getSubDistrict(1);
        } else {
          this.getSubDistrict(0);
        }
      }
    },
    getSubDistrict: async function (flag) {
      let districtId = this.form.businessInformation.districtId;
      if (!this.form.businessInformation.districtId) {
        districtId = 0;
      }
      let subdistrict = await this.$callApi(
        "get",
        `https://dev-getfin-api.dosetech.co/api/Address/SubDistricts/` +
          districtId,
        null,
        this.$headers,
        null
      );
      if (subdistrict.result == 1) {
        let list = [{ id: null, name: `${this.$t("selectSubDistrict")}` }];
        let datalist = subdistrict.detail;
        this.subdistricts = list.concat(datalist);
        if (flag == 1) {
          this.form.businessInformation.subdistrictId = null;
        }
      }
    },

    handleChangeProvince: async function (value) {
      this.form.businessInformation.provinceId = value;
      this.getDistrict(1);
    },
    handleChangeDistrict: async function (value) {
      this.form.businessInformation.districtId = value;
      this.getSubDistrict(1);
    },
    handleChangeSubDistrict: async function (value) {
      this.form.businessInformation.subdistrictId = value;
    },
    handleChangeCompanyProvince: async function (value) {
      this.form.businessInformation.companyProvinceId = value;
    },
  },
};
</script>

<style scoped>
.menuactive {
  color: #ffb300 !important;
}
</style>
