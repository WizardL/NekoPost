require('es6-promise').polyfill() // Polyfill for ES6 start here
import { app, store } from './main'

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup
store.replaceState(window.__INITIAL_STATE__)

// actually mount to DOM
app.$mount('#app')
