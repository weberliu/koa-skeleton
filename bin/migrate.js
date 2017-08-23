#!/usr/bin/env node

var shelljs = require('shelljs')

require('colors')
var log = console.log.bind(console, '>>> [MIGRATION]:'.red)

function build (cmd, params = '') {
  return `node_modules/.bin/sequelize ${cmd} ${params} --config=database/config.json --migrations-path=database/migrations --seeders-path=database/seeders --models-path=src/models `
}

const action = process.argv[2]
const params = process.argv.slice(3)

switch (action) {
  case 'reset':
    shelljs.exec(build(params[0] === 'all' ? 'db:migrate:undo:all' : 'db:migrate:undo'))
    shelljs.exec(build('db:migrate'))
    break
  case 'undo':
    shelljs.exec(build(params[0] === 'all' ? 'db:migrate:undo:all' : 'db:migrate:undo'))
    break
  case 'init':
    shelljs.exec(build('init'))
    break
  default:
    shelljs.exec(build('db:migrate'))
}

log(`${action} is done.`)

process.exit(0)
