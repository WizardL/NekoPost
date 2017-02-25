'use strict'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import * as filters from './utils/filters'
import { sync } from 'vuex-router-sync'

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

// devtools
Vue.config.devtools = (process.env.NODE_ENV !== 'production')

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
  router,
  store,
  ...App // Object spread copying everything from App.vue
})

// mount the vue instance to DOM
// store.replaceState(window.__INITIAL_STATE__)
app.$mount('#app')

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator)
  navigator.serviceWorker.register('/service-worker.js')
