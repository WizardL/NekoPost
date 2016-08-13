export function configRouter(router) {

  // normal routes
  router.map({

    /** TODO
    ---
    1. API documentation needed (for development)
    2. Bot integration
    ---
    
    '/about': {
      component: require('./component/About.vue')
    },

    '/post': {
      component: require('./component/Post.vue')
    },

    '/report': {
      component: require('./components/Report.vue')
    },

    '/reply': {
      component: require('./components/Reply.vue')
    }

    */
  })

  router.beforeEach((transition) => {
    const toPath = transition.to.path

    console.info()

    if (toPath.replace(/[^/]/g,"").length > 1)
      router.app.isIndex = false
    else
      router.app.isIndex = true

    transition.next()
  })

}
