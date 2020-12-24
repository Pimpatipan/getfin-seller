<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold header-main text-uppercase mb-3">
              {{ id = 0 ? $t("add") : $t("edit")}}{{$t("product")}}
            </h1>
          </b-col>
        </b-row>

        <b-tabs class="mt-2 product-tabs">
          <b-tab :title="$t('productDetails')" active>
            <ProductDetailsSection />
          </b-tab>
          <b-tab :title="$t('inventory')">
            <ProductStock />
          </b-tab>
          <b-tab :title="$t('question')">
            <ProductQuestionSection />
          </b-tab>
          <b-tab :title="$t('userReview')">
            <ProductUserReviewSection />
          </b-tab>
        </b-tabs>
      </b-container>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import ProductDetailsSection from "./components/ProductDetailsSection";
import ProductStock from "./components/ProductStockSection";
import ProductQuestionSection from "./components/ProductQuestionSection";
import ProductUserReviewSection from "./components/ProductUserReviewSection";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "ProductDetails",
  components: {
    ProductDetailsSection,
    ProductStock,
    ProductQuestionSection,
    ProductUserReviewSection,
  },
  data() {
    return {
      id: this.$route.params.id,
      modalMessage: "",
      requestDeleteUser: {
        userId: this.$route.params.id,
      },
      requestUpdateStatus: {
        userId: this.$route.params.id,
      },
    };
  },
  mounted: async function () {},
  methods: {},
};
</script>

<style scoped>
::v-deep .card-header {
  padding-bottom: 0px !important;
}

.tab-title-collapse {
  border: none;
}

::v-deep .tab-pane {
  padding-top: 0;
}

.btn-collapse {
  border-radius: 0;
  background-color: white !important;
  font-size: 17px;
  padding: 0;
  border: 0;
}

.collapsed > .fa-chevron-down,
:not(.collapsed) > .fa-chevron-right {
  display: none;
}

::v-deep .columnCustomerName {
  display: none !important;
}

.display-custom > label {
  color: #16274a;
  font-size: 16px;
  margin-bottom: 2px;
  font-weight: bold;
}

.display-custom > div > p {
  color: #16274a;
  font-size: 16px;
}
.sub-title-name {
  text-align: left;
  color: #16274a;
  font-size: 20px;
  background: #fff !important;
  padding-right: 15px;
  position: relative;
  z-index: 1;
}

.sub-status {
  margin-bottom: 0 !important;
}

.sub-status-link {
  font-size: 16px !important;
}
</style>
