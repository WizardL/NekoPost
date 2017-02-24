import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 20,
    items: {/* [id: number]: Item */},
    posts: {/* [id: number]: Post */},
    lists: {
      hot: [/* number */],
      new: []
    }
  },
  actions: {},
  mutations: {}
})
