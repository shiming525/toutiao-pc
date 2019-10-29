import myBread from '@/components/my-bread.vue'

export default {
  install (Vue) {
    // Vue是一个构造函数
    Vue.component('my-bread', myBread)
  }
}
