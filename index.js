#! /usr/bin/env node
// -*- js2-strict-missing-semi-warning: nil; -*-

var resolve  = require('resolve')
var pager    = require('default-pager')
var fs       = require('fs')
var path     = require('path')
var optimist = require('optimist')
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


var packageReadme = function (name, opts) {
  var pkg = packageFile(name, opts)
  var pkgDir = path.dirname(pkg)
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
  var opts = optimist.argv
  var name = String(opts._.shift()) || './'

  if (opts.g) {
    opts.global = true
  }

  if (resolve.isCore(name)) {
    apidocs(name).pipe(pager())
  } else if (opts.github || opts.gh || opts.web) {
    var pkg = require(packageFile(name, opts))
    opener(packageUrl(pkg, opts.web))
  } else {
    packageReadme(name, opts).pipe(pager())
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
