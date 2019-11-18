import Vue from 'vue'

import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueMoment from 'vue-moment'

Vue.use(BootstrapVue)
Vue.use(VueMoment)

new Vue({
  render: h => h(App),
}).$mount('#app')
