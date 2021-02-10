<template>
  <div class="c-app">
    <TheSidebar v-if="forcerefresh" />
    <div class="c-wrapper">
      <TheHeader />
      <div class="c-body">
        <b-overlay :show="!$isLoading" rounded="sm" spinner-type="grow">
          <main class="c-main" :aria-hidden="$isLoading ? 'true' : null">
            <CContainer fluid class="px-0">
              <transition name="fade">
                <router-view></router-view>
              </transition>
            </CContainer>
          </main>
        </b-overlay>

        <!-- <div class="chatbox-container">
          <div class="chatbox-header"></div>
          <div
            id="talkjs-container"
            style="width: 90%; margin: 30px; height: 500px"
          >
            <i>Loading chat...</i>
          </div>
        </div> -->
      </div>
      <TheFooter />
    </div>
  </div>
</template>

<script>
import TheSidebar from "./TheSidebar";
import TheHeader from "./TheHeader";
import TheFooter from "./TheFooter";
import Talk from "talkjs";
import { mapGetters } from "vuex";

export default {
  name: "TheContainer",
  components: {
    TheSidebar,
    TheHeader,
    TheFooter
  },
  data() {
    return {
      forcerefresh: true
    };
  },
  created() {},

  watch: {
    refreshFlag: function(value) {
      if (value == true) {
        this.forcerefresh = false;
        this.$nextTick(() => {
          this.forcerefresh = true;
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      refreshFlag: "getRefreshMenu"
    })
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$store.dispatch("getActiveData");
    });
    Talk.ready.then(function() {
      //   var me = new Talk.User({
      //     id: parseInt(Math.random() * 500000).toString(),
      //     name: "Alice",
      //     email: "demo@talkjs.com",
      //     photoUrl: "https://demo.talkjs.com/img/alice.jpg",
      //     welcomeMessage: "Hey there! How are you? :-) 1111",
      //     role: "Test",
      //   });
      //   var talkSession = new Talk.Session({
      //     appId: "Hku1c4Pt",
      //     me: me,
      //   });
      //   var other = new Talk.User({
      //     id: parseInt(Math.random() * 500000).toString(),
      //     name: "Sebastian",
      //     email: "demo@talkjs.com",
      //     photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
      //     welcomeMessage: "Hey, how can I help? 2222",
      //     role: "Test",
      //   });
      //   var conversation = talkSession.getOrCreateConversation(
      //     Talk.oneOnOneId(me, other)
      //   );
      //   conversation.setParticipant(me);
      //   conversation.setParticipant(other);
      //   // const popup = talkSession.createPopup(conversation, { keepOpen: false });
      //   // popup.mount({ show: false });
      //   // const button = document.getElementById("btn-getInTouch");
      //   // button.addEventListener("click", (event) => {
      //   //   event.preventDefault();
      //   //   popup.show();
      //   // });
      //   var inbox = talkSession.createInbox({ selected: conversation });
      //   inbox.mount(document.getElementById("talkjs-container"));
      //   var chatbox = talkSession.createChatbox(conversation, {
      //     // Don't use the default header provided by TalkJS
      //     showChatHeader: false,
      //   });
    });
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
