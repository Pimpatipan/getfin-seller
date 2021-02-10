<template>
  <b-container class="container-box min-vh-100">
    <CRow class="no-gutters px-3 px-sm-0">
      <b-col md="6" class="text-center text-sm-left my-3 my-md-0">
        <h1 class="mr-sm-4 header-main text-uppercase">
          {{ $t("faq") }}
        </h1>
      </b-col>
      <b-col md="6" class="justify-content-end">
        <b-input-group class="panel-input-serach ml-auto">
          <b-form-input
            class="input-serach"
            placeholder="FAQ"
            v-model="filter.search"
            @keyup="handleSearch"
          ></b-form-input>
          <b-input-group-prepend @click="getData">
            <span class="icon-input m-auto pr-2">
              <font-awesome-icon icon="search" title="View" />
            </span>
          </b-input-group-prepend>
        </b-input-group>
      </b-col>
    </CRow>
    <div class="mt-3 bg-white py-3 py-sm-0">
      <b-row class="no-gutters px-3">
        <b-col>
          <div v-if="list.length > 0" class="panel-fqa mt-0 mt-md-3">
            <div no-body v-for="(data, key) in list" v-bind:key="key">
              <div class="panel-title-name pt-0 pb-2">{{ data.name }}</div>
              <div
                class="panel"
                v-for="(item, key) in data.faqList"
                v-bind:key="key"
              >
                <div role="tablist">
                  <b-card no-body class="mb-3">
                    <b-card-header
                      header-tag="header"
                      class="tab-title p-0"
                      role="tab"
                    >
                      <b-button
                        class="text-left"
                        type="button"
                        block
                        variant="title"
                        v-b-toggle="`accordion-${item.id}-${key}`"
                      >
                        <span class="w-100">{{ item.question }}</span>
                        <font-awesome-icon
                          icon="chevron-right"
                          class="icon float-right mt-1"
                        />
                        <font-awesome-icon
                          icon="chevron-down"
                          class="icon float-right mt-1"
                        />
                      </b-button>
                    </b-card-header>
                    <b-collapse
                      :id="`accordion-${item.id}-${key}`"
                      accordion="my-accordion"
                      role="tabpanel"
                    >
                      <b-card-body>
                        <div v-html="item.answer"></div>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </div>
            </div>
          </div>
          <b-row v-else>
            <b-col class="text-center py-5">
             <p class="m-0">{{ $t("nofaq") }}</p>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  name: "faq-index",
  data() {
    return {
      isLoading: true,
      list: [],
      filter: {
        search: "",
      },
    };
  },
  methods: {
    getData: async function () {
      this.$isLoading = false;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/faq/topic`,
        null,
        this.$headers,
        this.filter
      );

      if (data.result == 1) {
        this.list = data.detail;
        this.$isLoading = true;
      }
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.getData();
      }
    },
  },
  created: async function () {
    await this.getData();
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: white;
  font-size: 35px;
  text-align: center;
}
.panel-title-name {
  padding: 20px 0px 20px 0px;
  font-size: 20px;
}
.collapsed > .fa-chevron-down,
.not-collapsed > .fa-chevron-right {
  display: none;
}
@media (max-width: 991.98px) {
  .panel-fqa {
    padding: 0px;
  }
  .title {
    font-size: 18px;
  }
  .input-search {
    height: 50px;
  }
}
</style>
