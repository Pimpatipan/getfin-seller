<template>
  <CHeader with-subheader>
    <CToggler in-header class="ml-3 d-lg-none" @click="$store.commit('toggleSidebarMobile')" />
    <CToggler in-header class="ml-3 d-md-down-none" @click="$store.commit('toggleSidebarDesktop')" />
    <CHeaderBrand
      class="mx-lg-auto d-lg-none"
      src="/img/brand/logo_skl.svg"
      width="97"
      height="46"
      alt="CoreUI Logo"
    />
    <div>
      <h1 class="text-uppercase ml-2 theheader-txt font-weight-bold">Partner Center</h1>
    </div>
    <CHeaderNav class="d-md-down-none mr-auto">
      <!-- <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem>-->
    </CHeaderNav>
    <CHeaderNav class="mr-1 mr-sm-4">
      <!-- <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <ul>
            <li v-for="lang in languages" :key="lang" @click="changeLang(lang)">{{lang}}</li>
          </ul>
        </CHeaderNavLink>
      </CHeaderNavItem>-->
      <!-- <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell" class="text-warning" />
        </CHeaderNavLink>
      </CHeaderNavItem>-->
      <CHeaderNavItem class="d-md-down-none mx-2">
        <div>
          <span v-if="$IsVerified">
            <font-awesome-icon
              icon="check-circle"
              title="View"
              class="mr-2 text-success"
              
            />Verified Account</span>
            <span v-else>
            <font-awesome-icon
              icon="check-circle"
              title="View"
              class="mr-2 text-secondary"
            />Unverified Account
            </span>
        </div>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none">
        <b-dropdown class="my-2 lang-dd" right no-caret>
          <template v-slot:button-content>
            <div class="form-inline">
              <div v-if="language == 'en'">
                <img src="@/assets/images/united-states.png" class="partner-logo" />
              </div>
              <div v-else-if="language == 'th'">
                <img src="@/assets/images/thailand.png" class="partner-logo" />
              </div>
              <!-- <font-awesome-icon icon="chevron-down" class="align-middle mt-1 ml-1 text-dark" size="sm" /> -->
            </div>
          </template>
          <b-dropdown-item @click="changeLanguage('en')">EN</b-dropdown-item>
          <b-dropdown-item @click="changeLanguage('th')">TH</b-dropdown-item>
        </b-dropdown>
      </CHeaderNavItem>
      <!-- <TheHeaderDropdownAccnt /> -->
      <!-- <CHeaderNavItem class="mr-2">
        <a href="#" @click.prevent="logout">
          <CIcon name="cil-lock-locked" />
          <span class="ml-1">Logout</span>
        </a>
      </CHeaderNavItem>-->
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0" />
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from "./TheHeaderDropdownAccnt";

export default {
  name: "TheHeader",
  data() {
    return {
      displayName: "",
      language: this.$language,
      // languages: ["en", "th"]
    };
  },
  created: async function () {
    //await this.getProfile();
  },
  methods: {
    //   changeLang(lang) {
    //     this.$i18n.locale = lang;
    //   },
    changeLanguage(value) {
      this.language = value;
      this.$cookies.set(
        "language",
        value,
        60 * 60 * 24 * 365,
        "/",
        this.$cookiesDomain
      );
      location.reload();
    },
    getProfile: async function () {
      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/info`,
        null,
        this.$headers,
        null
      );
      if (resData.result == 1) {
        this.displayName =
          resData.detail.admin.firstName + " " + resData.detail.admin.lastName;
      }
    },
    logout: async function () {
      let resData = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/logout`,
        null,
        this.$headers,
        null
      );
      this.$cookies.remove("seller-token");
      window.location.href = "/";
    },
  },
  components: {
    TheHeaderDropdownAccnt,
  },
};
</script>

<style scoped>
::v-deep .lang-dd button {
  background-color: transparent;
  border: none;
  padding: 0;
}

::v-deep .lang-dd button:focus,
::v-deep .lang-dd button:active,
::v-deep .lang-dd.show > .btn-secondary.dropdown-toggle,
::v-deep .lang-dd button:hover {
  background-color: transparent !important;
  border: none;
  padding: 0;
}

.lang-dd {
  padding: 5px 10px;
}

::v-deep .lang-dd ul {
  width: 200px;
  padding: 5px;
}

.partner-logo {
  width: 25px;
}
</style>
