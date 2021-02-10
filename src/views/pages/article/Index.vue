<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col xl="4" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">
            {{ $t("article") }}
          </h1>
        </b-col>
        <b-col xl="8" class="text-right">
          <div class="d-flex justify-content-end">
            <b-input-group class="panel-input-serach">
              <b-form-input
                class="input-serach"
                :placeholder="$t('articleName')"
                v-model="filter.Search"
                @keyup="handleSearch"
              ></b-form-input>
              <b-input-group-prepend @click="btnSearch">
                <span class="icon-input m-auto pr-2">
                  <font-awesome-icon icon="search" title="View" />
                </span>
              </b-input-group-prepend>
            </b-input-group>
            <router-link to="/article/details/0">
              <b-button class="btn-main">{{ $t("createArticle") }}</b-button>
            </router-link>
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
              Clear
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
              <template v-slot:cell(imageUrl)="data">
                <div
                  class="image ratio-4-3-pt b-contain"
                  v-bind:style="{
                    'background-image': 'url(' + data.item.imageUrl + ')'
                  }"
                ></div>
              </template>
              <template v-slot:cell(updatedTime)="data">
                <span>{{
                  new Date(data.item.updatedTime) | moment($formatDateTime)
                }}</span>
              </template>
              <template v-slot:cell(enabled)="data">
                <div v-if="data.item.enabled == true" class="text-success">
                  {{ $t("display") }}
                </div>
                <div v-else class="text-danger">{{ $t("notdisplay") }}</div>
              </template>
              <template v-slot:cell(sortOrder)="data">
                <div v-if="data.item.sortOrder == 0">-</div>
                <div v-else>{{ data.item.sortOrder }}</div>
              </template>
              <template v-slot:cell(shortDescription)="data">
                <p class="m-0 three-lines">
                  {{ data.item.shortDescription }}
                </p>
              </template>
              <template v-slot:cell(id)="data">
                <div class="d-flex justify-content-center">
                  <router-link :to="'/article/details/' + data.item.id">
                    <b-button variant="link" class="text-dark px-1 py-0">
                      {{ $t("edit") }}
                    </b-button>
                  </router-link>
                  <b-button
                    variant="link"
                    class="text-dark px-1 py-0"
                    @click="openModalDelete(data.item)"
                  >
                    {{ $t("delete") }}
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
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalAlertConfirm
      msg="ยืนยันการลบ ?"
      :text="modalMessage"
      btnConfirm="Delete"
      colorBtnConfirm="danger"
      btnCancel="Close"
      ref="ModalAlertConfirm"
      @confirm="btnDelete"
    />
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalAlertConfirm from "@/components/modal/alert/ModalAlertConfirm";
export default {
  name: "QuestionIndex",
  components: {
    ModalAlert,
    ModalAlertError,
    ModalAlertConfirm
  },
  data() {
    return {
      statusList: [],
      modalMessage: "",
      activeItem: "",

      requestDeleteArticle: {
        id: null
      },
      fields: [
        {
          key: "imageUrl",
          label: `${this.$t("thumbnail")}`,
          class: "w-100px"
        },
        {
          key: "name",
          label: `${this.$t("articleName")}`,
          class: "w-100px"
        },
        {
          key: "shortDescription",
          label: `${this.$t("articleDesc")}`,
          class: "w-200"
        },
        {
          key: "sortOrder",
          label: `${this.$t("sortOrder")}`,
          class: "w-100px"
        },
        {
          key: "updatedTime",
          label: `${this.$t("createDate")}`,
          class: "w-100px"
        },
        {
          key: "enabled",
          label: `${this.$t("articleStatus")}`,
          class: "w-100px"
        },
        {
          key: "id",
          label: ""
        }
      ],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        PageNo: 1,
        PerPage: 10,
        Search: ""
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
    await this.getList();
  },
  methods: {
    getList: async function() {
      this.isBusy = true;
      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/article/list`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.items = resData.detail.dataList;
        this.rows = resData.detail.totalData;
        this.statusList = resData.detail.overviewCount;

        this.isBusy = false;
        this.$isLoading = true;
      }
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
      this.filter.pageNo = 1;
      this.filter.perPage = value;
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
    openModalDelete(value) {
      this.requestDeleteArticle.id = value.id;
      this.modalMessage = "คุณต้องการลบ " + value.name + " ใช่หรือไม่?";
      this.$refs.ModalAlertConfirm.show();
    },
    btnDelete: async function() {
      this.$refs.ModalAlertConfirm.hide();
      let resData = await this.$callApi(
        "delete",
        `${this.$baseUrl}/api/product/article/delete/${this.requestDeleteArticle.id}`,
        null,
        this.$headers,
        null
      );
      this.modalMessage = resData.message;
      if (resData.result == 1) {
        this.$refs.modalAlert.show();
        this.filter.Page = 1;
        setTimeout(() => {
          this.$refs.modalAlert.hide();
        }, 3000);
        await this.getList();
      } else {
        this.$refs.modalAlertError.show();
      }
    },
    saveQuestion() {}
  }
};
</script>

<style scoped>
.article-modal {
  height: calc(100vh - 200px);
  overflow-y: auto;
}
.image {
  width: 100%;
  padding-top: 42.9%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
