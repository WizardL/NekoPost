import Vue from 'vue'
import VueRouter from 'vue-router'

import { configRouter } from './router-config'

Vue.use(VueRouter)

const App = Vue.extend(require('./App'))

const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

// configure router
configRouter(router)

router.start(App, '#app')

// debugging
window.router = router
