import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// import CreateListView from '../views/CreateListView'
// import SubmitView from '../views/SubmitView.vue'
// import ComplainView from '../views/ComplainView.vue'
import AboutView from '../views/AboutView.vue'
import FAQView from '../views/FAQView.vue'
// import PostView from '../views/PostView.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    // { path: '/热门/:page(\\d+)?', component: createListView('hot') },
    // { path: '/最新/:page(\\d+)?', component: createListView('new') },
    // { path: '/吐槽', name: 'submit', component: SubmitView },
    // { path: '/投诉', name: 'complain', component: ComplainView },
    // { path: '/装逼', name: 'about', component: AboutView },
    // { path: '/post/:id', name: 'post', component: PostView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/faq', name: 'FAQ', component: FAQView }
  ]
})