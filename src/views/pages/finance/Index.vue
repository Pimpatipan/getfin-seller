<template>
  <div class="min-vh-100 container-box">
    <form class="form-box">
      <!-- <b-container class="container-box"> -->
      <CRow class="no-gutters px-3 px-sm-0">
        <b-col lg="6" class="text-center text-sm-left my-3 my-lg-0">
          <h1 class="mr-sm-4 header-main text-uppercase">
            {{ $t("finance") }}
          </h1>
        </b-col>
        <!-- <b-col lg="6" class="d-flex justify-content-end">
          <div class="d-flex">
            <b-dropdown
              id="dropdown-1"
              class="btn-mains small-dropdown"
              right
              no-flip
            >
              <template v-slot:button-content>
                <font-awesome-icon
                  icon="ellipsis-v"
                  title="filter-btn"
                  class="text-white d-sm-none"
                />
                <span class="d-none d-sm-inline">ACTION</span>
              </template>
              <b-dropdown-item disabled>Export Data</b-dropdown-item>
            </b-dropdown>
          </div>
        </b-col> -->
      </CRow>
      <!-- <b-row class="no-gutters">
          <b-col>
            <h1 class="mr-sm-4 header-main text-uppercase">
              <span>Finance Overviews</span>
            </h1>
          </b-col>
        </b-row> -->
      <b-row class="no-gutters px-3 px-sm-0 mt-1 overflow-auto">
        <b-button-group
          class="btn-group-status d-inline-flex d-inline-md-block"
        >
          <b-button
            :class="{ menuactive: isActive('/finance/account-statement') }"
            @click="onNavigation('/finance/account-statement')"
          >
            {{ $t("accountStatement") }}
          </b-button>
          <b-button
            :class="{ menuactive: isActive('/finance/order') }"
            @click="onNavigation('/finance/order')"
          >
            {{ $t("orderOverview") }}
          </b-button>
          <b-button
            :class="{ menuactive: isActive('/finance/transaction') }"
            @click="onNavigation('/finance/transaction')"
          >
            {{ $t("transactionOverview") }}
          </b-button>
        </b-button-group>
      </b-row>
      <b-row class="no-gutters">
        <router-view></router-view>
      </b-row>
      <!-- </b-container> -->
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeItem: "",
      menu: this.$route.params.menu || "account-statement",
    };
  },
  methods: {
    isActive: function(menuItem) {
      return this.$route.path == menuItem;
    },
    onNavigation(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menuactive {
  color: #ffb300 !important;
}
</style>
