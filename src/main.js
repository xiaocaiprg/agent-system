import Vue from "vue";
import App from "./App.vue";
import "./styles/main.less";
import "./styles/rem.less";

import router from "./router/router";
import Vant from "vant";
import "vant/lib/index.less";

Vue.use(Vant);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount("#app");
