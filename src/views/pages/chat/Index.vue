<template>
  <div>
    <div class="container-box">
      <b-row class="mt-2">
        <b-col class=" bg-white py-3">
          <div>
            <div id="talkjs-container" style="width: 100%; height: 70vh;">
              <div class="text-center pt-4">
                <div class="spinner-border text-warning" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Talk from "talkjs";
export default {
  name: "ReturnIndex",
  data() {
    return {
      profile: {
        chatId: "",
        name: "",
        email: "",
        photoUrl: "",
      },
    };
  },
  created: async function() {
    this.$isLoading = true;
    await this.getProfileInfo();
    this.handleShowChat();
  },
  methods: {
    getProfileInfo: async function() {
      let resData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Profile/ShortProfile`,
        null,
        this.$headers,
        null
      );

      if (resData.result == 1) {
        this.profile.chatId = resData.detail.userDetail.chatId;
        this.profile.photoUrl = resData.detail.userDetail.seller.logo;
        this.profile.name = `${resData.detail.userDetail.firstname} ${resData.detail.userDetail.lastname}`;
        this.profile.email = resData.detail.userDetail.email;
      }
    },
    handleShowChat() {
      Talk.ready.then(() => {
        var me = new Talk.User({
          id: `${this.profile.chatId}`,
          name: `${this.profile.name}`,
          email: `${this.profile.email}`,
          photoUrl: `${this.profile.photoUrl}`,
          welcomeMessage: this.$t("hello"),
          locale: "th-TH",
          role: "seller",
        });
        var talkSession = new Talk.Session({
          appId: `${this.$talkJSAppID}`,
          me: me,
        });
        var inbox;
        // if (otherUserProfile.id) {
        //   var other = new Talk.User({
        //     id: otherUserProfile.chatId,
        //     name: otherUserProfile.sellerName,
        //     email: otherUserProfile.email,
        //     photoUrl: otherUserProfile.imageUrl,
        //     welcomeMessage: `${this.$t("hello")}`,
        //     role: "buyer",
        //   });
        //   const conversation = talkSession.getOrCreateConversation(
        //     Talk.oneOnOneId(me, other)
        //   );
        //   conversation.setParticipant(me);
        //   conversation.setParticipant(other);
        //   inbox = talkSession.createInbox({
        //     selected: conversation,
        //   });
        // } else {
        inbox = talkSession.createInbox({});
        // }
        inbox.mount(document.getElementById("talkjs-container"));
      });
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
