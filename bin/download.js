#!/usr/bin/env node

var coredocs = require('node-api-docs')
var jsonstream = require('jsonstream')
var through = require('through2')
var mkdirp = require('mkdirp')
var fs = require('fs')
var path = require('path')

var coredir = path.join(__dirname, '../core')
mkdirp.sync(coredir)

console.log('Downloading core docs for offline use...')

coredocs.json('index')
  .pipe(jsonstream.parse(['desc',true,'text']))
  .pipe(through.obj(function (text, enc, next) {
    var m = /^\[[^\]]+\]\((\S+)\.html\)$/.exec(text)
    if (!m) return next()
    if (m[1] === 'documentation' || m[1] === 'synopsis') return next()
    var file = m[1] + '.md'
    coredocs.markdown(m[1]).pipe(fs.createWriteStream(path.join(coredir, file)))
    next()
  }))

// Don't abort install if this fails.
process.on('uncaughtException', function (err) {
  console.error(err.toString())
})
