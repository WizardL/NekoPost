"use strict";

import app from './src'

import colors from 'colors'

const port = process.env.PORT || 3000

(async () => {
  await app.listen(port)
  console.log(`[${'@'.green}]  Server listening on port ${port}`)
})()
