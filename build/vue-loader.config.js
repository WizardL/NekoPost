export default config

const config = {
  postcss: [
    require('autoprefixer')({
      browsers: ['last 3 versions']
    })
  ]
}
