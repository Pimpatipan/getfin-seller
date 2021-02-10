<template>
  <div v-if="form">
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1
              class="font-weight-bold header-main text-uppercase text-center text-sm-left"
            >
              {{ $t("returnDetails") }}
            </h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters mt-2">
          <b-col>
            <div class="bg-white p-3 mb-3">
              <div class="row">
                <div class="col-sm-6">
                  <p class="font-weight-bold text-center text-sm-left mb-2">
                    {{ $t("orderNo") }} :
                    <span class="font-weight-normal">
                      <router-link :to="'/order/details/' + form.order.id">
                        <span
                          v-if="form.order.invoiceNo != ''"
                          class="text-underline"
                        >
                          {{ form.order.invoiceNo }}
                        </span>
                        <span v-else class="text-underline">{{
                          form.order.quotationNo
                        }}</span>
                      </router-link></span
                    >
                  </p>

                  <p class="font-weight-bold text-center text-sm-left mb-2">
                    {{ $t("dateTime") }} :
                    <span class="font-weight-normal">
                      {{
                        new Date(form.order.createdTime)
                          | moment("DD MMM YYYY (HH:mm)")
                      }}</span
                    >
                  </p>
                </div>
                <div class="col-sm-6 text-center text-sm-right">
                  <span
                    class="text-underline pointer"
                    @click="$bvModal.show('showBookBankModal')"
                    v-if="form.bookBankImageUrl != ''"
                  >
                    {{ $t("seeBookBank") }}</span
                  >
                </div>
              </div>
            </div>

            <b-row>
              <b-col md="4" class="text-lg-left">
                <div class="bg-white p-3 h-100">
                  <b-row>
                    <b-col cols="6">
                      <p class="font-weight-bold mb-2">
                        {{ $t("buyerInfo") }}
                      </p>
                    </b-col>
                  </b-row>
                  <b-row class>
                    <b-col xl="4" class="font-weight-bold"
                      >{{ $t("name") }} :</b-col
                    >
                    <b-col class="mb-2 mb-sm-0" xl="8">
                      {{ form.order.firstname }} {{ form.order.lastname }}
                      <span
                        class="f-14 text-blue ml-3 text-underline"
                        @click="directToChat"
                        >{{ $t("sendMsg") }}</span
                      >
                    </b-col>

                    <b-col xl="4" class="font-weight-bold"
                      >{{ $t("tel") }} :</b-col
                    >
                    <b-col class="mb-2 mb-sm-0" xl="8">{{
                      form.order.telephone
                    }}</b-col>

                    <b-col xl="4" class="font-weight-bold"
                      >{{ $t("email") }} :</b-col
                    >
                    <b-col class="mb-2 mb-sm-0 text-wrap" xl="8">
                      {{ form.order.email }}</b-col
                    >

                    <b-col xl="4" class="font-weight-bold"
                      >{{ $t("tier") }} :</b-col
                    >
                    <b-col xl="8">{{ form.order.tier }}</b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col md="4" class="text-lg-left">
                <div class="bg-white p-3 h-100">
                  <b-row>
                    <b-col cols="12">
                      <p class="font-weight-bold m-0">
                        {{ $t("shippingAddress") }}
                      </p>
                    </b-col>
                  </b-row>
                  <b-row class>
                    <b-col class="my-2 mb-sm-0" md="12">
                      {{ form.order.shippingAddress.firstname }}
                      {{ form.order.shippingAddress.lastname }}
                    </b-col>

                    <b-col class="my-2 mb-sm-0" md="12">
                      {{ form.order.shippingAddress.address }}
                      {{ form.order.shippingAddress.building }}
                      {{ form.order.shippingAddress.alley }}
                      {{ form.order.shippingAddress.road }}
                      {{ form.order.shippingAddress.subDistrict }}
                      {{ form.order.shippingAddress.district }}
                      {{ form.order.shippingAddress.province }}
                      {{ form.order.shippingAddress.code }}</b-col
                    >

                    <b-col class="my-2 mb-sm-0" md="12"
                      >โทร : {{ form.order.shippingAddress.telephone }}</b-col
                    >
                  </b-row>
                </div>
              </b-col>
              <b-col md="4" class="text-lg-left">
                <div class="bg-white p-3 h-100">
                  <b-row>
                    <b-col cols="12">
                      <p class="font-weight-bold m-0">
                        {{ $t("receiptAddress") }}
                      </p>
                    </b-col>
                  </b-row>

                  <b-row class>
                    <b-col class="my-2 mb-sm-0" md="12"
                      >{{ form.order.billingAddress.firstname }}
                      {{ form.order.billingAddress.lastname }}</b-col
                    >

                    <b-col class="my-2 mb-sm-0" md="12">
                      {{ form.order.billingAddress.address }}
                      {{ form.order.billingAddress.building }}
                      {{ form.order.billingAddress.alley }}
                      {{ form.order.billingAddress.road }}
                      {{ form.order.billingAddress.subDistrict }}
                      {{ form.order.billingAddress.district }}
                      {{ form.order.billingAddress.province }}
                      {{ form.order.billingAddress.code }}</b-col
                    >

                    <b-col class="my-2 mb-sm-0" md="12"
                      >โทร : {{ form.order.billingAddress.telephone }}</b-col
                    >
                  </b-row>
                </div>
              </b-col>
            </b-row>

            <div class="bg-white mt-3">
              <b-row class="p-3">
                <b-col sm="4" class="text-center text-sm-left">
                  <p class="font-weight-bold my-2">{{ $t("returnDetails") }}</p>
                </b-col>
                <b-col class="text-center text-sm-right m-auto" sm="8">
                  <a
                    v-if="form.returnStatusId == 1"
                    href="#"
                    @click="updateReturnStatus(3)"
                    class="f-14 text-underline mr-2"
                    >{{ $t("reject") }}</a
                  >
                  <span
                    v-else
                    href="#"
                    class="f-14 text-underline text-grey mr-2"
                    >{{ $t("reject") }}</span
                  >
                  <b-button
                    :disabled="form.returnStatusId != 1"
                    class="btn-details-set btn-main mr-1 btn-return"
                    @click="updateReturnStatus(2)"
                    >{{ $t("approve") }}</b-button
                  >
                </b-col>
              </b-row>

              <div class="row no-gutters bg-gray-return py-3">
                <div class="col-3">
                  <div
                    class="square-box square-ratio-pt b-contain"
                    v-bind:style="{
                      'background-image':
                        'url(' + form.orderItems[0].productImageUrl + ')',
                    }"
                  ></div>
                </div>
                <div class="col-6">
                  <div class>
                    <p class="font-weight-bold mb-1">
                      SKU: {{ form.orderItems[0].sku }}
                    </p>
                    <p class="m-0 two-lines">
                      {{ form.orderItems[0].productName }}
                    </p>
                    <div class="d-flex">
                      <div
                        v-for="(item, index) in form.orderItems[0].attribute"
                        :key="index"
                        class="config-tag mr-1 mt-1"
                      >
                        {{ item.label }} : {{ item.option.label }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-3 text-center">
                  <p
                    class="text-warning return-status"
                    v-if="form.orderItems[0].returnStatusId == 1"
                  >
                    {{ $t("inprogress") }}
                  </p>
                  <p
                    class="text-warning return-status"
                    v-if="form.orderItems[0].returnStatusId == 2"
                  >
                    {{ $t("approve") }}
                  </p>
                  <p
                    class="text-danger return-status"
                    v-else-if="form.orderItems[0].returnStatusId == 3"
                  >
                    {{ $t("reject") }}
                  </p>
                  <p
                    class="text-success return-status"
                    v-else-if="form.orderItems[0].returnStatusId == 4"
                  >
                    {{ $t("returned") }}
                  </p>
                </div>
              </div>
              <b-row class="p-3">
                <b-col cols="12" class="text-left">
                  <p class="font-weight-bold mb-2">
                    {{ $t("requestDetails") }}
                  </p>
                  <p
                    class="mb-1"
                    v-if="
                      form.orderItems[0].returnOrderProductImage.length != 0
                    "
                  >
                    {{ $t("imgProductList") }}
                  </p>

                  <div
                    v-bind:style="{
                      'background-image': 'url(' + item.path + ')',
                    }"
                    @click="showPreview(item.path)"
                    v-for="(item, index) in form.orderItems[0]
                      .returnOrderProductImage"
                    :key="index"
                    class="img-doc d-inline-block mr-2 return-pic pointer my-3 b-contain"
                  ></div>

                  <p class="mb-1">
                    {{ $t("returnReason") }}:
                    <span v-if="form.orderItems[0].returnReason != null">{{
                      form.orderItems[0].returnReason
                    }}</span>
                    <span v-else>-</span>
                  </p>

                  <p class="mb-1">
                    {{ $t("note") }}:
                    <span v-if="form.orderItems[0].note != null">{{
                      form.orderItems[0].note
                    }}</span>
                    <span v-else>-</span>
                  </p>
                  <!-- <p class="mb-1">{{ $t("details") }}: {{form.orderItems[0].}}</p> -->
                </b-col>
              </b-row>

              <hr class="m-0" />

              <b-row class="p-3">
                <b-col cols="12" class="text-left">
                  <p class="font-weight-bold mb-2">
                    {{ $t("sendBackDetails") }}
                  </p>
                  <p
                    class="mb-1"
                    v-if="form.returnOrderDetailImage.length != 0"
                  >
                    {{ $t("deliverySlip") }}
                  </p>

                  <div
                    v-bind:style="{
                      'background-image': 'url(' + item.path + ')',
                    }"
                    @click="showPreview(item.path)"
                    v-for="(item, index) in form.returnOrderDetailImage"
                    :key="index"
                    class="img-doc d-inline-block mr-2 return-pic pointer my-3 b-contain"
                  ></div>

                  <p class="mb-1">
                    {{ $t("shippingMethod") }}:
                    <span v-if="form.shippingType != null">{{
                      form.shippingType
                    }}</span>
                    <span v-else>-</span>
                  </p>
                  <p class="mb-1">
                    {{ $t("trackingNo") }}:
                    <span v-if="form.trackingNumber != null">{{
                      form.trackingNumber
                    }}</span>
                    <span v-else>-</span>
                  </p>
                  <p class="mb-1">
                    {{ $t("bankName") }}:
                    <span v-if="form.bankName != null">{{
                      form.bankName
                    }}</span>
                    <span v-else>-</span>
                  </p>
                  <p class="mb-1">
                    {{ $t("bankAccountNo") }}:
                    <span v-if="form.bankAccountNo != null">{{
                      form.bankAccountNo
                    }}</span>
                    <span v-else>-</span>
                  </p>
                  <p class="mb-1">
                    {{ $t("bankAccountName") }}:
                    <span v-if="form.bankAccountName != null">{{
                      form.bankAccountName
                    }}</span>
                    <span v-else>-</span>
                  </p>
                </b-col>
              </b-row>

              <div class="p-3">
                <InputTextArea
                  class="mb-4"
                  :textFloat="$t('replyRequest')"
                  :placeholder="$t('replyRequest')"
                  type="text"
                  name="answer"
                  rows="5"
                  v-model="note"
                />
              </div>

              <div>
                <b-table
                  striped
                  responsive
                  hover
                  :items="form.returnOrderStatusLogs"
                  :fields="fieldsLog"
                  show-empty
                  :empty-text="$t('noData')"
                  class="table-list"
                >
                  <template v-slot:cell(createdTime)="data">
                    <span>{{
                      new Date(data.item.createdTime)
                        | moment("DD MMM YYYY (HH:mm)")
                    }}</span>
                  </template>
                  <template v-slot:cell(firstname)="data">
                    {{ data.item.firstname }} {{ data.item.lastname }}
                  </template>
                  <template v-slot:cell(note)="data">
                    <div v-if="data.item.note == '' || data.item.note == null">
                      -
                    </div>
                    <div v-else>{{ data.item.note }}</div>
                  </template>
                </b-table>
              </div>

              <b-row class="no-gutters p-3">
                <b-col md="4">
                  <router-link to="/return">
                    <b-button
                      :disabled="isDisable"
                      class="btn-details-set btn-secondary text-uppercase"
                      >{{ $t("cancel") }}</b-button
                    >
                  </router-link>
                </b-col>
                <b-col md="8" class="text-sm-right">
                  <button
                    :disabled="isDisable"
                    type="button"
                    class="btn btn-details-set btn-success ml-md-2 text-uppercase"
                    @click="updateReturnStatus(form.returnStatusId)"
                  >
                    {{ $t("save") }}
                  </button>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </form>

    <b-modal
      id="showPreviewModal"
      ref="showPreviewModal"
      hide-header
      hide-footer
      centered
      body-class="p-4"
      size="md"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <!-- <h3 class="font-weight-bold">Image Preview</h3> -->
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('showPreviewModal')"
        >
          ×
        </button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <div
                class="preview-box b-contain m-auto border-0"
                v-bind:style="{ 'background-image': 'url(' + img + ')' }"
              ></div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>

    <b-modal
      id="showBookBankModal"
      ref="showBookBankModal"
      hide-header
      hide-footer
      centered
      body-class="p-4"
      size="md"
    >
      <div class="modal-header border-0 px-0 pt-0">
       <h3 class="font-weight-bold">{{ $t("bookBank") }}</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('showBookBankModal')"
        >
          ×
        </button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <div
                class="preview-box b-contain m-auto border-0"
                v-bind:style="{
                  'background-image': 'url(' + form.bookBankImageUrl + ')',
                }"
              ></div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>

    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalLoading ref="modalLoading" :hasClose="false" />
  </div>
</template>

<script>
import sampleImg from "@/assets/images/cinna.jpg";
import InputTextArea from "@/components/inputs/InputTextArea";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalLoading from "@/components/modal/alert/ModalLoading";

export default {
  name: "ReturnDetails",
  components: {
    InputTextArea,
    ModalAlert,
    ModalAlertError,
    ModalLoading,
  },
  data() {
    return {
      sample: sampleImg,
      id: this.$route.params.id,
      selected: [],
      selectedAll: false,
      isDisable: false,
      modalMessage: "",
      form: null,
      note: "",
      img: "",
      fieldsLog: [
        {
          key: "createdTime",
          label: `${this.$t("dateTime")}`,
          class: "w-100px",
        },
        {
          key: "returnOrderStatus",
          label: `${this.$t("status")}`,
          class: "w-100px",
        },
        {
          key: "firstname",
          label: `${this.$t("updateBy")}`,
          class: "w-100px",
        },
        {
          key: "note",
          label: `${this.$t("note")}`,
          class: "w-100px",
        },
      ],
    };
  },
  created: async function () {
    await this.getData();
    this.$isLoading = true;
  },
  methods: {
    directToChat() {
      this.$store.commit("setOtherProfile", this.form);
      setTimeout(() => {
        this.$router.push({
          path: "/chat",
        });
      }, 500);
    },
    showPreview(img) {
      this.img = img;
      this.$refs["showPreviewModal"].show();
    },
    getData: async function () {
      this.isBusy = true;
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Transaction/ReturnOrder/` + this.id,
        null,
        this.$headers,
        null
      );
      if (resData.result == 1) {
        this.form = resData.detail;
        this.isBusy = false;
        this.$isLoading = true;
      }
    },
    updateReturnStatus: async function (id) {
      this.isDisable = true;

      this.$refs.modalLoading.show();

      let data = {
        id: this.form.id,
        orderId: this.form.orderId,
        note: this.note,
        orderItems: [
          {
            productId: this.form.productId,
            returnOrderId: this.form.returnOrderId,
          },
        ],
        orderStatusId: id,
      };

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Transaction/ReturnOrder/save`,
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
        setTimeout(() => {
          this.$refs.modalAlert.hide();
        }, 3000);
        this.note = "";
        this.getData();
      } else {
        this.$refs.modalAlertError.show();
      }
    },
  },
};
</script>

<style scoped>
.review-shortdesc {
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  width: 100%;
}
.text-grey {
  color: gray;
}

/* .return-pic {
  width: 15% !important;
  padding-bottom: 15% !important;
} */

.return-status {
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

div {
  word-break: break-word;
}

.config-tag {
  background: #ff0641;
  padding: 1px 5px;
  color: white;
  border-radius: 15px;
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .btn-return {
    /* width: 100px !important; */
  }
}
</style>
