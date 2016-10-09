import Vue from 'vue'
import VueRouter from 'vue-router'

import { configRouter } from './router-config'

Vue.use(VueRouter)

const App = Vue.extend(require('./App'))

const router = new VueRouter({
  mode: 'history',
  routes: App
})

const app = new Vue({
  router
}).$mount('#app')

// debugging
window.router = router
