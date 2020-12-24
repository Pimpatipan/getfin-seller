<template>
  <div class="w-100">
    <form class="form-box">
      <b-container class="px-0">
        <b-tabs class="mt-2 profile-general-tabs">
          <b-tab active>
            <template v-slot:title>
              <span>{{ $t("sellerAccount") }}</span>
              <font-awesome-icon
                icon="check-circle"
                title="View"
                class="ml-1 text-success"
                v-if="warningLogs[0].result"
              />
              <font-awesome-icon
                icon="times-circle"
                title="View"
                class="ml-1 text-danger"
                v-else
              />
            </template>
            <SellerAccount
              :dataObject="sellerAccount"
              :note="warningLogs[0].warningLog.note"
              v-on:reloadData="reloadData"
            />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <span>{{ $t("businessInformation") }}</span>
              <font-awesome-icon
                icon="check-circle"
                title="View"
                class="ml-1 text-success"
                v-if="warningLogs[1].result"
              />
              <font-awesome-icon
                icon="times-circle"
                title="View"
                class="ml-1 text-danger"
                v-else
              />
            </template>
            <BusinessInfo
              :dataObject="businessInformation"
              :note="warningLogs[1].warningLog.note"
              v-on:reloadData="reloadData"
            />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <span>{{ $t("bankAccount") }}</span>
              <font-awesome-icon
                icon="check-circle"
                title="View"
                class="ml-1 text-success"
                v-if="warningLogs[2].result"
              />
              <font-awesome-icon
                icon="times-circle"
                title="View"
                class="ml-1 text-danger"
                v-else
              />
            </template>
            <BankAccount
              :dataObject="bankAccount"
              :note="warningLogs[2].warningLog.note"
              v-on:reloadData="reloadData"
              :isApprove="isApproved"
            />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <span>{{ $t("warehouseAddress") }}</span>
              <font-awesome-icon
                icon="check-circle"
                title="View"
                class="ml-1 text-success"
                v-if="warningLogs[3].result"
              />
              <font-awesome-icon
                icon="times-circle"
                title="View"
                class="ml-1 text-danger"
                v-else
              />
            </template>
            <WarehouseAddress
              :dataObject="warehouseAddress"
              :note="warningLogs[3].warningLog.note"
              v-on:reloadData="reloadData"
            />
          </b-tab>
        </b-tabs>
      </b-container>
    </form>
  </div>
</template>

<script>
// import ModalAlertConfirm from "@/components/modal/alert/ModalAlertConfirm";
// import ModalAlert from "@/components/modal/alert/ModalAlert";
// import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import SellerAccount from "../components/details/SellerAccountSection";
import BusinessInfo from "../components/details/BusinessInformationSection";
import BankAccount from "../components/details/BankAccountSection";
import WarehouseAddress from "../components/details/WarehouseAddressSection";
export default {
  name: "user",
  components: {
    SellerAccount,
    BusinessInfo,
    BankAccount,
    WarehouseAddress,
    // ModalAlertConfirm,
    // ModalAlert,
    // ModalAlertError,
  },
  props: {
    dataObject: {
      required: false,
      type: Object,
    },
    dataWarningLog: {
      required: false,
      type: Object | Array,
    },
  },
  data() {
    return {
      statusList: [],
      isApproved: false,
      modalMessage: "",
      activeItem: "seller-account",
      requestDeleteUser: {
        userId: null,
      },
      items: [],
      isBusy: false,
      rows: 0,
      totalRowMessage: "",
    };
  },
  created: async function () {
    this.isApproved = this.dataObject.isApproved;
    //this.warningLogs = this.dataWarningLog;
  },
  computed: {
    bankAccount: function () {
      return this.dataObject.bankAccount;
    },
    sellerAccount: function () {
      return this.dataObject.user;
    },
    warehouseAddress: function () {
      return this.dataObject.userWarehouseAddress;
    },
    businessInformation: function () {
      return this.dataObject.businessInformation;
    },
    warningLogs: function () {
      return this.dataWarningLog;
    },
  },
  methods: {
    reloadData() {
      this.$emit("reloadData");
    },
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
  },
};
</script>

<style scoped>
.menuactive {
  color: #ffb300 !important;
}
</style>
