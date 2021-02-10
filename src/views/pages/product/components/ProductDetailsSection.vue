<template>
  <div v-if="form">
    <form class="form-box">
      <b-row class="no-gutters bg-white">
        <b-col>
          <b-button v-b-toggle.collapse-general class="collapse-btn">
            {{ $t("general") }}
            <font-awesome-icon
              icon="chevron-right"
              class="icon float-right mt-1"
            />
            <font-awesome-icon
              icon="chevron-down"
              class="icon float-right mt-1"
            />
          </b-button>
          <b-collapse id="collapse-general" visible>
            <b-card class="card-box">
              <b-row class="pl-1 my-3">
                <b-col cols="6">
                  <div class="panel d-flex align-items-md-center">
                    <b-form-checkbox
                      size="lg"
                      @change="useSameLanguage"
                      id="sameLang"
                      v-model="form.product.isSameLanguage"
                      >{{ $t("useSameLang") }}</b-form-checkbox
                    >
                  </div>
                </b-col>
                <b-col cols="6" class="text-right">
                  <b-button
                    type="button"
                    class="btn btn-language"
                    v-for="(language, index) in languageList"
                    v-bind:key="index"
                    v-bind:class="[
                      languageActive == language.id ? 'active' : '',
                    ]"
                    @click="changeLanguage(language.id, index)"
                    :disabled="form.product.isSameLanguage ? true : false"
                  >
                    <span class="text-uppercase">{{ language.nation }}</span>
                  </b-button>
                </b-col>
              </b-row>

              <div>
                <div
                  v-for="(item, index) in form.product.translationList"
                  v-bind:key="index"
                >
                  <div
                    v-bind:class="[
                      languageActive == item.languageId ? '' : 'd-none',
                    ]"
                  >
                    <InputText
                      class="mb-4"
                      :textFloat="$t('productName')"
                      :placeholder="$t('productName')"
                      type="text"
                      name="name"
                      isRequired
                      :img="imageLogoLang"
                      v-model="item.name"
                      @onKeyup="setMeta(item.name, index)"
                      :isValidate="
                        $v.form.product.translationList.$each.$iter[index].name
                          .$error
                      "
                      :v="
                        $v.form.product.translationList.$each.$iter[index].name
                      "
                    />
                  </div>
                </div>
              </div>

              <label class="font-weight-bold main-label">
                {{ $t("category") }}
                <span class="text-danger">*</span>
              </label>
              <CategoryHierarchy
                :dataList="form.product.selectCategory"
                :catagories="catagories"
                @onDataChange="onDataChangeCategory"
                :v="$v.form.product.selectCategory"
              />
              <p class="text-danger" v-if="error">{{ errorText }}</p>
              <div>
                <div
                  v-for="(item, index) in form.product.translationList"
                  v-bind:key="index"
                  class="mt-4"
                >
                  <div
                    v-bind:class="[
                      languageActive == item.languageId ? '' : 'd-none',
                    ]"
                  >
                    <TextEditor
                      :textFloat="$t('desc')"
                      :rows="8"
                      :img="imageLogoLang"
                      placeholder="Type something..."
                      :name="'prodetail' + item.languageId"
                      :value="item.description"
                      @onDataChange="(val) => (item.description = val)"
                      :v="
                        $v.form.product.translationList.$each.$iter[index]
                          .description
                      "
                      isRequired
                    />
                  </div>
                </div>
              </div>

              <b-row>
                <b-col sm="6">
                  <InputText
                    textFloat="URL Key"
                    placeholder="URL Key"
                    type="text"
                    name="urlkey"
                    isRequired
                    v-model="form.product.urlKey"
                    :isValidate="$v.form.product.urlKey.$error"
                    :v="$v.form.product.urlKey"
                    @onKeyup="onUrlkeyChange"
                  />
                  <a
                    :href="
                      'https://dev-getfin.dosetech.co/product/' +
                      form.product.urlKey
                    "
                    target="_blank"
                    class="view-txt"
                    v-if="id != 0"
                    >{{ $t("view") }}</a
                  >
                  <!-- <a
                    :href="
                      'https://getfin.me/product/' +
                        form.product.urlKey
                    "
                    target="_blank"
                    class="view-txt"
                    v-if="id != 0"
                    >{{ $t("view") }}</a
                  > -->
                </b-col>
              </b-row>
            </b-card>
          </b-collapse>

          <b-button v-b-toggle.collapse-type class="collapse-btn">
            {{ $t("productType") }}
            <font-awesome-icon
              icon="chevron-right"
              class="icon float-right mt-1"
            />
            <font-awesome-icon
              icon="chevron-down"
              class="icon float-right mt-1"
            />
          </b-button>
          <b-collapse id="collapse-type" visible>
            <b-card class="card-box">
              <label class="font-weight-bold main-label">
                {{ $t("productType") }}
                <span class="text-danger">*</span>
              </label>

              <b-row class="mt-2 mb-4">
                <b-col md="6" class="mb-1 mb-sm-0">
                  <b-row>
                    <b-col>
                      <b-form-radio
                        name="some-type"
                        value="1"
                        v-model="form.product.productTypeId"
                        @change="handleProducTypeChange"
                        >{{ $t("simpleProduct") }}</b-form-radio
                      >
                    </b-col>
                    <b-col>
                      <b-form-radio
                        name="some-type"
                        value="2"
                        v-model="form.product.productTypeId"
                        @change="handleProducTypeChange"
                        >{{ $t("configProduct") }}
                      </b-form-radio>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <b-row
                class="mt-2 mb-sm-0"
                v-if="form.product.productTypeId == 1"
              >
                <b-col md="6" class="mb-1 mb-sm-0">
                  <InputText
                    textFloat="SKU"
                    placeholder="SKU"
                    type="text"
                    name="sku"
                    isRequired
                    v-model="form.product.sku"
                    :isValidate="$v.form.product.sku.$error"
                    :v="$v.form.product.sku"
                  />
                </b-col>
                <b-col md="6" class="mb-1 mb-sm-0">
                  <InputText
                    :textFloat="$t('qty')"
                    :placeholder="$t('qty')"
                    type="text"
                    name="quantity"
                    isRequired
                    v-model="form.product.quantity"
                    :isValidate="$v.form.product.quantity.$error"
                    :v="$v.form.product.quantity"
                    @onKeypress="isNumber($event)"
                  />
                </b-col>
              </b-row>

              <b-row v-if="form.product.productTypeId == 1">
                <b-col sm="6">
                  <InputText
                    :textFloat="$t('salePrice')"
                    :placeholder="$t('salePrice')"
                    type="text"
                    name="price"
                    isRequired
                    @onKeypress="isNumber($event)"
                    v-model="form.product.straightPrice"
                    :isValidate="$v.form.product.straightPrice.$error"
                    :v="$v.form.product.straightPrice"
                  />
                </b-col>
                <b-col sm="6">
                  <InputText
                    :textFloat="$t('productPrice')"
                    :placeholder="$t('productPrice')"
                    type="text"
                    name="price"
                    isRequired
                    v-model="form.product.rawPrice"
                    :isValidate="$v.form.product.rawPrice.$error"
                    :v="$v.form.product.rawPrice"
                    @onKeypress="isNumber($event)"
                  />
                </b-col>
              </b-row>

              <b-row v-if="form.product.productTypeId == 1">
                <b-col md="6">
                  <InputText
                    textFloat="GP"
                    placeholder="GP"
                    type="text"
                    name="gp"
                    isRequired
                    v-model="form.product.gp"
                    :isValidate="$v.form.product.gp.$error"
                    :v="$v.form.product.gp"
                  />
                </b-col>
              </b-row>

              <b-row v-if="form.product.productTypeId == 2">
                <b-col md="6">
                  <InputText
                    textFloat="SKU"
                    placeholder="SKU"
                    type="text"
                    name="sku"
                    isRequired
                    v-model="form.product.sku"
                    :isValidate="$v.form.product.sku.$error"
                    :v="$v.form.product.sku"
                    @onKeyup="handleChangeSKU()"
                  />
                </b-col>
              </b-row>

              <b-row
                class="mt-5 mb-sm-0"
                v-if="form.product.productTypeId == 2"
              >
                <b-col>
                  <ConfigOptionsSection
                    :v="$v.form.product.attributes"
                    :vsku="$v.form.product.sku"
                    :isEdit="form.product.id > 0"
                    :dataList="form.product.attributes"
                    :childrenObject="form.product.children"
                    :productAttributeImage="form.product.productAttributeImage"
                    :parentSKU="form.product.sku"
                    @handleCreateOptions="handleCreateOptions"
                    @handleCreateOptionsChoice="handleCreateOptionsChoice"
                    @handleChildrenObject="handleChildrenObject"
                    @onChangeOptionsName="onChangeOptionsName"
                    @onChangeOptionsChoiceName="onChangeOptionsChoiceName"
                  />
                </b-col>
              </b-row>

              <b-row
                class="mt-5 mb-sm-0"
                v-if="form.product.productTypeId == 2"
                id="combinationTable"
              >
                <b-col>
                  <label class="main-label mb-3" for="CombinationTable">{{
                    $t("combinationList")
                  }}</label>
                  <span
                    class="text-error"
                    v-if="
                      $v.form.product.children.attributeOption.$error == true
                    "
                  >
                    {{ $t("fillThisForm") }}
                  </span>
                </b-col>
              </b-row>

              <b-row class v-if="form.product.productTypeId == 2">
                <b-col>
                  <CombinationTable
                    :dataObject="form.product.children"
                    :attributes="form.product.attributes"
                    :v="$v.form.product.children.attributeOption"
                  />
                </b-col>
              </b-row>
            </b-card>
          </b-collapse>

          <b-button v-b-toggle.collapse-images class="collapse-btn">
            <span class="mr-2">{{ $t("image") }}</span>
            <span class="img-note">{{ $t("supportImg") }}</span>
            <font-awesome-icon
              icon="chevron-right"
              class="icon float-right mt-1"
            />
            <font-awesome-icon
              icon="chevron-down"
              class="icon float-right mt-1"
            />
          </b-button>
          <b-collapse id="collapse-images" visible>
            <b-card class="card-box">
              <DefaultImages
                @updateImageList="updateImageList"
                :dataList="form.product.productImage"
                :v="$v.form.product.productImage"
              />

              <div v-if="form.product.productTypeId == 2">
                <label class="font-weight-bold main-label mb-3">
                  {{ form.product.children.label }}
                </label>
                <template v-if="forceRefresh">
                  <draggable
                    :list="form.product.productAttributeImage"
                    handle=".handle"
                    class="img-list m-0"
                  >
                    <div
                      class="handle"
                      v-for="(img, index) in form.product.productAttributeImage"
                      :key="index"
                    >
                      <ImageUpload
                        v-bind:dataFile="img"
                        :index="index"
                        :name="img.altTag"
                        :v="
                          $v.form.product.productAttributeImage.$each.$iter[
                            index
                          ].imageUrl
                        "
                        @handleChangeImage="handleChangeImage"
                      />
                    </div>
                  </draggable>
                </template>
              </div>
            </b-card>
          </b-collapse>

          <b-button v-b-toggle.collapse-delivery class="collapse-btn">
            {{ $t("delivery") }}
            <font-awesome-icon
              icon="chevron-right"
              class="icon float-right mt-1"
            />
            <font-awesome-icon
              icon="chevron-down"
              class="icon float-right mt-1"
            />
          </b-button>
          <b-collapse id="collapse-delivery" visible>
            <b-card class="card-box">
              <b-row>
                <b-col lg="3" md="6">
                  <InputText
                    :textFloat="$t('weightProduct')"
                    :placeholder="$t('weightProduct')"
                    type="text"
                    name="weight"
                    isRequired
                    v-model="form.product.weight"
                    :isValidate="$v.form.product.weight.$error"
                    :v="$v.form.product.weight"
                    @onKeypress="isNumber($event)"
                  />
                </b-col>

                <b-col lg="3" md="6">
                  <InputText
                    :textFloat="$t('lengthProduct')"
                    :placeholder="$t('lengthProduct')"
                    type="text"
                    name="length"
                    isRequired
                    v-model="form.product.length"
                    :isValidate="$v.form.product.length.$error"
                    :v="$v.form.product.length"
                    @onKeypress="isNumber($event)"
                  />
                </b-col>

                <b-col lg="3" md="6">
                  <InputText
                    :textFloat="$t('widthProduct')"
                    :placeholder="$t('widthProduct')"
                    type="text"
                    name="width"
                    isRequired
                    v-model="form.product.width"
                    :isValidate="$v.form.product.width.$error"
                    :v="$v.form.product.width"
                    @onKeypress="isNumber($event)"
                  />
                </b-col>

                <b-col lg="3" md="6">
                  <InputText
                    :textFloat="$t('heightProduct')"
                    :placeholder="$t('heightProduct')"
                    type="text"
                    name="height"
                    isRequired
                    v-model="form.product.height"
                    :isValidate="$v.form.product.height.$error"
                    :v="$v.form.product.height"
                    @onKeypress="isNumber($event)"
                  />
                </b-col>
              </b-row>
            </b-card>
          </b-collapse>

          <SEOSection
            :data="form.product.translationList"
            :img="imageLogoLang"
            :langActive="languageActive"
            :isValidate="$v.form.product.translationList"
            :v="$v.form.product.translationList"
          />

          <b-row class="mt-4">
            <b-col md="6">
              <b-row class="px-3">
                <b-col sm="6" class="mb-4 mb-sm-0">
                  <label class="font-weight-bold main-label">
                    {{ $t("availability") }}
                    <span class="text-danger">*</span>
                  </label>
                  <div>
                    <b-form-checkbox
                      switch
                      v-model="form.product.enabled"
                      class="radio-active"
                      size="lg"
                    >
                      <span class="ml-2 main-label">
                        {{
                          form.product.enabled ? $t("active") : $t("inactive")
                        }}
                      </span>
                    </b-form-checkbox>
                  </div>
                </b-col>
                <b-col sm="6">
                  <label class="font-weight-bold main-label">
                    {{ $t("displayStatusSwh") }}
                    <span class="text-danger">*</span>
                  </label>
                  <div>
                    <b-form-checkbox
                      switch
                      v-model="form.product.display"
                      class="radio-active"
                      size="lg"
                    >
                      <span class="ml-2 main-label">
                        {{
                          form.product.display ? $t("active") : $t("inactive")
                        }}
                      </span>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row class="mt-4 px-3 py-2 btn-box no-gutters">
            <b-col md="6">
              <b-button
                class="btn btn-save-exit btn-details-set mr-md-2 text-uppercase"
                @click="openModalDelete(form.product.translationList[0].name)"
                v-if="id != 0"
                :disabled="isDisable"
                >{{ $t("delete") }}</b-button
              >
              <router-link to="/product">
                <b-button
                  :disabled="isDisable"
                  class="btn-details-set btn-cancel text-uppercase"
                  >{{ $t("cancel") }}</b-button
                >
              </router-link>
            </b-col>
            <b-col md="6" class="text-sm-right">
              <button
                :disabled="isDisable"
                @click="checkForm(0)"
                type="button"
                class="btn btn-details-set btn-save ml-md-2 text-uppercase"
              >
                {{ $t("saveDraft") }}
              </button>
              <button
                :disabled="isDisable"
                @click="checkForm(1)"
                type="button"
                class="btn btn-details-set btn-save-exit ml-md-2 text-uppercase"
              >
                {{ $t("saveAndPublish") }}
              </button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>

    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    <ModalLoading ref="modalLoading" :hasClose="false" />
    <ModalAlertConfirm
      :msg="$t('confirmDelete')"
      :text="modalMessage"
      :btnConfirm="$t('delete')"
      colorBtnConfirm="danger"
      :btnCancel="$t('close')"
      ref="isModalAlertConfirm"
      @confirm="btnDelete"
    />
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import { required, requiredIf, minValue } from "vuelidate/lib/validators";
import Vue from "vue";
import TextEditor from "@/components/inputs/TextEditor";
import SEOSection from "@/components/inputs/SEOSection";
import ConfigOptionsSection from "./details/ConfigOptionsSection";
import CombinationTable from "./details/CombinationListSection";
import draggable from "vuedraggable";
import DefaultImages from "./details/DefaultImages";
import ImageUpload from "./details/ImageUpload";
import CategoryHierarchy from "@/components/categoryHierarchy/CategoryHierarchy";
import json from "@/components/categoryHierarchy/category.json";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import ModalAlertConfirm from "@/components/modal/alert/ModalAlertConfirm";
import ModalLoading from "@/components/modal/alert/ModalLoading";

const validateGP = (typeId, value) => {
  if (typeId == 1 && value == 0) {
    return false;
  } else {
    return true;
  }
};
const validateGPConfig = (value) => {
  if (value == 0) {
    return false;
  } else {
    return true;
  }
};
export default {
  name: "ProductDetails",
  components: {
    InputText,
    TextEditor,
    SEOSection,
    ConfigOptionsSection,
    CombinationTable,
    draggable,
    DefaultImages,
    ImageUpload,
    CategoryHierarchy,
    ModalAlert,
    ModalAlertError,
    ModalAlertConfirm,
    ModalLoading,
  },
  data() {
    return {
      id: this.$route.params.id,
      languageList: [],
      existId: "",
      forceRefresh: true,
      items: [],
      list: [],
      parentList: [],
      listImage: [],
      defaultImage: [],
      imageLogoLang: "",
      languageActive: 1,
      productType: 2,
      isDisable: false,
      isLoadingData: false,
      error: false,
      errorText: "",
      modalMessage: "",
      optionsImageList: [],
      form: null,
      catagories: [],
      dataCategoryHierarchy: {
        categoryList: [],
        isLast: false,
        selectId: 0,
      },
      requestDeleteUser: {
        userId: null,
      },
    };
  },
  validations: {
    form: {
      product: {
        rawPrice: { required },
        straightPrice: { required },
        sku: { required },
        gp: {
          required: requiredIf(function () {
            return this.form.product.productTypeId == 1;
          }),
          validateGP(value) {
            return validateGP(this.form.product.productTypeId, value);
          },
        },
        // sku: {
        //   required: requiredIf(function() {
        //     return this.form.product.productTypeId == 1;
        //   }),
        // },
        quantity: {
          required: requiredIf(function () {
            return this.form.product.productTypeId == 1;
          }),
        },
        height: { required },
        weight: { required, minValue: minValue(10) },
        width: { required },
        length: { required },
        urlKey: { required },
        selectCategory: { required },
        productImage: { required },
        attributes: {
          $each: {
            label: {
              required: requiredIf(function () {
                return this.form.product.productTypeId == 2;
              }),
            },
            option: {
              $each: {
                label: {
                  required: requiredIf(function () {
                    return this.form.product.productTypeId == 2;
                  }),
                },
              },
            },
          },
        },
        children: {
          attributeOption: {
            $each: {
              product: {
                rawPrice: {
                  required: requiredIf(function () {
                    return (
                      this.form.product.productTypeId == 2 &&
                      this.form.product.attributes.length === 1
                    );
                  }),
                },
                straightPrice: {
                  required: requiredIf(function () {
                    return (
                      this.form.product.productTypeId == 2 &&
                      this.form.product.attributes.length === 1
                    );
                  }),
                },
                sku: {
                  required: requiredIf(function () {
                    return (
                      this.form.product.productTypeId == 2 &&
                      this.form.product.attributes.length === 1
                    );
                  }),
                },
                quantity: {
                  required: requiredIf(function () {
                    return (
                      this.form.product.productTypeId == 2 &&
                      this.form.product.attributes.length === 1
                    );
                  }),
                },
                gp: {
                  required: requiredIf(function () {
                    return (
                      this.form.product.productTypeId == 2 &&
                      this.form.product.attributes.length === 1
                    );
                  }),
                  validateGPConfig(value) {
                    if (
                      this.form.product.productTypeId == 2 &&
                      this.form.product.attributes.length === 1
                    ) {
                      return (
                        this.form.product.attributes.length === 1 &&
                        validateGPConfig(value)
                      );
                    } else {
                      return true;
                    }
                  },
                },
              },
              attribute: {
                attributeOption: {
                  $each: {
                    product: {
                      rawPrice: {
                        required: requiredIf(function () {
                          return (
                            this.form.product.productTypeId == 2 &&
                            this.form.product.attributes.length === 2
                          );
                        }),
                      },
                      straightPrice: {
                        required: requiredIf(function () {
                          return (
                            this.form.product.productTypeId == 2 &&
                            this.form.product.attributes.length === 2
                          );
                        }),
                      },
                      sku: {
                        required: requiredIf(function () {
                          return (
                            this.form.product.productTypeId == 2 &&
                            this.form.product.attributes.length === 2
                          );
                        }),
                      },
                      quantity: {
                        required: requiredIf(function () {
                          return (
                            this.form.product.productTypeId == 2 &&
                            this.form.product.attributes.length === 2
                          );
                        }),
                      },
                      gp: {
                        required: requiredIf(function () {
                          return (
                            this.form.product.productTypeId == 2 &&
                            this.form.product.attributes.length === 2
                          );
                        }),
                        validateGPConfig(value) {
                          if (
                            this.form.product.productTypeId == 2 &&
                            this.form.product.attributes.length === 2
                          ) {
                            return validateGPConfig(value);
                          } else {
                            return true;
                          }
                        },
                      },
                    },
                    attribute: {
                      attributeOption: {
                        $each: {
                          product: {
                            rawPrice: {
                              required: requiredIf(function () {
                                return (
                                  this.form.product.productTypeId == 2 &&
                                  this.form.product.attributes.length === 3
                                );
                              }),
                            },
                            straightPrice: {
                              required: requiredIf(function () {
                                return (
                                  this.form.product.productTypeId == 2 &&
                                  this.form.product.attributes.length === 3
                                );
                              }),
                            },
                            sku: {
                              required: requiredIf(function () {
                                return (
                                  this.form.product.productTypeId == 2 &&
                                  this.form.product.attributes.length === 3
                                );
                              }),
                            },
                            quantity: {
                              required: requiredIf(function () {
                                return (
                                  this.form.product.productTypeId == 2 &&
                                  this.form.product.attributes.length === 3
                                );
                              }),
                            },
                            gp: {
                              required: requiredIf(function () {
                                return (
                                  this.form.product.productTypeId == 2 &&
                                  this.form.product.attributes.length === 3
                                );
                              }),
                              validateGPConfig(value) {
                                if (
                                  this.form.product.productTypeId == 2 &&
                                  this.form.product.attributes.length === 3
                                ) {
                                  return validateGPConfig(value);
                                } else {
                                  return true;
                                }
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        productAttributeImage: {
          $each: {
            imageUrl: {
              required: requiredIf(function () {
                return this.form.product.productTypeId == 2;
              }),
            },
          },
        },
        translationList: {
          $each: {
            name: { required },
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
    //this.isLoadingData = true;
    await this.getData();
    await this.changeLanguage(1, 0);
  },
  computed: {
    isMobile() {
      return this.$screenSize.width < 991;
    },
  },
  methods: {
    handleForcefresh() {
      this.forceRefresh = false;
      this.$nextTick(() => {
        this.forceRefresh = true;
      });
    },
    handleChangeSKU: function (evt) {
      if (this.form.product.productTypeId == 2) {
        if (this.form.product.attributes.length == 1) {
          this.form.product.children.attributeOption.forEach(
            (element, index) => {
              element.product.sku =
                this.form.product.sku + "-000" + (index + 1);
            }
          );
        } else if (this.form.product.attributes.length == 2) {
          let pcount = 0;
          this.form.product.children.attributeOption.forEach((element) => {
            element.attribute.attributeOption.forEach((element2) => {
              pcount++;
              element2.product.sku = this.form.product.sku + "-000" + pcount;
            });
          });
        } else if (this.form.product.attributes.length == 3) {
          let pcount = 0;
          this.form.product.children.attributeOption.forEach((element) => {
            element.attribute.attributeOption.forEach((element2) => {
              element2.attribute.attributeOption.forEach((element3) => {
                pcount++;
                element3.product.sku = this.form.product.sku + "-000" + pcount;
              });
            });
          });
        }
      }
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;

      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        if (charCode == 46) return true;
        else evt.preventDefault();
      } else {
        return true;
      }
    },
    handleCreateOptions(list) {
      this.optionsImageList = list;
    },
    handleCreateOptionsChoice(list) {
      this.optionsImageList = list;
    },
    onChangeOptionsName(list) {
      this.optionsImageList = list;
    },
    onChangeOptionsChoiceName(list) {
      this.optionsImageList = list;
    },
    computedOptionList(list) {},
    handleChildrenObject(children, imageList) {
      this.form.product.children = children;
      this.form.product.productAttributeImage = imageList;
      this.handleForcefresh();
    },
    onUrlkeyChange: function (value) {
      this.form.product.urlKey = this.form.product.urlKey
        .replace(/ /g, "-")
        .replace(/\//g, "");
    },
    handleProducTypeChange(value) {
      if (!this.form.product.attributes) {
        this.form.product.attributes = [];
      }
      if (!this.form.product.children) {
        this.form.product.children = { attributeOption: [] };
        this.form.product.productAttributeImage = [];
      }
      this.form.product.productTypeId = value;
    },
    getData: async function () {
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
      }

      let cat = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/category/categoryHierarchy`,
        null,
        this.$headers,
        null
      );

      if (cat.result == 1) {
        this.catagories = cat.detail;
      }

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/productDetail/${this.id}`,
        null,
        this.$headers,
        null
      );
      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.id == 0) {
          this.form.product.productTypeId = 1;
          this.form.product.attributes = [];
          this.form.product.children = { attributeOption: [] };
          this.form.product.productAttributeImage = [];
        }

        if (this.form.product.isSameLanguage) {
          this.imageLogoLang = "";
          this.languageActive = this.form.product.mainLanguageId;
        } else {
          var index = this.languageList
            .map(function (x) {
              return x.id;
            })
            .indexOf(this.form.product.mainLanguageId);
          this.imageLogoLang = this.languageList[index].imageUrl;
        }

        this.$isLoading = true;
      }
    },
    updateImageList(list) {
      this.form.product.productImage = list;
    },
    onDataChangeCategory(list) {
      this.dataCategoryHierarchy = { ...list };
      this.form.product.selectCategory = [...list.categoryList];
    },
    changeLanguage(id, index) {
      if (!this.form.product.isSameLanguage) {
        this.languageActive = id;
        this.imageLogoLang = this.languageList[index].imageUrl;
      }
    },
    useSameLanguage: async function () {
      Vue.nextTick(() => {
        if (this.form.product.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.product.mainLanguageId = this.languageActive;
          let data = this.form.product.translationList.filter(
            (val) => val.languageId == this.form.product.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.product.translationList.length;
                index++
              ) {
                this.form.product.translationList[index].name = data.name;
                this.form.product.translationList[index].description =
                  data.description;
                this.form.product.translationList[index].metaTitle =
                  data.metaTitle;
                this.form.product.translationList[index].metaKeyword =
                  data.metaKeyword;
                this.form.product.translationList[index].metaDescription =
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
          let data = this.form.product.translationList.filter(
            (val) => val.languageId != this.form.product.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.name = "";
              data.description = "";
              data.metaTitle = "";
              data.metaKeyword = "";
              data.metaDescription = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function () {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.product.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.product.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    setMeta: function (name, index) {
      this.form.product.translationList[index].metaTitle = name;
      this.form.product.translationList[index].metaKeyword = name;
      this.form.product.translationList[index].metaDescription = name;
      this.form.product.urlKey = name.replace(/ /g, "-").replace(/\//g, "");
    },
    checkForm: async function (flag) {
      var catLength = this.form.product.selectCategory.length;

      if (this.form.product.isSameLanguage) {
        await this.useSameLanguage();
      }
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        if (this.dataCategoryHierarchy.isLast != true) {
          this.errorText = "Please select all level of sub category";
          window.scrollTo(0, 150);
        }

        if (this.$v.form.product.children.attributeOption.$error == true) {
          //document.getElementById("combinationTable").scrollIntoView();
          window.scrollTo(0, 150);
        }

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

      if (catLength > 0) {
        if (this.dataCategoryHierarchy.isLast != true) {
          window.scrollTo(0, 150);
          this.errorText = "Please select all level of sub category";
          this.error = true;
          return;
        } else {
          //save
          this.isDisable = true;
          this.error = false;

          await this.form.product.productImage.forEach((item, index) => {
            item.sortOrder = index + 1;
          });

          if (flag == 1) this.form.product.isPublish = true;
          else this.form.product.isPublish = false;

          this.$refs.modalLoading.show();

          let resData = await this.$callApi(
            "post",
            `${this.$baseUrl}/api/product/productDetail/save`,
            null,
            this.$headers,
            this.form
          );

          this.modalMessage = resData.message;
          this.isDisable = false;
          this.$refs.modalLoading.hide();
          if (resData.result == 1) {
            //this.existId = resData.detail.id;
            this.$refs.modalAlert.show();

            setTimeout(() => {
              this.$router.push({ path: `/product` });
            }, 3000);
          } else {
            this.modalMessage = resData.detail[0];
            this.$refs.modalAlertError.show();
          }
        }
      }
    },
    btnDelete: async function () {
      this.$refs.isModalAlertConfirm.hide();

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
          this.$router.push({ path: `/product` });
        }, 3000);
      } else {
        this.$refs.modalAlertError.show();
      }
    },
    openModalDelete(name) {
      this.requestDeleteUser.userId = this.id;
      this.modalMessage =
        `${this.$t("doYouWantToDelete")} ` + name + ` ${this.$t("yesOrNo")} ?`;
      this.$refs.isModalAlertConfirm.show();
    },
    handleChangeImage(index, image) {
      this.form.product.productAttributeImage[index].imageUrl = image;
      //this.optionsImageList[optionIndex].options[index].imageUrl = image;
      // this.form.product.children.attributeOption[
      //   index
      // ].product.imageUrl = image;
    },
  },
};
</script>

<style scoped>
.store-type-box {
  border: 1px solid #bcbcbc;
  height: 300px;
  overflow-y: auto;
}

.view-txt {
  position: absolute;
  right: 0;
  top: 0;
  text-decoration: underline;
  color: #707070;
  z-index: 1;
}

.parent-cat {
  display: inline-block;
  position: relative;
  top: 5px;
  margin-left: 10px;
}

.pl-lv4-cb {
  margin-left: 55px;
}
.text-error {
  color: #ff0000;
  font-size: 14px;
}
.card-box .card-body {
  padding: 1.25rem;
}

.card-box {
  border: none;
}

.collapsed {
  margin-bottom: 1.5rem;
}

.input-group-txt {
  color: #16274a;
  border: 1px solid #bcbcbc;
  border-radius: 0px;
  padding: 5px 10px;
  height: 33px !important;
  font-size: 14px;
}

.input-group-txt-box .input-group-append {
  height: 33px !important;
  font-weight: bold !important;
  color: #092d53 !important;
}

.bg-gray {
  background: #dbdbdb;
  margin-right: -17px;
  margin-left: -21px;
}

.img-note {
  font-size: 12px;
  margin-left: 5px;
  width: 300px;
  display: contents;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  top: 4px;
}

.handle {
  max-width: calc(100% / 7);
  padding-right: 15px;
  /* padding-left: 15px; */
  width: 100%;
}

.img-list {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.view-txt {
  position: absolute;
  right: 15px;
  top: 0;
  text-decoration: underline;
  color: #707070;
  z-index: 1;
}

@media (max-width: 767.98px) {
  .handle {
    max-width: calc(100% / 3);
    padding-right: 5px;
    /* padding-left: 5px; */
  }

  .img-note {
    display: none;
  }
}
</style>
