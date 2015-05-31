#! /usr/bin/env node

var resolve = require('resolve')
var pager   = require('default-pager')
var fs      = require('fs')
var path    = require('path')
var opts    = require('optimist').argv
var toUrl   = require('github-url').toUrl
var opener  = require('opener')
var rc      = require('rc')
var apidocs = require('node-api-docs')

var name = opts._.shift()
var global = opts.g || opts.global

if(!name) {
    name = './'
  }

if(resolve.isCore(name)) {
    return apidocs(name).pipe(pager())
  }

try {
  var found = false
  var prefix = rc('npm').prefix || path.join(process.execPath, '../..')
  var file = resolve.sync(name, {
    basedir: global ? path.join(prefix, 'lib') : process.cwd(),
    packageFilter: function (pkg, dir) {
      if(opts.git || opts.github || opts.gh) {
        opener(toUrl(pkg.repository))
        return found = true
      }
      if(opts.web) {
        opener(pkg.homepage || toUrl(pkg.repository) || 'https://npm.im/'+pkg.name)
        return found = true

      }
      var l = fs.readdirSync(dir)
      while(l.length) {
        var f = l.shift()
        if(/^readme/.test(f.toLowerCase())) {
          found = true
          fs.createReadStream(path.join(dir, f)).pipe(pager())
        }
      }
      return pkg
    }})
} catch(e) {
  if(found) return
  console.error(e.message)
  process.exit(1)
}

