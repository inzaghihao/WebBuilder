import Vue from 'vue'
Vue.config.productionTip = false

// *
import Common from '@/common/common.js'
window.$common = new Common()

// *.创建实例
import App from './App.vue'
new Vue({
    render: (h) => h(App),
}).$mount('#app')