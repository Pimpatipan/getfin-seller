<template>
  <div>
    <label
      class="font-weight-bold main-label mb-3"
      :class="[{ 'input-custom error': v.$error }]"
      >{{ $t("defaultImg") }} ({{ $t("max") }} 7 {{ $t("image") }})</label
    >
    <div class="panel-upload">
      <div class="panel-upload-box upload-mobile" v-if="!isMaxImg">
        <div class="panel-bg-file-img mb-2" for="file_upload">
          <font-awesome-icon icon="plus" color="#FFB300" class="icon-add" />
          <input
            type="file"
            name="name"
            ref="input"
            accept="image/png, image/jpeg"
            id="file_upload"
            v-on:change="onFileChange"
          />
        </div>
      </div>

      <draggable
        :list="imageList"
        class="d-flex flex-wrap px-md-10 upload-mobile"
        :style="[
          { width: isMaxImg ? '100%' : `calc(100% - 100% / ${quantityImg})` },
        ]"
      >
        <div
          class="panel-wrap-bg-file-img d-flex"
          :style="[{ width: `calc(100% / ${quantityImg})` }]"
          v-for="(item, index) in imageList"
          :key="index"
        >
          <div
            class="panel-bg-file-img mb-2"
            v-bind:style="{ backgroundImage: 'url(' + item.imageUrl + ')' }"
          >
            <font-awesome-icon
              icon="times-circle"
              color="#979797"
              class="icon-delete pointer"
              @click="deleteImage(index)"
            />
          </div>
        </div>
      </draggable>
    </div>

    <div v-if="v && v.$error">
      <span class="text-danger" v-if="v.required == false"
        >{{ $t("defaultImgError") }}</span
      >
    </div>
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import draggable from "vuedraggable";

export default {
  components: {
    ModalAlertError,
    draggable,
  },
  props: {
    dataList: {
      required: false,
      type: Array,
    },
    v: {
      required: false,
      type: Object,
    },
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
      modalMessage: "",
      image: "",
      filename: "",
      images: "",
      imageList: this.dataList,
      dragging: false,
      // image: this.dataFile && this.dataFile.id ? this.dataFile.imgUrl : require("@/assets/images/icons/picture.png")
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },
    isMaxImg() {
      if (this.imageList != null) return this.imageList.length == 7;
    },
    quantityImg() {
      if (this.$screenSize.width < 767.98) {
        return 3;
      } else if (this.isMaxImg) {
        return 7;
      } else {
        return 6;
      }
    },
  },
  methods: {
    onFileChange(e) {
      // this.errorFile = "";
      const file = e.target.files[0];
      this.filename = file.name;
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
      if (value) {
        this.imageList.push({
          imageUrl: value,
          sortOrder: 0,
          translation: [
            {
              languageId: 1,
              altTag: this.filename,
            },
            {
              languageId: 2,
              altTag: this.filename,
            },
          ],
        });

        this.$emit("updateImageList", this.imageList);
      }
    },
    handleChangeFileImage: async function(value) {
      if (value) {
        var reader = new FileReader();
        reader.readAsDataURL(value);
        reader.onload = async () => {
          let im = new Image();
          im.src = reader.result;
          im.onload = async () => {
            // if (im.width !== im.height) {
            //   this.modalMessage = "The image size must be 1024x1024 px only";
            //   this.$refs.modalAlertError.show();
            //   return;
            // } else {
            //   this.images = await this.saveImagetoDb(reader.result);
            //   await this.saveImage(this.images);

            // }
            this.images = await this.saveImagetoDb(reader.result);
            await this.saveImage(this.images);
          };
        };
      } else {
        this.value = "";
      }
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
    deleteImage(index) {
      this.imageList.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.panel-upload {
  position: relative;
  margin-bottom: 15px;
  flex-wrap: wrap;
  display: flex;
  margin-right: -15px;
  margin-left: -15px;
}

.panel-upload-box {
  max-width: calc(100% / 7);
  padding-right: 15px;
  padding-left: 15px;
  width: 100%;
}

.panel-upload-box-list {
  max-width: calc(100% / 7);
  padding-right: 15px;
  padding-left: 15px;
  width: 100%;
}

.panel-wrap-bg-file-img {
  padding-right: 15px;
  padding-left: 15px;
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
  right: 1px;
  top: 1px;
  color: #707070;
}

@media (max-width: 767.98px) {
  .panel-upload-box,
  .panel-wrap-bg-file-img {
    max-width: 33.33%;
  }
  .panel-wrap-bg-file-img {
    padding-right: 5px;
    padding-left: 5px;
  }

  .upload-mobile {
    max-width: 100% !important;
    width: 100% !important;
  }
}

@media (max-width: 600px) {
  .panel-upload-box {
    max-width: calc(100% / 3);
  }
}
</style>
