#! /usr/bin/env node

var resolve = require('resolve')
var editor = require('editor')
var fs = require('fs')
var path = require('path')

var name = process.argv[2]
var global = process.argv[3]

var dashG = /-g|--global/

if(dashG.test(name))
  name = global, global = true
else if(dashG.test(global))
  global = true
else
  global = false

if(!name) {
    console.error('no package specified')
    process.exit(1)
  }

if(resolve.isCore(name)) {
    console.error('detection of core libs not yet supported', name)
    console.error('pull requests accepted.')
    process.exit(1)
  }

try {
  var file = resolve.sync(name, {
    basedir: global ? path.join(process.env.npm_config_root, '../') : process.cwd(), 
    packageFilter: function (pkg, dir) {
      var l = fs.readdirSync(dir)
      while(l.length) {
        var f = l.shift()
        if(/^readme/.test(f.toLowerCase())) {
          editor(path.join(dir, f), {editor: 'less'}, function (){})
        }
      }
      return true
    }})
} catch(e) {
  console.error(e.message)
  process.exit(1)
}

