<template>
  <div v-if="userReviewDetail">
    <b-row class="no-gutters bg-white">
      <b-col class="p-3">
        <b-row>
          <b-col md="4">
            <label class="main-label">{{$t('userReview')}}</label>
            <div class="d-flex" v-if="userReviewDetail.ratingOverAll">
              <h1 class="overall-num">{{userReviewDetail.ratingOverAll.rate}}</h1>
              <div class="ml-3">
                <span class="score overall-score">
                  <div class="score-wrap">
                    <span
                      class="stars-active"
                      :style="{'width': (userReviewDetail.ratingOverAll.percent)+'%'}"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'star']"
                        v-for="(item,index) in 5"
                        v-bind:key="index"
                      />
                    </span>
                    <span class="stars-inactive">
                      <font-awesome-icon
                        :icon="['far', 'star']"
                        v-for="(item,index) in 5"
                        v-bind:key="index"
                      />
                    </span>
                  </div>
                </span>
                <span
                  class="f-14"
                >{{$t('total')}} : {{userReviewDetail.ratingOverAll.count}} {{$t('review')}}</span>
              </div>
            </div>
          </b-col>
          <b-col md="4" class="mt-3 mt-md-0">
            <div class="mt-1" v-if="userReviewDetail.ratingAttribute.length > 0">
                <!-- <pre>{{userReviewDetail.ratingAttribute}}</pre> -->
              <span class="main-label f-14 ml-lg-3">{{$t('overall')}}</span>
              <!-- <div v-for="(item2, key2) in parseInt(5)"
                :key="key2">
                <pre>{{userReviewDetail.ratingAttribute[0].star[5-key2-1]}}</pre>
                </div> -->
              <ProgressRating
                v-for="(item2, key2) in parseInt(5)"
                :key="key2"
                :name="`${5-key2} ${$t('star')}${5-key2>1?'':''}`"
                :data="userReviewDetail.ratingAttribute[0].star[5-key2-1]"
              />
            </div>
          </b-col>
          <b-col md="4" class="mt-3 mt-md-0">
            <!-- <div class="mt-1" v-if="userReviewDetail.reviewScore.ratingAttribute.length != 0">
              <span class="main-label f-14 ml-lg-3">Result</span>
              <ProgressRating
                v-for="(item2, key2) in parseInt(5)"
                :key="key2"
                :name="`${5-key2} star${5-key2>1?'s':''}`"
                :data="userReviewDetail.reviewScore.ratingAttribute[1].star[5-key2-1][5-key2]"
              />
            </div>-->
          </b-col>
        </b-row>

        <div class="mt-3">
          <b-table
            responsive
            striped
            :fields="userReviewFields"
            :items="items"
            :busy="isBusyUserReview"
            show-empty
            :empty-text="$t('noData')"
            class="table-list"
          >
            <template v-slot:cell(createdTime)="data">
              <span>{{ new Date(data.item.createdTime) | moment($formatDate) }}</span>
            </template>
            <template v-slot:cell(rate)="data">
              <font-awesome-icon
                :icon="['fas', 'star']"
                v-for="(item,index) in data.item.rate"
                v-bind:key="index"
                class="stars"
              />
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-center">
                <b-button variant="link" class="px-1 py-0">
                  <router-link :to="'/review/details/'+ data.item.id" class="text-dark text-underline">
                     {{$t('check')}}
                  </router-link>
                </b-button>
              </div>
            </template>
          </b-table>
        </div>
        <b-row>
          <b-col class="form-inline justify-content-center justify-content-md-between">
            <b-pagination
              v-model="filterUserReview.PageNo"
              :total-rows="rows"
              :per-page="filterUserReview.PerPage"
              class="m-md-0"
              @change="pagination"
            ></b-pagination>
            <b-form-select
              v-model="filterUserReview.PerPage"
              @change="hanndleChangePerpage"
              :options="pageOptions"
              class="mr-sm-3 select-page"
            ></b-form-select>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import InputSelect from "@/components/inputs/InputSelect";
import Vue from "vue";
import * as moment from "moment/moment";
import ProgressRating from "./userreview/ProgressRating";

export default {
  name: "ProductUserReview",
  components: {
    InputSelect,
    ProgressRating,
  },
  data() {
    return {
      id: this.$route.params.id,
      items: [],
      isBusy: false,
      isBusyUserReview: false,
      rowsUserReview: 0,
      isDisable: false,
      stars: [],
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      userReviewFields: [
        {
          key: "createdTime",
          label: `${this.$t("dateTime")}`,
          class: "w-100px",
        },
        {
          key: "description",
          label: `${this.$t("review")}`,
          class: "w-200",
        },
        {
          key: "reviewBy",
          label: `${this.$t("reviewBy")}`,
          class: "w-100px",
        },
        {
          key: "rate",
          label: `${this.$t("rating")}`,
          class: "w-100px",
        },
        {
          key: "id",
          label: ``,
        },
      ],
      filterUserReview: {
        PageNo: 1,
        PerPage: 10,
        ReviewStatus: [0, 1],
        Search: "",
        startDate: "",
        endDate: "",
        productId: this.$route.params.id,
      },
      userReviewDetail: null,
      items: [],
      rows:0
    };
  },
  created: async function () {
    if (this.id != 0) {
      await this.getUserReview();
    }
  },
  methods: {
    moment: function () {
      return moment();
    },
    pagination(Page) {
      this.filterUserReview.pageNo = Page;
      this.getUserReview();
    },
    hanndleChangePerpage(value) {
      this.filterUserReview.pageNo = 1;
      this.filterUserReview.perPage = value;
      this.getUserReview();
    },
    getUserReview: async function () {
      this.isBusyUserReview = true;
      let datas = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Review/List`,
        null,
        this.$headers,
        this.filterUserReview
      );

      if (datas.result == 1) {
        this.items = datas.detail.dataList;
        this.rows = datas.detail.count;
        this.isBusyUserReview = false;
        this.$isLoading = true;
      }

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/${this.id}/reviewScore`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.userReviewDetail = data.detail;
        //this.checkRatingOverall();
      }
    },
    checkRatingOverall() {
      let overallRate = this.userReviewDetail.ratingOverAll.percent;

      if (overallRate % 20 != 0) {
        if (overallRate > 0 && overallRate < 20) {
          this.userReviewDetail.ratingOverAll.percent = 10;
        } else if (overallRate > 20 && overallRate < 40) {
          this.userReviewDetail.ratingOverAll.percent = 30;
        } else if (overallRate > 40 && overallRate < 60) {
          this.userReviewDetail.ratingOverAll.percent = 50;
        } else if (overallRate > 60 && overallRate < 80) {
          this.userReviewDetail.ratingOverAll.percent = 70;
        } else if (overallRate > 80 && overallRate < 100) {
          this.userReviewDetail.ratingOverAll.percent = 90;
        } else {
        }
      }
    },
  },
};
</script>

<style scoped>
.overall-score {
  height: 22px;
}

.overall-num {
  font-size: 38px;
}

.b-contain {
  background-size: contain;
  padding-bottom: 50%;
}

.b-contain-square {
  background-size: contain;
  padding-top: 50%;
}

.stock-image {
  padding-bottom: 56.25%;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.status-txt {
  line-height: 25px;
}

.score {
  display: block;
  position: relative;
  overflow: hidden;
}

.score-wrap {
  display: inline-block;
  position: relative;
  height: 19px;
}

.score .stars-active,
.stars {
  color: #ffb300;
  position: relative;
  z-index: 10;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}

.score .stars-inactive {
  color: #ffb300;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-text-stroke: initial;
  /* overflow: hidden; */
}

.user-review-img {
  width: 24%;
  padding-top: 24%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
  border: 2px dashed grey;
  margin: 3px;
}

.r-15 {
  right: 15px;
}

.lh-30 {
  line-height: 30px;
}

::v-deep .review-table table thead {
  background: #092d53;
}

@media (max-width: 767px) {
  .user-review-img {
    width: 24%;
    padding-top: 24%;
    margin: calc(1% - 3px);
  }
}
</style>