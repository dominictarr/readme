#! /usr/bin/env node
// -*- js2-strict-missing-semi-warning: nil; -*-

var resolve  = require('resolve')
var pager    = require('default-pager')
var fs       = require('fs')
var path     = require('path')
var minimist = require('minimist')
var toUrl    = require('github-url').toUrl
var opener   = require('opener')
var rc       = require('rc')
var apidocs  = require('node-api-docs')


var basedir = function (opts) {
  if (!opts.global) {
    return process.cwd()
  }
  var npmrc = rc('npm', null, [])
  var prefix = npmrc.prefix || path.resolve(process.execPath, '../..')
  return path.join(prefix, 'lib')
}


var packageFile = function (name, opts) {
  return resolve.sync(path.join(name, 'package.json'), { basedir: basedir(opts) })
}


var packageReadme = function (pkgFile) {
  var pkgDir = path.dirname(pkgFile)
  var readmes = fs.readdirSync(pkgDir).filter(function (filename) {
    return /^readme/.test(filename.toLowerCase())
  })
  if (!readmes.length) {
    throw new Error('Readme not found in ' + pkgDir)
  }
  return fs.createReadStream(path.join(pkgDir, readmes[0]))
}


var packageUrl = function (pkg, webUrl) {
  var repoUrl = toUrl(pkg.repository)
  return webUrl
    ? pkg.homepage || repoUrl || 'https://npm.im/' + pkg.name
    : repoUrl
}


try {
  var opts = minimist(process.argv.slice(2), {
    boolean: ['global', 'github', 'core'],
    alias: {
      global: 'g',
      github: 'gh',
      core: 'c'
    }
  })

  var name = String(opts._.shift() || '')

  if (opts.core) {
    apidocs(name).pipe(pager())
  } else if (opts.github || opts.web) {
    var pkg = require(packageFile(name, opts))
    opener(packageUrl(pkg, opts.web))
  } else {
    var pkgFile = name ? packageFile(name, opts) : 'package.json';
    packageReadme(pkgFile).pipe(pager())
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
