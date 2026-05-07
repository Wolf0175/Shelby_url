import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Disable the production tip in the console
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')