// 确保在文件首部设置环境变量
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const chalk = require('chalk')
const ora = require('ora')
const webpack = require('webpack')
const { getPageList } = require('./utils/utils')
const config = require('./config')
const paths = config.paths
const getWebpackProdConf = require('./webpack/webpack.prod.conf')
const printBuildError = require('react-dev-utils/printBuildError')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

const spinner = ora('Biuld component...')
spinner.start()

const pages = getPageList(config.paths.entries)
pages.unshift(config.keyword.UMDCOMPILE)

const webpackConfs = pages.map(getWebpackProdConf)

function build() {
  const compiler = webpack(webpackConfs)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      spinner.stop()

      if (err) return reject(err)

      const messages = formatWebpackMessages(stats.toJson({}, true))
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }

      return resolve({
        stats,
        warnings: messages.warnings
      })
    })
  })
}

function clean() {
  return fs.emptyDir(paths.dist)
}

function success(output) {
  // webpack 打包结果统计
  process.stdout.write(
    output.stats.toString({
      colors: true,
      modules: false,
      hash: false,
      children: true,
      chunks: false,
      chunkModules: false
    }) + '\n\n'
  )

  console.log(chalk.cyan('  Build complete.\n'))
}

function error(err) {
  console.log(chalk.red('Failed to compile.\n'))
  printBuildError(err)
  process.exit(1)
}

clean()
  .then(build)
  .then(success)
  .catch(error)
