<template>
  <div>
    <b-row>
      <b-col>
        <b-table-simple small caption-top responsive class="combination-table">
          <b-thead head-variant="light">
            <b-tr>
              <!-- <b-th>
                {{ dataObject.label }}
              </b-th>
              <b-th
                v-if="
                  dataObject.attributeOption[0] &&
                    dataObject.attributeOption[0].attribute
                "
              >
                {{ dataObject.attributeOption[0].attribute.label }}
              </b-th>
              <b-th
                v-if="
                  dataObject.attributeOption[0] &&
                    dataObject.attributeOption[0].attribute &&
                    dataObject.attributeOption[0].attribute
                      .attributeOption[0] &&
                    dataObject.attributeOption[0].attribute.attributeOption[0]
                      .attribute
                "
              >
                {{
                  dataObject.attributeOption[0].attribute.attributeOption[0]
                    .attribute.label
                }}
              </b-th> -->
              <slot v-for="attr in attributes">
                <b-th>{{ attr.label }}</b-th>
              </slot>
              <b-th
                >{{ $t("salePrice") }} <span class="text-danger">*</span></b-th
              >
              <b-th
                >{{ $t("productPrice") }}
                <span class="text-danger">*</span></b-th
              >

              <b-th>{{ $t("stock") }} <span class="text-danger">*</span></b-th>
              <b-th>GP <span class="text-danger">*</span></b-th>
              <b-th>SKU <span class="text-danger">*</span></b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <slot v-for="(el1, index1) in dataObject.attributeOption">
              <template v-if="!el1.attribute">
                <b-tr>
                  <b-td class="w-50">
                    {{ el1.label }}
                  </b-td>

                  <b-td>
                    <b-form-input
                      class="input-children"
                      :class="{
                        'combitable-error':
                          v.$each.$iter[index1].product.straightPrice.$error
                      }"
                      @keypress="isNumber($event)"
                      @keyup="handleZero($event)"
                      v-model="el1.product.straightPrice"
                    ></b-form-input>
                  </b-td>
                  <b-td>
                    <b-form-input
                      class="input-children"
                      @keypress="isNumber($event)"
                      @keyup="handleZero($event)"
                      :class="{
                        'combitable-error':
                          v.$each.$iter[index1].product.rawPrice.$error
                      }"
                      v-model="el1.product.rawPrice"
                    ></b-form-input>
                  </b-td>
                  <b-td>
                    <b-form-input
                      class="input-children"
                      :class="{
                        'combitable-error':
                          v.$each.$iter[index1].product.quantity.$error
                      }"
                      @keypress="isNumber($event)"
                      v-model="el1.product.quantity"
                    ></b-form-input>
                  </b-td>
                  <b-td>
                    <b-form-input
                      class="input-children"
                      :class="{
                        'combitable-error':
                          v.$each.$iter[index1].product.gp.$error
                      }"
                      @keypress="isNumber($event)"
                      @keyup="handleZero($event)"
                      v-model="el1.product.gp"
                    ></b-form-input>
                  </b-td>
                  <b-td>
                    <b-form-input
                      class="input-children"
                      :class="{
                        'combitable-error':
                          v.$each.$iter[index1].product.sku.$error
                      }"
                      v-model="el1.product.sku"
                    ></b-form-input>
                  </b-td>
                </b-tr>
              </template>
              <template v-else>
                <slot v-for="(el2, index2) in el1.attribute.attributeOption">
                  <template v-if="!el2.attribute">
                    <b-tr>
                      <b-td
                        class=""
                        :rowspan="el1.attribute.attributeOption.length"
                        v-if="index2 == 0"
                      >
                        {{ el1.label }}
                      </b-td>
                      <b-td class="">
                        {{ el2.label }}
                      </b-td>

                      <b-td>
                        <b-form-input
                          class="input-children"
                          :class="{
                            'combitable-error':
                              v.$each.$iter[index1].attribute.attributeOption
                                .$each.$iter[index2].product.straightPrice
                                .$error
                          }"
                          @keypress="isNumber($event)"
                          @keyup="handleZero($event)"
                          v-model="el2.product.straightPrice"
                        ></b-form-input>
                      </b-td>
                      <b-td>
                        <b-form-input
                          class="input-children"
                          :class="{
                            'combitable-error':
                              v.$each.$iter[index1].attribute.attributeOption
                                .$each.$iter[index2].product.rawPrice.$error
                          }"
                          @keypress="isNumber($event)"
                          @keyup="handleZero($event)"
                          v-model="el2.product.rawPrice"
                        ></b-form-input>
                      </b-td>
                      <b-td>
                        <b-form-input
                          class="input-children"
                          :class="{
                            'combitable-error':
                              v.$each.$iter[index1].attribute.attributeOption
                                .$each.$iter[index2].product.quantity.$error
                          }"
                          @keypress="isNumber($event)"
                          v-model="el2.product.quantity"
                        ></b-form-input>
                      </b-td>
                      <b-td>
                        <b-form-input
                          class="input-children"
                          :class="{
                            'combitable-error':
                              v.$each.$iter[index1].attribute.attributeOption
                                .$each.$iter[index2].product.gp.$error
                          }"
                          @keypress="isNumber($event)"
                          @keyup="handleZero($event)"
                          v-model="el2.product.gp"
                        ></b-form-input>
                      </b-td>
                      <b-td>
                        <b-form-input
                          class="input-children"
                          :class="{
                            'combitable-error':
                              v.$each.$iter[index1].attribute.attributeOption
                                .$each.$iter[index2].product.sku.$error
                          }"
                          v-model="el2.product.sku"
                        ></b-form-input>
                      </b-td>
                    </b-tr>
                  </template>
                  <template v-else>
                    <slot
                      v-for="(el3, index3) in el2.attribute.attributeOption"
                    >
                      <b-tr>
                        <b-td
                          class=""
                          :rowspan="
                            el2.attribute.attributeOption.length *
                              el1.attribute.attributeOption.length
                          "
                          v-if="index2 === 0 && index3 === 0"
                        >
                          {{ el1.label }}
                        </b-td>
                        <b-td
                          class=""
                          :rowspan="el2.attribute.attributeOption.length"
                          v-if="index3 === 0"
                        >
                          {{ el2.label }}
                        </b-td>
                        <b-td class="">
                          {{ el3.label }}
                        </b-td>

                        <b-td>
                          <b-form-input
                            class="input-children"
                            :class="{
                              'combitable-error':
                                v.$each.$iter[index1].attribute.attributeOption
                                  .$each.$iter[index2].attribute.attributeOption
                                  .$each.$iter[index3].product.straightPrice
                                  .$error
                            }"
                            @keypress="isNumber($event)"
                            @keyup="handleZero($event)"
                            v-model="el3.product.straightPrice"
                          ></b-form-input>
                        </b-td>
                        <b-td>
                          <b-form-input
                            class="input-children"
                            :class="{
                              'combitable-error':
                                v.$each.$iter[index1].attribute.attributeOption
                                  .$each.$iter[index2].attribute.attributeOption
                                  .$each.$iter[index3].product.rawPrice.$error
                            }"
                            @keypress="isNumber($event)"
                            @keyup="handleZero($event)"
                            v-model="el3.product.rawPrice"
                          ></b-form-input>
                        </b-td>
                        <b-td>
                          <b-form-input
                            class="input-children"
                            @keypress="isNumber($event)"
                            :class="{
                              'combitable-error':
                                v.$each.$iter[index1].attribute.attributeOption
                                  .$each.$iter[index2].attribute.attributeOption
                                  .$each.$iter[index3].product.quantity.$error
                            }"
                            v-model="el3.product.quantity"
                          ></b-form-input>
                        </b-td>
                        <b-td>
                          <b-form-input
                            class="input-children"
                            @keypress="isNumber($event)"
                            @keyup="handleZero($event)"
                            :class="{
                              'combitable-error':
                                v.$each.$iter[index1].attribute.attributeOption
                                  .$each.$iter[index2].attribute.attributeOption
                                  .$each.$iter[index3].product.gp.$error
                            }"
                            v-model="el3.product.gp"
                          ></b-form-input>
                        </b-td>
                        <b-td>
                          <b-form-input
                            class="input-children"
                            :class="{
                              'combitable-error':
                                v.$each.$iter[index1].attribute.attributeOption
                                  .$each.$iter[index2].attribute.attributeOption
                                  .$each.$iter[index3].product.sku.$error
                            }"
                            v-model="el3.product.sku"
                          ></b-form-input>
                        </b-td>
                      </b-tr>
                    </slot>
                  </template>
                </slot>
              </template>
            </slot>
          </b-tbody>
        </b-table-simple>
      </b-col>
    </b-row>
  </div>
  <!-- <b-row class="mt-2" v-if="dataList[0].options.name !== ''">
    <b-col>
      <b-table-simple small caption-top responsive>
        <b-thead head-variant="light">
          <b-tr>
            <b-th v-for="(item, index) in dataList" :key="index">{{
              item.name
            }}</b-th>
            <b-th>Price</b-th>
            <b-th>Stock</b-th>
            <b-th>SKU</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <template v-if="dataList.length == 1">
            <b-tr v-for="(el1, index1) in dataList[0].options" :key="index1">
              <b-td>
                {{ el1.name }}
              </b-td>
              <b-td>
                {{ dataList[0].price }}
              </b-td>
              <b-td>
                {{ dataList[0].stock }}
              </b-td>
              <b-td>
                {{ dataList[0].sku }}
              </b-td>
            </b-tr>
          </template>
          <template v-if="dataList.length == 2">
            <slot v-for="el1 in dataList[0].options">
              <slot v-for="(el2, index2) in dataList[1].options">
                <b-tr>
                  <b-td
                    :rowspan="dataList[1].options.length"
                    v-if="index2 == 0"
                  >
                    {{ el1.name }}
                  </b-td>
                  <b-td>
                    {{ el2.name }}
                  </b-td>
                  <b-td>
                    {{ dataList[0].price }}
                  </b-td>
                  <b-td>
                    {{ dataList[0].stock }}
                  </b-td>
                  <b-td>
                    {{ dataList[0].sku }}
                  </b-td>
                </b-tr>
              </slot>
            </slot>
          </template>
          <template v-if="dataList.length == 3">
            <slot v-for="el1 in dataList[0].options">
              <slot v-for="(el2, index2) in dataList[1].options">
                <slot v-for="(el3, index3) in dataList[2].options">
                  <b-tr>
                    <b-td
                      :rowspan="
                        dataList[2].options.length * dataList[1].options.length
                      "
                      v-if="index2 === 0 && index3 === 0"
                    >
                      {{ el1.name }}
                    </b-td>
                    <b-td
                      :rowspan="dataList[2].options.length"
                      v-if="index3 === 0"
                    >
                      {{ el2.name }}
                    </b-td>
                    <b-td>
                      {{ el3.name }}
                    </b-td>
                    <b-td>
                      {{ dataList[0].price }}
                    </b-td>
                    <b-td>
                      {{ dataList[0].stock }}
                    </b-td>
                    <b-td>
                      {{ dataList[0].sku }}
                    </b-td>
                  </b-tr>
                </slot>
              </slot>
            </slot>
          </template>
        </b-tbody>
      </b-table-simple>
    </b-col>
  </b-row> -->
</template>

<script>
export default {
  name: "CombinationTable",
  props: {
    dataObject: {
      required: false,
      type: Object
    },
    attributes: {
      required: false,
      type: Array
    },
    v: {
      required: false,
      type: Object
    }
  },
  created() {},
  methods: {
    handleZero: function(evt) {
      let value = evt.target.value;
      value = value.replace(/^0+/, "");
      evt.target.value = value;
    },
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;

      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.input-children {
  width: 100%;
}
.text-error {
  color: #ff0000;
  font-size: 14px;
}
.combitable-error {
  border-color: red;
}
.combination-table.table thead th,
.table td {
  border: 1px solid #ebebeb;
}

@media (max-width: 600px) {
  .input-children {
    width: 100px;
  }
}
</style>
