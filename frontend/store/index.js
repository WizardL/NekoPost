import Vue from 'vue'
import Vuex from 'vuex'
import { fetchItem, fetchItems, fetchIdsByType, fetchPost } from './api'

Vue.use(Vuex)

export default store = new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 20,
    items: {/* [id: number]: Item */},
    posts: {/* [id: number]: Post */},
    lists: {
      hot: [/* number */],
      new: [],
    }
  },

  actions: {
    // Ensure data for rendering given list type
    FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {
      commit('SET_ACTIVE_TYPE', { type })
      return fetchIdsByType(type)
        .then(ids => commit('SET_LIST', { type, ids }))
        .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
    },

    // Ensure all active items are fetched
    ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {
      return dispatch('FETCH_ITEMS', {
        ids: getters.activeIds
      })
    },

    FETCH_ITEMS: ({ commit, state }, { ids }) => {
      // Only fetch items that we don't have
      ids = ids.filter(id => !state.items[id])
      if (ids.length)
        return fetchItems(ids).then(items => commit('SET_ITEMS', { items }))
      else
        return Promise.resolve()
    },

    FETCH_POST: ({ commit, state }, { id }) => {
      return state.posts[id]
        ? Promise.resolve(state.posts[id])
        : fetchPost(id).then(post => commit('SET_POST', { post }))
    }
  },

  mutation: {
    SET_ACTIVE_TYPE: (state, { type }) => {
      state.activeType = type
    },

    SET_LIST: (state, { type, ids }) => {
      state.lists[type] = ids
    },

    SET_ITEMS: (state, { items }) => {
      items.map(item => {
        if (item) Vue.set(state.items, item.id, item)
      })
    },

    SET_POST: (state, { post }) => {
      Vue.set(state.posts, post.id, post)
    }
  },

  getters: {
    // ids of the items that should be currently displayed based on
    // current list type and current pagination
    activeIds (state) {
      const { activeType, itemsPerPage, lists } = state
      const page = Number(state.route.params.page) || 1
      if (!activeType)
        return []
      else {
        const start = (page - 1) * itemsPerPage
        const end = page * itemsPerPage
        return lists[activeType].slice(start, end)
      }
    },

    // items that should be currently displayed
    // this Array may not be fully fetched
    activeItems (state, getters) {
      return getters.activeIds.map(id => state.items[id]).filter(_ => _)
    }
  }
})
