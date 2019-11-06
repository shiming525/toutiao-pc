import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login/login.vue'
import Home from '@/views/home/home.vue'
import welcome from '@/views/welcome/index.vue'
import notFond from '@/views/404/index.vue'
import local from '@/utils/local'
import Article from '@/views/article/article.vue'
import Image from '@/views/image/index.vue'
import Publish from '@/views/publish/index.vue'
import Comment from '@/views/comment/index.vue'
import Setting from '@/views/setting/index.vue'
import Fans from '@/views/fans/index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
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
        },
        { path: '/article',
          component: Article
        },
        { path: '/image',
          component: Image
        },
        {
          path: '/publish',
          component: Publish
        },
        {
          path: '/comment',
          component: Comment
        },
        {
          path: '/setting',
          component: Setting
        },
        {
          path: '/fans',
          component: Fans
        }
      ]
    },
    {
      path: '*',
      component: notFond
    }
  ]
})

router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (user && user.token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
