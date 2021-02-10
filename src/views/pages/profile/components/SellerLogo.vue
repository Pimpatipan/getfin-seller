<template>
  <div class="w-100">
    <b-container class="p-0">
      <b-row class="bg-white p-3 no-gutters mt-2">
        <b-col>
          <b-row class="mb-2">
            <b-col>
              <div class="main-label">{{ $t("uploadLogo") }}</div>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col>
              <div class="panel-upload">
                <div
                  class="panel-bg-file-img"
                  v-bind:style="{ backgroundImage: 'url(' + image + ')' }"
                >
                  <font-awesome-icon
                    class="icon-delete pointer"
                    icon="times-circle"
                    color="#979797"
                    v-if="image"
                    @click="deleteImages"
                  />
                  <font-awesome-icon
                    icon="plus"
                    color="#FFB300"
                    class="icon-add"
                    v-if="!image"
                  />
                  <input
                    type="file"
                    v-on:change="onFileChange"
                    name="name"
                    ref="input"
                    v-if="!image"
                    accept="image/png, image/jpeg"
                    isRequired
                  />
                </div>
              </div>
              <p class="detail-format mt-2">{{ $t("supportImg") }}</p>

              <!-- <label class="font-weight-bold main-label   w-100">{{
                name
              }}</label> -->
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col class="d-flex justify-content-end"
              ><div class="w-100"><hr /></div
            ></b-col>
          </b-row>
          <b-row>
            <b-col v-if="dataWarningLog[4].warningLog.note != ''">
              <label class="font-weight-bold">{{ $t("noteFromAdmin") }}</label>
              <p>{{ dataWarningLog[4].warningLog.note }}</p>
            </b-col>
          </b-row>
          <b-row class="">
            <b-col class="d-flex justify-content-end">
              <button
                :disabled="isDisable"
                type="button"
                @click="checkForm(0)"
                class="btn btn-info btn-details-set ml-md-2 text-uppercase"
              >
                {{ $t("save") }}
              </button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <ModalAlert ref="modalAlert" :text="modalMessage" />
      <ModalAlertError ref="modalAlertError" :text="modalMessage" />
      <ModalLoading ref="modalLoading" :hasClose="false" />
    </b-container>
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalLoading from "@/components/modal/alert/ModalLoading";
export default {
  components: {
    ModalAlert,
    ModalAlertError,
    ModalLoading
  },
  props: {
    dataObject: {
      required: false,
      type: Object,
    },
    dataWarningLog: {
      required: false,
      type: Object | Array,
    },
  },
  data() {
    return {
      file: "",
      value: "",
      name: "",
      modalMessage: "",
      isDisable: false,
      text: "*Please upload only file .xlsx less than 10 MB",
      type: {
        all: ["image/jpeg", "image/png", "application/pdf", ""],
        file: ["image/jpeg", "image/png", "application/pdf"],
        image: ["image/jpeg", "image/png"],
      },
      error: "",
      sortOrder: 0,
      data: this.dataFile && this.dataFile.id ? true : false,
      image: "",
      sellerLogo: this.dataObject,
      form: {
        sellerLogo: {
          id: 0,
          logo: null,
          logoFile: null,
        },
      },
      noteAdmin: "",
      //image: this.dataFile && this.dataFile.id ? this.dataFile.imgUrl : require("@/assets/images/icons/picture.png")
    };
  },
  created() {
    //this.form.sellerLogo = this.dataObject.seller;
    this.form.sellerLogo.id = this.dataObject.seller.id;
    this.form.sellerLogo.logo = this.dataObject.seller.logo;
    this.form.sellerLogo.logoFile = this.dataObject.seller.logoFile;
    this.image = this.dataObject.seller.logo;
    if (!this.form.sellerLogo.logo) {
      this.isDisable = true;
    }
  },
  watch: {
    dataObject: function () {
      this.form.sellerLogo.id = this.dataObject.seller.id;
      this.form.sellerLogo.logo = this.dataObject.seller.logo;
      this.form.sellerLogo.logoFile = this.dataObject.seller.logoFile;
      this.image = this.dataObject.seller.logo;
      if (!this.form.sellerLogo.logo) {
        this.isDisable = true;
      }
    },
  },
  methods: {
    reloadData() {
      this.$emit("reloadData");
    },
    onFileChange(e) {
      // this.errorFile = "";
      const file = e.target.files[0];
      var _validFileExtensions = ["image/jpeg", "image/png"];

      if (e.target.files.length) {
        if (_validFileExtensions.indexOf(file.type) < 0) {
          this.$refs.input.value = "";
          // this.errorFile = "*ประเภทไฟล์ไม่ถูกต้อง";
        } else {
          // this.image = URL.createObjectURL(file);
          this.handleChangeFileImage(file);
        }
      } else {
        this.$refs.input.value = "";
      }
    },
    saveImage: async function (value) {
      if (value) {
        this.image = value;
        this.form.sellerLogo.logoFile = value;
        this.isDisable = false;
      }
    },
    saveImagetoDb: async function (img) {
      var imgData = {
        base64: img,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/image/save`,
        null,
        this.$headers,
        imgData
      );

      if (data.result == 1) {
        return data.detail.url;
      }
    },
    checkForm: async function (flag) {
      this.isDisable = true;
      this.submit();
      this.flag = flag;
    },
    submit: async function () {
      this.$refs.modalLoading.show();

      let data = await this.$callApi(
        "patch",
        `${this.$baseUrl}/api/Profile/Logo`,
        null,
        this.$headers,
        this.form.sellerLogo
      );
      this.$refs.modalLoading.hide();
      this.modalMessage = data.message;
      this.isDisable = false;
      if (data.result == 1) {
        this.$refs.modalAlert.show();
        this.reloadData();
       setTimeout(() => {
          this.$refs.modalAlert.hide();
        }, 3000);
        this.$hasChange = false;
      } else {
        this.$refs.modalAlertError.show();
        this.reloadData();
      }
    },

    handleChangeFileImage: async function (value) {
      if (value) {
        var reader = new FileReader();
        reader.readAsDataURL(value);
        reader.onload = async () => {
          this.image = await this.saveImagetoDb(reader.result);
          this.name = value.name;
          this.form.sellerLogo.logo = this.image;
          this.value = reader.result;
          this.isDisable = false;
          // this.saveImage(reader.result);
        };
      } else {
        this.value = "";
      }
    },

    changeIndex: function (value) {
      if (this.data) {
        this.$emit("changeIndex", value);
      }
    },
    deleteImages: async function () {
      this.image = null;
      this.form.sellerLogo.logoFile = null;
      this.name = "";
      this.isDisable = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-upload {
  position: relative;
  margin-bottom: 15px;
  width: calc(100vh / 4);
}
.icon-add {
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  width: 25px;
  height: 25px;
}

.icon-delete {
  position: absolute;
  right: 5px;
  top: 5px;
  color: #707070;
}
.label-file {
  top: 0px;
  position: absolute;
  right: 60px;
  margin-right: 5px;
}
.panel-bg-file-img {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-bottom: 100%;
  border: 2px dashed #979797;
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}
.detail-format {
  color: #9b9b9b;
  font-size: 12px;
  font-family: "Kanit-Light";
  margin-top: 3px;
  margin-bottom: 0px;
  height: 35px;
}
.icon-camera {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #afce38;
  border-radius: 50%;
  padding: 7px;
  cursor: pointer;
}
input[type=file], /* FF, IE7+, chrome (except button) */
input[type=file]::-webkit-file-upload-button {
  /* chromes and blink button */
  cursor: pointer;
  width: 100%;
  height: 100%;
  line-height: 95px;
  position: absolute;
  opacity: 0;
}
</style>
