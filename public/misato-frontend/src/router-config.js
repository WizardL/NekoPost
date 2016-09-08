export function configRouter(router) {

  /** normal routes
  router.map({

    '/about': {
      component: require('./components/About.vue')
    },

    // 404 Not found handler
    '*': {
      component: require('./components/NotFound.vue')
    },

  })
  */
  router.redirect({
    '/info': '/about',
  })

  router.beforeEach((transition) => {
    const toPath = transition.to.path

    console.info()

    if (toPath.replace(/[^/]/g,"").length>1)
      router.app.isIndex = false
    else
      router.app.isIndex = true

    transition.next()
  })

}
