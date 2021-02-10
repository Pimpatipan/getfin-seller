<template>
  <div>
    <b-container class="container-box">
      <b-row class="no-gutters">
        <b-col>
          <h1 class="font-weight-bold header-main text-uppercase mb-3">
            {{ $t("questionDetails") }}
          </h1>
        </b-col>
      </b-row>

      <div class="bg-white p-3">
        <b-row>
          <div class="col-sm-6 text-center text-sm-left mb-1">
            <span class="main-label">
              {{ $t("questionBy") }} :
              <span class="m-0">{{ form.questionBy }}</span>
            </span>
          </div>
          <div class="col-sm-6 text-center text-sm-right">
            <span class="main-label text-secondary f-14 font-weight-normal"
              >{{ $t("lastUpdated") }} :
              {{ form.questionTime | moment("DD MMM YYYY (HH:mm:ss)") }}</span
            >
          </div>
        </b-row>

        <b-row class="mt-3">
          <b-col sm="2" class="mb-3 mb-sm-0">
            <div
              class="square-box m-0 review-img b-contain"
              v-bind:style="{
                'background-image': 'url(' + form.imageUrl + ')',
              }"
            ></div>
          </b-col>
          <b-col sm="10">
            <p class="mb-1 text-secondary">SKU : {{ form.sku }}</p>
            <p>{{ form.productName }}</p>
          </b-col>
        </b-row>

        <div class="bg-gray-box p-3 mt-3 mb-3">
          <b-row>
            <b-col>
              <p>{{ form.question }}</p>
            </b-col>
          </b-row>
        </div>

        <InputTextArea
          class="mb-4"
          :textFloat="$t('answer')"
          :placeholder="$t('answer')"
          type="text"
          name="answer"
          isRequired
          rows="5"
          v-model="form.answer"
        />

        <p class="text-danger" v-if="error">{{ $t("required") }}</p>

        <!-- <b-row>
          <b-col md="6">
            <label class="font-weight-bold main-label f-14">
              {{$t('verifyStatus')}}
              <span class="text-danger">*</span>
            </label>
            <div>
              <b-form-checkbox switch v-model="form.isVerify" class="radio-active" size="lg">
                <span
                  class="ml-2 main-label status-txt f-14"
                >{{form.isVerify ? $t('verified') : $t('noVerify') }}</span>
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col md="6"></b-col>
        </b-row> -->

        <b-row class="mt-4 no-gutters">
          <b-col md="4">
            <router-link to="/question">
              <b-button
                :disabled="isDisable"
                class="btn-details-set btn-secondary"
                >{{ $t("cancel") }}</b-button
              >
            </router-link>
          </b-col>
          <b-col md="8" class="text-sm-right">
            <b-form-checkbox
              id="checkbox-1"
              v-model="notibuyer"
              name="checkbox-1"
              value="accepted"
              class="d-inline-block mb-3 mb-md-0"
              >{{ $t("notifyViaEmail") }}</b-form-checkbox
            >
            <button
              :disabled="isDisable"
              @click="saveQuestion(id)"
              type="button"
              class="btn btn-details-set btn-success ml-md-2 text-uppercase"
            >
              {{ $t("ans") }}
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
    ModalLoading,
  },
  data() {
    return {
      id: this.$route.params.id,
      isDisable: false,
      notibuyer: false,
      modalMessage: "",
      error: false,
      form: {},
    };
  },
  created: async function () {
    await this.getList();
  },
  methods: {
    getList: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/question/${this.id}`,
        null,
        this.$headers,
        null
      );
      if (resData.result == 1) {
        this.form = resData.detail;
        this.$isLoading = true;
      }
    },
    saveQuestion: async function () {
      if (this.form.answer == null || this.form.answer == "") {
        this.error = true;
        return;
      }

      this.error = false;
      this.isDisable = true;

      var notiFlag = 0;

      if (this.notibuyer) notiFlag = 1;
      else notiFlag = 0;

      this.$refs.modalLoading.show();

      let dataModal = {
        id: this.id,
        answer: this.form.answer,
        isVerify: this.form.isVerify,
        isNotifyEmail: notiFlag,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/question/save`,
        null,
        this.$headers,
        dataModal
      );

      this.modalMessage = data.message;
      this.$refs.modalLoading.hide();
      this.isDisable = false;
      this.$store.dispatch("getActiveData");
      if (data.result == 1) {
        this.$refs.modalAlert.show();
        setTimeout(() => {
          this.$router.push({ path: `/question` });
        }, 3000);
      } else {
        this.$refs.modalAlertError.show();
      }
    },
  },
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

@media (max-width: 600px) {
  .review-list-img {
    width: 30%;
    padding-top: 30%;
  }
}
</style>