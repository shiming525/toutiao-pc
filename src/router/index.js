import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login/login.vue'
import Home from '@/views/home/home.vue'
import welcome from '@/views/welcome/index.vue'
import notFond from '@/views/404/index.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          component: welcome
        }
      ]
    },
    {
      path: '*',
      component: notFond
    }
  ]
})
