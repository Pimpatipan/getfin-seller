<template>
  <div >
    <b-container class="container-box">
      <b-row class="no-gutters">
        <b-col>
          <h1 class="font-weight-bold header-main text-uppercase mb-3">
            {{ (id == 0 ? $t("add") : $t("edit")) }}{{ $t("article") }}
          </h1>
        </b-col>
      </b-row>

      <div class="bg-white p-3" v-if="$isLoading">
        <b-row class="pl-1">
          <b-col cols="6">
            <div class="panel d-flex align-items-md-center">
              <!-- <b-form-checkbox size="lg" id="highlight"
                >เป็นไฮไลท์</b-form-checkbox
              > -->

              <b-form-checkbox
                size="lg"
                id="sameLang"
                class="mt-0 mt-sm-3"
                @change="useSameLanguage"
                v-model="form.article.isSameLanguage"
                >{{ $t("useSameLang") }}
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col cols="6" class="text-right">
            <b-button
              type="button"
              class="btn btn-language"
              v-for="(language, index) in languageList"
              v-bind:key="index"
              v-bind:class="[languageActive == language.id ? 'active' : '']"
              @click="changeLanguage(language.id, index)"
              :disabled="form.article.isSameLanguage ? true : false"
            >
              <span class="text-uppercase">{{ language.nation }}</span>
            </b-button>
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col>
            <div
              v-for="(item, index) in form.article.translationList"
              v-bind:key="index"
            >
              <div
                v-bind:class="[
                  languageActive == item.languageId ? '' : 'd-none',
                ]"
              >
                <InputText
                  :textFloat="$t('articleName')"
                  :placeholder="$t('articleName')"
                  type="text"
                  name="name"
                  :img="imageLogoLang"
                  v-model="item.name"
                  @onKeyup="setAlttag(item.name)"
                  isRequired
                  :isValidate="
                    $v.form.article.translationList.$each.$iter[index].name
                      .$error
                  "
                  :v="$v.form.article.translationList.$each.$iter[index].name"
                />
              </div>
            </div>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <div
              v-for="(item, index) in form.article.translationList"
              v-bind:key="index"
            >
              <div
                v-bind:class="[
                  languageActive == item.languageId ? '' : 'd-none',
                ]"
              >
                <InputTextArea
                  class="mb-4"
                  rows="8"
                  :textFloat="$t('articleDesc')"
                  :placeholder="$t('articleDesc')"
                  type="text"
                  name="desc"
                  :img="imageLogoLang"
                  v-model="item.shortDescription"
                  isRequired
                  :isValidate="
                    $v.form.article.translationList.$each.$iter[index]
                      .shortDescription.$error
                  "
                  :v="
                    $v.form.article.translationList.$each.$iter[index]
                      .shortDescription
                  "
                />
              </div>
            </div>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <InputText
              :textFloat="$t('sortOrder')"
              :placeholder="$t('sortOrder')"
              type="text"
              name="sortorder"
              isRequired
              :isValidate="$v.form.article.sortOrder.$error"
              :v="$v.form.article.sortOrder"
              @onKeypress="isNumber($event)"
              v-model="form.article.sortOrder"
            />
          </b-col>
          <b-col md="6">
            <InputText
              :textFloat="$t('urlKey')"
              :placeholder="$t('urlKey')"
              type="text"
              name="urlKey"
              isRequired
              v-model="form.article.urlKey"
              :isValidate="$v.form.article.urlKey.$error"
              :v="$v.form.article.urlKey"
              @onKeyup="onUrlkeyChange"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <UploadFile
              :textFloat="$t('cover')"
              :placeholder="$t('pleaseUpload')"
              format="image"
              name="thumbnail"
              :fileName="form.article.imageUrl"
              :text="$t('supportImg')"
              isRequired
              v-on:onFileChange="onImageChange"
              v-on:delete="deleteImage"
              :v="$v.form.article.imageUrl"
            />
          </b-col>
          <b-col md="6">
            <div
              class="preview-box b-contain"
              v-if="coverImgType == 1"
              v-bind:style="{ 'background-image': 'url(' + showPreview + ')' }"
            >
              <img
                src="@/assets/images/icons/loading.svg"
                class="loading"
                alt="loading"
                v-if="isLoadingImage"
              />
            </div>
            <div
              class="preview-box position-relative p-0 embed-responsive embed-responsive-16by9 banner-video"
              v-else
            >
              <video ref="videoRef" class="w-100 video-box" controls>
                <source :src="showPreview" type="video/mp4" />
              </video>
            </div>
          </b-col>
        </b-row>

        <div>
          <div
            v-for="(item, index) in form.article.translationList"
            v-bind:key="index"
            class="mt-4"
          >
            <div
              v-bind:class="[languageActive == item.languageId ? '' : 'd-none']"
            >
              <TextEditor
               v-if="$isLoading"
                :textFloat="$t('desc')"
                :rows="8"
                :img="imageLogoLang"
                placeholder="Type something..."
                :name="'prodetail' + item.languageId"
                :value="item.description"
                @onDataChange="(val) => (item.description = val)"
                :v="
                  $v.form.article.translationList.$each.$iter[index].description
                "
                isRequired
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white p-3 mt-2">
        <b-row>
          <b-col>
            <label for="" class="main-label my-2">{{
              $t("displayOnProduct")
            }}</label>
            <label for="" class="ml-3 mb-0 mt-2"
              >( {{ selected.length }} {{ $t("productSelected") }} )</label
            >
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col>
            <b-form-checkbox
              size="lg"
              class="ml-2"
              v-model="displayOnlySelected"
              @change="onChangeShowSelected($event)"
              ><label for="" class="">{{
                $t("displayOnSelected")
              }}</label></b-form-checkbox
            >
          </b-col>
          <b-col sm="6" class="text-right">
            <div class="d-flex">
              <b-input-group class="panel-article-input-serach">
                <b-form-input
                  class="input-serach"
                  :placeholder="$t('productName') + ', SKU'"
                  v-model="filter.search"
                  @keyup="handleSearch"
                ></b-form-input>
                <b-input-group-prepend @click="btnSearch">
                  <span class="icon-input m-auto pr-2">
                    <font-awesome-icon icon="search" title="View" />
                  </span>
                </b-input-group-prepend>
              </b-input-group>
              <b-button v-b-toggle.sidebar-1 class="btn-filter">
                <font-awesome-icon
                  icon="filter"
                  title="filter-btn"
                  class="text-white mr-0 mr-sm-1"
                />
                <span class="d-none d-sm-inline">{{ $t("filter") }}</span>
              </b-button>
            </div>
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

            <div>
              <p class="font-weight-bold mb-2 main-label">
                {{ $t("productStatus") }}
              </p>
            </div>
            <b-row
              class=""
              v-for="(status, index) in statusList"
              :key="status.id"
            >
              <b-col>
                <div class="form-check mb-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="status.id"
                    v-model="filter.status"
                    :id="'status-' + status.id"
                    @change="checkStatusLengthProduct"
                  />
                  <label
                    class="form-check-label"
                    :for="'status-' + status.id"
                    >{{ status.name }}</label
                  >
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <InputSelect
                  class="mb-4"
                  :title="$t('category')"
                  name="Cate"
                  v-bind:options="catLists"
                  valueField="id"
                  textField="name"
                  v-model="selectedCategoryId"
                  @onDataChange="handleChangeCategory"
                />
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col class="d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-purple button"
                  @click="getDataByStatus"
                >
                  {{ $t("sendSubmit") }}
                </button>
              </b-col>
            </b-row>
          </div>
        </b-sidebar>
        <b-row class="mt-3">
          <b-col>
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
                  <template v-slot:cell(ids)="data">
                    <b-form-checkbox
                      size="lg"
                      class="ml-3"
                      :value="data.item.id"
                      v-model="selected"
                    ></b-form-checkbox>
                  </template>
                  <template v-slot:head(ids)="data">
                    <b-form-checkbox
                      size="lg"
                      class="ml-3"
                      :ref="data.field.key"
                      @click="checkAllSelect()"
                      v-model="selectedAll"
                    ></b-form-checkbox>
                  </template>
                  <template v-slot:cell(imageUrl)="data">
                    <div
                      class="image"
                      v-bind:style="{
                        'background-image': 'url(' + data.item.imageUrl + ')',
                      }"
                    ></div>
                  </template>
                  <template v-slot:cell(price)="data">
                    <span> ฿ {{ data.item.price | numeral("0,0.00") }} </span>
                  </template>
                  <template v-slot:cell(stock)="data">
                    <span> {{ data.item.stock | numeral("0") }} </span>
                  </template>
                  <template v-slot:cell(sold)="data">
                    <span> {{ data.item.sold | numeral("0") }} </span>
                  </template>
                  <template v-slot:cell(display)="data">
                    <div v-if="data.item.display == true" class="text-success">
                      {{ $t("active") }}
                    </div>
                    <div v-else class="text-danger">{{ $t("inactive") }}</div>
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
          </b-col>
        </b-row>
        <b-row class="no-gutters px-3 px-sm-0">
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
              class="mr-sm-3"
              v-model="filter.perPage"
              @change="hanndleChangePerpage"
              :options="pageOptions"
            ></b-form-select>
          </b-col>
        </b-row>
      </div>
      <div class="bg-white p-3 mt-2 pt-5">
        <SEOSection
          :data="form.article.translationList"
          :img="imageLogoLang"
          :langActive="languageActive"
          :isValidate="$v.form.article.translationList"
          :v="$v.form.article.translationList"
        />

        <b-row class="mt-4">
          <b-col>
            <label class="font-weight-bold main-label">
              {{ $t("availability") }}
              <span class="text-danger">*</span>
            </label>
            <div>
              <b-form-checkbox
                switch
                v-model="form.article.enabled"
                class="radio-active"
                size="lg"
              >
                <span class="ml-2 main-label">{{
                  form.article.enabled ? $t("active") : $t("inactive")
                }}</span>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>

        <b-row class="mt-5">
          <b-col md="6">
            <b-button
              v-if="isEdit"
              class="btn btn-danger btn-details-set mr-md-2"
              :disabled="isDisable"
              @click="openModalDelete(form.article.translationList[0].name)"
              >{{ $t("delete") }}</b-button
            >
            <b-button
              href="/article"
              :disabled="isDisable"
              class="btn-details-set"
              >{{ $t("cancel") }}</b-button
            >
          </b-col>
          <b-col md="6" class="text-sm-right">
            <button
              type="button"
              @click="checkForm(0)"
              :disabled="isDisable"
              class="btn btn-main btn-details-set ml-md-2 text-uppercase button"
            >
              {{ $t("save") }}
            </button>
            <button
              type="button"
              @click="checkForm(1)"
              :disabled="isDisable"
              class="btn btn-main btn-details-set ml-md-2 text-uppercase button"
            >
              {{ $t("saveAndExit") }}
            </button>
          </b-col>
        </b-row>
      </div>
      <div class="bg-white p-3"></div>
    </b-container>
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalAlertConfirm
      msg="ยืนยันการลบ ?"
      :text="modalMessage"
      btnConfirm="Delete"
      colorBtnConfirm="danger"
      btnCancel="Close"
      ref="isModalAlertConfirm"
      @confirm="btnDelete"
    />
    <ModalLoading ref="modalLoading" :hasClose="false" />
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import UploadFile from "@/components/inputs/UploadFile";
import TextEditor from "@/components/inputs/TextEditor";
import SEOSection from "@/components/inputs/SEOSection";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalAlertConfirm from "@/components/modal/alert/ModalAlertConfirm";
import Vue from "vue";
import InputSelect from "@/components/inputs/InputSelect";
import ModalLoading from "@/components/modal/alert/ModalLoading";

export default {
  name: "ArticleDetails",
  components: {
    InputText,
    InputTextArea,
    InputSelect,
    UploadFile,
    SEOSection,
    TextEditor,
    ModalAlert,
    ModalAlertError,
    ModalAlertConfirm,
    ModalLoading
  },
  data() {
    return {
      id: this.$route.params.id,
      isLoadingImage: false,
      isLoadingMobileImage: false,
      coverImgType: 1,
      showVideo: "",
      productitems: [],
      statusList: [
        {
          id: 0,
          name: "Inactive",
        },
        {
          id: 1,
          name: "Active",
        },
      ],
      totalRowMessage: "",
      showPreview: "",
      mobileCoverImgType: 1,
      displayOnlySelected: false,
      mobileShowVideo: "",
      mobileShowPreview: "",
      isEdit: false,
      images: "",
      isBusy: false,
      mobileImages: "",
      modalMessage: "",
      isDisable: false,
      fileNameComputer: "",
      fileNameMobile: "",
      selected: [],
      languageList: [],
      catLists: [],
      fileName: "",

      selectedAll: false,
      rows: 0,
      languageActive: 1,
      imageLogoLang: "",
      description: "",
      fields: [
        {
          key: "ids",
          label: "#",
        },
        {
          key: "imageUrl",
          label: `${this.$t("thumbnail")}`,
          class: "w-200",
        },
        {
          key: "name",
          label: `${this.$t("productDetails")}`,
          class: "w-100px",
        },
        {
          key: "sku",
          label: "SKU",
          class: "w-200",
        },
        {
          key: "price",
          label: `${this.$t("price")}`,
          class: "w-200",
        },
        {
          key: "sold",
          label: `${this.$t("sold")}`,
          class: "w-200",
        },
        {
          key: "stock",
          label: `${this.$t("stock")}`,
          class: "w-100px",
        },
        {
          key: "display",
          label: `${this.$t("productStatus")}`,
          class: "w-100px",
        },
      ],
      items: [],
      pageOptions: [
        { value: 10, text: `10 / ${this.$t("page")}` },
        { value: 30, text: `30 / ${this.$t("page")}` },
        { value: 50, text: `50 / ${this.$t("page")}` },
        { value: 100, text: `100 / ${this.$t("page")}` },
      ],
      productFields: [
        {
          key: "ids",
          label: "#",
        },
        {
          key: "thumbnail",
          label: `${this.$t("thumbnail")}`,
          class: "w-200px",
        },
        {
          key: "name",
          label: `${this.$t("productDetails")}`,
          class: "w-200",
        },
        {
          key: "sku",
          label: "SKU",
          class: "w-100px",
        },
        {
          key: "price",
          label: `${this.$t("price")}`,
          class: "w-100px",
        },
        {
          key: "sold",
          label: `${this.$t("sold")}`,
          class: "w-100px",
        },
        {
          key: "stock",
          label: `${this.$t("stock")}`,
          class: "w-100px",
        },
        {
          key: "display",
          label: `${this.$t("productStatus")}`,
          class: "w-100px",
        },
      ],
      filter: {
        pageNo: 1,
        perPage: 10,
        search: "",
        productId: [],
        categoryId: [],
        status: [0, 1],
      },
      selectedCategoryId: 0,
      allItems: [],
      form: {
        article: {
          id: 0,
          sortOrder: 0,
          urlKey: "",
          imageUrl: "",
          deleted: false,
          enabled: true,
          display: false,
          isSameLanguage: true,
          mainLanguageId: 0,
          productId: [],
          translationList: [
            {
              languageId: 1,
              name: "",
              shortDescription: null,
              description: "",
              metaTitle: "",
              metaKeyword: "",
              metaDescription: "",
            },
            {
              languageId: 2,
              name: "",
              shortDescription: null,
              description: "",
              metaTitle: "",
              metaKeyword: "",
              metaDescription: "",
            },
          ],
        },
      },
      checkAll: false,
      selectAllCb: false,
      checkAllProduct: false,
      selectAllCbProduct: false,
    };
  },
  validations: {
    fileNameComputer: { required },
    fileNameMobile: { required },
    form: {
      article: {
        sortOrder: { required },
        urlKey: { required },
        imageUrl: { required },
        translationList: {
          $each: {
            name: { required },
            shortDescription: { required },
            description: { required },
            metaTitle: { required },
            metaKeyword: { required },
            metaDescription: { required },
          },
        },
      },
    },
  },
  created: async function () {
    await this.getDatas();
  },
  watch: {
    selected: function () {
      if (this.selected.length == this.allItems.length) {
        this.selectedAll = true;
      } else {
        this.selectedAll = false;
      }
    },
    selectedAll: function () {
      if (this.selected.length != this.allItems.length) {
        if (this.selectedAll) {
          this.selected = [];
          this.allItems.forEach((element, index) => {
            this.selected.push(element.id);
          });
          if (this.displayOnlySelected) this.onClearFilter();
        }
      } else {
        if (!this.selectedAll) {
          this.selected = [];
        }
      }
    },
  },
  methods: {
    onUrlkeyChange: function (value) {
      this.form.article.urlKey = this.form.article.urlKey
        .replace(/ /g, "-")
        .replace(/\//g, "");
    },
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getList();
    },
    checkAllSelect() {
      if (!this.selectAllCb) {
        this.filter.Status = [];
      } else {
        var list = this.statusList.slice(1);
        for (const item in list) {
          this.filter.Status.push(list[item].id);
        }
      }
    },
    checkAllProductSelect() {
      if (this.selectAllCbProduct) {
        this.filter.status = [];
      } else {
        this.filter.status = [];
        this.statusList.forEach((element) => {
          this.filter.status.push(element.id);
        });
      }
    },
    checkStatusLengthProduct() {
      if (this.filter.status.length == this.statusList.length - 1) {
        this.selectAllCbProduct = true;
      } else {
        this.selectAllCbProduct = false;
      }
    },
    handleChangeCategory: async function (value) {
      this.filter.categoryId = [];
      if (value != 0) {
        this.filter.categoryId.push(value);
      }
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perPage = value;
      this.getList();
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    changeSameLang: function (value) {
      this.form.article.isSameLanguage = value;
    },
    setAlttag: function (value) {
      this.languageList.forEach((element, index) => {
        this.form.article.translationList[index].altTag = value.replace(
          / /g,
          "-"
        );
        this.form.article.translationList[index].metaTitle = value;
        this.form.article.translationList[index].metaKeyword = value;
        this.form.article.translationList[index].metaDescription = value;
      });

      this.form.article.urlKey = value.replace(/ /g, "-").replace(/\//g, "");
    },
    setAlttagByLang: function (value, index) {
      this.form.article.translationList[index].altTag = value.replace(
        / /g,
        "-"
      );
    },
    onChangeShowSelected(value) {
      this.filter.pageNo = 1;
      if (value == true) this.filter.productId = this.selected;
      else this.filter.productId = [];

      this.getList();
    },
    getDatas: async function () {
      this.$isLoading = false;

      let languages = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/language`,
        null,
        this.$headers,
        null
      );
     
      if (languages.result == 1) {
        this.languageList = languages.detail;
        this.changeLanguage(1, 0);
      }

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/article/${this.$route.params.id}`,
        null,
        this.$headers,
        null
      );

      await this.getList();
      await this.getAllData();

      if (data.result == 1) {
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.$route.params.id > 0) {
          this.form = data.detail;
          this.isEdit = true;
          this.form.article.imageBase64 = "";
          this.selected = this.form.article.productId;
          this.showPreview = this.form.article.imageUrl;

          let vdo = this.form.article.imageUrl.split(".").pop();
          if (vdo == "mp4") {
            this.coverImgType = 2;
            var vid = this.$refs.videoRef;
            if (vid != undefined) {
              vid.load();
            }
          }
        } else {
          this.form.article.imageUrl = "";
        }

        this.$isLoading = true;
      }

      if (this.form.article.isSameLanguage) {
        this.imageLogoLang = "";
      } else {
        var index = this.languageList
          .map(function (x) {
            return x.id;
          })
          .indexOf(this.languageActive);
        this.imageLogoLang = this.languageList[index].imageUrl;
      }
    },
    getList: async function () {
      this.isBusy = true;
      let productlist = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/article/productList`,
        null,
        this.$headers,
        this.filter
      );

      let catlist = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/categoryList`,
        null,
        this.$headers,
        this.filter
      );

      if (productlist.result == 1) {
        this.items = productlist.detail.dataList;
        this.rows = productlist.detail.count;
        // this.statusList = productlist.detail.overviewCount;

        this.isBusy = false;
      }

      if (catlist.result == 1) {
        let list = [{ id: 0, name: `${this.$t("selectCategory")}` }];
        let datalist = catlist.detail;
        this.catLists = list.concat(datalist);
      }
    },
    getAllData: async function () {
      // get ข้อมูลทั้งหมดมาใช้ตอนเช็คติ้ก
      let filterAll = {
        pageNo: 1,
        perPage: -1,
        search: "",
        productId: [],
        categoryId: [],
        status: [0, 1],
      };
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/article/productList`,
        null,
        this.$headers,
        filterAll
      );

      if (data.result == 1) {
        this.allItems = data.detail.dataList;
      }
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    onImageChange(img) {
      this.isLoadingImage = true;
      this.isDisable = true;

      var reader = new FileReader();
      reader.readAsDataURL(img);

      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoadingImage = false;
        this.isDisable = false;

        this.showPreview = this.images;
        this.form.article.imageUrl = this.images;

        if (img.type == "video/mp4") {
          this.coverImgType = 2;
          this.form.article.isVideo = true;
          var vid = this.$refs.videoRef;
          if (vid != undefined) {
            vid.load();
          }
        } else {
          this.coverImgType = 1;
          this.form.article.isVideo = false;
        }
      };
    },
    saveImagetoDb: async function (img) {
      var imgData = {
        base64: img,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/image/save`,
        null,
        this.$headers,
        imgData
      );

      if (data.result == 1) {
        return data.detail.url;
      }
    },
    deleteImage(value) {
      this.form.article.imageUrl = "";
      this.form.article.imageBase64 = null;
      this.showPreview = null;

      if (this.coverImgType == 2) {
        var vid = this.$refs.videoRef;
        vid.load();
        this.coverImgType = 1;
      }
    },
    checkForm: async function (flag) {
      if (this.form.article.isSameLanguage) {
        await this.useSameLanguage();
      }
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        this.$nextTick(() => {
          let domRect = document
            .querySelector(".input-custom.error")
            .getBoundingClientRect();
          window.scrollTo(
            domRect.left + document.documentElement.scrollLeft,
            domRect.top + document.documentElement.scrollTop - 150
          );
        });

        await this.checkValidateTranslationList();
        return;
      }
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function () {
      this.isDisable = true;
      this.$refs.modalLoading.show();
      this.form.article.productId = this.selected;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveArticle`,
        null,
        this.$headers,
        this.form
      );

      this.modalMessage = data.message;
      this.$refs.modalLoading.hide();
      this.isDisable = false;
      if (data.result == 1) {
        this.existId = data.detail;
        this.$refs.modalAlert.show();

        if (this.flag == 1) {
          setTimeout(function () {
            window.location.href = "/article";
          }, 3000);
        } else {
          if (this.$route.params.id > 0) {
            this.getDatas();
          } else {
            this.form.article.id = this.existId;
            this.id = this.existId;
            this.isEdit = true;
            this.$router.push({ path: `/article/details/${this.existId}` });
          }
        }
      } else {
        this.$refs.modalAlertError.show();
      }
    },
    getDataByStatus(status) {
      //this.filter.status = status;
      this.activeItem = status;
      this.$refs.filterSidebar.hide(true);
      this.getList();
    },
    onClearFilter() {
      this.selectedCategoryId = 0;
      this.filter = {
        pageNo: 1,
        perPage: 10,
        search: "",
        productId: [],
        categoryId: [],
        status: [0, 1],
      };
      this.$refs.filterSidebar.hide(true);
      this.getList();
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageNo = 1;
        this.getList();
      }
    },
    btnSearch() {
      this.filter.pageNo = 1;
      this.getList();
    },
    btnDelete: async function () {
      this.$refs.isModalAlertConfirm.hide();

      let resData = await this.$callApi(
        "delete",
        `${this.$baseUrl}/api/product/article/delete/${this.$route.params.id}`,
        null,
        this.$headers,
        null
      );
      this.modalMessage = resData.message;
      if (resData.result == 1) {
        this.$refs.modalAlert.show();
        setTimeout(function () {
          window.location.href = "/article";
        }, 3000);
      } else {
        this.$refs.modalAlertError.show();
      }
    },
    openModalDelete(name) {
      this.modalMessage = "คุณต้องการลบ " + name + " ใช่หรือไม่?";
      this.$refs.isModalAlertConfirm.show();
    },
    useSameLanguage: async function () {
      Vue.nextTick(() => {
        if (this.form.article.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.article.mainLanguageId = this.languageActive;
          let data = this.form.article.translationList.filter(
            (val) => val.languageId == this.form.article.mainLanguageId
          );

          if (this.$route.params.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.article.translationList.length;
                index++
              ) {
                this.form.article.translationList[index].altTag = data.altTag;
                this.form.article.translationList[index].name = data.name;
                this.form.article.translationList[index].shortDescription =
                  data.shortDescription;
                this.form.article.translationList[index].description =
                  data.description;
                this.form.article.translationList[index].metaTitle =
                  data.metaTitle;
                this.form.article.translationList[index].metaKeyword =
                  data.metaKeyword;
                this.form.article.translationList[index].metaDescription =
                  data.metaDescription;
              }
            }
          }
        } else {
          var index = this.languageList
            .map(function (x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;

          let data = this.form.article.translationList.filter(
            (val) => val.languageId != this.form.article.mainLanguageId
          );
          if (this.$route.params.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.altTag = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function () {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.article.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.article.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    deleteData: async function () {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/product/article/delete/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/article";
        }
      }
    },
  },
};
</script>

<style scoped>
.panel {
  font-size: 17px;
  color: #16274a;
}
.b-contain {
  padding-bottom: 42.9%;
}
.banner-video::before {
  padding-top: 42.9%;
}
.panel-article-input-serach {
  background-color: #fff;
  border: 1px solid #d8dbe0 !important;
  color: #4a4a4a;
  width: 100%;
  margin-right: 10px;
}
.image {
  width: 100%;
  padding-top: 42.9%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
