import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from '@/api'

import plugin from '@/components'
Vue.use(plugin)
// import MyBread from '@/components/my-bread'
// Vue.component('my-bread', MyBread)

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
