<template>
  <div>
    <form action>
      <b-row class="no-gutters bg-white">
        <b-col class="p-3">
          <div class>
            <b-table
              striped
              responsive
              hover
              :items="questionitems"
              :fields="questionFields"
              :busy="isBusyQuestion"
              show-empty
              :empty-text="$t('noData')"
              class="table-list"
            >
              <template v-slot:cell(questionTime)="data">
                <span>{{
                  new Date(data.item.questionTime) | moment($formatDate)
                }}</span>
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
                      class="text-dark text-underline"
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
          </div>
          <b-row>
            <b-col
              class="form-inline justify-content-center justify-content-md-between"
            >
              <b-pagination
                v-model="filterQuestion.pageNo"
                :total-rows="rows"
                :per-page="filterQuestion.perPage"
                class="m-md-0"
                @change="paginationQuestion"
              ></b-pagination>
              <b-form-select
                @change="hanndleChangePerpageQuestion"
                v-model="filterQuestion.perPage"
                :options="pageOptions"
                class="mr-sm-3 select-page"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
import * as moment from "moment/moment";
import HeaderLine from "@/components/HeaderLine";
import InputTextArea from "@/components/inputs/InputTextArea";

export default {
  name: "ProductQuestion",
  components: {
    HeaderLine,
    InputTextArea,
  },
  data() {
    return {
      id: this.$route.params.id,
      isDisable: false,
      isEdit: false,
      error: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      questionitems: [],
      answerVal: "",
      isBusyQuestion: false,
      isSuccess: false,
      checkAll: false,
      rows: 0,
      rowsQuestion: 0,
      selectAllVerifyCb: false,
      selectAllAnswerCb: false,
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      optionsQuestion: [
        { value: 0, text: "Earliest - Latest" },
        { value: 1, text: "Latest - Earliest" },
      ],
      sortByDefaultOptions: [
        { value: 0, text: "Please select an option" },
        { value: 1, text: "Sort Order" },
        { value: 2, text: "Created Time" },
      ],
      questionFields: [
        {
          key: "questionTime",
          label: `${this.$t("dateTime")}`,
          class: "w-100px",
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
          label: `${this.$t("answerStatus")}`,
          class: "w-100px",
        },
        {
          key: "id",
          label: "",
        },
      ],
      filterQuestion: {
        perPage: 10,
        pageNo: 1,
        verifyStatus: [0, 1],
        answerStatus: [],
        sortByDateTime: 1,
        search: "",
        startDate: "",
        endDate: "",
        productId: this.$route.params.id,
      },
      questionDetail: {
        id: 0,
        question: null,
        answer: null,
        questionBy: null,
        answerBy: null,
        questionTime: "0001-01-01T00:00:00",
        updatedTime: "0001-01-01T00:00:00",
        isVerify: false,
        isAnswer: false,
      },
    };
  },
  created: async function () {
    if (this.id != 0) {
      await this.getQuestionData();
    }
  },
  methods: {
    moment: function () {
      return moment();
    },
    getQuestionData: async function () {
      this.isBusyQuestion = true;
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/question/List`,
        null,
        this.$headers,
        this.filterQuestion
      );

      if (data.result == 1) {
        this.questionitems = data.detail.dataList;
        this.rows = data.detail.count;
        this.isBusyQuestion = false;
        this.$isLoading = true;
      }
    },
    editQuestion: async function (id) {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/question/${id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.questionDetail = data.detail;
      }

      this.answerVal = this.questionDetail.answer;

      this.$refs["questionModal"].show();
    },
    saveQuestion: async function () {
      this.isDisable = true;
      let dataModal = {
        id: this.questionDetail.id,
        answer: this.answerVal,
        isVerify: this.questionDetail.isVerify,
        isAnswer: this.questionDetail.isAnswer,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveQuestion`,
        null,
        this.$headers,
        dataModal
      );

      if (data.result == 1) {
        this.isDisable = false;
        this.getQuestionData();
      }

      this.$refs["questionModal"].hide();
    },
    paginationQuestion(Page) {
      this.filterQuestion.pageNo = Page;
      this.getQuestionData();
    },
    hanndleChangePerpageQuestion(value) {
      this.filterQuestion.pageNo = 1;
      this.filterQuestion.perPage = value;
      this.getQuestionData();
    },
    getQuestionDataByFilter() {
      this.$refs.filterSidebar.hide(true);
      this.getQuestionData();
    },
    checkVerifyLength() {
      if (this.filterQuestion.verifyStatus.length == 2) {
        this.selectAllVerifyCb = true;
      } else {
        this.selectAllVerifyCb = false;
      }
    },
    checkAllVerifyStatus() {
      if (this.selectAllVerifyCb) {
        this.filterQuestion.verifyStatus = [];
      } else {
        this.filterQuestion.verifyStatus = [1, 0];
      }
    },
    checkAnswerLength() {
      if (this.filterQuestion.answerStatus.length == 2) {
        this.selectAllAnswerCb = true;
      } else {
        this.selectAllAnswerCb = false;
      }
    },
    checkAllAnswerStatus() {
      if (this.selectAllAnswerCb) {
        this.filterQuestion.answerStatus = [];
      } else {
        this.filterQuestion.answerStatus = [1, 0];
      }
    },
  },
};
</script>