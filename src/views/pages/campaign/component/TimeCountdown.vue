<template>
  <b-button variant="primary" class="w-200">{{ timeLeft }}</b-button>
</template>

<script>
export default {
  name: "HomeFlashsellCountTimer",
  props: {
    endDate: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      timeLeft: "00d : 00h : 03m :00s"
    };
  },
  methods: {
    onPageLoad() {
      var countDownDate = new Date(this.endDate).getTime();

      setInterval(x => {
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

        this.timeLeft = `${days}d :${hours}h : ${minutes}m : ${seconds}s`;
        // if (days) {
        //   this.timeLeft = `${days} ${this.$t("day")} ${this.timeLeft}`;
        // }

        if (distance < 0) {
          clearInterval(x);
          this.timeLeft = "EXPIRED";
        }
      }, 1000);
    }
  },
  created: async function() {
    await this.onPageLoad();
  }
};
</script>

<style lang="scss" scoped>
.time-left {
  line-height: 1.2;
}

@media (max-width: 767.98px) {
  .time-left {
    line-height: normal;
  }
}
</style>
