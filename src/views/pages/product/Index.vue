<template>
  <div>
    <div class="min-vh-100 container-box">
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col xl="4" class="text-center text-sm-left mb-3 mb-xl-0 mt-3 mt-sm-0">
          <h1 class="mr-sm-4 header-main text-uppercase mb-0">
            {{ $t("product") }}
          </h1>
        </b-col>
        <b-col xl="8" class="text-right">
          <div class="d-flex justify-content-end">
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

            <router-link to="/product/details/0">
              <b-button class="btn-main">{{ $t("create") }}</b-button>
            </router-link>
          </div>
        </b-col>
      </CRow>
      <b-row class="no-gutters px-3 px-sm-0 mt-2">
        <b-col class="overflow-auto">
          <b-button-group
            class="btn-group-status d-inline-flex d-inline-md-block"
          >
            <b-button
              v-for="(item, index) in statusList"
              :key="index"
              @click="getDataByStatus(item.name, item.id)"
              :class="{ menuactive: isActive(item.id) }"
              >{{ item.name }} ({{ item.value }})</b-button
            >
          </b-button-group>
        </b-col>
      </b-row>
      <div class="mt-3 bg-white py-3 py-sm-0">
        <b-row class="no-gutters px-3 px-sm-0">
          <b-col>
            <b-table
              responsive
              class="text-center table-list"
              striped
              :fields="fields"
              :items="items"
              :busy="isBusy"
              show-empty
              :empty-text="$t('noData')"
            >
              <template v-slot:cell(imageUrl)="data">
                <div class="position-relative">
                  <div
                    class="square-box b-contain"
                    v-bind:style="{
                      'background-image': 'url(' + data.item.imageUrl + ')',
                    }"
                  ></div>
                </div>
              </template>
              <template v-slot:cell(name)="data">
                <p class="mb-1 nobreak two-lines">{{ data.item.name }}</p>
                <span v-if="data.item.isOutOfStock" class="outofstock mr-1">{{
                  $t("outOfStock")
                }}</span>
                <span v-if="data.item.isLowStock" class="lowstock mr-1">{{
                  $t("lowStock")
                }}</span>
              </template>
              <template v-slot:cell(stock)="data">
                <p class="m-0">{{ data.item.stock | numeral("0,0") }}</p>
              </template>
              <template v-slot:cell(price)="data">
                <p class="m-0" v-if="data.item.productTypeId == 1">
                  ฿ {{ data.item.price | numeral("0,0.00") }}
                </p>
                <p class="m-0" v-else>
                  ฿ {{ data.item.minPrice | numeral("0,0.00") }} - ฿
                  {{ data.item.maxPrice | numeral("0,0.00") }}
                </p>
              </template>
              <template v-slot:cell(display)="data">
                <div v-if="data.item.display == true" class="text-success">
                  <font-awesome-icon icon="check" title="display" />
                </div>
                <div v-else class="text-danger">
                  <font-awesome-icon icon="times" title="not display" />
                </div>
              </template>
              <template v-slot:cell(enabled)="data">
                <div v-if="data.item.enabled == true" class="text-success">
                  {{ $t("active") }}
                </div>
                <div v-else class="text-danger">{{ $t("inactive") }}</div>
              </template>
              <template v-slot:cell(displays)="data">
                <b-form-checkbox
                  v-model="data.item.display"
                  name="check-button"
                  switch
                  size="lg"
                  class="mb-2"
                  @change="onChangeDisplayStatus($event, data.item.id)"
                ></b-form-checkbox>
              </template>
              <template v-slot:cell(id)="data">
                <b-button variant="link" class="px-1 py-0">
                  <router-link
                    :to="'/product/details/' + data.item.id"
                    class="text-dark"
                  >
                    {{ $t("edit") }}
                  </router-link>
                </b-button>
                {{ " " }} {{ " " }}
                <b-button
                  variant="link"
                  class="px-1 py-0 text-dark"
                  @click="openModalDelete(data.item)"
                >
                  {{ $t("delete") }}
                </b-button>
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
        <b-row class="no-gutters px-3 px-sm-0 pb-3">
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
    <!-- Modal -->
    <ModalAlertConfirm
      :msg="$t('confirmDelete')"
      :text="modalMessage"
      :btnConfirm="$t('delete')"
      colorBtnConfirm="danger"
      :btnCancel="$t('close')"
      ref="ModalAlertConfirm"
      @confirm="btnDelete"
    />
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import InputSelect from "@/components/inputs/InputSelect";
import ModalAlertConfirm from "@/components/modal/alert/ModalAlertConfirm";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
export default {
  name: "user",
  components: {
    InputSelect,
    ModalAlertConfirm,
    ModalAlert,
    ModalAlertError,
  },
  data() {
    return {
      statusList: [
        {
          id: 0,
        },
      ],
      modalMessage: "",
      activeItem: "",
      requestDeleteUser: {
        userId: null,
      },
      fields: [
        {
          key: "imageUrl",
          label: `${this.$t("thumbnail")}`,
          class: "w-100px text-nowrap",
        },
        {
          key: "name",
          label: `${this.$t("productName")}`,
          class: "w-100px text-nowrap",
        },
        { key: "sku", label: "SKU", class: "w-100px text-nowrap" },
        {
          key: "price",
          label: `${this.$t("price")}`,
          class: "w-100px text-nowrap",
        },
        {
          key: "stock",
          label: `${this.$t("available")}`,
          class: "w-50px text-nowrap",
        },
        {
          key: "display",
          label: `${this.$t("visible")}`,
          class: "w-50px text-nowrap",
        },
        {
          key: "enabled",
          label: `${this.$t("status")}`,
          class: "w-50px text-nowrap",
        },
        {
          key: "displays",
          label: `${this.$t("displayStatus")}`,
          class: "w-100px text-nowrap",
        },
        { key: "id", label: "", class: "w-50px text-nowrap" },
      ],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        PageNo: 1,
        PerPage: 10,
        Search: "",
        status: [],
      },
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      totalRowMessage: "",
      checkAll: false,
      selectAllCb: false,
    };
  },
  created: async function() {
    await this.getList();
    this.activeItem = 0;
    this.$showAlert = false;
  },
  methods: {
    getList: async function() {
      this.isBusy = true;
      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/List`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.items = resData.detail.dataList;
        this.rows = resData.detail.count;
        this.statusList = resData.detail.overviewCount;

        this.isBusy = false;
        this.$isLoading = true;
      }
    },
    getDataByStatus(status, id) {
      this.filter.PageNo = 1;
      this.activeItem = id;
      this.filter.status = [];
      if (id != 0) this.filter.status.push(id);
      this.getList();
    },
    isActive: function(menuItem) {
      return this.activeItem == menuItem;
    },
    onClearFilter() {
      this.filter.pageNo = 1;
      this.filter.answerStatus = [];
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
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filter.status = [];
      } else {
        this.filter.status = [1, 2, 3, 4];
        // this.statusList.forEach(element => {
        //   this.filter.status.push(element.id);
        // });
      }
    },
    checkStatusLength() {
      if (this.filter.status.length == this.statusList.length - 1) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
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
      this.requestDeleteUser.userId = value.id;
      this.modalMessage =
        `${this.$t("doYouWantToDelete")} ` +
        value.name +
        ` ${this.$t("yesOrNo")} ?`;
      this.$refs.ModalAlertConfirm.show();
    },
    onChangeDisplayStatus: async function(value, id) {
      var data = {
        productId: id,
        status: value,
      };
      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/displayStatus`,
        null,
        this.$headers,
        data
      );
      if (resData.result == 1) {
        this.getList();
      }
    },
    btnDelete: async function() {
      this.$refs.ModalAlertConfirm.hide();
      let resData = await this.$callApi(
        "delete",
        `${this.$baseUrl}/api/product/removeProductDetail/${this.requestDeleteUser.userId}`,
        null,
        this.$headers,
        this.requestDeleteUser
      );
      this.modalMessage = resData.message;
      if (resData.result == 1) {
        this.$refs.modalAlert.show();
        setTimeout(() => {
          this.$refs.modalAlert.hide();
        }, 3000);
        this.filter.Page = 1;
        await this.getList();
      } else {
        this.$refs.modalAlertError.show();
      }
    },
  },
};
</script>

<style scoped>
.outofstock {
  background: red;
  padding: 1px 5px;
  color: white;
  border-radius: 15px;
  font-size: 12px;
}

.lowstock {
  background: #ffb300;
  padding: 1px 5px;
  color: white;
  border-radius: 15px;
  font-size: 12px;
}
</style>
