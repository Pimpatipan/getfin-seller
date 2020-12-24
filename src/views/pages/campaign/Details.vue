<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col sm="6" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">
            <!-- {{ $t("campaignDetails") }} -->
            {{ campaign.name }}
          </h1>
        </b-col>
        <b-col sm="6" class="text-right">
          <router-link :to="'/campaign/details/productlist/' + id">
            <b-button class="btn-main"
              >{{ $t("add") }}{{ $t("product") }}</b-button
            >
          </router-link>
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
              <template v-slot:cell(imageUrl)="data">
                <div
                  class="image"
                  v-bind:style="{
                    'background-image': 'url(' + data.item.imageUrl + ')'
                  }"
                ></div>
              </template>
              <template v-slot:cell(createdTime)="data">
                <span>{{
                  new Date(data.item.createdTime) | moment($formatDate)
                }}</span>
              </template>
              <template v-slot:cell(price)="data">
                <p class="m-0">฿ {{ data.item.price | numeral("0,0.00") }}</p>
              </template>
              <template v-slot:cell(categoryName)="data">
                <p class="m-0">{{ data.item.categoryName.join(" > ") }}</p>
              </template>
              <template v-slot:cell(campaignPrice)="data">
                <InputText
                  :textFloat="$t('campaignPrice')"
                  :placeholder="$t('campaignPrice')"
                  type="text"
                  name="campaignPrice"
                  isRequired
                  :isValidate="
                    $v.items.$each.$iter[data.index].campaignPrice.$error
                  "
                  :v="$v.items.$each.$iter[data.index].campaignPrice"
                  @onKeypress="isNumber($event)"
                  v-model="data.item.campaignPrice"
                />
              </template>
              <template v-slot:cell(saleStock)="data">
                <InputText
                  :textFloat="$t('stockToBuy')"
                  :placeholder="$t('stockToBuy')"
                  type="text"
                  name="stockToBuy"
                  isRequired
                  :isValidate="
                    $v.items.$each.$iter[data.index].saleStock.$error
                  "
                  :v="$v.items.$each.$iter[data.index].saleStock"
                  @onKeypress="isNumber($event)"
                  v-model="data.item.saleStock"
                />
              </template>
              <template v-slot:cell(id)="data">
                <div class="d-flex justify-content-center">
                  <b-button
                    variant="link"
                    class="text-dark px-1 py-0"
                    @click="deleteProduct(data.item)"
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
        <b-row class="p-2">
          <b-col>
            <router-link :to="'/campaign'">
              <button
                type="button"
                class="btn  btn-main btn-details-set  ml-md-2 text-uppercase"
              >
                {{ $t("cancel") }}
              </button>
            </router-link>
          </b-col>
          <b-col class="d-flex justify-content-end">
            <button
              :disabled="isDisable"
              @click="checkForm(0)"
              type="button"
              class="btn btn-main btn-details-set  ml-md-2 text-uppercase"
            >
              {{ $t("save") }}
            </button>
            <button
              :disabled="isDisable"
              @click="checkForm(1)"
              type="button"
              class="btn btn-main btn-details-set  ml-md-2 text-uppercase"
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

import InputText from "@/components/inputs/InputText";
import { required } from "vuelidate/lib/validators";
export default {
  name: "QuestionIndex",
  components: {
    ModalAlert,
    ModalAlertError,
    ModalLoading,
    InputText
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
      selected: [],
      isDisable: false,
      selectedAll: false,
      checkAll: false,
      selectAllCb: false,
      form: {
        Id: this.$route.params.id,
        Product: []
      },
      fields: [
        {
          key: "imageUrl",
          label: `${this.$t("thumbnail")}`,
          class: "w-200"
        },
        {
          key: "name",
          label: `${this.$t("productName")}`,
          class: "w-100px"
        },
        {
          key: "sku",
          label: `SKU`,
          class: "w-100px"
        },
        {
          key: "categoryName",
          label: `${this.$t("category")}`,
          class: "w-100px"
        },

        {
          key: "imageUrl",
          label: `${this.$t("category")}`,
          class: "w-100px"
        },
        {
          key: "price",
          label: `${this.$t("currentPrice")}`,
          class: "w-100px",
          tdClass: "text-left"
        },

        {
          key: "campaignPrice",
          label: `${this.$t("campaignPrice")}`,
          class: "w-100px"
        },
        {
          key: "stock",
          label: `${this.$t("stock")}`,
          class: "w-100px"
        },
        {
          key: "saleStock",
          label: `${this.$t("stockToBuy")}`,
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
        StartDate: null,
        EndDate: null,
        Status: [],
        Search: ""
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` }
      ],
      totalRowMessage: ""
    };
  },
  validations: {
    items: {
      $each: {
        campaignPrice: { required },
        saleStock: { required }
      }
    }

    // article: {
    //   sortOrder: { required },
    //   urlKey: { required },
    //   imageUrl: { required },
    //   translationList: {
    //     $each: {
    //       name: { required },
    //       shortDescription: { required },
    //       description: { required },
    //       metaTitle: { required },
    //       metaKeyword: { required },
    //       metaDescription: { required },
    //     },
    //   },
    // },
  },
  created: async function() {
    await this.getList();
    await this.getCampaignDetail();
    this.$isLoading = true;
  },
  computed: {},
  methods: {
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    category: async function(val) {
      let text = "";

      text = val.join(" > ");
      return text;
    },
    getList: async function() {
      this.isBusy = true;

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Campaign/product/${this.id}`,
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
    checkForm: async function(flag) {
      this.items.forEach(element => {
        this.form.Product.push({
          id: element.id,
          campaignPrice: element.campaignPrice,
          saleStock: element.saleStock
        });
      });
      this.$v.items.$touch();
      if (this.$v.items.$error) {
        return;
      }
      this.modalAlertShow = false;
      //this.flag = flag;
      this.$refs.modalLoading.show();
      this.submit(flag);
    },
    submit: async function(flag) {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Campaign/save`,
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
              path: `/campaign`
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
    },
    deleteProduct(product) {
      const index = this.items.indexOf(product);

      if (index > -1) {
        this.items.splice(index, 1);
      }
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
