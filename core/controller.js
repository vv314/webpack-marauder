// https://www.npmjs.com/package/cross-spawn
const spawn = require('react-dev-utils/crossSpawn')
const paths = require('../build/config/paths')
const getEntry = require('../build/libs/entry')
const { buffer2String } = require('../build/libs/utils')

const cmdMap = {
  dev: 'dev-server',
  test: 'test',
  build: 'build',
  lib: 'build4comp',
  dll: 'dll',
  '-v': 'version'
}

function version() {
  const npm = spawn('npm', ['info', 'webpack-marauder', 'dist-tags'])
  const res = new Promise((resolve, reject) => {
    npm.stdout.on('data', data => resolve(buffer2String(data)))
    npm.stderr.on('data', data => reject(buffer2String(data)))
  })

  console.log(require(paths.ownPackageJson).version, '\n')
  console.log('dist-tags:')
  return res.then(data => {
    const arr = data.replace(/[{}]/g, '').split(',')
    return arr.map(tag => console.log(`  ${tag}`))
  })
}

module.exports = function({ commands, args, rawArgv } = {}) {
  const equalsCmd = cmd => cmdMap.hasOwnProperty(cmd)
  const cmd = commands[0]
  // marax dev index_page
  // inputArgs: ['index_page']
  const entryArgs = commands.slice(1)

  if (!equalsCmd(cmd)) {
    console.log('Unknown command "' + cmd + '".')
    console.log('Perhaps you need to update webpack-marauder?')
    console.log(
      'See: https://github.com/SinaMFE/webpack-marauder/blob/master/README.md'
    )
    process.exit(0)
  }

  function apply(path, inputEntry) {
    require('../commands/' + path)({ inputEntry, args })
  }

  if (cmd === '-v') {
    version()
  } else if (cmd === 'dev' || cmd === 'build') {
    getEntry(entryArgs).then(inputEntry => apply(cmdMap[cmd], inputEntry))
  } else {
    apply(cmdMap[cmd])
  }
}
