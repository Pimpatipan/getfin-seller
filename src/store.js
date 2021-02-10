import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueCookies from "vue-cookies";
Vue.use(Vuex);

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: false,
  asideShow: false,
  darkMode: false,
  otherProfile: {
    id: 0
  },
  menu: {
    order: 0,
    returnOrder: 0,
    review: 0,
    question: 0,
    refresh: true
  },
  refreshMenu: null,
  isRefreshed: false
};

const mutations = {
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  set(state, [variable, value]) {
    state[variable] = value;
  },
  toggle(state, variable) {
    Vue.set(state, variable, !state[variable]);
    // state[variable] = !state[variable]
  },
  setOtherProfile(state, val) {
    state.otherProfile = val;
  },
  getActiveMenuData(state, val) {
    if (state.menu !== val && !state.isRefreshed) {
      state.refreshMenu = null;
      setTimeout(() => {
        state.menu.order = val.order;
        state.menu.returnOrder = val.returnOrder;
        state.menu.review = val.review;
        state.menu.question = val.question;
        state.refreshMenu = true;
        state.isRefreshed = true;
      }, 0);
    } else {
      state.refreshMenu = false;
    }
  },
  setRefreshMenuData(state, val) {
    state.refreshMenu = val;
  },
  setRefreshed(state, val) {
    state.isRefreshed = val;
  }
};

const actions = {
  getActiveData: ({ commit }) => {
    axios({
      url: `${Vue.prototype.$baseUrl}/api/Menu/ActiveMenu`,
      method: "get",
      headers: Vue.prototype.$headers
    }).then(response => {
      commit("getActiveMenuData", response.data.detail);
      commit("setRefreshed", false);
    });
  }
};

const getters = {
  getRefreshMenu: state => {
    return state.refreshMenu;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
