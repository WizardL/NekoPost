<template>
    <div class="posts-view">
        <!-- TODO: Make more emojis! -->
        <spinner :show="loading"></spinner>
        <div class="posts-nav">
            <router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)">&lt; prev</router-link>
            <a v-else class="disabled">&lt; prev</a>
            <span>{{ page }}//{{ maxPage }}</span>
            <router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</router-link>
            <a v-else class="disabled">more &gt;</a>
        </div>
        <transition :name="page-swap">
            <div class="posts-list" :key="displayedPage" v-if="displayedPage > 0">
                <transition-group tag="ul" name="item">
                    <item v-for="item in displayedItems" :key="item.id" :item="item"></item>
                </transition-group>
            </div>
        </transition>
    </div>
</template>

<script>
import Spinner from './Spinner.vue'
import Item from './Item.vue'
import { watchList } from '../store/api'

let isInitialRenderer = true

export default {
    name: 'item-list',

    components: {
        Spinner,
        Item
    },

    props: {
        type: String
    },

    data () {
        const data = {
            loading: false,
            transition: 'slide-up',
            displayedPage: isInitialRenderer ? Number(this.$store.state.route.params.page) || 1 : -1,
            displayedItems: isInitialRenderer ? this.$store.getters.activeItems : []
        }
        isInitialRenderer = false
        return data
    },

    computed: {
        page () {
            return Number(this.$store.state.route.params.page) || 1
        },
        maxPage () {
            const { itemsPerPage, lists } = this.$store.state
            return Math.ceil(lists[this.type].length / itemsPerPage)
        },
        hasMore () {
            return this.page < this.maxPage
        }
    },

    // Called right before the mounting begins: the `render` function is about to be
    // called for the first time.
    beforeMount () {
        if (this.$root._isMounted)
            this.loadItems(this.page)
        
        this.unwatchList = watchList(this.type, (ids) => {
            this.$store.commit('SET_LIST', { type: this.type, ids })
            this.$store.dispatch('ENSURE_ACTIVE_ITEMS').then(() => {
                this.dispatchItems = this.$store.getters.activeItems
            })
        })
    },

    beforeDestroy () {
        this.unwatchList()
    },

    watch: {
        page (to, from) {
            this.loadItems(to, from)
        }
    },

    methods: {
        loadItems (to = this.page, from = -1) {
            this.loading = true
            this.$store.dispatch('FETCH_LIST_DATA', { type: this.type }).then(() => {
                if (this.page < 0 || this.page > this.maxPage) {
                    this.$router.replace(`/${this.type}/1`)
                    return
                }
                this.transition = (from === -1)
                                ? null
                                : (to > from)
                                ? 'slide-left'
                                : 'slide-right'
                this.displayedPage = to
                this.displayedItems = this.$store.getters.activeItems
                this.loading = false
                
            })
        }
    }
}
</script>