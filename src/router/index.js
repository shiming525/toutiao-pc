import VueRouter from 'vue-router'
import Vue from 'vue'
import login from '../views/login/login.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/login',
      component: login
    }
  ]
})
