#!/usr/bin/env node

const path = require('path')
const projectRootPath = path.resolve(__dirname, '..')
const srcPath = path.join(projectRootPath, 'src')
const appPath = path.join(projectRootPath, 'app')
const fs = require('fs')
const debug = require('debug')('dev')
const babelCliDir = require('babel-cli/lib/babel/dir')
const babelCliFile = require('babel-cli/lib/babel/file')
const chokidar = require('chokidar')
const watcher = chokidar.watch(path.join(__dirname, '../src'), { ignored: /^\./, persistent: true, ignoreInitial: true })
const cp = require('child_process')

require('colors')
const log = console.log.bind(console, '>>> [DEV]:'.red)

watcher.on('ready', function () {
  log('Compiling...'.green)
  babelCliDir({ outDir: 'app/', retainLines: true, sourceMaps: true }, [ 'src/' ]) // compile all when start
  // require('../app') // start app
  let appIns = cp.fork(path.join(appPath))
  log('♪ App Started'.green)

  watcher
    .on('add', function (absPath) {
      compileFile('src/', 'app/', path.relative(srcPath, absPath), cacheClean)
      appIns = reload(appIns)
    })

    .on('change', function (absPath) {
      compileFile('src/', 'app/', path.relative(srcPath, absPath), cacheClean)
      appIns = reload(appIns)
    })

    .on('unlink', function (absPath) {
      var rmfileRelative = path.relative(srcPath, absPath)
      var rmfile = path.join(appPath, rmfileRelative)
      try {
        fs.unlinkSync(rmfile)
        fs.unlinkSync(rmfile + '.map')
      } catch (e) {
        debug('fail to unlink', rmfile)
        return
      }
      console.log('Deleted', rmfileRelative)
      cacheClean()
      appIns = reload(appIns)
    })
})

function compileFile (srcDir, outDir, filename, cb) {
  var outFile = path.join(outDir, filename)
  var srcFile = path.join(srcDir, filename)
  try {
    babelCliFile({
      outFile: outFile,
      retainLines: true,
      highlightCode: true,
      comments: true,
      babelrc: true,
      sourceMaps: true
    }, [ srcFile ], { highlightCode: true, comments: true, babelrc: true, ignore: [], sourceMaps: true })
  } catch (e) {
    console.error('Error while compiling file %s', filename, e)
    return
  }
  console.log(srcFile + ' -> ' + outFile)
  cb && cb()
}

function cacheClean () {
  Object.keys(require.cache).forEach(function (id) {
    if (/[\/\\](app)[\/\\]/.test(id)) {
      delete require.cache[id]
    }
  })
  log('♬ App Cache Cleaned...'.green)
}

function reload(appIns) {
  log('♬ App Reloading...'.green)
  const res = appIns.kill('SIGINT')

  return cp.fork(require('path').join(appPath));
}

process.on('SIGINT', () => {
  process.exit(0);
})

process.on('exit', function (e) {
  log(' ♫ App Quit'.green)
})
