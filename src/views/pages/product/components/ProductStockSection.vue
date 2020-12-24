<template>
  <div v-if="!isLoading">
    <SimpleProductTable
      :data="simpleProductData"
      @setStockQty="setStockQty"
      :id="simpleProductId"
      v-if="productTypeId == 1"
    />

    <form class="form-box" v-else>
      <b-row class="no-gutters bg-white">
        <b-col class="p-3">
          <div class="mt-3 w-100">
            <b-table
              striped
              responsive="lg"
              :items="stockitems"
              :fields="stockFields"
              :busy="isBusy"
              show-empty
              :empty-text="$t('noData')"
              class="table-list"
            >
              <template v-slot:cell(product)="data">
                <span class="text-dark">
                  {{ data.item.product.sku }}
                </span>
                <p class="text-secondary m-0">
                  ({{ data.item.product.name }}
                  <span
                    v-for="(item, index) in data.item.product.attribute"
                    :key="index"
                    >, {{ item.option.label }}</span
                  >)
                </p>
              </template>
              <template v-slot:cell(product.price)="data">
                <div>
                  <p class="m-0">
                    {{ data.item.product.price | numeral("0,0.00") }}
                  </p>
                </div>
              </template>
              <template v-slot:cell(stock.inStock)="data">
                <div class="d-flex justify-content-center">
                  <p class="m-0">
                    {{ data.item.stock.inStock | numeral("0,0") }}
                  </p>
                  <a
                    href="#"
                    class="m-0 text-primary ml-3 text-underline"
                    @click="showStockLog(data.item.product.id)"
                  >
                    {{ $t("adjust") }}
                  </a>
                </div>
              </template>
              <template v-slot:cell(stock.onHold)="data">
                <div>
                  <p class="m-0">
                    {{ data.item.stock.onHold | numeral("0,0") }}
                  </p>
                </div>
              </template>
              <template v-slot:cell(stock.available)="data">
                <div>
                  <p class="m-0">
                    {{ data.item.stock.available | numeral("0,0") }}
                  </p>
                </div>
              </template>
              <template v-slot:table-busy>
                <div class="text-center text-black my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong class="ml-2">Loading...</strong>
                </div>
              </template>
            </b-table>
          </div>
          <b-row>
            <b-col
              class="form-inline justify-content-center justify-content-md-between"
            >
              <b-pagination
                v-model="filterStock.pageNo"
                :total-rows="rowsStock"
                :per-page="filterStock.perPage"
                class="m-md-0"
                @change="paginationStock"
              ></b-pagination>
              <b-form-select
                @change="hanndleChangePerpageStock"
                v-model="filterStock.perPage"
                :options="pageOptions"
                class="mr-sm-3 select-page"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>

    <b-modal
      id="setStockModal"
      ref="setStockModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">
          <span v-if="setStockType == 1">{{ $t("increase") }}</span>
          <span v-else-if="setStockType == 2">{{ $t("decrease") }}</span>
          <span v-else>{{ $t("adjust") }}</span
          ><span v-if="$language == 'en'" class="text-white">.</span
          >{{ $t("stock") }}
        </h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('setStockModal')"
        >
          ×
        </button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <InputText
                :textFloat="$t('unit')"
                :placeholder="$t('unit')"
                type="number"
                name="stock"
                isRequired
                v-model="newStock"
                @onKeypress="isNumber($event)"
                @onKeyup="setInStockData"
              />

              <label class="label-text mb-4">
                {{ $t("inStock") }}:
                <span class="text-body px-3">{{ oldStock }}</span>
                <font-awesome-icon icon="arrow-right" title="arrow-rights" />
                <span class="text-body pl-3">{{ inStockData }}</span>
              </label>

              <InputText
                :textFloat="$t('note')"
                :placeholder="$t('note')"
                type="text"
                name="note"
                v-model="note"
              />

              <p v-if="stockerror" class="text-danger">{{ stockMsgError }}</p>
            </b-col>
          </b-row>
          <div class="text-center mt-3">
            <b-button
              class="btn btn-main"
              :disabled="isDisable"
              @click="saveStock"
              >{{ $t("save") }}</b-button
            >
          </div>
        </b-container>
      </div>
    </b-modal>

    <b-modal
      id="showStockLogModal"
      ref="showStockLogModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
      size="xl"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">{{ $t("stockLog") }}</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('showStockLogModal')"
        >
          ×
        </button>
      </div>
      <div>
        <b-container class="p-0">
          <SimpleProductTable
            :data="simpleProductData"
            @setStockQty="setStockQty"
            :id="simpleProductId"
            :isBusy="isBusy"
          />
        </b-container>
      </div>
    </b-modal>

    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import * as moment from "moment/moment";
import axios from "axios";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import SimpleProductTable from "./stock/SimpleProductTable";

export default {
  name: "ProductStock",
  components: {
    InputText,
    ModalAlert,
    ModalAlertError,
    SimpleProductTable,
  },
  data() {
    return {
      id: this.$route.params.id,
      isDisable: false,
      isEdit: false,
      isBusy: false,
      isLoading: false,
      error: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      flagStock: 0,
      stockFilterList: [],
      stockitems: {
        stock: {
          productId: 0,
          onHold: 0,
          available: 0,
          inStock: 0,
        },
        stockLog: {
          count: 0,
          stockLogList: [],
        },
      },
      simpleProductId: 0,
      productTypeId: 0,
      simpleProductData: {},
      stockMsgError: "",
      note: "",
      modalMessage: "",
      stockerror: false,
      setStockType: 0,
      rowsStock: 0,
      newStock: 0,
      oldStock: 0,
      inStockData: 0,
      stockFields: [
        {
          key: "product",
          label: `SKU, Options`,
          tdClass: "text-left",
          class: "w-200",
        },
        {
          key: "product.price",
          label: `${this.$t("price")}`,
        },
        {
          key: "stock.inStock",
          label: `${this.$t("inStock")}`,
        },
        {
          key: "stock.onHold",
          label: `${this.$t("onHold")}`,
        },
        {
          key: "stock.available",
          label: `${this.$t("availableStock")}`,
        },
      ],
      filterStock: {
        perPage: 10,
        pageNo: 1,
        startDate: "",
        endDate: "",
        status: [],
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
    };
  },
  created: async function () {
    await this.getStockData();
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
    moment: function () {
      return moment();
    },
    getStockData: async function () {
      this.isBusy = true;
      //this.isLoading = true;

      let stockList = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/stock/${this.id}`,
        null,
        this.$headers,
        this.filterStock
      );

      if (stockList.result == 1) {
        this.productTypeId = stockList.detail.productTypeId;

        if (this.productTypeId == 1) {
          //this.simpleProductId = id;
          this.simpleProductData = stockList.detail;
        } else {
          this.stockitems = stockList.detail.stockDetail;
          this.rowsStock = stockList.detail.count;
          this.isBusy = false;
        }
      }

      //this.isLoading = false;
      this.$isLoading = true;
    },
    setStockQty(type, stock) {
      this.setStockType = type;
      this.oldStock = stock;
      this.inStockData = stock;
      if (this.simpleProductId == 0) this.simpleProductId = this.id;
      this.$refs["setStockModal"].show();
    },
    setInStockData(value) {
      if (this.newStock != "" || this.newStock != 0) {
        this.isDisable = false;
        if (this.setStockType == 1) {
          this.inStockData = parseInt(this.newStock) + parseInt(this.oldStock);
        } else if (this.setStockType == 2) {
          this.inStockData = parseInt(this.oldStock) - parseInt(this.newStock);
        } else if (this.setStockType == 3) {
          this.inStockData = this.newStock;
        }
      } else {
        this.isDisable = true;
        this.inStockData = this.oldStock;
      }
    },
    saveStock: async function () {
      this.isDisable = true;

      let modalData = {
        productId: this.simpleProductId,
        quantity: this.newStock,
        actionId: this.setStockType,
        note: this.note,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveStock`,
        null,
        this.$headers,
        modalData
      );

      this.isDisable = false;

      if (data.result == 1) {
        this.$refs.showStockLogModal.hide();
        this.$refs.setStockModal.hide();
        this.newStock = 0;
        this.note = "";
        this.getStockData();
      } else {
        this.$refs.modalAlertError.show();
      }
    },
    paginationStock(Page) {
      this.filterStock.pageNo = Page;
      this.getStockData();
    },
    hanndleChangePerpageStock(value) {
      this.filterStock.pageNo = 1;
      this.filterStock.perPage = value;
      this.getStockData();
    },
    getDataByStockFilter() {
      this.$refs.filterSidebar.hide(true);
      this.getStockData();
    },
    showStockLog: async function (id) {
      let stockList = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/stock/${id}`,
        null,
        this.$headers,
        this.filterStock
      );

      if (stockList.result == 1) {
        this.simpleProductId = id;
        this.simpleProductData = stockList.detail;
      }

      this.$refs.showStockLogModal.show();
    },
  },
};
</script>

<style scoped>
::v-deep .sku-input label {
  margin-top: 8px;
  font-weight: bold;
  width: 15%;
}

::v-deep .sku-input .bv-no-focus-ring {
  width: 100%;
}

@media (max-width: 600px) {
  ::v-deep .sku-input label {
    width: 25%;
  }
}
</style>