<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col sm="5" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">Dashboard</h1>
          <span class="f-18 font-weight-bold">{{ title }}</span>
        </b-col>
      </CRow>

      <div class="mt-3 bg-white py-3 py-sm-0">
        <div v-if="statusData">
          <div class="dashboard-status-box p-1">
            <div class="dashboard-status px-2 py-3">
              <p
                class="m-0 main-label my-auto one-line"
                v-if="type == 'performance'"
              >
                {{ $t("totalShare") }}
              </p>
              <p
                class="m-0 main-label my-auto one-line"
                v-else-if="type == 'campaign'"
              >
                {{ $t("totalJoinCampaign") }}
              </p>
              <p class="m-0 main-label my-auto one-line" v-else>
                {{ $t("totalShareProduct") }}
              </p>

              <p
                class="m-0 dashboard-status-value"
                v-if="type == 'performance'"
              >
                {{ statusData.totalShare | numeral("0,0") }}
              </p>
              <p
                class="m-0 dashboard-status-value"
                v-else-if="type == 'campaign'"
              >
                {{ statusData.totalJoinCampaign | numeral("0,0") }}
              </p>
              <p class="m-0 dashboard-status-value" v-else>
                {{ statusData.totalShareProduct | numeral("0,0") }} /
                {{ statusData.totalShareArticle | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div class="dashboard-status px-2 py-3">
              <p
                class="m-0 main-label my-auto one-line"
                v-if="type == 'performance'"
              >
                {{ $t("totalOrderDb") }}
              </p>
              <p
                class="m-0 main-label my-auto one-line"
                v-else-if="type == 'campaign'"
              >
                {{ $t("totalProductJoinCampaign") }}
              </p>
              <p class="m-0 main-label my-auto one-line" v-else>
                {{ $t("totalProduct") }}
              </p>

              <p
                class="m-0 dashboard-status-value"
                v-if="type == 'performance'"
              >
                {{ statusData.totalOrder | numeral("0,0") }}
              </p>
              <p
                class="m-0 dashboard-status-value"
                v-else-if="type == 'campaign'"
              >
                {{ statusData.totalProductJoinCampaign | numeral("0,0") }}
              </p>
              <p class="m-0 dashboard-status-value" v-else>
                {{ statusData.totalProduct | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div class="dashboard-status px-2 py-3">
              <p
                class="m-0 main-label my-auto one-line"
                v-if="type == 'performance'"
              >
                {{ $t("totalProductShare") }}
              </p>
              <p
                class="m-0 main-label my-auto one-line"
                v-else-if="type == 'campaign'"
              >
                {{ $t("revenueCampaign") }}
              </p>
              <p class="m-0 main-label my-auto one-line" v-else>
                {{ $t("totalProductChannel") }}
              </p>

              <p
                class="m-0 dashboard-status-value"
                v-if="type == 'performance'"
              >
                {{ statusData.totalProduct | numeral("0,0") }}
              </p>
              <p
                class="m-0 dashboard-status-value"
                v-else-if="type == 'campaign'"
              >
                {{ statusData.revenue | numeral("0,0") }}
              </p>
              <p class="m-0 dashboard-status-value" v-else>
                 <span
                  v-if="
                    statusData.totalProductChannel.channel != null
                  "
                  ><font-awesome-icon :icon="['fab', 'facebook-f']" v-if="statusData.totalProductChannel.channel.includes('facebook')" /></span
                ><span v-else>{{
                  statusData.totalProductChannel.channel
                }}</span> |
                {{ statusData.totalProductChannel.total | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div class="dashboard-status px-2 py-3">
              <p
                class="m-0 main-label my-auto one-line"
                v-if="type == 'performance'"
              >
                {{ $t("totalChashback") }}
              </p>
              <p
                class="m-0 main-label my-auto one-line"
                v-else-if="type == 'campaign'"
              >
                {{ $t("totalOrderCampaign") }}
              </p>
              <p class="m-0 main-label my-auto one-line" v-else>
                {{ $t("revenuePorductChanel") }}
              </p>

              <p
                class="m-0 dashboard-status-value"
                v-if="type == 'performance'"
              >
                {{ statusData.totalChashback | numeral("0,0") }}
              </p>
              <p
                class="m-0 dashboard-status-value"
                v-else-if="type == 'campaign'"
              >
                {{ statusData.totalOrder | numeral("0,0") }}
              </p>
              <p class="m-0 dashboard-status-value" v-else>
               <span
                  v-if="
                    statusData.revenuePorductChanel.channel != null
                  "
                  ><font-awesome-icon :icon="['fab', 'facebook-f']" v-if="statusData.revenuePorductChanel.channel.includes('facebook')" /></span
                ><span v-else>{{
                  statusData.revenuePorductChanel.channel
                }}</span> |
                {{ statusData.revenuePorductChanel.total | numeral("0,0") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 bg-white py-3 py-sm-0">
        <CRow class="no-gutters p-3">
          <b-col
            sm="6"
            class="text-center text-sm-left my-auto font-weight-bold f-18"
          >
            {{
              type == "campaign" ? $t("campaignListDb") : $t("productListDb")
            }}
          </b-col>
          <b-col sm="6" class="text-right">
            <div class="d-flex justify-content-end border-1">
              <b-input-group class="panel-input-serach">
                <b-form-input
                  class="input-serach"
                  :placeholder="
                    type == 'campaign' ? $t('campaignName') : $t('productName')
                  "
                  v-model="filter.search"
                  @keyup="handleSearch"
                ></b-form-input>
                <b-input-group-prepend @click="btnSearch">
                  <span class="icon-input m-auto pr-2">
                    <font-awesome-icon icon="search" title="View" />
                  </span>
                </b-input-group-prepend>
              </b-input-group>
            </div>
          </b-col>
        </CRow>

        <b-table
          class="table-list"
          striped
          responsive
          hover
          :items="items"
          :fields="fields"
          :busy="isBusy"
          show-empty
          empty-text="ไม่พบข้อมูล"
        >
          <template v-slot:cell(category)="data">
            <span
              v-if="data.item.category != null && data.item.category.length > 0"
              class=""
            >
              {{ addSign(data.item.category) }}</span
            >
            <span v-else>-</span>
          </template>
          <template v-slot:cell(startDate)="data">
            <div>
              <span
                >{{ new Date(data.item.startDate) | moment($formatDateTime) }} -
                {{ new Date(data.item.endDate) | moment($formatDateTime) }}
              </span>
            </div>
          </template>
          <template v-slot:cell(top1)="data">
            <span v-if="data.item.top1 != null && data.item.top1 != ''">
              {{ data.item.top1 }}</span
            >
            <span v-else>-</span>
          </template>
          <template v-slot:cell(top2)="data">
            <span v-if="data.item.top2 != null && data.item.top2 != ''">
              {{ data.item.top2 }}</span
            >
            <span v-else>-</span>
          </template>
          <template v-slot:cell(top3)="data">
            <span v-if="data.item.top3 != null && data.item.top3 != ''">
              {{ data.item.top3 }}</span
            >
            <span v-else>-</span>
          </template>
          <template v-slot:table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="ml-2">Loading...</strong>
            </div>
          </template></b-table
        >

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
import Timer from "../dashboard/components/countDownTimer";
import LineChart from "../dashboard/components/LineChart";

export default {
  components: {
    Timer,
    LineChart,
  },
  data() {
    return {
      statusData: null,
      performanceData: null,
      campaignData: null,
      filter: {
        PageNo: 1,
        PerPage: 10,
        search: "",
      },
      items: [],
      isBusy: false,
      rows: 0,
      fields: [],
      fieldsPerformance: [
        {
          key: "name",
          label: `${this.$t("productName")}`,
          class: "w-100px",
        },
        {
          key: "category",
          label: `${this.$t("category")}`,
          class: "w-100px",
        },
        {
          key: "shareCount",
          label: `${this.$t("shareCount")}`,
          class: "w-200",
        },
        {
          key: "viewCount",
          label: `${this.$t("viewCount")}`,
          class: "w-100px",
        },
        {
          key: "clickCount",
          label: `${this.$t("clickCount")}`,
          class: "w-100px",
        },
        {
          key: "conversion",
          label: `Conversion`,
          class: "w-100px",
        },
        {
          key: "conversionTHB",
          label: "Conversion (THB)",
          class: "w-100px",
        },
        {
          key: "cashBack",
          label: `${this.$t("cashBack")}`,
          class: "w-100px",
        },
      ],
      fieldsCampaign: [
        {
          key: "name",
          label: `${this.$t("campaignName")}`,
          class: "w-100px",
        },
        {
          key: "startDate",
          label: `${this.$t("startDate")} - ${this.$t("endDate")}`,
          class: "w-100px",
        },
        {
          key: "revenue",
          label: `${this.$t("revenue")}`,
          class: "w-200",
        },
        {
          key: "totalOrder",
          label: `${this.$t("sold")}`,
          class: "w-100px",
        },
      ],
      fieldsProductPerformance: [
        {
          key: "name",
          label: `${this.$t("name")}`,
          class: "w-100px",
        },
        {
          key: "category",
          label: `${this.$t("category")}`,
          class: "w-100px",
        },
        {
          key: "shareCount",
          label: `${this.$t("shareCount")}`,
          class: "w-100px",
        },
        {
          key: "clickCount",
          label: `${this.$t("clickCount")}`,
          class: "w-100px",
        },
        {
          key: "conversion",
          label: `Conversion`,
          class: "w-100px",
        },
        {
          key: "sold",
          label: `${this.$t("sold")}`,
          class: "w-100px",
        },
        {
          key: "conversionTHB",
          label: "Conversion (THB)",
          class: "w-100px",
        },
        {
          key: "top1",
          label: `${this.$t("top1")}`,
          class: "w-100px",
        },
        {
          key: "top2",
          label: `${this.$t("top2")}`,
          class: "w-100px",
        },
        {
          key: "top3",
          label: `${this.$t("top3")}`,
          class: "w-100px",
        },
      ],
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      type: "",
      title: "",
      path: "",
      pathTable: "",
      apiType: "",
      filterBox: null,
    };
  },
  watch: {
    "$route.path"(value) {
      this.type = value.split("/").pop();
      this.checkType();
      this.getDataBox();
      this.getDataList();
    },
  },
  created: async function () {
    await this.checkType();
    await this.getDataBox();
    await this.getDataList();
    this.$isLoading = true;
  },
  methods: {
    checkType: async function () {
      if (this.type == "") this.type = this.$route.path.split("/").pop();
      if (this.type == "performance") {
        this.path = "/PerformanceOverview";
        this.pathTable = "/PerformanceOverview/Products";
        this.title = this.$t("dbPerformance");
        this.fields = this.fieldsPerformance;
        this.filterBox = null;
        this.apiType = "get";
      } else if (this.type == "campaign") {
        this.path = "/Campaign";
        this.pathTable = "/Campaign/List";
        this.title = this.$t("dbCampaign");
        this.fields = this.fieldsCampaign;
        this.apiType = "get";
        this.filterBox = null;
      } else {
        this.path = "/ProductPerformance";
        this.pathTable = "/ProductPerformance/Products";
        this.title = this.$t("dbProductPerformance");
        this.fields = this.fieldsProductPerformance;
        this.apiType = "post";
        this.filterBox = {
          PageNo: 1,
          PerPage: 10,
          groupBy: "",
        };
      }
    },
    getDataBox: async function () {
      let resData = await this.$callApi(
        this.apiType,
        `${this.$baseUrl}/api/Dashboard${this.path}`,
        null,
        this.$headers,
        this.filterBox
      );
      if (resData.result == 1) {
        this.statusData = resData.detail;
      }
    },
    getDataList: async function () {
      this.isBusy = true;
      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Dashboard${this.pathTable}`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.items = resData.detail.dataList;
        this.rows = resData.detail.count;
      }
      this.isBusy = false;
    },
    pagination(Page) {
      this.filter.PageNo = Page;
      this.getDataList();
    },
    hanndleChangePerpage(value) {
      this.filter.PageNo = 1;
      this.filter.PerPage = value;
      this.getDataList();
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.PageNo = 1;
        this.getDataList();
      }
    },
    btnSearch() {
      this.filter.PageNo = 1;
      this.getDataList();
    },
  },
};
</script>


<style scoped>
.dashboard-status-box {
  width: 25%;
  display: inline-block;
}

.dashboard-status {
  border-radius: 5px;
  border: 1px solid #1085ff;
}

.dashboard-status-value {
  color: #1085ff;
  font-size: 20px;
  font-weight: bold;
}

.performance-box {
  width: 25% !important;
}

.performance-box div,
.campaign-data-box {
  border: 1px solid #dbdbdb;
}

.panel-input-serach {
  border-color: #092d53 !important;
}

@media (max-width: 991px) {
  .performance-box {
    width: 50% !important;
  }
}

@media (max-width: 767px) {
  .dashboard-status-box {
    width: 50%;
  }
}

@media (max-width: 600px) {
  /* .dashboard-status-box {
    width: 50%;
  } */
}
</style>