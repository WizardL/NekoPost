"use strict"

import app from './backend'
import colors from 'colors'

import { development, test, production } from './config'
import { DatabaseConnector } from './backend/db'
import { updateTopPosts } from './backend/topPosts'
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

// updateTopPost at first run.
updateTopPosts()
  
// setInterval to update top post every 12 hours.
setInterval(() => {
  updateTopPosts()
}, 43200000)
