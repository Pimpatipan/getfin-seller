<template>
  <div>
    <b-row class="mb-3" v-for="(item, index) in list" :key="index">
      <b-col sm="2">
        <label class="font-weight-bold main-label"
          >{{ $t("variation") }} #{{ index + 1 }}</label
        >
        <div
          v-if="
            item.option[0].label.length == 0 ||
              (!v.$each.$iter[index].label && v.$each.$iter[index].label.$error)
          "
        >
          <span class="text-error">{{ $t("enterAtLeastOption") }} </span>
        </div>
      </b-col>
      <b-col sm="10">
        <div class="ops-box py-3 px-4 position-relative">
          <div class="text-right delete-ops-icon">
            <font-awesome-icon
              icon="times-circle"
              class="text-secondary delete-icon pointer"
              @click="deleteOptions(index)"
            />
          </div>

          <b-form-group
            id="fieldset-horizontal"
            label-cols-sm="3"
            :label="$t('optionName')"
            label-for="ops-name"
            label-align-sm="right"
          >
            <b-form-input
              id="ops-name"
              class="input-ops"
              v-model="item.label"
              @keyup="onChangeOptionsName(index)"
            ></b-form-input>
            <div
              v-if="
                v.$each.$iter[index].label && v.$each.$iter[index].label.$error
              "
            >
              <span
                class="text-error"
                v-if="v.$each.$iter[index].label.required == false"
                >{{ $t("required") }}
              </span>
            </div>
          </b-form-group>

          <div v-for="(item2, index2) in item.option" :key="index2">
            <b-form-group
              id="fieldset-horizontal"
              label-cols-sm="3"
              :label="$t('options') + ' ' + (index2 + 1)"
              label-for="ops-1"
              label-align-sm="right"
            >
              <div class="d-flex">
                <b-form-input
                  id="ops-1"
                  class="input-ops"
                  v-model="item2.label"
                  @keyup="onChangeOptionsChoiceName(index, index2)"
                ></b-form-input>
                <div class="pl-2 pt-2">
                  <font-awesome-icon
                    icon="trash-alt"
                    class="text-danger delete-icon pointer"
                    v-if="index2 !== 0"
                    @click="deleteOptionsChoice(index, index2)"
                  />
                </div>
              </div>
              <div
                v-if="
                  v.$each.$iter[index].option.$each.$iter[index2].label &&
                    v.$each.$iter[index].option.$each.$iter[index2].label.$error
                "
              >
                <span
                  class="text-error"
                  v-if="
                    v.$each.$iter[index].option.$each.$iter[index2].label
                      .required == false
                  "
                  >{{ $t("required") }}
                </span>
              </div>
            </b-form-group>
          </div>

          <div
            class="create-ops-box m-auto pointer"
            @click="createOptionsChoice(index)"
          >
            + {{ $t("createNewOptions") }}
          </div>
        </div>
      </b-col>
    </b-row>

    <b-row v-if="list.length < 3">
      <b-col sm="2">
        <label class="font-weight-bold main-label">{{ $t("options") }}</label>
      </b-col>
      <b-col sm="10">
        <div class="create-ops-box pointer" @click="createOptions">
          + {{ $t("createNewOptions") }}
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";

export default {
  name: "ConfigOptions",
  components: {
    InputText
  },
  props: {
    vsku: {
      required: false,
      type: Object
    },
    parentSKU: {
      required: false,
      type: String
    },
    dataList: {
      required: false,
      type: Array
    },
    childrenObject: {
      required: false,
      type: Object
    },
    isEdit: {
      required: false,
      type: Boolean
    },
    productAttributeImage: {
      required: false,
      type: Array
    },
    v: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      list: this.dataList,
      displayOption: [],
      children: this.childrenObject,
      editFlag: this.isEdit,
      imageList: this.productAttributeImage,
      isDelete: false
    };
  },
  methods: {
    createOptions() {
      this.vsku.$touch();
      if (this.vsku.$error) {
        return;
      }
      this.list.push({
        id: 0,
        code: "",
        label: "",
        sortOrder: 0,
        option: [
          {
            id: 0,
            code: "",
            label: "",
            sortOrder: 1
          }
        ]
      });
      if (this.list.length == 1) {
        this.createChildren(0);
      } else if (this.list.length == 2) {
        this.createChildren(1);
      } else {
        this.createChildren(2);
      }

      this.$emit("handleCreateOptions", this.list);
    },
    createOptionsChoice(index) {
      this.list[index].option.push({
        id: 0,
        code: "",
        label: "",
        sortOrder: 1
      });
      this.createChildren(index);

      this.$emit("handleCreateOptionsChoice", this.list);
    },
    createChildren(index) {
      if (this.list.length === 1) {
        if (!this.editFlag) {
          this.children = {
            id: 0,
            code: this.list[0].code,
            label: this.list[0].label,
            attributeOption: []
          };
        }
        if (this.editFlag) {
          this.children.attributeOption.push({
            id: 0,
            code: this.list[0].option[this.list[0].option.length - 1].code,
            label: this.list[0].option[this.list[0].option.length - 1].label,
            sortOrder: 0,
            attributeMapperId: 0,
            attribute: null,
            product: {
              id: 0,
              rawPrice: 0.0,
              straightPrice: 0.0,
              sku: "",
              quantity: "",
              gp: 0,
              imageUrl: ""
            }
          });
          if (!this.isDelete) {
            this.imageList.push({
              productImageId: 0,
              attributeMapperId: 0,
              imageUrl: "",
              altTag: this.list[0].option[this.list[0].option.length - 1].code
            });
          }
        } else {
          if (!this.isDelete) {
            this.imageList = [];
          }
          this.list[0].option.forEach(element => {
            this.children.attributeOption.push({
              id: 0,
              code: element.code,
              label: element.label,
              sortOrder: 0,
              attributeMapperId: 0,
              attribute: null,
              product: {
                id: 0,
                rawPrice: 0.0,
                straightPrice: 0.0,
                sku: "",
                quantity: "",
                gp: 0,
                imageUrl: ""
              }
            });

            if (!this.isDelete) {
              this.imageList.push({
                productImageId: 0,
                attributeMapperId: 0,
                imageUrl: "",
                altTag: element.code
              });
            }
          });
        }

        this.children.attributeOption.forEach((element, index) => {
          element.product.sku = this.parentSKU + "-000" + (index + 1);
        });
      }
      if (this.list.length === 2) {
        if (index == 0) {
          this.children.attributeOption.push({
            id: 0,
            code: this.list[0].option[this.list[0].option.length - 1].code,
            label: this.list[0].option[this.list[0].option.length - 1].label,
            sortOrder: 0,
            attributeMapperId: 0,
            attribute: {
              id: 0,
              code: this.list[1].code,
              label: this.list[1].label,
              sortOrder: 1,
              attributeOption: []
            },
            product: null
          });

          this.list[1].option.forEach(option => {
            this.children.attributeOption[
              this.children.attributeOption.length - 1
            ].attribute.attributeOption.push({
              id: 0,
              code: option.code,
              label: option.label,
              sortOrder: 0,
              attributeMapperId: 0,
              attribute: null,
              product: {
                id: 0,
                rawPrice: 0.0,
                straightPrice: 0.0,
                sku: "",
                quantity: "",
                gp: 0,
                imageUrl: ""
              }
            });
          });
          if (!this.isDelete) {
            this.imageList.push({
              productImageId: 0,
              attributeMapperId: 0,
              imageUrl: "",
              altTag: this.list[0].option[this.list[0].option.length - 1].code
            });
          }
        }
        if (index == 1) {
          this.children.attributeOption.forEach(element => {
            element.product = null;
            if (!element.attribute) {
              element.attribute = {
                id: 0,
                code: this.list[1].code,
                label: this.list[1].label,
                sortOrder: 1,
                attributeOption: []
              };
            }

            if (element.attribute.attributeOption.length == 0) {
              this.list[1].option.forEach(element2 => {
                element.attribute.attributeOption.push({
                  id: 0,
                  code: element2.code,
                  label: element2.label,
                  sortOrder: 0,
                  attributeMapperId: 0,
                  attribute: null,
                  product: {
                    id: 0,
                    rawPrice: 0.0,
                    straightPrice: 0.0,
                    sku: "",
                    quantity: "",
                    gp: 0,
                    imageUrl: ""
                  }
                });
              });
            } else {
              element.attribute.attributeOption.push({
                id: 0,
                code: this.list[1].option[this.list[1].option.length - 1].code,
                label: this.list[1].option[this.list[1].option.length - 1]
                  .label,
                sortOrder: 0,
                attributeMapperId: 0,
                attribute: null,
                product: {
                  id: 0,
                  rawPrice: 0.0,
                  straightPrice: 0.0,
                  sku: "",
                  quantity: "",
                  gp: 0,
                  imageUrl: ""
                }
              });
            }
          });
        }
        let pcount = 0;
        this.children.attributeOption.forEach(element => {
          element.attribute.attributeOption.forEach(element2 => {
            pcount++;
            element2.product.sku = this.parentSKU + "-000" + pcount;
          });
        });
      }

      if (this.list.length === 3) {
        if (index == 0) {
          this.children.attributeOption.push({
            id: 0,
            code: this.list[0].option[this.list[0].option.length - 1].code,
            label: this.list[0].option[this.list[0].option.length - 1].label,
            sortOrder: 0,
            attributeMapperId: 0,
            attribute: {
              id: 0,
              code: this.list[1].code,
              label: this.list[1].label,
              sortOrder: 1,
              attributeOption: []
            },
            product: null
          });

          this.list[1].option.forEach(option => {
            this.children.attributeOption[
              this.children.attributeOption.length - 1
            ].attribute.attributeOption.push({
              id: 0,
              code: option.code,
              label: option.code,
              sortOrder: 0,
              attributeMapperId: 0,
              attribute: {
                id: 0,
                code: this.list[2].code,
                label: this.list[2].label,
                sortOrder: 1,
                attributeOption: []
              },
              product: null
            });
          });

          this.children.attributeOption[
            this.children.attributeOption.length - 1
          ].attribute.attributeOption.forEach(el => {
            this.list[2].option.forEach(option => {
              el.attribute.attributeOption.push({
                id: 0,
                code: option.code,
                label: option.label,
                sortOrder: 0,
                attributeMapperId: 0,
                attribute: null,
                product: {
                  id: 0,
                  rawPrice: 0.0,
                  straightPrice: 0.0,
                  sku: "",
                  quantity: "",
                  gp: 0,
                  imageUrl: ""
                }
              });
            });
          });
          if (!this.isDelete) {
            this.imageList.push({
              productImageId: 0,
              attributeMapperId: 0,
              imageUrl: "",
              altTag: this.list[0].option[this.list[0].option.length - 1].code
            });
          }
        }
        if (index == 1) {
          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption.push({
              id: 0,
              code: this.list[1].option[this.list[1].option.length - 1].code,
              label: this.list[1].option[this.list[1].option.length - 1].label,
              sortOrder: 0,
              attributeMapperId: 0,
              attribute: {
                id: 0,
                code: this.list[2].code,
                label: this.list[2].label,
                sortOrder: 1,
                attributeOption: []
              },
              product: null
            });

            this.list[2].option.forEach(option => {
              element.attribute.attributeOption[
                element.attribute.attributeOption.length - 1
              ].attribute.attributeOption.push({
                id: 0,
                code: option.code,
                label: option.label,
                sortOrder: 0,
                attributeMapperId: 0,
                attribute: null,
                product: {
                  id: 0,
                  rawPrice: 0.0,
                  straightPrice: 0.0,
                  sku: "",
                  quantity: "",
                  gp: 0,
                  imageUrl: ""
                }
              });
            });
          });
        }
        if (index == 2) {
          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption.forEach(element2 => {
              element2.product = null;
              if (!element2.attribute) {
                element2.attribute = {
                  id: 0,
                  code: this.list[2].code,
                  label: this.list[2].label,
                  sortOrder: 1,
                  attributeOption: []
                };
              }

              if (element2.attribute.attributeOption.length == 0) {
                this.list[2].option.forEach(element3 => {
                  element2.attribute.attributeOption.push({
                    id: 0,
                    code: element3.code,
                    label: element3.label,
                    sortOrder: 0,
                    attributeMapperId: 0,
                    attribute: null,
                    product: {
                      id: 0,
                      rawPrice: 0.0,
                      straightPrice: 0.0,
                      sku: "",
                      quantity: "",
                      gp: 0,
                      imageUrl: ""
                    }
                  });
                });
              } else {
                element2.attribute.attributeOption.push({
                  id: 0,
                  code: this.list[2].option[this.list[2].option.length - 1]
                    .code,
                  label: this.list[2].option[this.list[2].option.length - 1]
                    .label,
                  sortOrder: 0,
                  attributeMapperId: 0,
                  attribute: null,
                  product: {
                    id: 0,
                    rawPrice: 0.0,
                    straightPrice: 0.0,
                    sku: "",
                    quantity: "",
                    gp: 0,
                    imageUrl: ""
                  }
                });
              }
            });
          });
        }

        let pcount = 0;
        this.children.attributeOption.forEach(element => {
          element.attribute.attributeOption.forEach(element2 => {
            element2.attribute.attributeOption.forEach(element3 => {
              pcount++;
              element3.product.sku = this.parentSKU + "-000" + pcount;
            });
          });
        });
      }

      this.$emit("handleChildrenObject", this.children, this.imageList);
    },

    deleteOptions(index) {
      this.list.splice(index, 1);

      if (index !== 0) {
        this.isDelete = true;
      }
      if (this.list.length === 0) {
        this.children = { attributeOption: [] };
        // if (index == 0) {
        //   this.imageList = [];
        //   this.isDelete = true;
        // }
        this.isDelete = false;

        this.$emit("handleChildrenObject", this.children);
      } else if (this.list.length === 1) {
        this.children.attributeOption = [];
        this.editFlag = false;
        // if (index == 0) {
        //   this.isDelete = true;
        // }
        this.createChildren(index);
      } else if (this.list.length === 2) {
        this.children.attributeOption.forEach(element => {
          element.attribute.attributeOption = [];
        });
        if (index == 0) {
          //this.isDelete = true;
          this.createChildren(0);
        } else if (index == 1) {
          this.createChildren(1);
        } else {
          this.createChildren(index - 1);
        }

        // this.editFlag = false;
      }
    },

    deleteOptionsChoice(index, index2) {
      let label = this.list[index].option[index2].label;
      let target = this.imageList.findIndex(el => el.altTag === label);
      this.list[index].option.splice(index2, 1);
      if (this.list.length === 1) {
        this.children.attributeOption.splice(index2, 1);
        this.imageList.splice(target, 1);
      }

      if (this.list.length === 2) {
        if (index == 0) {
          this.children.attributeOption.splice(index2, 1);
          this.imageList.splice(target, 1);
        } else if (index == 1) {
          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption.splice(index2, 1);
          });
        }
      }
      if (this.list.length === 3) {
        if (index == 0) {
          this.children.attributeOption.splice(index2, 1);
          this.imageList.splice(target, 1);
        } else if (index == 1) {
          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption.splice(index2, 1);
          });
        } else if (index == 2) {
          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption.forEach(element2 => {
              element2.attribute.attributeOption.splice(index2, 1);
            });
          });
        }
      }
    },
    onChangeOptionsName(index) {
      this.list[index].code = this.list[index].label;
      if (this.list.length === 1) {
        this.children.code = this.list[0].code;
        this.children.label = this.list[0].label;
      } else if (this.list.length === 2) {
        this.children.code = this.list[0].code;
        this.children.label = this.list[0].label;
        this.children.attributeOption.forEach(element => {
          element.attribute.code = this.list[1].code;
          element.attribute.label = this.list[1].label;
        });
      } else if (this.list.length === 3) {
        this.children.code = this.list[0].code;
        this.children.label = this.list[0].label;
        this.children.attributeOption.forEach(element => {
          element.attribute.code = this.list[1].code;
          element.attribute.label = this.list[1].label;
          element.attribute.attributeOption.forEach(element2 => {
            element2.attribute.code = this.list[2].code;
            element2.attribute.label = this.list[2].label;
          });
        });
      }
      this.$emit("handleChangeOptionsName", this.list);
    },
    onChangeOptionsChoiceName(index, index2) {
      let code = this.list[index].option[index2].code;
      let target = 0;
      let childrenTarget = 0;

      if (this.list.length === 1) {
        if (this.children.attributeOption.length !== 0) {
          target = this.imageList.findIndex(el => el.altTag === code);
          childrenTarget = this.children.attributeOption.findIndex(
            el => el.code === code
          );
        }
        this.list[index].option[index2].code = this.list[index].option[
          index2
        ].label;
        this.children.attributeOption[childrenTarget].code = this.list[
          index
        ].option[index2].code;
        this.children.attributeOption[childrenTarget].label = this.list[
          index
        ].option[index2].label;

        this.imageList[target].altTag = this.list[index].option[index2].label;
      }

      if (this.list.length === 2) {
        if (index === 0) {
          if (this.children.attributeOption.length > 1) {
            target = this.imageList.findIndex(el => el.altTag === code);
            childrenTarget = this.children.attributeOption.findIndex(
              el => el.code === code
            );
          }
          this.list[index].option[index2].code = this.list[index].option[
            index2
          ].label;
          this.children.attributeOption[childrenTarget].code = this.list[
            index
          ].option[index2].code;
          this.children.attributeOption[childrenTarget].label = this.list[
            index
          ].option[index2].label;

          this.imageList[target].altTag = this.list[index].option[index2].label;
        }
        if (index === 1) {
          this.list[index].option[index2].code = this.list[index].option[
            index2
          ].label;

          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption[
              index2
            ].code = this.list[1].option[index2].code;
            element.attribute.attributeOption[
              index2
            ].label = this.list[1].option[index2].label;
          });
        }
      }

      if (this.list.length === 3) {
        if (index === 0) {
          if (this.children.attributeOption.length > 1) {
            target = this.imageList.findIndex(el => el.altTag === code);
            childrenTarget = this.children.attributeOption.findIndex(
              el => el.code === code
            );
          }
          this.list[index].option[index2].code = this.list[index].option[
            index2
          ].label;
          this.children.attributeOption[childrenTarget].code = this.list[
            index
          ].option[index2].code;
          this.children.attributeOption[childrenTarget].label = this.list[
            index
          ].option[index2].label;

          this.imageList[target].altTag = this.list[index].option[index2].label;
        }
        if (index === 1) {
          this.list[index].option[index2].code = this.list[index].option[
            index2
          ].label;

          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption[
              index2
            ].code = this.list[1].option[index2].code;
            element.attribute.attributeOption[
              index2
            ].label = this.list[1].option[index2].label;
          });
        }
        if (index === 2) {
          this.list[index].option[index2].code = this.list[index].option[
            index2
          ].label;

          this.children.attributeOption.forEach(element => {
            element.attribute.attributeOption.forEach(element2 => {
              element2.attribute.attributeOption[
                index2
              ].code = this.list[2].option[index2].code;
              element2.attribute.attributeOption[
                index2
              ].label = this.list[2].option[index2].label;
            });
          });
        }
      }
      // this.createChildren(this.imageList);
      this.$emit("onChangeOptionsChoiceName", this.list);
    }
  }
};
</script>

<style scoped>
.create-ops-box {
  color: #1085ff;
  border: 1px solid #1085ff;
  width: 300px;
  text-align: center;
  padding: 5px;
  font-weight: bold;
  border-style: dashed;
  background: #fff;
}

.ops-box {
  background: #f1f1f1;
}
.text-error {
  color: #ff0000;
  font-size: 14px;
}
.delete-ops-icon {
  position: absolute;
  right: 20px;
  z-index: 1;
}

.input-ops {
  width: 75%;
}

@media (max-width: 600px) {
  .input-ops,
  .create-ops-box {
    width: 100%;
  }
}
</style>
