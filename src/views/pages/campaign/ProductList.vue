<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col sm="6" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 f-size-20 text-uppercase">
            {{ $t("addProductToCampaign") }}
            ( {{ campaign.name }} )
          </h1>
        </b-col>
        <b-col sm="6" class="text-right">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              :placeholder="$t('productName') + ', SKU'"
              v-model="filter.Search"
              @keyup="handleSearch"
            ></b-form-input>
            <b-input-group-prepend @click="btnSearch">
              <span class="icon-input m-auto pr-2">
                <font-awesome-icon icon="search" title="View" />
              </span>
            </b-input-group-prepend>
          </b-input-group>
        </b-col>
      </CRow>
      <div class="mt-3 bg-white">
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
              <template v-slot:cell(ids)="data">
                <b-form-checkbox
                  size="lg"
                  class="ml-3"
                  :value="data.item.id"
                  v-model="selected"
                ></b-form-checkbox>
              </template>

              <template v-slot:cell(imageUrl)="data">
                <div
                  class="image"
                  v-bind:style="{
                    'background-image': 'url(' + data.item.imageUrl + ')'
                  }"
                ></div>
              </template>
              <template v-slot:cell(sku)="data">
                <u class="m-0 text-primary">{{ data.item.sku }}</u>
              </template>

              <template v-slot:cell(price)="data">
                <p class="m-0">฿ {{ data.item.price | numeral("0,0.00") }}</p>
              </template>
              <!-- <template v-slot:cell(category)="data">
                <Category :categoryList="data.item.category" />
              </template> -->

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

        <b-row class="mt-4 px-3 py-2 btn-box no-gutters">
          <b-col md="4" class="text-white">
            <p class="mt-2 mb-0">
              {{ $t("productSelected") }} {{ selected.length }}
              {{ $t("productCount") }}
            </p>
          </b-col>
          <b-col md="8" class="text-sm-right">
            <router-link :to="'/campaign/details/' + id">
              <button
                type="button"
                class="btn btn-details-set btn-save-exit ml-md-2 text-uppercase"
              >
                {{ $t("cancel") }}
              </button>
            </router-link>
            <button
              :disabled="isDisable"
              @click="submit(0)"
              type="button"
              class="btn btn-details-set btn-save-exit ml-md-2 text-uppercase"
            >
              {{ $t("save") }}
            </button>
            <button
              :disabled="isDisable"
              @click="submit(1)"
              type="button"
              class="btn btn-details-set btn-save-exit ml-md-2 text-uppercase"
            >
              {{ $t("saveAndExit") }}
            </button>
          </b-col>
        </b-row>
      </div>
    </div>
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalLoading ref="modalLoading" :hasClose="false" />
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalLoading from "@/components/modal/alert/ModalLoading";
export default {
  name: "QuestionIndex",
  components: {
    ModalAlert,
    ModalAlertError,
    ModalLoading
  },
  data() {
    return {
      id: this.$route.params.id,
      statusList: [],
      modalMessage: "",
      activeItem: "",
      campaign: {},
      requestDeleteUser: {
        userId: null
      },
      form: {
        CampaignId: this.$route.params.id,
        Product: []
      },
      selected: [],
      selectedAll: false,
      checkAll: false,
      selectAllCb: false,
      fields: [
        {
          key: "ids",
          label: "#"
        },
        {
          key: "sku",
          label: `SKU`,
          class: "w-100px"
        },
        {
          key: "imageUrl",
          label: `${this.$t("thumbnail")}`,
          class: "w-200"
        },
        {
          key: "name",
          label: `${this.$t("productDetails")}`,
          class: "w-100px"
        },
        // {
        //   key: "category",
        //   label: `${this.$t("category")}`,
        //   class: "w-100px",
        //   tdClass: "text-left"
        // },
        {
          key: "stock",
          label: `${this.$t("stock")}`,
          class: "w-100px"
        },
        {
          key: "price",
          label: `${this.$t("currentPrice")}`,
          class: "w-100px"
        }
      ],
      items: [],
      isBusy: false,
      existId: 0,
      rows: 0,
      filter: {
        PageNo: 1,
        PerPage: 10,
        StartDate: null,
        EndDate: null,
        Status: [],
        Search: "",
        Sku: "",
        Category: []
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` }
      ],
      totalRowMessage: "",

      isDisable: true
    };
  },
  created: async function() {
    await this.getList();
    await this.getCampaignDetail();
    //await this.getAllList();
    this.$isLoading = true;
  },
  watch: {
    selected: function() {
      if (this.selected.length > 0) {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    }
  },
  methods: {
    getCampaignDetail: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Campaign/${this.$route.params.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.campaign = data.detail;
      }
    },
    getList: async function() {
      this.isBusy = true;

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Campaign/product/addProduct/${this.id}`,
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
    getAllList: async function() {
      // get ข้อมูลทั้งหมดมาใช้ตอนเช็คติ้ก
      let filterAll = {
        PageNo: 1,
        PerPage: -1,
        StartDate: null,
        EndDate: null,
        Status: [],
        Search: "",
        Sku: "",
        Category: []
      };
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Campaign/product/addProduct/${this.id}`,
        null,
        this.$headers,
        filterAll
      );

      if (data.result == 1) {
        this.allItems = data.detail.dataList;
      }
    },
    checkAllSelect() {
      if (!this.selectedAll) {
        this.filter.Status = [];
      } else {
        var list = this.statusList.slice(1);
        for (const item in list) {
          this.filter.Status.push(list[item].id);
        }
      }
    },
    submit: async function(flag) {
      this.$refs.modalLoading.show();
      this.isDisable = true;
      this.form.Product = this.selected;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Campaign/Product/SaveProduct`,
        null,
        this.$headers,
        this.form
      );

      this.modalMessage = data.message;
      this.isDisable = false;
      this.$refs.modalLoading.hide();
      if (data.result == 1) {
        this.$refs.modalAlert.show();

        if (flag == 0) {
          this.filter.Product = [];
          this.selected = [];
          this.getList();
        } else {
          setTimeout(() => {
            this.$router.push({
              path: `/campaign/details/${this.id}`
            });
          }, 3000);
        }
      } else {
        this.$refs.modalAlertError.show();
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
.menuactive {
  color: #ffb300 !important;
}

.image {
  width: 100%;
  padding-top: 42.9%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.f-size-20 {
  font-size: 20px;
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
