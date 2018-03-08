'use strict'

const chalk = require('chalk')
const { prompt } = require('inquirer')
const paths = require('../config/paths')
const { getPageList } = require('./utils')

const pages = getPageList(paths.entries)

// TL
// 识别 entry, branch
// 可指定输入页面名，或选择页面名

// npm run build
// npm run build --ftp
// npm run build index --ftp
// 输入出错

function empty() {
  console.log(`😂  ${chalk.red('请创建入口文件')}\n`)
  console.log(
    `src
└── view
    ├── page1
    │   ├── ${chalk.green('index.html')}
    │   └── ${chalk.green('index.js')}
    └── page2
        ├── ${chalk.green('index.html')}
        └── ${chalk.green('index.js')}`,
    '\n'
  )
  process.exit(1)
}

async function getEntry(entryArgs) {
  if (!pages.length) {
    empty()
  } else if (pages.length === 1) {
    return chooseOne(entryArgs)
  } else {
    return chooseMany(entryArgs)
  }
}

function result(entry = '', trunk = '') {
  return Promise.resolve({ entry, trunk })
}

function chooseOne(entryArgs) {
  const illegalInput = entryArgs.length && !validEntry(entryArgs[0])

  if (illegalInput) {
    return chooseEntry('您输入的页面有误, 请选择:')
  } else {
    return result(pages[0], entryArgs[1])
  }
}

function chooseMany(entryArgs) {
  if (validEntry(entryArgs[0])) return result(entryArgs[0])

  return chooseEntry(entryArgs.length && '您输入的页面有误, 请选择:')
}

function validEntry(entry) {
  return pages.includes(entry)
}

async function chooseEntry(msg) {
  const list = [...pages]
  const question = {
    type: 'list',
    name: 'entry',
    choices: list,
    default: list.indexOf('index'),
    // message 不可为空串
    message: msg || '请选择您的目标页面:'
  }
  const { entry } = await prompt(question)

  if (!entry) process.exit(0)
  console.log()

  return result(entry)
}

module.exports = getEntry
