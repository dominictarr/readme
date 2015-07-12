#! /usr/bin/env node
// -*- js2-strict-missing-semi-warning: nil; -*-

var apidocs        = require('node-api-docs')
var concat         = require('concat-stream')
var findRoot       = require('find-root')
var fs             = require('fs')
var help           = require('help-version')(usage()).help
var marked         = require('marked')
var markedTerminal = require('marked-terminal')
var minimist       = require('minimist')
var opener         = require('opener')
var rc             = require('rc')
var resolve        = require('resolve')
var toUrl          = require('github-url').toUrl
var pager          = require('default-pager')
var path           = require('path')


function usage() {
  return [
    'Usage:  readme [<option>] [<name>]',
    '',
    'With no <name>, display current module\'s readme.',
    '',
    'Options:',
    '  --global, -g    Show readme for a globally installed module.',
    '  --core, -c      Show readme for a core module.',
    '  --web           Open project\'s homepage.',
    '  --github, --gh  Open project\'s GitHub page.',
    '  --no-color      Turn off colors.'
  ].join('\n')
}


var basedir = function (opts) {
  if (!opts.global) {
    return process.cwd()
  }
  var npmrc = rc('npm', null, [])
  var prefix = npmrc.prefix || path.resolve(process.execPath, '../..')
  return path.join(prefix, 'lib')
}


var packageFile = function (name, opts) {
  return name
    ? resolve.sync(path.join(name, 'package.json'), { basedir: basedir(opts) })
    : path.join(findRoot(basedir(opts)), 'package.json')
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
    boolean: ['global', 'core', 'web', 'github'],
    alias: {
      global: 'g',
      core: 'c',
      github: 'gh'
    }
  })

  if (opts._.length > 1) {
    help(1)
  }

  var name = String(opts._.shift() || '')
  var readme

  if (opts.core) {
    readme = apidocs(name)
  } else if (opts.github || opts.web) {
    var pkg = require(packageFile(name, opts))
    opener(packageUrl(pkg, opts.web))
  } else {
    var pkgFile
    try {
      pkgFile = packageFile(name, opts)
    } catch (e) {
      opts.global = true
      pkgFile = packageFile(name, opts)
    }
    readme = packageReadme(pkgFile)
  }

  if (readme) {
    marked.setOptions({
      renderer: new markedTerminal()
    })
    readme.pipe(concat({ encoding: 'string' }, function (md) {
      pager().end(marked(md))
    }))
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
