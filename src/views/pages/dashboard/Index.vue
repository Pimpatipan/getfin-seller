<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col sm="5" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">Dashboard</h1>
          <span class="f-18 font-weight-bold">{{
            $t("dbProductOverview")
          }}</span>
        </b-col>
      </CRow>

      <div class="mt-3 bg-white py-3 py-sm-0">
        <div v-if="statusData">
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">{{ $t("sold") }}</p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.sold | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("question") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.question | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">{{ $t("review") }}</p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.review | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("outOfStock") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.outOfStock | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("returnProduct") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.rejectProduct | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("waitForPay") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.waitForPay | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("waitForShip") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.waitForShip | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("waitForConfirm") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.waitForConfirm | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("returnRequest") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.returnRequest | numeral("0,0") }}
              </p>
            </div>
          </div>
          <div class="dashboard-status-box p-1">
            <div
              class="dashboard-status px-2 py-3 d-flex justify-content-between"
            >
              <p class="m-0 main-label my-auto one-line">
                {{ $t("codReject") }}
              </p>
              <p class="m-0 dashboard-status-value">
                {{ statusData.codReject | numeral("0,0") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 bg-white py-3 py-sm-0">
        <h1 class="mr-sm-4 header-main p-3">{{ $t("todayPerformance") }}</h1>
        <b-row no-gutters>
          <b-col md="6"
            ><LineChart
              :xData="lineChartData.label"
              :yData="lineChartData.data"
          /></b-col>
          <b-col md="6" class="m-auto">
            <b-row v-if="performanceData" no-gutters class="p-2">
              <b-col xl="6" class="dashboard-status-box p-1 performance-box">
                <div
                  class="dashboard-status px-2 py-3 d-flex justify-content-between w-100"
                >
                  <p class="m-0 main-label my-auto one-line w-50">
                    {{ $t("revenue") }}
                  </p>
                  <p class="m-0 dashboard-status-value w-50">
                    {{ performanceData.totalRevenue | numeral("0,0") }}
                  </p>
                </div>
              </b-col>
              <b-col xl="6" class="dashboard-status-box p-1 performance-box">
                <div
                  class="dashboard-status px-2 py-3 d-flex justify-content-between w-100"
                >
                  <p class="m-0 main-label my-auto one-line w-50">
                    {{ $t("view") }}
                  </p>
                  <p class="m-0 dashboard-status-value w-50">
                    {{ performanceData.totalView | numeral("0,0") }}
                  </p>
                </div>
              </b-col>
              <b-col xl="6" class="dashboard-status-box p-1 performance-box">
                <div
                  class="dashboard-status px-2 py-3 d-flex justify-content-between w-100"
                >
                  <p class="m-0 main-label my-auto w-50">
                    {{ $t("order") }}
                  </p>
                  <p class="m-0 dashboard-status-value w-50">
                    {{ performanceData.totalOrder | numeral("0,0") }}
                  </p>
                </div>
              </b-col>
              <b-col xl="6" class="dashboard-status-box p-1 performance-box">
                <div
                  class="dashboard-status px-2 py-3 d-flex justify-content-between w-100"
                >
                  <p class="m-0 main-label my-auto w-50">
                    {{ $t("avgOrder") }}
                  </p>
                  <p class="m-0 dashboard-status-value w-50">
                    {{ performanceData.averageOrder | numeral("0,0") }}%
                  </p>
                </div>
              </b-col>
            </b-row></b-col
          >
        </b-row>
      </div>

      <div class="mt-3 bg-white py-3 py-sm-0py-3">
        <h1 class="mr-sm-4 header-main px-3 mb-3">
          {{ $t("upcomingCampaign") }}
        </h1>
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div v-if="campaignData">
                <slick ref="slick" v-bind="slickOptions" v-if="campaignData">
                  <div
                    v-for="(item, key) in campaignData"
                    v-bind:key="key"
                    class="p-2"
                  >
                    <div class="campaign-data-box p-2">
                      <Timer
                        :startDate="item.startDateJoinCampaign"
                        :endDate="item.endDateJoinCampaign"
                        @handleExpired="handleExpired"
                      />
                      <div
                        class="image"
                        v-bind:style="{
                          'background-image': 'url(' + item.imageUrl + ')',
                        }"
                      ></div>

                      <p class="my-2 one-line f-18 font-weight-bold">
                        {{ item.name }}
                      </p>
                      <p class="mb-2 one-line f-14 text-secondary">
                        {{ item.startDateJoinCampaign | moment($formatDate) }} -
                        {{ item.endDateJoinCampaign | moment($formatDate) }}
                      </p>
                      <p class="two-lines">{{ item.shortDescription }}</p>
                      <div class="d-flex justify-content-between">
                        <router-link
                          class="btn btn-primary mr-2"
                          :to="`/campaign/info/${item.id}`"
                          >{{ $t("openDb") }}</router-link
                        >

                        <div class="ml-auto my-auto">
                          <span class="mr-2"
                            >{{ $t("sellerDb") }} :
                            {{ item.totalPartner }}</span
                          >
                          <span
                            >{{ $t("products") }} :
                            {{ item.totalProduct }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </slick>
              </div>
              <div v-else class="text-center f-16 p-5">
                {{ $t("noCampaign") }}
              </div>
            </div>
          </div>
        </div>
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
        pageNo: 1,
        perPage: 10,
        search: "",
      },
      slickOptions: {
        arrows: true,
        infinite: true,
        slidesToShow: 4,
        dots: false,
        initialSlide: 0,
        autoplaySpeed: 3000,
        responsive: [
           {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
      },
      lineChartData: {
        label: [],
        data: [],
      },
    };
  },
  created: async function () {
    await this.DashboardPerformance();
    await this.DashboardStatus();
    await this.UpcomingCampaign();
    this.$isLoading = true;
  },
  methods: {
    handleExpired: async function () { 
      this.campaignData = null;
      await this.UpcomingCampaign();
    },
    DashboardStatus: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Dashboard/DashboardStatus`,
        null,
        this.$headers,
        null
      );
      if (resData.result == 1) {
        this.statusData = resData.detail;
      }
    },
    DashboardPerformance: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Dashboard/Performance`,
        null,
        this.$headers,
        null
      );
      if (resData.result == 1) {
        this.performanceData = resData.detail;

        this.lineChartData.label = [];
        this.lineChartData.data = [];

        resData.detail.revenues.forEach(async (element, index) => {
          this.lineChartData.label[index] = this.$moment(
            element.createdTime
          ).format("DD MMM");
          this.lineChartData.data[index] = element.revenue;
        });
      }
    },
    UpcomingCampaign: async function () {
      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Dashboard/UpcomingCampaign`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.campaignData = resData.detail.dataList;
      }
    },
  },
};
</script>


<style scoped>
.dashboard-status-box {
  width: 20%;
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
  width: 25%;
  text-align: right;
}

.performance-box {
  width: 25% !important;
}

.performance-box div,
.campaign-data-box {
  border: 1px solid #dbdbdb;
}

.image {
  width: 100%;
  padding-top: 42.9%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

@media (max-width: 1200px) {
  .performance-box {
    width: 100% !important;
  }

  .dashboard-status-box {
    width: 50%;
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