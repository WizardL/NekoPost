"use strict"

import app from './backend'
import colors from 'colors'

import { development, test, production } from './config'
import { DatabaseConnector } from './backend/db'
import { updateTopPosts } from './backend/topPosts'
import { updateHotPosts } from './backend/hotPosts'
const port = process.env.PORT || 3000
const DBConfig = (process.env.NODE_DEV == 'production') ? production : development

;(async () => {
  try {
    const info = await DatabaseConnector(DBConfig)
    console.log(`[${'*'.green}]  Connected to ${info.host}:${info.port}/${info.name}`)
  } catch (err) {
    console.log(`[${'!'.red}]  Unable to connect to database`)
  }
  await app.listen(port)
  console.log(`[${'@'.green}]  Server listening on port ${port}`)

})()

// updateTopPosts at first run.
updateTopPosts()

// updateHotPosts at first run.
updateHotPosts()

// setInterval to update top posts every 12 hours.
setInterval(() => {
  updateTopPosts()
}, 43200000)

// setInterval to update hot posts every 30 minutes.
setInterval(() => {
  updateHotPosts()
}, 1800000)
