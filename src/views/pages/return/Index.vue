<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col xl="6" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">
            {{ $t("returnList") }}
          </h1>
        </b-col>
        <b-col xl="6" class="text-right">
          <div class="d-flex justify-content-end">
            <b-input-group class="panel-input-serach">
              <b-form-input
                class="input-serach"
                :placeholder="$t('orderNo')"
                v-model="filter.Search"
                @keyup="handleSearch"
              ></b-form-input>
              <b-input-group-prepend @click="btnSearch">
                <span class="icon-input m-auto pr-2">
                  <font-awesome-icon icon="search" title="View" />
                </span>
              </b-input-group-prepend>
            </b-input-group>
            <b-button
              v-b-toggle.sidebar-1
              class="ml-2 btn-filter btn-filter-faq"
            >
              <font-awesome-icon
                icon="filter"
                title="filter-btn"
                class="text-white mr-0 mr-sm-1"
              />
              <span class="d-none d-sm-inline one-line"
                >{{ $t("filter") }} ({{ countStartdate + countEnddate }})</span
              >
            </b-button>
          </div>
        </b-col>
      </CRow>
      <b-row class="no-gutters px-3 px-sm-0 mt-2">
        <b-col class="overflow-auto">
          <b-button-group class="btn-group-status d-inline-block">
            <b-button
              v-for="(item, index) in statusList"
              :key="index"
              @click="getDataByClickStatus(item.name, item.id)"
              :class="{ menuactive: isActive(item.id) }"
              >{{ item.name }} ({{ item.value }})</b-button
            >
          </b-button-group>
        </b-col>
      </b-row>
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

          <div>
            <label class="label-text mb-3">{{ $t("returnTime") }}</label>
          </div>

          <label class="label-text">{{ $t("startDate") }}</label>
          <datetime
            :placeholder="$t('selectDate')"
            class="date-picker"
            v-model="filter.startDate"
            format="dd MMM yyyy HH:mm"
            type="datetime"
          ></datetime>

          <label class="label-text">{{ $t("endDate") }}</label>
          <datetime
            :placeholder="$t('selectDate')"
            class="date-picker"
            v-model="filter.endDate"
            format="dd MMM yyyy HH:mm"
            type="datetime"
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
      <div class="mt-3 bg-white p-3 p-sm-0">
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
              <template v-slot:cell(orderNo)="data">
                <router-link :to="'/order/details/' + data.item.orderId">
                  <span>{{ data.item.orderNo }}</span>
                </router-link>
              </template>
              <template v-slot:cell(returnNo)="data">
                <div
                  v-if="data.item.returnNo == '' || data.item.returnNo == null"
                >
                  -
                </div>
                <div v-else>{{ data.item.returnNo }}</div>
              </template>
              <template v-slot:cell(customerDetail)="data">
                <div class="text-left">
                  <p class="font-weight-bold mb-1">
                    {{ data.item.customerDetail.firstname }}
                    {{ data.item.customerDetail.lastname }}
                    <span>
                      <font-awesome-icon
                        icon="comment"
                        title="chat"
                        class="pointer text-warning"
                        @click="directToChat(data.item)"
                      ></font-awesome-icon>
                    </span>
                  </p>

                  <p class="m-0">{{ data.item.customerDetail.email }}</p>
                  <p class="m-0">{{ data.item.customerDetail.telephone }}</p>
                </div>
              </template>
              <template v-slot:cell(dateTimePurchase)="data">
                <span>
                  {{
                    new Date(data.item.dateTimePurchase)
                      | moment($formatDateTime)
                  }}
                </span>
              </template>
              <template v-slot:cell(dateTimeReturn)="data">
                <span>
                  {{
                    new Date(data.item.dateTimeReturn) | moment($formatDateTime)
                  }}
                </span>
              </template>
              <template v-slot:cell(orderStatus)="data">
                <div v-if="data.item.returnStatusId == 4" class="text-success">
                  {{ data.item.orderStatus }}
                </div>
                <div
                  v-else-if="data.item.returnStatusId == 3"
                  class="text-danger"
                >
                  {{ data.item.orderStatus }}
                </div>
                <div
                  v-else-if="data.item.returnStatusId == 2"
                  class="text-info"
                >
                  {{ data.item.orderStatus }}
                </div>
                <div v-else class="text-warning">
                  {{ data.item.orderStatus }}
                </div>
              </template>
              <template v-slot:cell(orderId)="data">
                <div class="d-flex justify-content-center">
                  <b-button variant="link" class="px-1 py-0">
                    <router-link :to="'/return/details/' + data.item.orderId">
                      {{ $t("details") }}
                    </router-link>
                  </b-button>
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
  </div>
</template>

<script>
export default {
  name: "ReturnIndex",
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
          class: "w-100px",
        },
        {
          key: "returnNo",
          label: `${this.$t("returnNo")}`,
          class: "w-100px",
        },
        {
          key: "customerDetail",
          label: `${this.$t("customerDetails")}`,
          class: "w-100px",
          tdClass: "text-left",
        },
        {
          key: "dateTimePurchase",
          label: `${this.$t("purchaseTime")}`,
          class: "w-100px",
        },
        {
          key: "dateTimeReturn",
          label: `${this.$t("returnTime")}`,
          class: "w-100px",
        },
        {
          key: "orderStatus",
          label: `${this.$t("status")}`,
          class: "w-100px",
        },
        {
          key: "orderId",
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
        startDate: "",
        endDate: "",
        Search: "",
        Status: [1],
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      isBusy: false,
      isDisable: false,
      errorDate: false,
    };
  },
  computed: {
    countStartdate: function () {
      var count = 0;
      if (this.filter.startDate != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
    countEnddate: function () {
      var count = 0;

      if (this.filter.endDate != "") count += 1;
      else if (count > 0) count -= 1;
      return count;
    },
  },
  created: async function () {
    await this.getStatusList();
    await this.getList();
    this.$isLoading = true;
  },
  methods: {
    directToChat(data) {
      let buyerdata = {
        chatId: data.chatId,
        firstname: data.customerDetail.firstname,
        lastname: data.customerDetail.lastname,
        email: data.customerDetail.email,
        photoUrl: data.imageUrl,
      };
      this.$store.commit("setOtherProfile", buyerdata);
      setTimeout(() => {
        this.$router.push({
          path: "/chat",
        });
      }, 500);
    },
    getStatusList: async function () {
      let status = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Transaction/ReturnOrder/OrderStatus`,
        null,
        this.$headers,
        null
      );

      if (status.result == 1) {
        this.statusList = status.detail;
        this.activeItem = status.detail[0].id;
      }
    },
    getList: async function () {
      this.isBusy = true;

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Transaction/ReturnOrder`,
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
    isActive: function (menuItem) {
      return this.activeItem == menuItem;
    },
    getDataByClickStatus(status, id) {
      this.activeItem = id;
      this.filter.Status = [];
      this.filter.Status.push(id);

      this.getList();
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
    hanndleStatusList(value) {
      this.filter.PageNo = 1;
      this.filter.statusId = value;
      this.getList();
    },
    onClearFilter() {
      this.filter.pageNo = 1;
      this.filter.startDate = "";
      this.filter.endDate = "";
      this.$refs.filterSidebar.hide(true);
      this.getList();
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
</style>
