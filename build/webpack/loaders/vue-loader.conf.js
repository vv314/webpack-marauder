const { cssLoaders } = require('./style-loader')
const config = require('../../config')
const babelLoader = require('./babel-loader')
const maraConf = require(config.paths.marauder)
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: Object.assign(
    cssLoaders({
      sourceMap: isProd && maraConf.sourceMap,
      extract: isProd,
      minimize: isProd,
      vue: true
    }),
    {
      js: babelLoader(isProd)
    }
  ),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
