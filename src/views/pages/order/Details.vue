<template>
  <div v-if="form.order">
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold header-main text-uppercase">
              {{ $t("orderNo") }} :
              <span v-if="form.order.invoiceNo != ''">{{
                form.order.invoiceNo
              }}</span>
              <span v-else>{{ form.order.quotationNo }}</span>
            </h1>
          </b-col>
        </b-row>
        <b-row class="no-gutters mt-2">
          <!-- <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>-->

          <b-col>
            <b-row class="bg-white p-3 no-gutters">
              <b-col lg="6" class="text-lg-left order-1 order-lg-0">
                <p class="font-weight-bold text-center text-lg-left mb-2">
                  {{ $t("dateTime") }} :
                  <span class="font-weight-normal">{{
                    new Date(form.order.createdTime)
                      | moment("DD MMM YYYY (HH:mm)")
                  }}</span>
                </p>

                <b-row>
                  <b-col cols="6">
                    <p class="mb-2 mt-2 font-weight-bold">
                      {{ $t("buyerInfo") }}
                    </p>
                  </b-col>
                </b-row>
                <b-row class="mt-2 mb-3">
                  <b-col md="3" class="font-weight-bold"
                    >{{ $t("name") }} :</b-col
                  >
                  <b-col class="mb-2 mb-sm-0" md="9"
                    >{{ form.order.firstname }} {{ form.order.lastname }}

                    <span
                      class="f-14 text-blue ml-3 text-underline"
                      @click="directToChat"
                      >{{ $t("sendMsg") }}</span
                    ></b-col
                  >

                  <b-col md="3" class="font-weight-bold"
                    >{{ $t("tel") }} :</b-col
                  >
                  <b-col class="mb-2 mb-sm-0" md="9">{{
                    form.order.telephone
                  }}</b-col>

                  <b-col md="3" class="font-weight-bold"
                    >{{ $t("email") }} :</b-col
                  >
                  <b-col class="mb-2 mb-sm-0" md="9">{{
                    form.order.email
                  }}</b-col>

                  <b-col md="3" class="font-weight-bold"
                    >{{ $t("tier") }} :</b-col
                  >
                  <b-col md="9">{{ form.order.memberType }}</b-col>
                </b-row>
              </b-col>
              <b-col
                lg="6"
                class="text-center text-lg-right order-0 order-lg-1"
              >
                <div
                  class="d-sm-flex justify-content-center justify-content-lg-end"
                >
                  <p class="font-weight-bold mb-2">
                    {{ $t("status") }} : {{ form.order.statusName }}
                  </p>
                </div>

                <a
                  href="#"
                  class="f-14 text-blue text-underline"
                  v-if="
                    form.order.orderStatusId == 4 ||
                      form.order.orderStatusId == 14
                  "
                  @click="alreadyPack"
                  >{{ $t("alreadyPack") }}</a
                >

                <div v-if="!form.order.isResendOrder">
                  <a
                    href="#"
                    class="f-14 ml-2 text-underline"
                    v-if="form.order.orderStatusId == 9"
                    @click="resendOrder"
                    >{{ $t("resend") }}</a
                  >
                </div>
                <div v-else class="f-14 d-inline-block">{{ $t("sent") }}</div>

                <a
                  href="#"
                  class="f-14 text-underline ml-2"
                  v-if="
                    form.order.orderStatusId == 1 ||
                      form.order.orderStatusId == 2
                  "
                  @click="cancelOrder"
                  >{{ $t("cancelOrder") }}</a
                >
              </b-col>
            </b-row>

            <b-row class="mt-2 mx-0">
              <b-col md="6" class="pl-md-0 pr-md-1 px-0 mb-2 mb-md-0">
                <div class="bg-white p-3 h-200">
                  <b-row>
                    <b-col cols="8">
                      <p class="font-weight-bold">
                        {{ $t("shippingAddress") }}
                      </p>
                    </b-col>
                    <b-col cols="4" class="text-right">
                      <p
                        class="pointer text-underline text-blue"
                        @click="printShippingLabel"
                      >
                        {{ $t("print") }}
                      </p>
                    </b-col>
                  </b-row>

                  <div class="address-box">
                    <p>
                      {{ form.order.shippingAddress.firstname }}
                      {{ form.order.shippingAddress.lastname }}
                    </p>
                    <p>
                      {{ form.order.shippingAddress.address }}
                      {{ form.order.shippingAddress.building }}
                      {{ form.order.shippingAddress.alley }}
                      {{ form.order.shippingAddress.road }}
                      {{ form.order.shippingAddress.subDistrict }}
                      {{ form.order.shippingAddress.district }}
                      {{ form.order.shippingAddress.province }}
                      {{ form.order.shippingAddress.code }}
                    </p>
                    <p class="mt-3">
                      {{ $t("tel") }} :
                      {{ form.order.shippingAddress.telephone }}
                    </p>
                  </div>
                </div>
              </b-col>
              <b-col md="6" class="pr-md-0 pl-md-1 px-0">
                <div class="bg-white p-3 h-200">
                  <b-row>
                    <b-col cols="8">
                      <p class="font-weight-bold">{{ $t("receiptAddress") }}</p>
                    </b-col>
                    <b-col cols="4" class="text-right">
                      <p
                        class="pointer text-underline text-blue"
                        @click="printShippingLabel"
                      >
                        {{ $t("print") }}
                      </p>
                    </b-col>
                  </b-row>
                  <div class="address-box">
                    <p>
                      {{ form.order.billingAddress.firstname }}
                      {{ form.order.billingAddress.lastname }}
                    </p>
                    <p>
                      {{ form.order.billingAddress.address }}
                      {{ form.order.billingAddress.building }}
                      {{ form.order.billingAddress.alley }}
                      {{ form.order.billingAddress.road }}
                      {{ form.order.billingAddress.subDistrict }}
                      {{ form.order.billingAddress.district }}
                      {{ form.order.billingAddress.province }}
                      {{ form.order.billingAddress.code }}
                    </p>
                    <p class="mt-3">
                      {{ $t("tel") }} :
                      {{ form.order.billingAddress.telephone }}
                    </p>
                  </div>
                </div>
              </b-col>
            </b-row>

            <div class="mt-2">
              <b-button v-b-toggle.collapse-tracking class="collapse-btn">
                {{ $t("shippingDetails") }}
                <font-awesome-icon
                  icon="chevron-right"
                  class="icon float-right mt-1"
                />
                <font-awesome-icon
                  icon="chevron-down"
                  class="icon float-right mt-1"
                />
              </b-button>
              <b-collapse id="collapse-tracking" visible>
                <TrackingTimeline
                  :trackingNo="form.order.trackingNoShippingJung"
                  :shippingTypeName="form.order.shippingTypeName"
                />
              </b-collapse>
            </div>

            <div class="w-100 mt-3 bg-white">
              <b-table
                striped
                responsive
                :items="itemsOrder"
                :fields="fieldsOrder"
                show-empty
                :empty-text="$t('noData')"
                class="table-list m-0"
              >
                <template v-slot:cell(id)="data">
                  <p class="m-0">{{ data.index + 1 }}</p>
                </template>
                <template v-slot:cell(productImageUrl)="data">
                  <div
                    class="square-box b-contain"
                    v-bind:style="{
                      'background-image':
                        'url(' + data.item.productImageUrl + ')'
                    }"
                  ></div>
                </template>
                <template v-slot:cell(productName)="data">
                  <p class="m-0 nobreak">{{ data.item.productName }}</p>
                  <!-- <p class="m-0 nobreak">{{data.item.productShortDescription}}</p> -->
                  <div class="d-flex">
                    <div
                      v-for="(item, index) in data.item.attribute"
                      :key="index"
                      class="config-tag mr-1 mt-1"
                    >
                      {{ item.label }} : {{ item.option.label }}
                    </div>
                  </div>
                  <div></div>
                </template>
                <template v-slot:cell(gp)="data">
                  <p class="m-0">{{ data.item.gp }} %</p>
                </template>
                <template v-slot:cell(subtotal)="data">
                  <p class="m-0">
                    ฿ {{ data.item.subtotal | numeral("0,0.00") }}
                  </p>
                </template>
                <template v-slot:cell(discount)="data">
                  <p class="m-0">
                    ฿ {{ data.item.discount | numeral("0,0.00") }}
                  </p>
                </template>
                <template v-slot:cell(grandTotal)="data">
                  <p class="m-0">
                    ฿ {{ data.item.grandTotal | numeral("0,0.00") }}
                  </p>
                </template>
              </b-table>

              <b-row class="mb-3 p-3">
                <b-col sm="6" offset-md="6">
                  <div class="bg-yellow p-3">
                    <b-row class="pb-2">
                      <b-col cols="7">{{ $t("subTotalOrder") }}</b-col>
                      <b-col cols="5" class="text-right"
                        >฿ {{ form.order.subtotal | numeral("0,0.00") }}</b-col
                      >
                    </b-row>
                    <hr />

                    <b-row class="pb-2">
                      <b-col cols="7">{{ $t("totalWithGp") }}</b-col>
                      <b-col cols="5" class="text-right"
                        >฿
                        {{
                          form.order.totalWithoutGetFinFee | numeral("0,0.00")
                        }}</b-col
                      >
                    </b-row>

                    <b-row class="pb-2" v-if="form.order.discount != 0">
                      <b-col cols="7">{{ $t("discount") }}</b-col>
                      <b-col cols="5" class="text-right"
                        >- ฿
                        {{ form.order.discount | numeral("0,0.00") }}</b-col
                      >
                    </b-row>

                    <b-row class="pb-2">
                      <b-col cols="7">{{ $t("getfinFee") }}</b-col>
                      <b-col cols="5" class="text-right"
                        >฿ {{ form.order.getfinFee | numeral("0,0.00") }}</b-col
                      >
                    </b-row>

                    <hr />

                    <b-row class="pb-2">
                      <b-col cols="7">{{ $t("shippingOrder") }}</b-col>
                      <b-col cols="5" class="text-right"
                        >฿
                        {{ form.order.shippingCost | numeral("0,0.00") }}</b-col
                      >
                    </b-row>

                    <b-row class="pb-2">
                      <b-col cols="7" class="font-weight-bold">{{
                        $t("grandtotal")
                      }}</b-col>
                      <b-col cols="5" class="text-right font-weight-bold"
                        >฿
                        {{ form.order.grandTotal | numeral("0,0.00") }}</b-col
                      >
                    </b-row>
                  </div>
                </b-col>
              </b-row>
            </div>

            <div>
              <b-table
                striped
                responsive
                hover
                :items="items"
                :fields="fields"
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
                <template v-slot:cell(updatedByName)="data">
                  <div v-if="data.item.updatedByName">
                    {{ data.item.updatedByName }}
                  </div>
                  <div v-else>-</div>
                </template>
              </b-table>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </form>

    <b-modal
      id="rejectOrderModal"
      ref="rejectOrderModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">{{ $t("cancelOrder") }}</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('rejectOrderModal')"
        >
          ×
        </button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <InputTextArea
                :textFloat="$t('noteCustomer')"
                :placeholder="$t('noteCustomer')"
                type="text"
                name="reject"
                v-model="note"
                @onKeyup="onChangeNote"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button
          class="btn btn-details-set btn-success float-right"
          :disabled="isDisable"
          @click="sendRejectOrderRequest()"
          >{{ $t("save") }}</b-button
        >
        <b-button
          class="btn btn-details-set btn-secondary float-left"
          @click="$bvModal.hide('rejectOrderModal')"
          >{{ $t("cancel") }}</b-button
        >
      </div>
    </b-modal>

    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalLoading ref="modalLoading" :hasClose="false" />
  </div>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import { required, numeric, minValue } from "vuelidate/lib/validators";
import HeaderLine from "@/components/HeaderLine";
import InputTextArea from "@/components/inputs/InputTextArea";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalLoading from "@/components/modal/alert/ModalLoading";
import TrackingTimeline from "@/views/pages/order/component/TrackingTimeline";

export default {
  name: "OrderDetails",
  components: {
    HeaderLine,
    InputTextArea,
    ModalAlert,
    ModalAlertError,
    ModalLoading,
    TrackingTimeline
  },
  data() {
    return {
      flag: 0,
      items: [],
      itemsOrder: [],
      selected: [],
      statusList: [],
      form: {},
      note: "",
      modalMessage: "",
      isDisable: true,
      isDisableBtn: false,
      isLoadingData: false,
      isSuccess: false,
      status: false,
      note: "",
      statusColor: "",
      id: this.$route.params.id,
      fields: [
        {
          key: "createdTime",
          label: `${this.$t("dateTime")}`,
          class: "w-100px"
        },
        {
          key: "orderSatusName",
          label: `${this.$t("status")}`,
          class: "w-100px"
        },
        {
          key: "updatedByName",
          label: `${this.$t("updateBy")}`,
          class: "w-100px"
        }
      ],
      fieldsOrder: [
        {
          key: "id",
          label: "#"
        },
        {
          key: "sku",
          label: "SKU",
          class: "w-100px"
        },
        {
          key: "productImageUrl",
          label: `${this.$t("thumbnail")}`,
          class: "w-100px"
        },
        {
          key: "productName",
          label: `${this.$t("productName")}`,
          tdClass: "text-left w-200",
          thclass: "w-200"
        },
        {
          key: "gp",
          label: `GP`,
          class: "w-100px"
        },
        {
          key: "orderItemQuantity",
          label: `${this.$t("qty")}`
        },
        {
          key: "subtotal",
          label: `${this.$t("amount")}`,
          class: "w-100px"
        },
        {
          key: "discount",
          label: `${this.$t("discount")}`,
          class: "w-100px"
        },
        {
          key: "grandTotal",
          label: `${this.$t("total")}`,
          class: "w-100px"
        }
      ],
      upload: {
        transferSlip: "",
        uploadDate: "",
        transferAmount: 0,
        bankTransfer: 0
      }
    };
  },
  created: async function() {
    await this.getData();
    //await this.checkStatus();
  },
  methods: {
    directToChat() {
      this.$store.commit("setOtherProfile", this.form.order);
      setTimeout(() => {
        this.$router.push({
          path: "/chat"
        });
      }, 500);
    },
    moment: function() {
      return moment();
    },
    cancelOrder() {
      this.isDisable = true;
      this.$refs["rejectOrderModal"].show();
    },
    onChangeNote() {
      if (this.note != "") {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    },
    sendRejectOrderRequest: async function() {
      this.isDisable = true;
      var data = {
        transactionId: this.id,
        note: this.note
      };

      let status = await this.$callApi(
        "put",
        `${this.$baseUrl}/api/transaction/cancel`,
        null,
        this.$headers,
        data
      );
      if (status.result == 1) {
        this.$refs["rejectOrderModal"].hide();
        this.isDisable = false;
        this.getData();
      }
    },
    checkStatus: function(evt) {
      var status = this.selected;
      if (status == 1 || status == 6 || status == 7) {
        this.status = true;
      } else {
        this.status = false;
      }
    },
    getData: async function() {
      //this.isLoadingData = true;

      let status = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Transaction/OrderStatusWithCount`,
        null,
        this.$headers,
        null
      );
      if (status.result == 1) {
        this.statusList = status.detail;
      }

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Transaction/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.items = data.detail.orderStatusLogList;
        this.itemsOrder = data.detail.orderItemList;

        //this.isLoadingData = false;
        this.$isLoading = true;
      }
    },
    printShippingLabel: async function() {
      this.$refs.modalLoading.show();

      axios({
        url: `http://s.boxme.asia/api/v1/orders/awb-label/YTMwYmY5NDYtYzdhNi00Njk0LTg3YzgtNDQwZmQ4YjAwZDc1`,
        method: "get",
        headers: this.$headers,
        responseType: "blob"
      })
        .then(response => {
          this.$refs.modalLoading.hide();
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `Shipping Label-` + dateExcel + `.pdf`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(error => {
          if (error.response.status === 500) {
            // this.imgModal = "/img/icon-unsuccess.png";
            // this.msgModal =
            //   "Internal Server Error. Please contact system administrator";
            // this.hideClose = false;
          }
        });
    },
    alreadyPack: async function() {
      let body = {
        transactionId: this.id,
        note: ""
      };

      this.$refs.modalLoading.show();

      let data = await this.$callApi(
        "put",
        `${this.$baseUrl}/api/transaction/ApproveShipping`,
        null,
        this.$headers,
        body
      );
      this.modalMessage = data.message || data.detail[0];
      if (data.result == 1) {
        this.$refs.modalLoading.hide();
        this.$refs.modalAlert.show();

        //setTimeout(function () {
        this.getData();

        setTimeout(() => {
          this.$refs.modalAlert.hide();
        }, 3000);
        //}, 3000);
      } else {
        this.$refs.modalAlertError.show();
      }
    },
    resendOrder: async function() {
      this.$refs.modalLoading.show();

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/ResendOrder/` + this.id,
        null,
        this.$headers,
        null
      );
      this.modalMessage = data.message;
      if (data.result == 1) {
        this.$refs.modalLoading.hide();
        this.$refs.modalAlert.show();

        setTimeout(() => {
          this.$refs.modalAlert.hide();
        }, 3000);

        //setTimeout(function () {
        this.getData();
        //}, 3000);
      } else {
        this.$refs.modalAlertError.show();
      }
    }
  }
};
</script>

<style scoped>
.sub-color {
  color: #c9b67e;
}

.b-contain {
  background-size: contain;
}

.pt-100 {
  padding-top: 100%;
}

.slip-details {
  line-height: 25px;
}

.address-box p {
  margin: 0;
}

.address-box {
  line-height: 25px;
}

.input-disabled {
  width: 50px;
}

.h-200 {
  min-height: 200px;
}

.pab-0,
.pab {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.right-0 {
  right: 15px;
}

.f-17 {
  font-size: 17px;
}

.order-desc {
  font-size: 13px;
  color: #6b6b6b;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.order-discount {
  color: #c9b67e;
  font-size: 13px;
}

.bg-yellow {
  background: #fff2d6;
  color: #333333;
}

.delete-order {
  clear: both;
  text-align: right;
}

.image-preview {
  padding-top: 50%;
  width: 50%;
  margin: auto;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.status-1 {
  color: #2eb85c !important;
}

.status-2,
.status-3,
.status-4 {
  color: #f9b115 !important;
}

.status-5,
.status-6,
.status-7 {
  color: #e55353 !important;
}

.statusSelect {
  border: 0;
  width: 235px;
  font-size: 20px;
  font-weight: bold;
  height: auto;
  padding-top: 0;
  position: relative;
  left: 10px;
  text-align-last: right;
  top: -2px;
  -webkit-appearance: none;
}

.config-tag {
  background: #ff0641;
  padding: 1px 5px;
  color: white;
  border-radius: 15px;
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 992px) {
  .pab-0 {
    position: unset;
    width: auto;
  }

  .input-disabled {
    float: right;
  }

  .statusSelect {
    text-align-last: center;
  }
}
</style>
