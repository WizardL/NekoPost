import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//import { createListView } from '../views/CreateListView'
import SubmitView from '../views/SubmitView.vue'
//import ComplainView from '../views/ComplainView.vue'
import AboutView from '../views/AboutView.vue'
//import PostView from '../views/PostView.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    //{ path: '/热门/:page(\\d+)?', component: createListView('hot') },
    //{ path: '/最新/:page(\\d+)?', component: createListView('new') },
    { path: '/吐槽', component: SubmitView },
    //{ path: '/投诉', component: ComplainView },
    { path: '/装逼', component: AboutView },
    //{ path: '/post/:id', component: PostView },
    { path: '*', redirect: '/装逼' }
  ]
})
