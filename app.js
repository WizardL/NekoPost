"use strict"

import app from './src'
import colors from 'colors'

import { development, test, production } from './config'
import { DatabaseConnector } from './backend/db'
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
