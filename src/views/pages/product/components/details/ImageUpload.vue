<template>
  <div class="panel-upload">
    <div
      class="panel-bg-file-img"
      v-bind:style="{ backgroundImage: 'url(' + image + ')' }"
      v-on:click="changeIndex(index)"
    >
      <font-awesome-icon
        class="icon-delete"
        icon="times-circle"
        color="#FFFFFF"
        @click="deleteImage"
        v-if="image"
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
        :required="required"
        :name="name"
        ref="input"
        v-if="!image"
        accept="image/png, image/jpeg"
      />
    </div>

    <label class="font-weight-bold main-label mt-2 mt-md-3 text-center w-100">{{
      name
    }}</label>
    <div v-if="v && v.$error">
      <span class="text-danger" v-if="v.required == false">{{
        $t("selectImgError")
      }}</span>
    </div>
    <!-- <b-form-input v-model="dataFile.sortOrder"></b-form-input> -->
    <input type="hidden" v-model="dataFile.productImageId" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
export default {
  components: {
    ModalAlertError,
  },
  props: {
    dataFile: {
      required: false,
      type: Object,
    },
    required: {
      required: false,
      type: Boolean,
    },
    name: {
      required: false,
      type: String,
    },
    urlkey: {
      required: false,
      type: String,
    },
    index: {
      required: false,
      type: Number,
    },
    optionIndex: {
      required: false,
      type: Number,
    },
    v: {
      required: false,
      type: Object,
    },
    // image: {
    //   required: false,
    //   type: String
    // }
    // value: File
  },
  data() {
    return {
      file: "",
      value: "",
      type: {
        all: ["image/jpeg", "image/png", "application/pdf", ""],
        file: ["image/jpeg", "image/png", "application/pdf"],
        image: ["image/jpeg", "image/png"],
      },
      error: "",
      sortOrder: 0,
      data: this.dataFile && this.dataFile.productImageId ? true : false,
      //image: "",
      modalMessage: "",
      image: this.dataFile.imageUrl,
    };
  },
  computed: mapGetters(["headers"]),
  created: function() {
    // this.image = this.data
    //   ? this.dataFile.imageUrl
    //   : require("@/assets/images/icons/picture.png");
  },
  methods: {
    onFileChange(e) {
      // this.errorFile = "";
      const file = e.target.files[0];
      var _validFileExtensions = ["image/jpeg", "image/png"];

      if (e.target.files.length) {
        if (_validFileExtensions.indexOf(file.type) < 0) {
          this.$refs.input.value = "";
          this.modalMessage = `${this.$t("fileNotSupport")}`;
          this.$refs.modalAlertError.show();
        } else if (file.size > 10000000) {
          this.modalMessage = `${this.$t("fileIsTooLarge")}`;
          this.$refs.modalAlertError.show();
        } else {
          // this.image = URL.createObjectURL(file);
          this.handleChangeFileImage(file);
        }
      } else {
        this.$refs.input.value = "";
      }
    },
    saveImage: async function(value) {
      this.image = await this.saveImagetoDb(value);
      this.$emit("handleChangeImage", this.index, this.image);
    },
    handleChangeFileImage: async function(value) {
      if (value) {
        var reader = new FileReader();
        reader.readAsDataURL(value);
        reader.onload = () => {
          this.value = reader.result;
          this.saveImage(reader.result);
        };
      } else {
        this.value = "";
      }
    },
    deleteImage() {
      this.image = "";
    },
    saveImagetoDb: async function(img) {
      var imgData = {
        base64: img,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveImage`,
        null,
        this.$headers,
        imgData
      );

      if (data.result == 1) {
        return data.detail.url;
      }
    },
    changeIndex: function(value) {
      if (this.data) {
        this.$emit("changeIndex", value);
      }
    },
    reloadImages: async function() {
      if (this.data) {
        await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/productimages/delete/${this.dataFile.productImageId}`,
          null,
          this.headers,
          null
        );
      }
      this.$emit("reloadImages", this.index);
    },
  },
};
</script>

<style scoped>
.panel-upload {
  position: relative;
  margin-bottom: 15px;
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
  background-size: contain;
  padding-bottom: 100%;
  border: 2px dashed #979797;
  width: 100%;
  cursor: move;
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
