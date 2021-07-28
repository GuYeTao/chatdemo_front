import Vue from 'vue'
import App from './App'
import router from "./router";
import axios from "./axios"
import 'jquery'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from "./store"
import BaiduMap from 'vue-baidu-map'
Vue.use(ElementUI)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
