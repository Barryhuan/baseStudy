import Vue from 'vue'
import App from './App'
import router from './router' // 导入路由
import store from './store' // 导入管理器
import axios from 'axios'
import './assets/css/common.css' // 引入全局样式
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
Vue.use(router)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
