<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col cols="5" class="text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase m-0">
            {{ $t("resendOrder") }}
          </h1>
        </b-col>
        <b-col cols="7" class="text-right my-3 my-lg-0">
          <b-button v-b-toggle.sidebar-1 class="ml-2 btn-filter">
            <font-awesome-icon
              icon="filter"
              title="filter-btn"
              class="text-white mr-0 mr-sm-1"
            />
            <span class="d-none d-sm-inline font-weight-bold text-uppercase"
              >{{ $t("filter") }} ({{
                countName +
                countOrderNo +
                countSku +
                countProductName +
                countPaymentChannel +
                countStartdate +
                countEnddate
              }})</span
            >
          </b-button>
        </b-col>
      </CRow>
      <b-sidebar
        id="sidebar-1"
        :title="$t('filter')"
        backdrop
        shadow
        backdrop-variant="dark"
        right
        ref="filterSidebar"
      >
        <div class="px-3 py-2">
          <div class="text-right">
            <button
              type="button"
              class="btn btn-link px-0"
              @click="onClearFilter()"
            >
              {{ $t("clear") }}
            </button>
          </div>

          <InputText
            class="mb-4"
            :textFloat="$t('orderNo')"
            :placeholder="$t('orderNo')"
            type="text"
            name="ordername"
            v-model="filter.OrderNo"
          />

          <InputText
            class="mb-4"
            :textFloat="$t('customerName')"
            :placeholder="$t('customerName')"
            type="text"
            name="cusname"
            v-model="filter.CustomerName"
          />

          <InputText
            class="mb-4"
            textFloat="SKU"
            placeholder="SKU"
            type="text"
            name="sku"
            v-model="filter.Sku"
          />

          <InputText
            class="mb-4"
            :textFloat="$t('productName')"
            :placeholder="$t('productName')"
            type="text"
            name="proname"
            v-model="filter.ProductName"
          />

          <InputSelect
            class="mb-4"
            :title="$t('paymentChannel')"
            name="payment"
            v-bind:options="paymentChannelList"
            valueField="id"
            textField="name"
            v-model="paymentChanelSelected"
            @onDataChange="handleChangePaymentChannel"
          />

          <label class="label-text">{{ $t("startDate") }}</label>
          <datetime
            :placeholder="$t('selectDate')"
            class="date-picker"
            format="dd MMM yyyy"
            value-zone="local"
            v-model="filter.startDate"
          ></datetime>

          <label class="label-text">{{ $t("endDate") }}</label>
          <datetime
            :placeholder="$t('selectDate')"
            class="date-picker"
            format="dd MMM yyyy"
            value-zone="local"
            v-model="filter.endDate"
          ></datetime>

          <div class="text-center">
            <p class="text-danger" v-if="errorDate">{{ $t("correctDate") }}</p>
          </div>

          <div class="text-center mt-4">
            <button
              type="button"
              class="btn btn-purple button"
              @click="getDataByStatus"
            >
              {{ $t("search") }}
            </button>
          </div>
        </div>
      </b-sidebar>
      <b-row class="no-gutters px-3 px-sm-0 mt-2">
        <b-col class="overflow-auto">
          <b-button-group
            class="btn-group-status d-inline-flex d-inline-md-block"
          >
            <b-button
              v-for="(item, index) in statusList"
              :key="index"
              @click="getDataByOrderStatus(item.name, item.id)"
              :class="{ menuactive: isActive(item.name) }"
              >{{ item.name }} ({{ item.count }})</b-button
            >
          </b-button-group>
        </b-col>
      </b-row>
      <div class="mt-3 bg-white py-3 py-sm-0">
        <b-row class="no-gutters px-3 px-sm-0">
          <b-col>
            <b-table
              striped
              responsive
              hover
              :items="items"
              :fields="fields"
              :busy="isBusy"
              show-empty
              :empty-text="$t('noData')"
              class="table-list"
            >
              <template v-slot:cell(ids)="data">
                <b-form-checkbox
                  size="lg"
                  class="ml-3"
                  :value="data.item.id"
                  v-model="selected"
                ></b-form-checkbox>
              </template>
              <template v-slot:head(ids)="data">
                <b-form-checkbox
                  size="lg"
                  class="ml-3"
                  :ref="data.field.key"
                  v-model="selectedAll"
                ></b-form-checkbox>
              </template>
              <template v-slot:cell(firstName)="data">
                <span
                  >{{ data.item.firstName }} {{ data.item.lastName }}
                  <font-awesome-icon
                    icon="comment"
                    title="chat"
                    class="pointer text-warning"
                    @click="directToChat(data.item)"
                  ></font-awesome-icon
                ></span>
              </template>
              <template v-slot:cell(createdTime)="data">
                <span>
                  {{
                    new Date(data.item.createdTime) | moment($formatDateTime)
                  }}
                </span>
              </template>
              <template v-slot:cell(orderStatus)="data">
                <div
                  v-if="
                    data.item.orderStatusId == 10 || data.item.orderStatusId < 5
                  "
                  class="text-warning"
                >
                  {{ data.item.orderStatus }}
                </div>
                <div
                  v-else-if="
                    data.item.orderStatusId == 5 ||
                    data.item.orderStatusId == 11
                  "
                  class="text-success"
                >
                  {{ data.item.orderStatus }}
                </div>
                <div v-else class="text-danger">
                  {{ data.item.orderStatus }}
                </div>
              </template>
              <template v-slot:cell(grandTotal)="data">
                <p class="m-0">
                  ฿ {{ data.item.grandTotal | numeral("0,0.00") }}
                </p>
              </template>
              <template v-slot:cell(id)="data">
                <div class="d-flex justify-content-center">
                  <router-link :to="'/resendorder/details/' + data.item.id">
                    <b-button variant="link" class="text-dark px-1 py-0">
                      {{ $t("details") }}
                    </b-button>
                  </router-link>
                </div>
              </template>
              <template v-slot:table-busy>
                <div class="text-center text-black my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong class="ml-2">Loading...</strong>
                </div>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row class="no-gutters px-3 px-sm-0">
          <b-col
            class="form-inline justify-content-center justify-content-sm-between"
          >
            <div class="d-sm-flex m-3">
              <b-pagination
                v-model="filter.PageNo"
                :total-rows="rows"
                :per-page="filter.PerPage"
                class="m-md-0"
                @change="pagination"
                align="center"
              ></b-pagination>
            </div>

            <b-form-select
              class="mr-sm-3 select-page"
              v-model="filter.PerPage"
              @change="hanndleChangePerpage"
              :options="pageOptions"
            ></b-form-select>
          </b-col>
        </b-row>
      </div>
    </div>

    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalLoading ref="modalLoading" :hasClose="false" />
  </div>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import InputText from "@/components/inputs/InputText";
import InputSelect from "@/components/inputs/InputSelect";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalLoading from "@/components/modal/alert/ModalLoading";

export default {
  name: "OrderIndex",
  components: {
    InputText,
    InputSelect,
    ModalAlertError,
    ModalLoading,
  },
  data() {
    return {
      statusList: [],
      hideColumn: "d-none",
      paymentChannelList: [],
      paymentChanelSelected: 0,
      list: [],
      allItems: [],
      modalMessage: "",
      activeItem: "",
      requestDeleteUser: {
        userId: null,
      },
      fields: [
        {
          key: "orderNo",
          label: `${this.$t("orderNo")}`,
          class: "w-100px",
        },
        {
          key: "createdTime",
          label: `${this.$t("dateTime")}`,
          class: "w-100px",
        },
        {
          key: "firstName",
          label: `${this.$t("customerName")}`,
          class: "w-100px",
        },
        {
          key: "paymentType",
          label: `${this.$t("pendingMethod")}`,
          class: "w-200",
        },
        {
          key: "grandTotal",
          label: `${this.$t("amount")}`,
          class: "w-100px",
        },
        {
          key: "orderStatus",
          label: `${this.$t("status")}`,
          class: "w-100px",
        },
        {
          key: "id",
          label: "",
          class: "w-100px",
        },
      ],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        PageNo: 1,
        PerPage: 10,
        CustomerName: "",
        ProductName: "",
        Sku: "",
        startDate: "",
        endDate: "",
        OrderNo: "",
        Status: [],
        PaymentChanel: [],
      },
      paymentChannelFilter: {
        perPage: 10,
        pageNo: 1,
        search: "",
        status: [],
        sortByOrderOrId: 1,
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      totalRowMessage: "",
      items: [],
      isBusy: false,
      isDisable: false,
      selected: [],
      selectedAll: false,
      checkAll: false,
      selectAllCb: false,
      errorDate: false,
    };
  },
  created: async function () {
    await this.getList();
    this.activeItem = "ทั้งหมด";
  },
  watch: {
    selected: function () {
      if (this.selected.length == this.allItems.count) {
        this.selectedAll = true;
      } else {
        this.selectedAll = false;
      }
    },
    selectedAll: function () {
      if (this.selected.length != this.allItems.count) {
        if (this.selectedAll) {
          this.selected = [];
          this.allItems.dataList.forEach((element, index) => {
            this.selected.push(element.id);
          });
        }
      } else {
        if (!this.selectedAll) {
          this.selected = [];
        }
      }
    },
  },
  computed: {
    countName: function () {
      var count = 0;
      if (this.filter.CustomerName != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countOrderNo: function () {
      var count = 0;

      if (this.filter.OrderNo != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countSku: function () {
      var count = 0;
      if (this.filter.Sku != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countProductName: function () {
      var count = 0;

      if (this.filter.ProductName != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countPaymentChannel: function () {
      var count = 0;
      if (this.filter.PaymentChanel.length != 0) count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countEnddate: function () {
      var count = 0;

      if (this.filter.endDate != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countStartdate: function () {
      var count = 0;
      if (this.filter.startDate != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
  },
  methods: {
    getList: async function () {
      this.isBusy = true;

      let status = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Transaction/ResendOrderStatusWithCount`,
        null,
        this.$headers,
        null
      );
      if (status.result == 1) {
        this.statusList = status.detail;
      }

      let paymentChannel = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/PaymentChannel/List`,
        null,
        this.$headers,
        this.paymentChannelFilter
      );
      if (paymentChannel.result == 1) {
        let list = [{ id: 0, name: `${this.$t("selectPayment")}` }];
        let datalist = paymentChannel.detail.dataList;
        this.paymentChannelList = list.concat(datalist);
      }

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Transaction/ResendOrders`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.items = resData.detail.dataList;
        this.rows = resData.detail.count;
        //this.statusList = resData.detail.overviewCount;

        this.isBusy = false;
        this.$isLoading = true;
      }
    },
    getDataByStatus(status) {
      if (this.filter.startDate > this.filter.endDate) {
        this.errorDate = true;
        return;
      }

      this.errorDate = false;
      this.$refs.filterSidebar.hide(true);
      this.getList();
    },
    getDataByOrderStatus: async function (status, id) {
      this.activeItem = status;
      this.filter.Status = [];
      if (id != 0) this.filter.Status.push(id);
      await this.getList();
    },
    handleChangePaymentChannel: async function (value) {
      this.filter.PaymentChanel = [];
      if (value != 0) {
        this.filter.PaymentChanel.push(value);
      }
    },
    isActive: function (menuItem) {
      return this.activeItem == menuItem;
    },
    pagination(Page) {
      this.filter.PageNo = Page;
      this.getList();
    },
    hanndleChangePerpage(value) {
      this.filter.PageNo = 1;
      this.filter.PerPage = value;
      this.getList();
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.PageNo = 1;
        this.getList();
      }
    },
    btnSearch() {
      this.filter.PageNo = 1;
      this.getList();
    },
    checkAllSelect() {
      if (!this.selectAllCb) {
        this.filter.Status = [];
      } else {
        var list = this.statusList.slice(1);
        for (const item in list) {
          this.filter.Status.push(list[item].id);
        }
      }
    },
    checkStatusLength() {
      if (this.filter.Status.length == 10) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
    onClearFilter() {
      this.filter.PageNo = 1;
      this.filter.startDate = "";
      this.filter.endDate = "";
      this.filter.CustomerName = "";
      this.filter.ProductName = "";
      this.filter.Sku = "";
      this.filter.OrderNo = "";
      this.paymentChanelSelected = 0;
      this.filter.PaymentChanel = [];
      this.$refs.filterSidebar.hide(true);
      this.getList();
    },
    directToChat(data) {
      this.$store.commit("setOtherProfile", data);
      setTimeout(() => {
        this.$router.push({
          path: "/chat",
        });
      }, 500);
    },
  },
};
</script>
