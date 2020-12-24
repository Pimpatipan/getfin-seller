<template>
  <div v-if="campaign">
    <b-container class="container-box">
      <b-row class="no-gutters">
        <b-col md="8" class="text-center text-md-left mb-2 mb-xl-0">
          <h1
            class="font-weight-bold header-main text-uppercase d-inline-block one-line campaign-name"
          >
            <!-- {{ $t("campaignDetails") }} -->
            {{ campaign.name }}
          </h1>
          <div v-if="campaign.status" class="campaign-status mt-3">
            {{ campaign.status }}
          </div>
          <div v-else class="campaign-status mt-3">-</div>
        </b-col>
        <b-col md="4" class="text-center text-md-right mb-2 mb-sm-0">
          <TimeCounter :endDate="campaign.endDateJoinCampaign" />
        </b-col>
      </b-row>

      <b-row class="no-gutters px-3 px-sm-0 mb-3">
        <b-col class="overflow-auto">
          <b-button-group
            class="btn-group-status d-inline-flex d-inline-md-block"
          >
            <b-button
              :class="{ menuactive: isActive('Basic Info') }"
              @click="activeItem = 'Basic Info'"
            >
              {{ $t("basicInfo") }}</b-button
            >
            <!-- <b-button
              :class="{ menuactive: isActive('Registered Campaign') }"
              @click="activeItem = 'Registered Campaign'"
              >Registered Campaign</b-button
            > -->
          </b-button-group>
        </b-col>
      </b-row>

      <div class="bg-white p-3">
        <b-row>
          <b-col class="text-center" sm="6"
            ><img :src="campaign.banner.imageUrl" alt="" class="w-50" />
            <b-row class="mt-4 text-left">
              <b-col sm="6">
                <b>
                  {{ $t("campaignPeriod") }} ({{ diffDate }} {{ $t("day") }})</b
                >
                <br /><br /><span class="text-primary">
                  {{ $t("start") }} :
                </span>
                {{
                  new Date(campaign.startDateCampaign)
                    | moment($formatDateTime)
                }}<br />
                <span class="text-danger"> {{ $t("end") }} : </span
                >{{
                  new Date(campaign.endDateCampaign) | moment($formatDateTime)
                }} </b-col
              ><b-col sm="6" class="mt-4 mt-sm-0"
                ><b> {{ $t("registrationEnd") }}</b
                ><br /><br />
                {{
                  new Date(campaign.endDateJoinCampaign)
                    | moment($formatDateTime)
                }}</b-col
              >
            </b-row>
          </b-col>
          <b-col sm="6" class="mt-4 mt-sm-0">
            <div>
              <b>
                {{ $t("campaignPeriod") }} :
                {{ new Date(campaign.startDateCampaign) | moment("DD MMM") }} -
                {{ new Date(campaign.endDateCampaign) | moment("DD MMM") }}
              </b>
              <br /><br />

              <div>
                <span v-html="campaign.description"></span>
              </div>
            </div>
          </b-col>
        </b-row>

        <div class="text-center mt-5">
          <router-link :to="'/campaign/details/' + id">
            <button
              :disabled="isDisable"
              type="button"
              class="btn btn-details-set btn-primary ml-md-2 text-uppercase"
            >
              {{ $t("joinNow") }}
            </button>
          </router-link>
          <p class="text-secondary mt-2">
            {{ campaign.totalPartner }} {{ $t("sellerJoined") }} |
            {{ campaign.totalProduct }} {{ $t("productCount") }}
          </p>
        </div>
      </div>

      <b-row class="bg-white mt-2 px-3 py-2 no-gutters">
        <b-col class="d-flex justify-content-end">
          <router-link :to="'/campaign'">
            <button
              type="button"
              class="btn btn-details-set btn-secondary  ml-md-2 text-uppercase"
            >
              {{ $t("cancel") }}
            </button>
          </router-link>
        </b-col>
      </b-row>
    </b-container>
    <ModalAlert ref="modalAlert" :text="modalMessage" />
    <ModalAlertError ref="modalAlertError" :text="modalMessage" />
  </div>
</template>

<script>
import ModalAlert from "@/components/modal/alert/ModalAlert";
import ModalAlertError from "@/components/modal/alert/ModalAlertError";
import TimeCounter from "../campaign/component/TimeCountdown";
export default {
  components: {
    ModalAlert,
    ModalAlertError,
    TimeCounter
  },
  data() {
    return {
      id: this.$route.params.id,
      campaign: null,
      form: {},
      notibuyer: false,
      isDisable: false,
      error: false,
      modalMessage: "",
      reply: "",
      timeLeft: "00d : 00h : 03m :00s",
      activeItem: ""
    };
  },
  created: async function() {
    this.$isLoading = true;
    //await this.onPageLoad();
    await this.getCampaignDetail();
    this.activeItem = "Basic Info";
  },
  computed: {
    diffDate: function() {
      var oneDay = 24 * 60 * 60 * 1000;
      var date =
        (new Date(this.campaign.endDateCampaign) -
          new Date(this.campaign.startDateCampaign)) /
        oneDay;
      Math.abs;
      return Math.round(date);
    }
  },
  methods: {
    getCampaignDetail: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Campaign/${this.$route.params.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.campaign = data.detail;
        this.onCampaignCount();
      }
    },
    onCampaignCount() {
      var countDownDate = new Date(this.campaign.endDateJoinCampaign).getTime();
      setInterval(() => {
        var now = new Date().getTime();

        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) {
          hours = "0" + hours;
        }

        if (minutes < 10) {
          minutes = "0" + minutes;
        }

        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        this.timeLeft =
          days + "d : " + hours + "h : " + minutes + "m : " + seconds + "s";
        // this.timeLeft = days + "วัน " + hours + " : " + minutes + " : " + seconds + "";

        if (distance < 0) {
          clearInterval(x);
          this.timeLeft = "EXPIRED";
        }
      }, 1000);
    },
    isActive: function(menuItem) {
      return this.activeItem == menuItem;
    }
  }
};
</script>

<style scoped>
.campaign-status {
  display: inline-block;
  padding: 7px 20px;
  margin-left: 15px;
  border-radius: 15px;
  background-color: #ffb300;
  color: white;
  /*font-size: 14px;*/
  position: relative;
  bottom: 10px;
}

.time-count {
  display: inline-block;
  padding: 7px 15px;
  border-radius: 10px;
  background-color: #707070;
  color: white;
  white-space: nowrap;
  position: relative;
  top: 6px;
  max-width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.menuactive {
  color: #ffb300 !important;
}

.campaign-name {
  max-width: 40%;
  white-space: nowrap;
  margin: 0;
}

@media (max-width: 767.98px) {
  .campaign-name {
    max-width: 100%;
  }
  .time-count {
    position: unset;
    /* width: auto; */
  }
}

@media (max-width: 575.98px) {
  .campaign-status {
    margin-left: 0;
    margin-top: 5px;
  }
}
</style>
