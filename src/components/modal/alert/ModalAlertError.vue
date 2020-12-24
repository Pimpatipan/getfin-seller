<template>
  <div>
    <b-modal v-model="showModal" ref="alertModal" hide-header hide-footer centered>
      <div class="modal-header">
        <button type="button" aria-label="Close" class="close" @click="hide">×</button>
      </div>
      <div class="text-center">
        <img src="@/assets/images/icons/wrong.png" alt="unsuccess" class="mb-3 img" />
        <p class="text-text" v-if="text">{{ text }}</p>
        <p class="f-18 font-weight-bold mt-2" v-if="detailtext">({{detailtext}})</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      required: false,
      type: String
    },
    detailtext: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      showModal: false
    };
  },
  methods: {
    show() {
      this.showModal = true;
    },
    hide() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
.modal-header {
  border: 0 !important;
  padding: 0;
}
.text-text {
  font-family: "Kanit-SemiBold" !important;
  color: #16274a;
  margin-bottom: 0;
  font-size: 26px;
}
.modal-body {
  margin: auto;
  text-align: center;
}
.img {
  width: 100px;
}
@media (max-width: 767.98px) {
  /* .text-text {
    font-size: 15px;
  } */
}
</style>