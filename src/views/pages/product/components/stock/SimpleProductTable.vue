<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white">
        <b-col class="p-3">
          <b-row>
            <b-col md="6">
              <b-row>
                <b-col sm="6">
                  <label class="label-text my-3">
                    {{ $t("inStock") }}:
                    <span class="text-body pl-3">{{
                      stockitems.stock.inStock | numeral("0,0")
                    }}</span>
                  </label>
                </b-col>
                <b-col sm="6" class="text-sm-right my-2 my-sm-3">
                  <span
                    class="ml-sm-2 text-underline pointer"
                    @click="setStockQty(1)"
                    >{{ $t("increase") }}</span
                  >
                  <span
                    class="ml-2 text-underline pointer"
                    @click="setStockQty(2)"
                    >{{ $t("decrease") }}</span
                  >
                  <span
                    class="ml-2 text-underline pointer"
                    @click="setStockQty(3)"
                    >{{ $t("adjust") }}</span
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <hr />

          <b-row>
            <b-col sm="6">
              <label class="label-text"
                >{{ $t("onHold") }} :
                {{ stockitems.stock.onHold | numeral("0,0") }}</label
              >
            </b-col>
            <b-col sm="6" class="mt-2 mt-md-0">
              <label class="label-text"
                >{{ $t("availableStock") }}:
                {{ stockitems.stock.available | numeral("0,0") }}</label
              >
            </b-col>
          </b-row>

          <div class="mt-3">
            <b-table
              striped
              responsive
              hover
              :items="stockitems.stockLog.stockLogList"
              :fields="stockFields"
              :busy="isBusyTable"
              show-empty
              :empty-text="$t('noData')"
              class="table-list"
            >
              <template v-slot:cell(createdTime)="data">
                <span>{{
                  new Date(data.item.createdTime) | moment($formatDate)
                }}</span>
              </template>
              <template v-slot:cell(originalQuantity)="data">
                <div>
                  <p class="m-0">
                    {{ data.item.originalQuantity | numeral("0,0") }}
                  </p>
                </div>
              </template>
              <template v-slot:cell(updateQuantity)="data">
                <div>
                  <p class="m-0">
                    {{ data.item.updateQuantity | numeral("0,0") }}
                  </p>
                </div>
              </template>
              <template v-slot:cell(balance)="data">
                <div>
                  <p class="m-0">{{ data.item.balance | numeral("0,0") }}</p>
                </div>
              </template>
              <template v-slot:cell(referenceNo)="data">
                <div v-if="data.item.referenceNo == null">-</div>
                <div v-else>{{ data.item.referenceNo }}</div>
              </template>
              <template v-slot:cell(note)="data">
                <div v-if="data.item.note == ''">-</div>
                <div v-else>{{ data.item.note }}</div>
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
  </div>
</template>

<script>
import * as moment from "moment/moment";

export default {
  props: {
    data: {
      required: false,
      type: Array | Object,
    },
    isBusy: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      id: 0,
      status: 0,
      isDisables: true,
      rowsStock: 0,
      filterStock: {
        perPage: 10,
        pageNo: 1,
        startDate: "",
        endDate: "",
        status: [],
      },
      stockFields: [
        {
          key: "createdTime",
          label: `${this.$t("dateTime")}`,
        },
        {
          key: "originalQuantity",
          label: `${this.$t("currentStock")}`,
        },
        {
          key: "updateQuantity",
          label: `${this.$t("inOutwards")}`,
        },
        {
          key: "balance",
          label: `${this.$t("remainStock")}`,
        },
        {
          key: "referenceNo",
          label: `${this.$t("refNo")}`,
        },
        {
          key: "note",
          label: `${this.$t("note")}`,
        },
        {
          key: "createdBy",
          label: `${this.$t("updateBy")}`,
        },
      ],
      stockitems: {},
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      isBusyTable: false
    };
  },
  watch: {
    data() {
      this.stockitems = this.data;
      this.isBusyTable = this.isBusy;
    },
  },
  created: async function () {
    this.stockitems = this.data;
    this.rowsStock = this.stockitems.stockLog.count;
    this.isBusyTable = this.isBusy;
  },
  methods: {
    setStockQty(type) {
      this.$emit("setStockQty", type, this.stockitems.stock.inStock);
    },
    paginationStock(Page) {
      this.filterStock.pageNo = Page;
      this.$emit("paginationStock", this.filterStock.pageNo);
      //this.getStockData();
    },
    hanndleChangePerpageStock(value) {
      this.filterStock.pageNo = 1;
      this.filterStock.perPage = value;
      this.$emit("hanndleChangePerpageStock", value);
      //this.getStockData();
    },
  },
};
</script>