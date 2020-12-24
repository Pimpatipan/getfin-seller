<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white px-4 pb-4">
        <b-col>
          <b-row class="my-3">
            <b-col class="d-flex align-items-md-center main-label">{{
              $t("warehouseAddress")
            }}</b-col>
          </b-row>
          <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('warehouseName')"
                :placeholder="$t('warehouseName')"
                type="text"
                name="warehouseName"
                v-model="form.warehouseAddress.name"
                isRequired
                :isValidate="$v.form.warehouseAddress.name.$error"
                :v="$v.form.warehouseAddress.name"
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
                name="sellerId"
                v-model="form.warehouseAddress.houseNo"
                isRequired
                :isValidate="$v.form.warehouseAddress.houseNo.$error"
                :v="$v.form.warehouseAddress.houseNo"
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
                v-model="form.warehouseAddress.buildingVillage"
                :isValidate="$v.form.warehouseAddress.buildingVillage.$error"
                :v="$v.form.warehouseAddress.buildingVillage"
                isRequired
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
                v-model="form.warehouseAddress.roadAlley"
                isRequired
                :isValidate="$v.form.warehouseAddress.roadAlley.$error"
                :v="$v.form.warehouseAddress.roadAlley"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col>
              <InputSelect
                class=""
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :title="$t('province')"
                name="province"
                v-bind:options="province"
                valueField="id"
                textField="name"
                v-model="form.warehouseAddress.provinceId"
                @onDataChange="handleChangeProvince"
                isRequired
                :isValidate="$v.form.warehouseAddress.provinceId.$error"
                :v="$v.form.warehouseAddress.provinceId"
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
                v-bind:options="districts"
                valueField="id"
                textField="name"
                v-model="form.warehouseAddress.districtId"
                @onDataChange="handleChangeDistrict"
                isRequired
                :isValidate="$v.form.warehouseAddress.districtId.$error"
                :v="$v.form.warehouseAddress.districtId"
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
                v-model="form.warehouseAddress.subdistrictId"
                @onDataChange="handleChangeSubDistrict"
                isRequired
                :isValidate="$v.form.warehouseAddress.subdistrictId.$error"
                :v="$v.form.warehouseAddress.subdistrictId"
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
                name="phoneNo"
                v-model="form.warehouseAddress.telephone"
                isRequired
                :isValidate="$v.form.warehouseAddress.telephone.$error"
                :v="$v.form.warehouseAddress.telephone"
                :maxLength="10"
                @onKeypress="isNumber($event)"
              />
            </b-col>
          </b-row>
          <!-- <b-row class="">
            <b-col>
              <InputText
                classLabelName="col-lg-4"
                classInputName="col-lg-6"
                :textFloat="$t('emailAddress')"
                :placeholder="$t('emailAddress')"
                type="text"
                name="email"
                v-model="form.warehouseAddress.email"
                isRequired
                :isValidate="$v.form.warehouseAddress.email.$error"
                :v="$v.form.warehouseAddress.email"
              />
            </b-col>
          </b-row> -->
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
import InputSelect from "../../../profile/components/inputs/InputSelect";
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
    InputSelect,
  },
  data() {
    return {
      sellerAccount: "",
      modalMessage: "",
      isDisable: false,
      activeItem: "seller-account",
      province: [],
      districts: [],
      subdistricts: [],
      form: {
        warehouseAddress: {
          id: 1,
          name: "",
          houseNo: "",
          buildingVillage: null,
          roadAlley: null,
          provinceId: 111,
          districtId: 17,
          subdistrictId: 69,
          telephone: "",
          email: "",
        },
      },
       noteAdmin: "",
    };
  },
  validations: {
    form: {
      warehouseAddress: {
        name: { required },
        houseNo: { required },
        buildingVillage: { required },
        roadAlley: { required },
        provinceId: { required },
        districtId: { required },
        subdistrictId: { required },
        telephone: { required },
      },
    },
  },
  created: async function() {
    this.form.warehouseAddress = this.dataObject;
    if (this.form.warehouseAddress.provinceId === 0) {
      await this.getProvinces(1);
    } else {
      await this.getProvinces(0);
    }
  },
  watch: {
    dataObject: function() {
      this.form.warehouseAddress = this.dataObject;
    },
    note: function () {
      this.noteAdmin = this.note;
    },
  },
  methods: {
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
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
    getProvinces: async function(flag) {
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
          this.form.warehouseAddress.provinceId = null;
          this.getDistrict(1);
        } else {
          this.getDistrict(0);
        }
      }
    },
    getDistrict: async function(flag) {
      let provinceId = this.form.warehouseAddress.provinceId;
      if (!this.form.warehouseAddress.provinceId) {
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
          this.form.warehouseAddress.districtId = null;
          this.getSubDistrict(1);
        } else {
          this.getSubDistrict(0);
        }
      }
    },
    getSubDistrict: async function(flag) {
      let districtId = this.form.warehouseAddress.districtId;
      if (!this.form.warehouseAddress.districtId) {
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
          this.form.warehouseAddress.subdistrictId = null;
        }
      }
    },

    handleChangeProvince: async function(value) {
      this.form.warehouseAddress.provinceId = value;
      this.getDistrict(1);
    },
    handleChangeDistrict: async function(value) {
      this.form.warehouseAddress.districtId = value;
      this.getSubDistrict(1);
    },
    handleChangeSubDistrict: async function(value) {
      this.form.warehouseAddress.subdistrictId = value;
    },
    onFileChange(file) {
      this.filename = file.name;
      this.isDisable = false;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.file = reader.result;
      };
    },
    checkForm: async function(flag) {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        return;
      }
      this.isDisable = true;
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function() {
      let data = await this.$callApi(
        "patch",
        `${this.$baseUrl}/api/Profile/General/WarehouseAddress`,
        null,
        this.$headers,
        this.form.warehouseAddress
      );

      this.modalMessage = data.message;
      this.isDisable = false;
      if (data.result == 1) {
        this.$refs.modalAlert.show();
        // setTimeout(function() {
        //   window.location.reload();
        // }, 3000);
        this.$hasChange = false;
        this.reloadData();
      } else {
        this.$refs.modalAlertError.show();
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
