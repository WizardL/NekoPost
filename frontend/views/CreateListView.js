import ItemList from '../components/ItemList.vue'

// factory design
export const createListView = (type) => ({
  name: `${type}-stories-view`,
  render(h) {
    return h(ItemList, { props: { type } })
  }
})
