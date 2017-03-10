#!/usr/bin/env node

var _ = require('lodash')
var program = require('commander')
var shelljs = require('shelljs')

require('colors')
var log = console.log.bind(console, '>>> [MIGRATION]:'.red)

function build(cmd, params = '') {
  return `node_modules/.bin/sequelize ${cmd} ${params} --config=database/config.json --migrations-path=database/migrations --seeders-path=database/seeders --models-path=src/models `
}

const action = process.argv[2]

switch (action) {
  case 'model':
    var params = process.argv.slice(3)
    var cmd = build('model:create', `--name ${params[0]} --attributes ${params[1]}`)
    shelljs.exec(cmd)
    break
  case 'reset':
    shelljs.exec(build('db:migrate:undo'))
    shelljs.exec(build('db:migrate'))
    break
  default:
    shelljs.exec(build('db:migrate'))
}


