<template>
  <div class="w-100">
    <b-container class="p-0">
      <b-row class="bg-white p-3 no-gutters mt-2">
        <b-col>
          <b-row class="my-3">
            <b-col>
              <div class="main-label">{{ $t("invoiceNum") }}</div>
            </b-col>
          </b-row>
          <form class="">
            <b-row class="">
              <b-col>
                <InputText
                  classLabelName="col-lg-4"
                  classInputName="col-lg-6"
                  :textFloat="$t('invoicePrefix')"
                  :placeholder="$t('invoicePrefix')"
                  type="text"
                  name="invoiceprefix"
                  v-model="form.invoice.invoicePrefix"
                  isRequired
                  :isValidate="$v.form.invoice.invoicePrefix.$error"
                  :v="$v.form.invoice.invoicePrefix"
                />
              </b-col>
            </b-row>
          </form>

          <b-row class="my-4">
            <b-col class="d-flex justify-content-end"
              ><div class="w-100"><hr /></div
            ></b-col>
          </b-row>
               <b-row>
            <b-col>
              <label class="font-weight-bold">{{ $t("noteFromAdmin") }}</label>
              <p>{{ dataWarningLog[6].warningLog.note }}</p>
            </b-col>
          </b-row>
          <b-row class="">
            <b-col class="d-flex justify-content-end"
              ><b-button
                variant="info"
                :disabled="isDisable"
                @click="checkForm(0)"
                class="btn btn-details-set"
                >{{ $t("save") }}</b-button
              ></b-col
            >
          </b-row>
        </b-col>
      </b-row>
      <ModalAlert ref="modalAlert" :text="modalMessage" />
      <ModalAlertError ref="modalAlertError" :text="modalMessage" />
    </b-container>
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import InputText from "../../profile/components/inputs/InputText";
import { required } from "vuelidate/lib/validators";
export default {
  components: {
    InputText,
    ModalAlert,
    ModalAlertError,
  },
  props: {
    sellerInvoice: {
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
      modalMessage: "",
      flag: 0,
      invoice: this.sellerInvoice,
      isDisable: false,
      form: {
        invoice: {
          id: 0,
          invoicePrefix: "",
        },
      },
    };
  },
  validations: {
    form: {
      invoice: {
        invoicePrefix: { required },
      },
    },
  },
  created() {
    this.form.invoice.id = this.invoice.user.seller.id;
    this.form.invoice.invoicePrefix = this.invoice.user.seller.invoicePrefix;
  },
  watch: {
    sellerInvoice: function() {
      this.form.invoice.id = this.invoice.user.seller.id;
      this.form.invoice.invoicePrefix = this.invoice.user.seller.invoicePrefix;
    },
  },
  methods: {
    reloadData() {
      this.$emit("reloadData");
    },
    checkForm: async function(flag) {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }
      this.isDisable = true;
      this.submit();
      this.flag = flag;
    },
    submit: async function() {
      let data = await this.$callApi(
        "patch",
        `${this.$baseUrl}/api/Profile/Invoice`,
        null,
        this.$headers,
        this.form.invoice
      );

      this.modalMessage = data.message;
      this.isDisable = false;
      if (data.result == 1) {
        this.$refs.modalAlert.show();
        //this.reloadData();
        // setTimeout(function() {
        //   window.location.reload();
        // }, 3000);
        this.$hasChange = false;
      } else {
        this.$refs.modalAlertError.show();
        this.reloadData();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
