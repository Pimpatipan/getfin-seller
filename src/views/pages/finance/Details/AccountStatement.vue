<template>
  <div class="w-100 mt-2">
    <!-- <b-container class="container-box"> -->
    <b-row class="no-gutters mt-1">
      <b-col class="px-3" lg="4">
        <b-row class="bg-white p-3">
          <b-col class="">
            <b-row class="">
              <b-col class="p-0">
                <label class="main-label">{{ $t("earning") }}</label>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="p-0">
                <label class="sacondary-label statement-label">{{
                  $t("amtToRecieve")
                }}</label>
              </b-col>
            </b-row>
            <b-row class="my-2">
              <b-col class="p-0">
                <label class="main-label"
                  >฿ {{ openObject.closingBalance | numeral("0,0.00") }}</label
                >
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col class="p-0">
                <label class="main-label">{{ $t("paymentMethod") }}</label>
              </b-col>
            </b-row>
            <b-row class="py-3 bank-panel mt-1">
              <b-col class="" cols="3" sm="1" lg="3" xl="2">
                <img
                  src="@/assets/images/acct-statement.png"
                  class="finance-icon"
                  alt=""
                />
              </b-col>
              <b-col class="" cols="9">
                <div>
                  <label class="mb-0">{{ openObject.accountNumber }}</label>
                </div>
                <div>
                  <label class="sacondary-label statement-label">{{
                    openObject.bankName
                  }}</label>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="px-3" lg="8">
        <b-row class="bg-white p-3 finance-box">
          <b-col>
            <b-row>
              <b-col class="p-0" sm="3">
                <label class="main-label mt-2">{{
                  $t("statementStatus")
                }}</label>
              </b-col>
              <b-col class="p-0 my-1" cols="6" sm="12" lg="3">
                <datetime
                  :placeholder="$t('startDate')"
                  v-model="filter.StartDate"
                  @close="hanedleDateChange"
                  class="date-filter"
                ></datetime>
              </b-col>

              <b-col class="p-0 my-1" cols="6" sm="12" lg="3">
                <datetime
                  :placeholder="$t('endDate')"
                  @close="hanedleDateChange"
                  v-model="filter.EndDate"
                  class="date-filter"
                >
                </datetime>
              </b-col>
              <b-col
                sm="12"
                lg="3"
                class="d-flex justify-content-end px-0 px-lg-3"
              >
                <button
                  type="button"
                  class="btn btn-link px-2 py-1"
                  @click="onClearFilter()"
                >
                  {{ $t("clear") }}
                </button>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col class="p-0">
                <b-button-group
                  class="btn-group-status d-inline-flex d-inline-md-block"
                >
                  <b-button
                    :class="{
                      menuactive: isActive(1),
                    }"
                    @click="onGetStatus(1)"
                  >
                    {{ $t("open") }}
                  </b-button>
                  <b-button
                    :class="{ menuactive: isActive(2) }"
                    @click="onGetStatus(2)"
                  >
                    {{ $t("paid") }}
                  </b-button>
                </b-button-group>
              </b-col>
              <b-col> </b-col>
            </b-row>
            <div v-if="activeItem === 1">
              <b-row class="statement-panel" v-if="!isDisable">
                <b-col>
                  <div>
                    <b-row class="">
                      <b-col class="p-0">
                        <b-button
                          v-b-toggle="'collapse-1'"
                          class="collapse-statement-btn py-3 px-0"
                        >
                          <span class="collapse-statement-btn-label">
                            {{ $t("statementNumber") }} :
                            {{ openObject.statementNumber }}
                          </span>

                          <font-awesome-icon
                            icon="chevron-right"
                            color="#575757"
                            class="icon mt-1 when-close"
                            :class="{ 'float-right': activeItem == 2 }"
                          />
                          <font-awesome-icon
                            icon="chevron-down"
                            color="#575757"
                            class="icon mt-1 when-open"
                            :class="{ 'float-right': activeItem == 2 }"
                          />

                          <label class="my-1 float-right mr-3"
                            >฿
                            {{ openObject.subtotal | numeral("0,0.00") }}</label
                          >

                          <div class="when-close">
                            <span class="statement-label">
                              {{ openObject.startDate | moment($formatDate) }} -
                              {{ openObject.endDate | moment($formatDate) }}
                            </span>
                          </div>
                        </b-button>

                        <b-collapse
                          :id="'collapse-1'"
                          class="collapse-statement"
                          :visible="activeItem == 1"
                        >
                          <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col class="my-1">
                              <label
                                >{{
                                  openObject.startDate | moment($formatDate)
                                }}
                                -
                                {{
                                  openObject.endDate | moment($formatDate)
                                }}</label
                              >
                            </b-col>
                            <b-col class="d-flex justify-content-end">
                              <label class="my-1"
                                >฿
                                {{
                                  openObject.subtotal | numeral("0,0.00")
                                }}</label
                              >
                            </b-col>
                          </b-row>
                          <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col>
                              <label class="my-1">{{
                                $t("openBalance")
                              }}</label>
                            </b-col>
                            <b-col class="d-flex justify-content-end">
                              <label class="my-1"
                                >฿
                                {{
                                  openObject.grandTotal | numeral("0,0.00")
                                }}</label
                              >
                            </b-col>
                          </b-row>
                          <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("itemPriceCredit") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.itemPriceCredit
                                        | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label
                                    >{{ $t("shippingFee") }} (
                                    {{ $t("paidByCus") }} )</label
                                  >
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.shippingFeeCustomer
                                        | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("getfinFee") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.getfinFee | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("omiseTotal") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.paymentFee
                                        | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                                     <b-row>
                                <b-col class="ml-2">
                                  <label>- {{ $t("omiseWithdraw") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      30 | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col class="ml-2">
                                  <label>- {{ $t("omiseCharge") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.omiseCharge | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col class="ml-2">
                                  <label>- {{ $t("omiseVat") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.omiseVat | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                            </b-col>
                          </b-row>
                          <!-- <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("subTotal") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.subtotal | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("closeBalance") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      openObject.closingBalance
                                        | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                            </b-col>
                          </b-row> -->
                          <b-row
                            class="mx-3 py-3 collapse-element-border collapse-statement-label-custom"
                          >
                            <b-col>
                              <label class="my-1"
                                >{{ $t("payoutAmt") }} (THB)</label
                              >
                            </b-col>
                            <b-col class="d-flex justify-content-end">
                              <label
                                >฿
                                {{
                                  openObject.grandTotal | numeral("0,0.00")
                                }}</label
                              >
                            </b-col>
                          </b-row>
                        </b-collapse>
                      </b-col>
                    </b-row>
                  </div>
                </b-col>
              </b-row>
              <b-row v-else>
                <b-col class="text-center text-secondary border-nodate-top">
                  <div class="p-5">
                    <span>
                      {{ $t("noData") }}
                    </span>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-if="activeItem === 2">
              <b-row
                class="statement-panel"
                v-if="statementLists.length > 0 && !isBusy"
              >
                <b-col>
                  <div v-for="(item, index) in statementLists" :key="index">
                    <b-row class="">
                      <b-col class="p-0">
                        <b-button
                          v-b-toggle="'collapse-' + index"
                          class="collapse-statement-btn-paid p-2 my-1"
                        >
                          <b-row>
                            <b-col cols="5">
                              <span class="">
                                ฿ {{ item.subtotal | numeral("0,0.00") }}
                              </span>

                              <div class="mt-2 statement-label">
                                {{ item.startDate | moment($formatDate) }} -
                                {{ item.endDate | moment($formatDate) }}
                              </div>
                            </b-col>
                            <b-col cols="6" class="border-left">
                              <span>
                                <label class="mb-1">{{
                                  item.accountNumber
                                }}</label>
                                <br />
                                <label
                                  class="sacondary-label statement-label"
                                  >{{ item.bankName }}</label
                                >
                              </span>
                            </b-col>
                            <b-col cols="1">
                              <font-awesome-icon
                                icon="chevron-right"
                                color="#575757"
                                id="statement-icon"
                                class="icon mt-1"
                                :class="{ 'float-right': activeItem == 2 }"
                              />
                              <font-awesome-icon
                                icon="chevron-down"
                                color="#575757"
                                id="statement-icon"
                                class="icon mt-1"
                                :class="{ 'float-right': activeItem == 2 }"
                              />
                            </b-col>
                          </b-row>
                        </b-button>
                        <b-collapse
                          :id="'collapse-' + index"
                          class="collapse-statement"
                          :visible="index == 0"
                        >
                          <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col class="my-1">
                              <label
                                >{{ item.startDate | moment($formatDate) }} -
                                {{ item.endDate | moment($formatDate) }}</label
                              >
                            </b-col>
                            <b-col class="d-flex justify-content-end">
                              <label class="my-1"
                                >฿
                                {{ item.subtotal | numeral("0,0.00") }}</label
                              >
                            </b-col>
                          </b-row>
                          <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col>
                              <label class="my-1">{{
                                $t("openBalance")
                              }}</label>
                            </b-col>
                            <b-col class="d-flex justify-content-end">
                              <label class="my-1"
                                >฿
                                {{ item.grandTotal | numeral("0,0.00") }}</label
                              >
                            </b-col>
                          </b-row>
                          <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("itemPriceCredit") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.itemPriceCredit | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label
                                    >{{ $t("shippingFee") }} (
                                    {{ $t("paidByCus") }} )</label
                                  >
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.shippingFeeCustomer
                                        | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("paymentFee") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.paymentFee | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("getfinFee") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.getfinFee | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("affiliateFee") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.affiliateFee | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("shippingFee") }}</label>
                                  ( {{ $t("paidBySeller") }} )
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.shippingFeeSeller | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                            </b-col>
                          </b-row>
                          <b-row class="mx-3 py-3 collapse-element-border">
                            <b-col>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("subTotal") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.subtotal | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col>
                                  <label>{{ $t("closeBalance") }}</label>
                                </b-col>
                                <b-col class="d-flex justify-content-end">
                                  <label
                                    >฿
                                    {{
                                      item.closingBalance | numeral("0,0.00")
                                    }}</label
                                  >
                                </b-col>
                              </b-row>
                            </b-col>
                          </b-row>
                          <b-row
                            class="mx-3 py-3 collapse-element-border collapse-statement-label-custom"
                          >
                            <b-col>
                              <label class="my-1"
                                >{{ $t("payoutAmt") }} (THB)</label
                              >
                            </b-col>
                            <b-col class="d-flex justify-content-end">
                              <label
                                >฿
                                {{ item.grandTotal | numeral("0,0.00") }}</label
                              >
                            </b-col>
                          </b-row>
                          <b-row
                            v-if="activeItem == 2"
                            class="mx-3 py-3 collapse-element-border collapse-statement-label-custom"
                          >
                            <b-col>
                              <button
                                type="button"
                                class="btn btn-info w-100 btn-details-set ml-md-2 text-uppercase"
                                @click="onNavigate()"
                              >
                                <u>See more</u>
                              </button>
                            </b-col>
                          </b-row>
                        </b-collapse>
                      </b-col>
                    </b-row>
                  </div>
                </b-col>
              </b-row>
              <b-row v-else>
                <b-col class="text-center text-secondary border-nodate-top">
                  <div class="p-5">
                    <span>
                      {{ $t("noData") }}
                    </span>
                  </div>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- </b-container> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: 23901.25,
      isDisable: false,
      activeItem: 1,
      statementLists: [],
      isBusy: false,
      paidLists: [],
      openObject: {},
      filter: {
        StartDate: "",
        EndDate: "",
        perPage: 10,
        pageNo: 1,
      },
    };
  },
  created: async function () {
    await this.getList();
  },
  methods: {
    getList: async function () {
      this.isBusy = true;
      this.isDisable = true;
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Finance/Open`,
        null,
        this.$headers,
        null
      );
      this.statementLists = [];
      if (resData.result == 1) {
        this.openObject = resData.detail;
        this.statementLists.push(resData.detail);
        if (this.openObject.grandTotal !== 0) {
          this.isDisable = false;
        }
        // this.rows = resData.detail.totalData;
        // this.statusList = resData.detail.overviewCount;

        this.isBusy = false;
        this.$isLoading = true;
      }
    },
    getPaidLists: async function () {
      this.isBusy = true;

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Finance/Paid`,
        null,
        this.$headers,
        this.filter
      );
      if (resData.result == 1) {
        this.statementLists = resData.detail.dataList;
        if (this.statementLists.length > 0) {
          this.isBusy = false;
        }

        // this.rows = resData.detail.totalData;
        // this.statusList = resData.detail.overviewCount;
      }
    },
    isActive: function (menuItem) {
      return this.activeItem == menuItem;
    },
    hanedleDateChange() {
      this.activeItem = 2;
      this.getPaidLists();
    },
    onGetStatus(flag) {
      this.activeItem = flag;
      if (flag == 1) this.getList();
      if (flag == 2) this.getPaidLists();
    },
    onNavigate() {
      this.$router.push("/finance/order");
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageNo = 1;
        this.getList();
      }
    },
    onClearFilter() {
      this.filter.search = "";
      this.filter.pageNo = 1;
      this.filter.StartDate = null;
      this.filter.EndDate = null;

      this.getPaidLists();
    },
    btnSearch() {
      this.filter.pageNo = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.bank-panel {
  border: #ebebeb solid 1px;
}
.collapse-statement-btn {
  width: 100%;
  text-align: left;
  background-color: white;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-bottom: none;
  border-top-color: #f1f1f1;
  color: #575757;
}
.collapse-statement-btn-paid {
  width: 100%;
  text-align: left;
  background-color: white;
  border-radius: 0;
  border: 1px solid #f1f1f1;

  color: #575757;
}
.statement-label {
  font-size: 14px;
}
.collapse-statement {
  background-color: #f1f1f1;
  color: #575757;
  font-size: 14px;
}
.border-nodate-top {
  border-top: 1px solid #f1f1f1;
}
.statement-panel {
  overflow-x: auto;
  max-height: calc(100vh / 0.5);
}
.collapse-element-border {
  border-bottom: 1px solid #ebebeb;
}
.collapse-statement-btn-label {
  color: #1085ff;
  font-size: 14px;
}
.collapsed > .when-open,
.not-collapsed > .when-close {
  display: none;
}
.collapsed > .row > .col-1 > .fa-chevron-down,
.not-collapsed > .row > .col-1 > .fa-chevron-right {
  display: none;
}

.collapse-statement-label-custom {
  font-size: 16px;
  font-weight: bold;
}
.payment-action {
  color: #1085ff;
  cursor: pointer;
}
.finance-icon {
  width: auto;
  height: 40px;
}
.date-statement-filter {
  background-color: #f8f8f8;
  border: 10px !important;
  color: #dbdbdb;
  width: 10px;
  height: 40px;
}
.finance-box {
  min-height: 70vh;
}
</style>
