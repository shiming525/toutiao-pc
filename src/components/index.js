import myBread from '@/components/my-bread.vue'
import myChannel from '@/components/my-channel.vue'

export default {
  install (Vue) {
    // Vue是一个构造函数
    Vue.component('my-bread', myBread)
    Vue.component('my-channel', myChannel)
  }
}
