<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col sm="4" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">
            {{ $t("reviewList") }}
          </h1>
        </b-col>
        <b-col sm="8" class="text-right">
          <div class="d-flex">
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

            <b-button v-b-toggle.sidebar-1 class="ml-2 btn-filter">
              <font-awesome-icon
                icon="filter"
                title="filter-btn"
                class="text-white mr-0 mr-sm-1"
              />
              <span
                class="d-none d-sm-inline font-weight-bold text-uppercase"
                >{{ $t("filter") }} ({{ countStartdate + countEnddate }})</span
              >
            </b-button>
          </div>
        </b-col>
      </CRow>
      <b-sidebar
        id="sidebar-1"
        title="FILTER"
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

          <label class="label-text">{{ $t("startDate") }}</label>
          <datetime
            :placeholder="$t('startDate')"
            class="date-picker"
            v-model="filter.startDate"
            format="dd MMM yyyy"
          ></datetime>

          <label class="label-text">{{ $t("endDate") }}</label>
          <datetime
            :placeholder="$t('endDate')"
            class="date-picker"
            v-model="filter.endDate"
            format="dd MMM yyyy"
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
          <b-button-group class="btn-group-status d-inline-block">
            <b-button
              v-for="(item, index) in statusList"
              :key="index"
              @click="getDataByClickStatus(item.name, item.id)"
              :class="{ menuactive: isActive(item.id) }"
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
              <template v-slot:cell(createdTime)="data">
                <span>{{
                  new Date(data.item.createdTime) | moment($formatDate)
                }}</span>
              </template>
              <template v-slot:cell(imageUrl)="data">
                <div class="row no-gutters">
                  <div class="col-6">
                    <div
                      class="square-box b-contain"
                      v-bind:style="{
                        'background-image': 'url(' + data.item.imageUrl + ')',
                      }"
                    ></div>
                  </div>
                  <div class="col-6">
                    <div class="review-shortdesc">
                      <p class="font-weight-bold mb-1">
                        SKU: {{ data.item.sku }}
                      </p>
                      <p class="m-0 three-lines">
                        {{ data.item.shortDescription }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:cell(reviewStatus)="data">
                <div
                  v-if="
                    data.item.reviewStatus == 'รอการรีวิว' ||
                    data.item.reviewStatus == 'To Be Review'
                  "
                  class="text-warning"
                >
                  {{ data.item.reviewStatus }}
                </div>
                <div v-else class="text-success">
                  {{ data.item.reviewStatus }}
                </div>
              </template>
              <template v-slot:cell(id)="data">
                <div class="d-flex justify-content-center">
                  <b-button variant="link" class="px-1 py-0">
                    <router-link
                      :to="'/review/details/' + data.item.id"
                      class="text-dark"
                    >
                      {{ $t("check") }}
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
  name: "QuestionIndex",
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
          key: "invoiceNo",
          label: `${this.$t("orderNo")}`,
          class: "w-100px",
        },
        {
          key: "imageUrl",
          label: `${this.$t("product")}`,
          class: "w-200",
          tdClass: "text-left",
        },
        {
          key: "description",
          label: `${this.$t("review")}`,
          class: "w-200",
        },
        {
          key: "createdTime",
          label: `${this.$t("dateTime")}`,
          class: "w-100px",
        },
        {
          key: "reviewStatus",
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
        ReviewStatus: [0],
        Search: "",
        startDate: "",
        endDate: "",
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
  methods: {
    getList: async function () {
      this.isBusy = true;

      let status = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Review/ReviewStatusWithCount`,
        null,
        this.$headers,
        null
      );
      if (status.result == 1) {
        this.statusList = status.detail;
      }

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Review/List`,
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
    isActive: function (menuItem) {
      return this.activeItem == menuItem;
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
    getDataByClickStatus(status, id) {
      this.activeItem = id;
      this.filter.ReviewStatus = [];
      this.filter.ReviewStatus.push(id);
      this.getList();
    },
    onClearFilter() {
      this.filter.pageNo = 1;
      this.filter.startDate = "";
      this.filter.endDate = "";
      this.$refs.filterSidebar.hide(true);
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
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filter.ReviewStatus = [];
      } else {
        this.filter.ReviewStatus = [1, 0];
      }
    },
    checkStatusLength() {
      if (this.filter.ReviewStatus.length == 2) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
  },
};
</script>

<style scoped>
.menuactive {
  color: #ffb300 !important;
}

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
