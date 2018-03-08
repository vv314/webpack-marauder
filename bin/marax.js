#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const semver = require('semver')
const controller = require('../core/controller')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(
      `You are using Node ${
        process.version
      }, but webpack-marauder requires Node ${requiredVersion}.\nPlease upgrade your Node version.\n`
    )
  )
  process.exit(1)
}

const rawArgv = process.argv.slice(2)

// npm run dev top10 => {"_":["dev","top10"]}
// npm run dev top10 --ftp => {"_":["dev","top10"]}
// npm run dev top10 --ftp sss => {"_":["dev","top10","ssss"]}
// marax dev top10 => {"_":["dev","top10"]}
// marax dev top10 --ftp => {"_":["dev","top10"],"ftp":true}
// npx marax dev top10 --ftp sss => {"_":["dev","top10"],"ftp":"sss"}
const args = require('minimist')(rawArgv)

controller({ commands: args._, args, rawArgv })
