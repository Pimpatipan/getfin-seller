import Vue from "vue";
import App from "./App";
import router from "./router";

import editor from "@tinymce/tinymce-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "tinymce/tinymce";

// Theme
import "tinymce/themes/silver/theme";

// Skins
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/content/default/content.min.css";

// Plugins
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/paste";
import "tinymce/plugins/autoresize";

import CoreuiVue from "@coreui/vue";
import "./main.css";
import { iconsSet as icons } from "./assets/icons/icons.js";
import { callApi } from "./api/apiUtility";
import { i18n } from "./plugins/i18n";
import VueCookies from "vue-cookies";
import Vuelidate from "vuelidate";
import BootstrapVue from "bootstrap-vue";
import VueMoment from "vue-moment";
import vueNumeralFilterInstaller from "vue-numeral-filter";
import store from "./store";
const moment = require("moment");
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "babel-polyfill";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import { Settings as LuxonSettings } from "luxon";
import VueFroala from "vue-froala-wysiwyg";
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
require("froala-editor/js/froala_editor.pkgd.min.js");
require("froala-editor/css/froala_editor.pkgd.min.css");
require("froala-editor/css/froala_style.min.css");
const req = require.context("froala-editor/js/plugins/", false, /\.(js)$/i);
req.keys().map(key => {
    require(`froala-editor/js/plugins/${key.toString().slice(2)}`);
});

//Icon
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faUserSecret,
    faPowerOff,
    faTrashAlt,
    faEye,
    faSearch,
    faArrowRight,
    faStar,
    faUser,
    faChevronRight,
    faChevronUp,
    faChevronDown,
    faFilter,
    faEllipsisV,
    faFileUpload,
    faSortDown,
    faTimesCircle,
    faDownload,
    faPencilAlt,
    faPlus,
    faCheck,
    faTimes,
    faCheckCircle,
    faLock,
    faFileDownload,
    faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarFar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
    faUserSecret,
    faPowerOff,
    faTrashAlt,
    faEye,
    faSearch,
    faArrowRight,
    faUser,
    faChevronRight,
    faStarFar,
    faStar,
    faChevronDown,
    faFilter,
    faEllipsisV,
    faFileUpload,
    faSortDown,
    faTimesCircle,
    faDownload,
    faPencilAlt,
    faPlus,
    faCheck,
    faTimes,
    faCheckCircle,
    faChevronUp,
    faLock,
    faFileDownload,
    faExclamationCircle
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(vueNumeralFilterInstaller, { locale: "en-gb" });
Vue.use(VueCookies);
Vue.use(BootstrapVue);
Vue.use(Vuelidate);
Vue.use(VueFroala, {
    config: {
        key: "UBB7jD6G4H5I3B2C10aIVLEABVAYFKc1Ce1MYGD1c1NYVMiB3B9B6A5C2C4D3H3G3H3==",
    },
});

moment.locale(VueCookies.isKey("language") ? VueCookies.get("language") : "en");
import VueSlickCarousel from "vue-slick-carousel";
const Slick = {
    install(Vue, options) {
        Vue.component('slick', VueSlickCarousel)
    }
};

Vue.use(VueMoment, {
    moment,
});
Vue.use(Slick);
Vue.component("datetime", Datetime);
Vue.component("editor", editor);

let globalData = new Vue({
    data: {
        $isLoading: false,
        $screenSize: {
            width: 0,
            height: 0,
        },
        $showAlert: false,
        $hasChange: false,
        $IsVerified: false,
    },
});

Vue.mixin({
    computed: {
        $isLoading: {
            get: function() { return globalData.$data.$isLoading },
            set: function(isLoading) { globalData.$data.$isLoading = isLoading; }
        },
        $screenSize: {
            get: function() { return globalData.$data.$screenSize },
            set: function(screenSize) { globalData.$data.$screenSize = screenSize; }
        },
        $showAlert: {
            get: function() { return globalData.$data.$showAlert },
            set: function(showAlert) { globalData.$data.$showAlert = showAlert; }
        },
        $hasChange: {
            get: function() { return globalData.$data.$hasChange },
            set: function(hasChange) { globalData.$data.$hasChange = hasChange; }
        },
        $IsVerified: {
            get: function() { return globalData.$data.$IsVerified },
            set: function(IsVerified) { globalData.$data.$IsVerified = IsVerified; }
        }
    }
})

Vue.prototype.$language = VueCookies.isKey("language") ?
    VueCookies.get("language") :
    "en";
Vue.prototype.$displayName = VueCookies.isKey("back_office_displayName") ?
    VueCookies.get("back_office_displayName") :
    "";
Vue.prototype.$callApi = callApi;
Vue.prototype.$baseUrl = "https://dev-seller-getfin-api.dosetech.co";
//Vue.prototype.$baseUrl = "https://api-getfin-seller.dosetech.co";
Vue.prototype.$formatDate = "DD MMM YYYY";
Vue.prototype.$formatDateTime = "DD MMM YYYY HH:mm";
Vue.prototype.$formatTime = "HH:mm";
Vue.prototype.$headers = {
    "Content-Type": "application/json",
    culture: Vue.prototype.$language,
    Authorization: VueCookies.isKey("seller-token") ?
        `Bearer ${VueCookies.get("seller-token")}` : "null",
};
Vue.prototype.$headersZip = {
    "API-KEY": "SK1ADM1FND",
    "Content-Type": "application/zip",
    culture: Vue.prototype.$language,
    Authorization: VueCookies.isKey("seller-token") ?
        `Bearer ${VueCookies.get("seller-token")}` : "null",
};
Vue.prototype.$talkJSAppID = "tdv3kXlp";

LuxonSettings.defaultLocale = Vue.prototype.$language;

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!VueCookies.get("seller-token")) {
            next({
                path: "/login",
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresIsLogin)) {
        if (VueCookies.get("seller-token")) {
            next({
                path: "/",
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

new Vue({
    el: "#app",
    library,
    i18n,
    router,
    icons,
    store,
    template: "<App/>",
    components: {
        App,
    },
});