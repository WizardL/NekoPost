'use strict'

import colors from 'colors'
import mongoose from 'mongoose'

export function DatabaseConnector(uri) {
  return new Promise(async (resolve, reject) => {

    mongoose.connection
      .on('error', (error) => reject(error))
      .on('close', () => console.log(`[${'!'.red}]Database connection closed`))
      .once('open', () => resolve(mongoose.connections[0]))
    try {
      await mongoose.connect(uri)
    } catch (error) {
      reject(error)
    }

    // Gracefully shutdown when INTERRUPT signal occurred
    process.on('SIGINT', () => mongoose.connection.close(() => process.exit(0)))
  })
}
