<template>
  <div class="w-100">
    <b-row class="no-gutters px-3 px-sm-0 ">
      <b-col class="d-flex justify-content-end mt-3">
        <div class="d-flex ">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              :placeholder="$t('orderNo')"
              type="text"
              name="orderNumber"
              v-model="filter.search"
              @keyup="handleSearch"
            ></b-form-input>
            <b-input-group-prepend @click="btnSearch">
              <span class="icon-input m-auto pr-2">
                <font-awesome-icon icon="search" title="View" />
              </span>
            </b-input-group-prepend>
          </b-input-group>

          <b-button v-b-toggle.sidebar-1 class="ml-2 btn-filter">
            <font-awesome-icon
              icon="filter"
              title="filter-btn"
              class="text-white mr-0 mr-sm-1"
            />
            <span class="d-none d-sm-inline font-weight-bold text-uppercase">{{
              $t("filter")
            }}</span>
          </b-button>
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
            <template v-slot:cell(stateMentNumber)="data">
              <span
                v-if="
                  data.item.stateMentNumber == '' || !data.item.stateMentNumber
                "
                >-</span
              >
              <span v-else>
                {{ data.item.stateMentNumber }}
              </span>
            </template>
            <template v-slot:cell(startDate)="data">
              <span
                >{{ new Date(data.item.orderDate) | moment($formatDate) }} -
                <br />
                {{ new Date(data.item.endDate) | moment($formatDate) }}
              </span>
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
      <b-row class="no-gutters">
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
            class="mr-sm-3 select-page "
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
        <b-row>
          <b-col>
            <div class="main-label">
              Statement Period
            </div>
          </b-col>
        </b-row>
        <b-row class="">
          <b-col>
            <b-form-select v-model="statementPeriod" class="mb-3">
              <b-form-select-option :value="null" disabled class="mb-2"
                >Statement Period</b-form-select-option
              >
              <b-form-select-option
                :value="item"
                v-for="(item, index) in statementPeriodLists"
                :key="index"
                >{{ item.startDate | moment($formatDate) }} -
                {{ item.endDate | moment($formatDate) }}
              </b-form-select-option>
            </b-form-select>
          </b-col>
        </b-row>

        <!-- <b-row class="">
          <b-col>
            <InputText
              :textFloat="$t('orderNo')"
              :placeholder="$t('orderNo')"
              type="text"
              name="orderNumber"
              v-model="filter.search"
            />
          </b-col>
        </b-row> -->
        <!-- <b-row class="">
          <b-col>
            <InputSelect
              class=""
              :title="$t('filterBy')"
              name="filterBy"
              v-bind:options="filterByLists"
              v-model="filter.filterBy"
            />
          </b-col>
        </b-row> -->
        <b-row>
          <b-col class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-purple button"
              @click="getDataByStatus"
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
  name: "FinanceTransactionOverview",
  components: {
    InputSelect,
    InputText,
  },
  data() {
    return {
      statusList: [],
      modalMessage: "",
      activeItem: "",
      statementPeriod: null,
      statementPeriodLists: [],
      requestDeleteUser: {
        userId: null,
      },
      fields: [
        {
          key: "orderDate",
          label: `${this.$t("orderDate")}`,
          stickyColumn: true,
          class: "w-100px",
        },
        {
          key: "stateMentNumber",
          label: `${this.$t("transactionNo")}`,
          class: "w-100px",
        },
        {
          key: "orderNo",
          label: `${this.$t("orderNo")}`,
          class: "w-200",
        },
        {
          key: "payoutAmount",
          label: `${this.$t("amount")}`,
          class: "w-100px",
        },
        {
          key: "startDate",
          label: `${this.$t("statement")}`,
          class: "w-100px",
        },
      ],
      statusCardLists: [
        {
          id: 1,
          statusName: "Total orders (all status)",
          icon: "",
          totalRecord: 6974,
        },
        {
          id: 2,
          statusName: "Delivered",
          icon: "",
          totalRecord: 0,
        },
        {
          id: 3,
          icon: "",
          statusName: "Delivery failed",
          totalRecord: 0,
        },
        {
          id: 4,
          icon: "",
          statusName: "Returned",
          totalRecord: 0,
        },
      ],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        StartDate: "",
        EndDate: "",
        perPage: 10,
        pageNo: 1,
        search: "",
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      totalRowMessage: "",
      isDisable: false,
    };
  },
  created: async function() {
    await this.getList();
  },
  methods: {
    getList: async function() {
      this.isBusy = true;
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Finance/TransactionOverviewPeriod`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        if (data.detail.length > 0) {
          this.statementPeriodLists = data.detail;
          this.statementPeriod = this.statementPeriodLists[0];
          this.filter.StartDate = this.statementPeriod.startDate;
          this.filter.EndDate = this.statementPeriod.endDate;
        }
      }

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Finance/TransactionOverview`,
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
    getDataByStatus() {
      if (this.statementPeriod) {
        this.filter.StartDate = this.statementPeriod.startDate;
        this.filter.EndDate = this.statementPeriod.endDate;
      }
      // this.filter.OverView = status;
      // this.activeItem = status;
      this.getList();
    },
    isActive: function(menuItem) {
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
      //this.filter.statusId = value;
      this.getList();
    },
    onClearFilter() {
      this.filter.search = "";
      this.filter.pageNo = 1;
      this.filter.StartDate = null;
      this.filter.EndDate = null;

      this.$refs.filterSidebar.hide(true);
      this.getList();
    },
    saveQuestion() {},
  },
};
</script>

<style scoped>
.menuactive {
  color: #ffb300 !important;
}
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
</style>
