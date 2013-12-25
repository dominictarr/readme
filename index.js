#! /usr/bin/env node

var resolve = require('resolve')
var editor  = require('editor')
var fs      = require('fs')
var path    = require('path')
var opts    = require('optimist').argv
var toUrl   = require('github-url').toUrl
var opener  = require('opener')

var name = opts._.shift()
var global = opts.g || opts.global
var pager = process.env.PAGER || opts.pager || 'less'

if(!name) {
    name = './'
  }

if(resolve.isCore(name)) {
    console.error('detection of core libs not yet supported', name)
    console.error('pull requests accepted.')
    process.exit(1)
  }

try {
  var found = false
  var file = resolve.sync(name, {
    basedir: global ? path.join(process.execPath, '../../lib') : process.cwd(), 
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
          editor(path.join(dir, f), {editor: pager}, function (){})
        }
      }
      return pkg
    }})
} catch(e) {
  if(found) return
  console.error(e.message)
  process.exit(1)
}

