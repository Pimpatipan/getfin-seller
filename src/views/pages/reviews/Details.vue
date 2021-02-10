<template>
  <div>
    <b-container class="container-box">
      <b-row class="no-gutters">
        <b-col>
          <h1 class="font-weight-bold header-main text-uppercase mb-3">
            {{ $t("reviewDetails") }}
          </h1>
        </b-col>
      </b-row>

      <div class="bg-white p-3">
        <b-row>
          <div class="col-sm-6 text-center text-sm-left mb-1">
            <span class="main-label">
              {{ $t("orderNo") }}:
              <a
                :href="'/order/details/' + form.orderId"
                class="text-underline"
                >{{ form.invoiceNo }}</a
              >
            </span>
          </div>
          <div class="col-sm-6 text-center text-sm-right">
            <span class="main-label text-secondary f-14 font-weight-normal"
              >{{ $t("lastUpdated") }} :
              {{ form.createdTime | moment("DD MMM YYYY (HH:mm:ss)") }}</span
            >
          </div>
        </b-row>

        <b-row class="mt-3">
          <b-col sm="2" class="mb-3 mb-sm-0">
            <div
              class="square-box m-0 review-img b-contain"
              v-bind:style="{
                'background-image': 'url(' + form.imageUrl + ')'
              }"
            ></div>
          </b-col>
          <b-col sm="10">
            <p class="mb-1 text-secondary f-14">SKU : {{ form.sku }}</p>
            <p class="m-0 font-weight-bold">{{ form.productName }}</p>
          </b-col>
        </b-row>

        <div class="bg-gray-box p-3 mt-3">
          <b-row>
            <b-col>
              <div>
                <img :src="form.customerImageUrl" class="w-25px" />
                <span class="font-weight-bold ml-2">{{
                  form.customerName
                }}</span>
              </div>

              <div class="mt-2">
                <p>{{ form.description }}</p>
                <div
                  class="square-box review-list-img b-contain"
                  v-bind:style="{ 'background-image': 'url(' + item + ')' }"
                  v-for="(item, index) in form.imageReviews"
                  :key="index"
                ></div>
              </div>
            </b-col>
          </b-row>
        </div>

        <InputTextArea
          class="mb-4"
          textFloat
          :placeholder="$t('replyReview')"
          type="text"
          name="answer"
          rows="5"
          v-model="form.answer"
        />

        <p class="text-danger" v-if="error">{{ $t("required") }}</p>

        <b-row class="mt-4 no-gutters">
          <b-col md="4">
            <router-link to="/review">
              <b-button
                :disabled="isDisable"
                class="btn-details-set btn-secondary text-uppercase"
                >{{ $t("cancel") }}</b-button
              >
            </router-link>
          </b-col>
          <b-col md="8" class="text-sm-right">
            <b-form-checkbox
              id="checkbox-1"
              v-model="notibuyer"
              name="checkbox-1"
              class="d-inline-block mb-3 mb-md-0"
              >{{ $t("notifyViaEmail") }}</b-form-checkbox
            >
            <button
              :disabled="isDisable"
              @click="replyReview"
              type="button"
              class="btn btn-details-set btn-success ml-md-2 text-uppercase"
            >
              {{ $t("reply") }}
            </button>
          </b-col>
        </b-row>
      </div>
    </b-container>

    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalLoading ref="modalLoading" :hasClose="false" />
  </div>
</template>

<script>
import InputTextArea from "@/components/inputs/InputTextArea";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalLoading from "@/components/modal/alert/ModalLoading";

export default {
  components: {
    InputTextArea,
    ModalAlert,
    ModalAlertError,
    ModalLoading
  },
  data() {
    return {
      id: this.$route.params.id,
      form: {},
      notibuyer: false,
      isDisable: false,
      error: false,
      modalMessage: "",
      reply: ""
    };
  },
  created: async function() {
    await this.getList();
    //document.querySelectorAll("a[href='/review']").className = "mystyle";
  },
  methods: {
    getList: async function() {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Review/Detail/${this.id}`,
        null,
        this.$headers,
        null
      );
      if (resData.result == 1) {
        this.form = resData.detail;
        this.$isLoading = true;
      }
    },
    replyReview: async function() {
      if (this.form.answer == null || this.form.answer == "") {
        this.error = true;
        return;
      }

      this.isDisable = true;
      this.error = false;

      var notiFlag = 0;

      if (this.notibuyer) notiFlag = 1;
      else notiFlag = 0;

      this.$refs.modalLoading.show();

      let data = {
        id: this.id,
        answer: this.form.answer,
        isNotifyEmail: notiFlag
      };

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/review/save`,
        null,
        this.$headers,
        data
      );
      this.modalMessage = resData.message;
      this.isDisable = false;
      this.$refs.modalLoading.hide();
      this.$store.dispatch("getActiveData");
      if (resData.result == 1) {
        this.$refs.modalAlert.show();
        this.reply = "";
        this.notibuyer = false;
        setTimeout(() => {
          this.$refs.modalAlert.hide();
        }, 3000);
        this.getList();
      } else {
        this.$refs.modalAlertError.show();
      }
    }
  }
};
</script>

<style scoped>
.review-img {
  width: 100%;
  padding-top: 100%;
}

.review-list-img {
  width: 19%;
  padding-top: 19%;
  display: inline-block;
  margin: 3px;
}

.w-25px {
  width: 25px;
}

@media (max-width: 600px) {
  .review-list-img {
    width: 30%;
    padding-top: 30%;
  }
}
</style>
