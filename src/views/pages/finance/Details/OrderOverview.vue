<template>
  <div class="w-100">
    <b-row class="no-gutters px-3 px-sm-0 mt-2">
      <b-col cols="12" lg="8" class="overflow-auto">
        <b-button-group
          class="btn-group-status d-inline-flex d-inline-md-block"
        >
          <b-button
            v-for="(item, index) in statusList"
            :key="index"
            @click="getDataByClickStatus(item.name, item.id)"
            :class="{ menuactive: isActive(item.id) }"
            >{{ item.name }} ({{ item.count }})</b-button
          >
        </b-button-group>
      </b-col>
      <b-col cols="12" lg="4" class="text-right">
        <b-button v-b-toggle.sidebar-1 class="btn-filter">
          <font-awesome-icon
            icon="filter"
            title="filter-btn"
            class="text-white mr-0 mr-sm-1"
          />
          <span class="d-none d-sm-inline">
            {{ $t("filter") }} ({{
              countStartdate + countEnddate + countOrderNo
            }})</span
          >
        </b-button>
      </b-col>
    </b-row>
    <b-row
      class="no-gutters px-3 px-sm-0 mt-2 statusCardLists-box"
      v-if="statusCardLists.length > 0"
    >
      <b-col md="3" class="">
        <div class="mb-1 card-status py-3 px-2 mx-0 mx-md-1 total-box">
          <b-row class="">
            <b-col cols="9" lg="9" class="pr-0 status-label">
              <label class="mt-2 one-line">
                {{ $t("totalOrder") }}
              </label>
            </b-col>
            <b-col cols="3" lg="3" class="d-flex justify-content-end">
              <label class="status-count-label my-1">
                {{ statusCardLists[0].count | numeral("0,") }}
              </label></b-col
            >
          </b-row>
        </div>
      </b-col>

      <b-col md="3" class="">
        <div class="mb-1 card-status py-3 px-2 mx-0 mx-md-1">
          <b-row class="mr-0">
            <b-col cols="2" md="3">
              <img
                src="@/assets/images/delivered-icon.png"
                class="finance-icon"
                alt=""
              />
            </b-col>
            <b-col cols="7" md="6" lg="5" class="pr-0 status-label">
              <label class="mt-2 one-line">
                {{ $t("deliveredOrder") }}
              </label>
            </b-col>
            <b-col cols="3" lg="4" class="d-flex justify-content-end pr-0">
              <label class="status-count-label my-1">
                {{ statusCardLists[1].count | numeral("0,") }}
              </label></b-col
            >
          </b-row>
        </div>
      </b-col>

      <b-col md="3" class="">
        <div class="mb-1 card-status py-3 px-2 mx-0 mx-md-1">
          <b-row class="mr-0">
            <b-col cols="2" md="3">
              <img
                src="@/assets/images/deliveredfail-icon.png"
                class="finance-icon"
                alt=""
              />
            </b-col>
            <b-col cols="7" md="6" lg="5" class="pr-0 status-label">
              <label class="mt-2 one-line">
                {{ $t("deliveredOrderFail") }}
              </label>
            </b-col>
            <b-col cols="3" lg="4" class="d-flex justify-content-end pr-0">
              <label class="status-count-label my-1">
                {{ statusCardLists[3].count | numeral("0,") }}
              </label></b-col
            >
          </b-row>
        </div>
      </b-col>

      <b-col md="3" class="">
        <div class="mb-1 card-status py-3 px-2 mx-0 mx-md-1">
          <b-row class="mr-0">
            <b-col cols="2" md="3">
              <img
                src="@/assets/images/return-icon.png"
                class="finance-icon"
                alt=""
              />
            </b-col>
            <b-col cols="7" md="6" lg="5" class="pr-0 status-label">
              <label class="mt-2 one-line">
                {{ $t("returnOrder") }}
              </label>
            </b-col>
            <b-col cols="3" lg="4" class="d-flex justify-content-end pr-0">
              <label class="status-count-label my-1">
                {{ statusCardLists[2].count | numeral("0,") }}
              </label></b-col
            >
          </b-row>
        </div>
      </b-col>
    </b-row>
    <div class="mt-2 bg-white p-3 p-sm-0">
      <b-row class="no-gutters">
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
            <template v-slot:cell(orderDate)="data">
              <span>{{
                new Date(data.item.orderDate) | moment($formatDate)
              }}</span>
            </template>

            <template v-slot:cell(unitPrice)="data">
              <span> ฿ {{ data.item.unitPrice | numeral("0,0.00") }} </span>
            </template>
            <template v-slot:cell(commission)="data">
              <span> ฿ {{ data.item.commission | numeral("0,0.00") }} </span>
            </template>
            <template v-slot:cell(paymentFee)="data">
              <span> ฿ {{ data.item.paymentFee | numeral("0,0.00") }} </span>
            </template>
            <template v-slot:cell(shippingCustomer)="data">
              <span>
                ฿ {{ data.item.shippingCustomer | numeral("0,0.00") }}
              </span>
            </template>
            <template v-slot:cell(shippingSeller)="data">
              <span>
                ฿ {{ data.item.shippingSeller | numeral("0,0.00") }}
              </span>
            </template>
               <template v-slot:cell(shippingPartner)="data">
              <span>
                ฿ {{ data.item.shippingPartner | numeral("0,0.00") }}
              </span>
            </template>
            <template v-slot:cell(startDate)="data">
              <span
                >{{ new Date(data.item.orderDate) | moment($formatDate) }} -
                <br />
                {{ new Date(data.item.endDate) | moment($formatDate) }}
              </span>
            </template>
            <template v-slot:cell(payoutAmount)="data">
              <span> ฿ {{ data.item.payoutAmount | numeral("0,0.00") }} </span>
            </template>
            <template v-slot:cell(payoutStatus)="data">
              <div
                v-if="data.item.payoutStatus == 'สำเร็จ'"
                class="text-success"
              >
                {{ data.item.payoutStatus }}
              </div>
              <div
                v-else-if="data.item.payoutStatus == 'โอนเงินไม่สำเร็จ'"
                class="text-danger"
              >
                {{ data.item.payoutStatus }}
              </div>
              <div v-else class="text-dark">
                {{ data.item.payoutStatus }}
              </div>
            </template>
            <template v-slot:cell(orderStatus)="data">
              <div
                v-if="
                  data.item.orderStatus == 'สำเร็จ' ||
                  data.item.orderStatus == 'Complete'
                "
                class="text-success"
              >
                {{ data.item.orderStatus }}
              </div>

              <div v-else class="text-danger">
                {{ data.item.orderStatus }}
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
              v-model="filter.pageNo"
              :total-rows="rows"
              :per-page="filter.perPage"
              class="m-md-0"
              @change="pagination"
              align="center"
            ></b-pagination>

            <div class="ml-2">
              <p class="total-record-paging text-nowrap text-center">
                {{ totalRowMessage }}
              </p>
            </div>
          </div>

          <b-form-select
            class="mr-sm-3 select-page"
            v-model="filter.perPage"
            @change="hanndleChangePerpage"
            :options="pageOptions"
          ></b-form-select>
        </b-col>
      </b-row>
    </div>
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
        <b-row>
          <b-col class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-link px-0"
              @click="onClearFilter()"
            >
              {{ $t("clear") }}
            </button>
          </b-col>
        </b-row>

        <div class="col-12"></div>
        <b-row class="">
          <b-col>
            <InputText
              :textFloat="$t('orderNo')"
              :placeholder="$t('orderNo')"
              type="text"
              name="orderNumber"
              v-model="filter.search"
            />
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col>
            <p class="main-label">{{ $t("startDate") }}</p>
            <datetime
              :placeholder="$t('selectDate')"
              v-model="filter.StartDate"
              class="date-picker"
              format="dd MMM yyyy"
            ></datetime>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col>
            <p class="main-label">{{ $t("endDate") }}</p>
            <datetime
              :placeholder="$t('selectDate')"
              v-model="filter.EndDate"
              class="date-picker"
              format="dd MMM yyyy"
            ></datetime>
          </b-col>
        </b-row>
        <div class="text-center">
          <p class="text-danger" v-if="errorDate">{{ $t("correctDate") }}</p>
        </div>
        <b-row>
          <b-col class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-purple button"
              @click="getDataByStatus(filter.status)"
            >
              {{ $t("sendSubmit") }}
            </button>
          </b-col>
        </b-row>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
export default {
  name: "FinanceOrderOverview",
  components: {
    InputSelect,
    InputText,
  },
  data() {
    return {
      statusList: [],
      modalMessage: "",
      activeItem: "",
      requestDeleteUser: {
        userId: null,
      },
      fields: [
        {
          key: "orderNo",
          label: `${this.$t("orderNo")}`,
          stickyColumn: true,
          class: "w-100px",
        },
        {
          key: "orderDate",
          label: `${this.$t("orderDate")}`,
          class: "w-100px",
        },

        {
          key: "unitPrice",
          label: `${this.$t("price")}`,
          class: "w-100px",
        },
        {
          key: "commission",
          label: `${this.$t("comission")}`,
          class: "w-100px",
        },
        {
          key: "paymentFee",
          label: `${this.$t("paymentFee")}`,
          class: "w-100px",
        },
        {
          key: "shippingCustomer",
          label: `${this.$t("shippingFee")} (${this.$t("paidByCus")})`,
          class: "w-100px",
        },
        {
          key: "shippingSeller",
          label: `${this.$t("shippingCost")}`,
          class: "w-100px",
        },
        {
          key: "shippingPartner",
          label: `${this.$t("shippingFee")} (${this.$t("paidByPartner")})`,
          class: "w-200",
        },
        {
          key: "promotion",
          label: `${this.$t("promotion")}`,
          class: "w-100px",
        },
        {
          key: "orderStatus",
          label: `${this.$t("orderStatus")}`,
          class: "w-100px",
        },
        {
          key: "startDate",
          label: `${this.$t("statementPeriod")}`,
          class: "w-100px",
        },
        {
          key: "payoutStatus",
          label: `${this.$t("payoutStatus")}`,
          class: "w-100px",
        },
        {
          key: "payoutAmount",
          label: `${this.$t("payoutAmt")}`,
          class: "w-100px",
        },
      ],
      statusCardLists: [],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        StartDate: "",
        EndDate: "",
        search: "",
        perPage: 10,
        pageNo: 1,
        status: [],
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      totalRowMessage: "",
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
    this.activeItem = 0;
  },
  computed: {
    countOrderNo: function () {
      var count = 0;
      if (this.filter.search != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countStartdate: function () {
      var count = 0;
      if (this.filter.StartDate != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countEnddate: function () {
      var count = 0;

      if (this.filter.EndDate != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
  },
  methods: {
    getList: async function () {
      this.isBusy = true;
      this.statusCardLists = [];
      let status = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Finance/OrderOverviewStatusWithCount`,
        null,
        this.$headers,
        null
      );
      if (status.result == 1) {
        this.statusCardLists = status.detail;
        this.statusList = status.detail;
      }

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Finance/OrderOverview`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.items = resData.detail.dataList;
        this.rows = resData.detail.count;

        this.isBusy = false;
        this.$isLoading = true;
      }
    },
    getDataByStatus(status) {
      if (this.filter.StartDate > this.filter.EndDate) {
        this.errorDate = true;
        return;
      }

      this.errorDate = false;
      this.filter.status = status;
      this.activeItem = status;
      this.getList();
      this.$refs.filterSidebar.hide(true);
    },
    getDataByClickStatus(status, id) {
      this.filter.PageNo = 1;
      this.activeItem = id;
      this.filter.status = [];
      if (id != 0) this.filter.status.push(id);
      this.getList();
    },
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filter.status = [];
      } else {
        this.filter.status = [];
        this.statusList.forEach((element) => {
          this.filter.status.push(element.id);
        });
      }
    },
    checkStatusLength() {
      if (this.filter.status.length == this.statusList.length - 1) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
    onClearFilter() {
      this.filter.search = "";
      this.filter.pageNo = 1;
      this.filter.StartDate = "";
      this.filter.EndDate = "";
      this.filter.status = [];
      this.$refs.filterSidebar.hide(true);
      this.getList();
    },
    isActive: function (menuItem) {
      return this.activeItem == menuItem;
    },
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getList();
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perPage = value;
      this.getList();
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageNo = 1;
        this.getList();
      }
    },
    btnSearch() {
      this.filter.pageNo = 1;
      this.getList();
    },
    hanndleStatusList(value) {
      this.filter.pageNo = 1;
      this.filter.statusId = value;
      this.getList();
    },
    saveQuestion() {},
  },
};
</script>

<style scoped>
.status-count-label {
  font-size: 20px;
  color: #1085ff;
}

.card-status {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  margin-bottom: 1.5rem;
  word-wrap: break-word;
  background-clip: border-box;
  border: 1px solid;
  border-radius: 0.25rem;
  background-color: #fff;
  border-color: #d8dbe0;
}
.finance-icon {
  width: auto;
  height: 35px;
}
.total-box {
  border: 2px solid #1085ff;
}
@media (min-width: 767px) {
  .statusCardLists-box {
    margin-right: -5px;
    margin-left: -5px;
  }
}
</style>
