<template>
  <CSidebar
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <!-- <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        id="logo-main"
        size="custom-size"
        :height="56"
        viewBox="0 0 556 134"
      />
      <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 110 134"
      />-->
      <div
        class="m-auto logo-temp text-uppercase text-center w-100"
        :class="[{ 'd-none': minimize }]"
      >
        <div
          class="imgLogo"
          v-bind:style="{
            'background-image': 'url(' + imgLogo + ')',
          }"
        ></div>
      </div>
    </CSidebarBrand>
    <div class="text-center mt-2 pt-2" :class="[{ 'd-none': minimize }]">
      <div
        class="img-profile"
        v-bind:style="{
          'background-image': 'url(' + img + ')',
        }"
      ></div>
      <h4 class="font-weight-bold mt-2 username">{{ name }} {{ lastname }}</h4>

      <b-row class="no-gutters py-3 user-btn mt-4">
        <b-col>
          <router-link :to="'/profile/general'" class="text-white no-underline">
            <div>
              <font-awesome-icon icon="user" />
            </div>
            <p class="m-0">{{ $t("profile") }}</p>
          </router-link>
        </b-col>
        <b-col class="pointer" @click.prevent="handleLogout">
          <div>
            <font-awesome-icon icon="power-off" />
          </div>
          <p class="m-0">{{ $t("logout") }}</p>
        </b-col>
      </b-row>
    </div>
    <CRenderFunction flat :contentToRender="sidebarItems" />
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="$store.commit('toggle', 'sidebarMinimize')"
    />

    <ModalAlertConfirm
      :msg="$t('logout')"
      :text="modalMessage"
      colorBtnConfirm="primary"
      :btnCancel="$t('no')"
      :btnConfirm="$t('yes')"
      ref="isModalAlertConfirm"
      @confirm="logout"
    />

    <ModalLoading ref="modalLoading" :hasClose="false" />
  </CSidebar>
</template>

<script>
import SidebarItems from "./SidebarItems";
import { mapState } from "vuex";
import ModalAlertConfirm from "@/components/modal/alert/ModalAlertConfirm";
import VueCookies from "vue-cookies";
import ModalLoading from "@/components/modal/alert/ModalLoading";

export default {
  name: "TheSidebar",
  extends: SidebarItems,
  components: {
    ModalAlertConfirm,
    ModalLoading,
  },
  data() {
    return {
      modalMessage: `${this.$t("logoutMsg")}`,
      name: "",
      lastname: "",
      img: "",
      imgLogo: "",
    };
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    ...mapState({
      minimize: (state) => state.sidebarMinimize,
    }),
  },
  mounted: async function () {
    this.name = VueCookies.get("username");
    this.getProfileInfo();
    this.getLogo();
  },
  methods: {
    handleLogout() {
      this.$refs.isModalAlertConfirm.show();
    },
    logout: async function () {
      this.$refs.isModalAlertConfirm.hide();
      this.$refs.modalLoading.show();

      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/logout`,
        null,
        this.$headers,
        null
      );
      this.$cookies.remove("seller-token");
      window.location.href = "/login";
    },
    getProfileInfo: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Profile/ShortProfile`,
        null,
        this.$headers,
        null
      );

      if (resData.result == 1) {
        this.img = resData.detail.userDetail.seller.logo;
        this.name = resData.detail.userDetail.firstname;
        this.lastname = resData.detail.userDetail.lastname;

        if (resData.detail.userDetail.seller.statusId == 2)
          this.$IsVerified = true;
        else this.$IsVerified = false;
      }
    },
    getLogo: async function () {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/setting/Logo`,
        null,
        this.$headers,
        null
      );
      this.imgLogo = resData.detail;
    },
    handleResize() {
      this.$screenSize.width = window.innerWidth;
      this.$screenSize.height = window.innerHeight;
    },
  },
  async created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
#logo-main {
  background-image: url("/img/brand/coreui-base-white.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.logo-temp {
  color: #ffb300;
  font-size: 24px;
  font-weight: bold;
}

.user-btn {
  background: #373122;
}

.username {
  font-size: 18px;
}

.img-profile {
  width: 50%;
  padding-bottom: 50%;
  border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin: auto;
}

.w-50px {
  width: 100px;
}
</style>