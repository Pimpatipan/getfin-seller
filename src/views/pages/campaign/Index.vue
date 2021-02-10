<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col sm="6" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">
            {{ $t("campaign") }}
          </h1>
        </b-col>
      </CRow>
      <b-row class="no-gutters px-3 px-sm-0 mt-2 mb-3">
        <b-col class="overflow-auto">
          <b-button-group
            class="btn-group-status d-inline-flex d-inline-md-block"
          >
            <b-button
              :class="{ menuactive: isActive('Available Campaign') }"
              @click="handleActiveItem('Available Campaign')"
            >
              {{ $t("avaliableCampaign") }}</b-button
            >
            <b-button
              :class="{ menuactive: isActive('Registered Campaign') }"
              @click="handleActiveItem('Registered Campaign')"
              >{{ $t("registeredCampaign") }}</b-button
            >
          </b-button-group>
        </b-col>
      </b-row>
      <div class="mt-3 bg-white p-3 p-sm-0">
        <b-row class="no-gutters ">
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
              <template v-slot:cell(imageUrl)="data">
                <div
                  class="image b-contain"
                  v-bind:style="{
                    'background-image': 'url(' + data.item.imageUrl + ')'
                  }"
                ></div>
              </template>
              <template v-slot:cell(endDateJoinCampaign)="data">
                <div>
                  <span
                    >{{
                      new Date(data.item.endDateJoinCampaign)
                        | moment($formatDateTime)
                    }}
                  </span>
                </div>
                <div>
                  <TimeCounter :endDate="data.item.endDateJoinCampaign" />
                </div>
              </template>
              <template v-slot:cell(startDateCampaign)="data">
                <div>
                  <span class="text-danger"> {{ $t("start") }} : </span
                  >{{
                    new Date(data.item.startDateCampaign)
                      | moment($formatDateTime)
                  }}
                </div>
                <div>
                  <span class="text-primary"> {{ $t("end") }} : </span
                  >{{
                    new Date(data.item.endDateCampaign)
                      | moment($formatDateTime)
                  }}
                </div>
              </template>
              <template v-slot:cell(id)="data">
                <div class="d-flex justify-content-center">
                  <b-button
                    variant="link"
                    class="px-1 py-0"
                    v-if="activeItem == 'Available Campaign'"
                  >
                    <router-link :to="'/campaign/info/' + data.item.id">
                      <u class="text-primary">{{ $t("join") }}</u>
                    </router-link>
                  </b-button>
                  <b-button variant="link" class="px-1 py-0" v-else>
                    <router-link :to="'/campaign/details/' + data.item.id">
                      <u class="text-primary">{{ $t("details") }}</u>
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

              <div class="ml-2">
                <p class="total-record-paging text-nowrap text-center">
                  {{ totalRowMessage }}
                </p>
              </div>
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
import * as moment from "moment/moment";
import TimeCounter from "../campaign/component/TimeCountdown";
export default {
  name: "QuestionIndex",
  components: {
    TimeCounter
  },
  data() {
    return {
      statusList: [],
      modalMessage: "",
      activeItem: "",
      requestDeleteUser: {
        userId: null
      },
      fields: [
        {
          key: "imageUrl",
          label: `${this.$t("thumbnail")}`,
          class: "w-200"
        },
        {
          key: "campaignName",
          label: `${this.$t("campaignName")}`,
          class: "w-100px"
        },

        {
          key: "endDateJoinCampaign",
          label: `${this.$t("regisCloseIn")}`,
          class: "w-100px"
        },
        {
          key: "startDateCampaign",
          label: `${this.$t("campaignPeriod")}`,
          class: "w-200"
        },
        {
          key: "id",
          label: "",
          class: "w-100px"
        }
      ],
      items: [],
      isBusy: false,
      rows: 0,
      forceRefresh: true,
      timeLeft: "00:00",
      filter: {
        PageNo: 1,
        PerPage: 10,
        StartDate: null,
        EndDate: null,
        Status: [1],
        Search: "",
        IsJoin: false
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` }
      ],
      totalRowMessage: "",

      isDisable: false
    };
  },
  created: async function() {
    this.$isLoading = false;
    await this.getList();

    this.activeItem = "Available Campaign";
  },

  methods: {
    moment: function() {
      return moment();
    },
    handleActiveItem(val) {
      this.activeItem = val;
      if (this.activeItem == "Available Campaign") {
        this.filter.IsJoin = false;
        this.filter.Status = [1];
      } else {
        this.filter.IsJoin = true;
        this.filter.Status = [4];
      }
      this.getList();
    },
    getList: async function() {
      this.isBusy = true;

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Campaign/list`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.items = resData.detail.dataList;
        this.rows = resData.detail.count;
        //this.statusList = resData.detail.overviewCount;
        this.$isLoading = true;

        this.isBusy = false;
      }
    },
    onCampaignCount(endDateJoinCampaign, timeLeft) {
      var countDownDate = new Date(this.moment(endDateJoinCampaign)).getTime();
      setInterval(() => {
        var now = new Date().getTime();

        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) {
          hours = "0" + hours;
        }

        if (minutes < 10) {
          minutes = "0" + minutes;
        }

        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        timeLeft =
          days + "d : " + hours + "h : " + minutes + "m : " + seconds + "s";
        // this.timeLeft = days + "วัน " + hours + " : " + minutes + " : " + seconds + "";

        if (distance < 0) {
          clearInterval();
          timeLeft = "EXPIRED";
        }
        this.forceRefresh = true;
      }, 1000);

      return timeLeft;

      //  var countDownDate = new Date(date).getTime();
    },
    getDataByStatus(status) {
      this.filter.OverView = status;
      this.activeItem = status;
      this.getList();
    },
    isActive: function(menuItem) {
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
    hanndleStatusList(value) {
      this.filter.PageNo = 1;
      this.filter.statusId = value;
      this.getList();
    }
  }
};
</script>

<style scoped>
.image {
  width: 50%;
  padding-top: 50%;
  margin: auto;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
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
