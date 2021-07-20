import Vue from 'vue'
import App from './App'
import router from './router' // 导入路由
import store from './store' // 导入管理器
import axios from 'axios'
import FastClick from 'fastclick'
import './assets/css/common.css' // 引入全局样式
FastClick.attach(document.body) // 消除移动端300ms延迟的点击效果
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
