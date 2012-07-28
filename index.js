#! /usr/bin/env node

var resolve = require('resolve')
var editor = require('editor')
var fs = require('fs')
var path = require('path')

var name = process.argv[2]
var global = process.argv[3]
var pager = process.env.PAGER || 'less'

var dashG = /-g|--global/

if(dashG.test(name))
  name = global, global = true
else if(dashG.test(global))
  global = true
else
  global = false

if(!name) {
    console.error('usage: readme packagename [-g]')
    process.exit(1)
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
      console.log('dir', dir)
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

