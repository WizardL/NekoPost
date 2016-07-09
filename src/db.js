"use strict"

import colors from 'colors'
import mongoose from 'mongoose'

import { development, test, production } from './config'
const DBConfig = (process.env.NODE_ENV == 'production') ? production : development

export default mongoose

mongoose.connect(DBConfig)

mongoose.connection
  .on('error', error => console.log(`[${'!'.red}]  Unable to connect to database'}`))
  .on('close', () => console.log(`[${'!'.red}]  Database connection closed.`))
  .once('open', () => console.log(`[${'*'.green}  Connected to ${mongoose.conneections[0].host}:${mongoose.connections[0].port}/${mongoose.connections[0].name}]`))

// Gracefully close when INTERRUPT Signal occurred.
process.on('SIGINT', () => mongoose.connection.close(() => process.exit(0)))
