import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login/login.vue'
import Home from '@/views/home/index.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Home
    }
  ]
})
