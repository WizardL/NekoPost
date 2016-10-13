import Server from 'socket.io'
import LRU from 'lru-cache'

const inBrowser = typeof window !== 'undefined'

// When using bundleRenderer, the server-side application code runs in a new
// context for each request. To allow caching across multiple requests, we need
// to attach the cache to the process which is shared across all requests.
const cache = inBrowser
  ? null
  : (process.__API_CACHE__ || (process.__API_CACHE__ = createCache()))

function createCache () {
  return LRU({
    max: 1000,
    maxAge: 1000 * 60 * 15 // 15 min cache
  })
}

// create a connection for all server-side requests
const api = inBrowser
  ? new Server()
  : (process.__API__ || (process.__API__ = createWS()))

function createWS() {
  const api = new Server()

  api.__ids__ = {}
  ;['hot', 'new'].forEach(type => {
    api.on(type, (content) => {
      api.__ids__[type] = content.values()
    })
  })

  ;(function warmCache() {
    fetchItems((api.__ids__.top || []).slice(0, 30))
    setTimeout(warmCache, 1000 * 60 * 15)
  })()

  return api
}

function fetch (item) {
  if (cache && cache.has(item))
    return Promise.resolve(cache.get(item))
  else
    return new Promise((resolve, reject) => {
      api.
    });
}
export function fetchItem (id) {
  return fetch(`item/${id}`)
}

export function fetchItems (ids) {
  return Promise.all(ids.map(id => fetchItem(id)))
}
