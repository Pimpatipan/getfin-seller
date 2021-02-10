<template>
  <div v-if="profile">
    <b-alert
      show
      variant="danger"
      :class="[
        'd-flex m-0 justify-content-center',
        status.requestApproveLog.statusId != 1 ? 'alert' : 'warning',
      ]"
      v-if="$showAlert"
    >
      <img
        src="@/assets/images/sand-clock.png"
        alt="logo-alert-warning"
        class="logo-alert-warning"
        v-if="status.requestApproveLog.statusId == 1"
      />
      <img
        src="@/assets/images/alert.png"
        alt="logo-alert"
        class="logo-alert"
        v-else
      />
      <div class="w-100px my-auto text-center">{{ $t("attention") }}:</div>
      <div class="my-auto">
        {{
          status.requestApproveLog.statusId == 1
            ? $t("waitApprove")
            : $t("warningLogs")
        }}
      </div></b-alert
    >
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col cols="6">
            <h1 class="mr-sm-4 header-main text-uppercase">
              <span>{{ $t("profile") }}</span>
            </h1>
          </b-col>
          <b-col cols="6" class="text-right">
            <b-button
              class="btn-main width-auto"
              @click="requestApprove"
              :disabled="$hasChange"
              >{{ $t("requestApprove") }}</b-button
            >
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col class="">
            <b-tabs class="profile-index-tabs" v-if="warningData">
              <b-tab
                class="profile-tabs"
                :active="menu == 'general'"
                @click="
                  $router.push({
                    name: 'Profile',
                    params: { menu: 'general' },
                  })
                "
              >
                <template v-slot:title>
                  <span>{{ $t("general") }}</span>
                  <font-awesome-icon
                    icon="check-circle"
                    title="View"
                    class="ml-1 text-success"
                    v-if="
                      warningData[0].result &&
                      warningData[1].result &&
                      warningData[2].result &&
                      warningData[3].result
                    "
                  />
                  <font-awesome-icon
                    icon="times-circle"
                    title="View"
                    class="ml-1 text-danger"
                    v-else
                  />
                </template>
                <b-card-text class="mt-3">
                  <General
                    v-if="profile"
                    :dataObject="profile"
                    :dataWarningLog="warningData"
                    v-on:reloadData="getData"
                  />
                </b-card-text>
              </b-tab>
              <b-tab
                class=""
                :active="menu == 'sellerLogo'"
                @click="
                  $router.push({
                    name: 'Profile',
                    params: { menu: 'sellerLogo' },
                  })
                "
              >
                <template v-slot:title>
                  <span>{{ $t("sellerLogo") }}</span>
                  <font-awesome-icon
                    icon="times-circle"
                    title="View"
                    class="ml-1 text-danger"
                    v-if="!warningData[4].result"
                  />
                  <font-awesome-icon
                    icon="check-circle"
                    title="View"
                    class="ml-1 text-success"
                    v-else
                  />
                </template>
                <b-card-text class="mt-3">
                  <SellerLogo
                    v-if="profile"
                    :dataObject="seller"
                    :dataWarningLog="warningData"
                    v-on:reloadData="getData"
                  />
                </b-card-text>
              </b-tab>
              <b-tab
                class=""
                :active="menu == 'shipping'"
                @click="
                  $router.push({
                    name: 'Profile',
                    params: { menu: 'shipping' },
                  })
                "
              >
                <template v-slot:title>
                  <span>{{ $t("shipping") }}</span>
                  <font-awesome-icon
                    icon="times-circle"
                    title="View"
                    class="ml-1 text-danger"
                    v-if="!warningData[5].result"
                  />
                  <font-awesome-icon
                    icon="check-circle"
                    title="View"
                    class="ml-1 text-success"
                    v-else
                  />
                </template>
                <b-card-text class="mt-3">
                  <Shipping
                    v-if="profile"
                    :sellerUser="profile"
                    :dataWarningLog="warningData"
                    v-on:reloadData="getData"
                  />
                </b-card-text>
              </b-tab>
              <b-tab
                class=""
                :active="menu == 'invoice'"
                @click="
                  $router.push({
                    name: 'Profile',
                    params: { menu: 'invoice' },
                  })
                "
              >
                <template v-slot:title>
                  <span>{{ $t("invoiceNum") }}</span>
                  <font-awesome-icon
                    icon="times-circle"
                    title="View"
                    class="ml-1 text-danger"
                    v-if="!warningData[6].result"
                  />
                  <font-awesome-icon
                    icon="check-circle"
                    title="View"
                    class="ml-1 text-success"
                    v-else
                  />
                </template>
                <b-card-text class="mt-3">
                  <Invoice
                    v-if="profile"
                    :sellerInvoice="profile"
                    :dataWarningLog="warningData"
                    v-on:reloadData="getData"
                  />
                </b-card-text>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
      </b-container>
    </form>
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError
      ref="modalAlertError"
      :text="modalMessage"
      :detailtext="detailMessage"
    />
  </div>
</template>

<script>
// import InputSelect from "@/components/inputs/InputSelect";
// import ModalAlertConfirm from "@/components/modal/alert/ModalAlertConfirm";
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import General from "../profile/components/General";
import SellerLogo from "../profile/components/SellerLogo";
import Shipping from "../profile/components/Shipping";
import Invoice from "../profile/components/Invoice";
export default {
  name: "user",
  components: {
    General,
    SellerLogo,
    Shipping,
    Invoice,
    // InputSelect,
    // ModalAlertConfirm,
    ModalAlert,
    ModalAlertError,
  },
  data() {
    return {
      statusList: [],
      modalMessage: "",
      detailMessage: "",
      activeItem: "",
      menu: this.$route.params.menu || "general",
      profile: null,
      status: null,
      warningData: null,
      isDisable: false,
      iconStatus: "",
    };
  },
  created: async function () {
    await this.getData();
  },
  computed: {
    seller: function () {
      if (this.profile) {
        return this.profile.user;
      } else {
        return null;
      }
    },
  },
  methods: {
    getData: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Profile`,
        null,
        this.$headers,
        null
      );
      if (resData.result == 1) {
        this.profile = resData.detail;
        this.$isLoading = true;

        if (this.profile.user.seller.statusId == 2) this.$hasChange = true;
        else this.$hasChange = false;
      }

      let statusData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/WarningLog/Profile`,
        null,
        this.$headers,
        null
      );
      if (statusData.result == 1) {
        this.status = statusData.detail;
        this.warningData = statusData.detail.warningProfile;

        if (this.status.requestApproveLog.statusId != 2) {
          this.$showAlert = true;
        } else {
          this.$showAlert = false;
        }
      }
    },
    requestApprove: async function () {
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Profile/RequestApprove`,
        null,
        this.$headers,
        null
      );
      this.modalMessage = data.message;
      if (data.result == 1) {
        if (data.detail == 1) {
          this.$refs.modalAlert.show();
          setTimeout(() => {
            this.$refs.modalAlert.hide();
          }, 3000);
          this.getData();
        } else {
          this.$refs.modalAlertError.show();
        }
      } else {
        if (data.detail == "general_seller_account")
          this.detailMessage = this.$t("generalSellerAccountError");
        else if (data.detail == "general_business_profile")
          this.detailMessage = this.$t("generalBusinessProfileError");
        else if (data.detail == "general_bank_account")
          this.detailMessage = this.$t("generalBankAccountError");
        else if (data.detail == "general_warehouse_address")
          this.detailMessage = this.$t("generalWarehouseAddressError");
        else if (data.detail == "invoice_prefix")
          this.detailMessage = this.$t("invoiceError");
        else if (data.detail == "logo")
          this.detailMessage = this.$t("logoError");
        else if (data.detail == "shipping")
          this.detailMessage = this.$t("shippingError");

        this.$refs.modalAlertError.show();
      }
    },
  },
};
</script>

<style>
.btn-group-action button {
  background-color: transparent;
  border: none;
  padding-left: 0;
  padding-right: 20px !important;
}

.btn-group-action button:focus,
.btn-group-action button:hover,
.btn-group-action button:active {
  background-color: transparent !important;
  border: none;
  padding-left: 0;
  color: #ffb300 !important;
}

@media (max-width: 600px) {
  .width-auto {
    width: auto;
  }
}
</style>
