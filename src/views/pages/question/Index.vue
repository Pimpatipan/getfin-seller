<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col xl="4" class="text-center text-md-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">
            {{ $t("question") }}
          </h1>
        </b-col>
        <b-col xl="8" class="text-right">
          <div class="d-flex">
            <b-input-group class="panel-input-serach">
              <b-form-input
                class="input-serach"
                :placeholder="$t('productName')"
                v-model="filter.Search"
                @keyup="handleSearch"
              ></b-form-input>
              <b-input-group-prepend @click="btnSearch">
                <span class="icon-input m-auto pr-2">
                  <font-awesome-icon icon="search" title="View" />
                </span>
              </b-input-group-prepend>
            </b-input-group>

            <b-form-select
              v-model="filter.sortByDateTime"
              :options="optionsQuestion"
              class="w-300"
              valueField="value"
              textField="text"
              @change="getList"
            ></b-form-select>

            <b-button v-b-toggle.sidebar-1 class="ml-2 btn-filter">
              <font-awesome-icon
                icon="filter"
                title="filter-btn"
                class="text-white mr-0 mr-sm-1"
              />
              <span class="d-none d-sm-inline font-weight-bold text-uppercase"
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
              >{{ item.name }} ({{ item.count }})</b-button
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

          <label class="label-text">{{ $t("startDate") }}</label>
          <datetime
            :placeholder="$t('selectDate')"
            class="date-picker"
            v-model="filter.startDate"
            format="dd MMM yyyy"
          ></datetime>

          <label class="label-text">{{ $t("endDate") }}</label>
          <datetime
            :placeholder="$t('selectDate')"
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
      <div class="mt-3 bg-white py-3 py-sm-0">
        <b-row class="no-gutters px-3 px-sm-0">
          <b-col>
            <b-table
              striped
              responsive
              hover
              :items="questionitems"
              :fields="questionFields"
              :busy="isBusy"
              show-empty
              :empty-text="$t('noQuestion')"
              class="table-list"
            >
              <template v-slot:cell(questionTime)="data">
                <span>
                  {{ new Date(data.item.questionTime) | moment($formatDate) }}
                </span>
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
                    <div class="review-shortdesc text-left">
                      <p class="font-weight-bold mb-1">
                        SKU:
                        <span class="font-weight-normal">{{
                          data.item.sku
                        }}</span>
                      </p>
                      <p class="m-0">{{ data.item.productName }}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:cell(isVerify)="data">
                <div v-if="data.item.isVerify == true" class="text-success">
                  Verified
                </div>
                <div v-else class="text-danger">Not Verified</div>
              </template>
              <template v-slot:cell(questionBy)="data">
                <div v-if="data.item.questionBy == ' '">-</div>
                <div v-else>{{ data.item.questionBy }}</div>
              </template>
              <template v-slot:cell(isAnswer)="data">
                <div v-if="data.item.isAnswer == true" class="text-success">
                  {{ $t("answer") }}
                </div>
                <div v-else class="text-warning">{{ $t("waitForAns") }}</div>
              </template>
              <template v-slot:cell(id)="data">
                <div class="d-flex justify-content-center">
                  <b-button variant="link" class="px-1 py-0">
                    <router-link
                      :to="'/question/details/' + data.item.id"
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
        <b-row class="no-gutters px-3 pt-3 px-sm-0">
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
    </div>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import Vue from "vue";

export default {
  name: "QuestionIndex",
  components: {
    InputText,
    InputTextArea,
  },
  data() {
    return {
      statusList: [],
      modalMessage: "",
      activeItem: 0,
      requestDeleteUser: {
        userId: null,
      },
      questionFields: [
        {
          key: "questionTime",
          label: `${this.$t("dateTime")}`,
          class: "w-100px",
        },
        {
          key: "imageUrl",
          label: `${this.$t("productName")}`,
          class: "w-200",
        },
        {
          key: "question",
          label: `${this.$t("question")}`,
          class: "w-200",
        },
        {
          key: "questionBy",
          label: `${this.$t("questionBy")}`,
          class: "w-100px",
        },
        {
          key: "isAnswer",
          label: `${this.$t("status")}`,
          class: "w-100px",
        },
        {
          key: "id",
          label: "",
          class: "w-100px",
        },
      ],
      optionsQuestion: [
        { value: 0, text: `${this.$t("oldToNew")}` },
        { value: 1, text: `${this.$t("newToOld")}` },
      ],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        perPage: 10,
        pageNo: 1,
        verifyStatus: [0, 1],
        answerStatus: [0],
        sortByDateTime: 0,
        search: "",
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
      questionitems: [],
      answerVal: "",
      isDisable: false,
      questionDetail: {},
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
        `${this.$baseUrl}/api/Question/QuestionStatusWithCount`,
        null,
        this.$headers,
        null
      );
      if (status.result == 1) {
        this.statusList = status.detail;
        this.statusList.reverse();
      }

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/question/List`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.questionitems = resData.detail.dataList;
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
      this.filter.answerStatus = [];
      if (id != 2) this.filter.answerStatus.push(id);
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
        this.filter.answerStatus = [];
      } else {
        this.filter.answerStatus = [1, 0];
      }
    },
    checkStatusLength() {
      if (this.filter.answerStatus.length == 2) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
  },
};
</script>

