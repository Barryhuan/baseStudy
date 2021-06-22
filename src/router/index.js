import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('@p/home')
    },
    {
      path: '/login',
      component: () => import('@p/login')
    },
    {
      path: '/city/:id',
      component: () => import('@p/city')
    },
    {
      path: '/shoplist',
      component: () => import('@p/shoplist'),
      meta: { keepAlive: true }
    },
    {
      path: '/search/:geohash',
      component: () => import('@p/search')
    },
    {
      path: '/order',
      component: () => import('@p/orders/order')
    },
    {
      path: '/user',
      component: () => import('@p/users/user')
    },
    {
      path: '/food',
      component: () => import('@p/food')
    }
  ]
})
