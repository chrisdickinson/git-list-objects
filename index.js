module.exports = list

var through = require('through')
  , walkrefs = require('git-walk-refs')
  , walktree = require('git-walk-tree')
  , emit = require('emit-function')

function list(find, hashes, endpoints) {
  // list commits and walk the tree
  // emit (type, path | null, size, object)

  var stream = through()
    , refs = walkrefs(find, hashes, endpoints)
    , error = emit(stream, 'error')
    , seen = {}

  refs
    .on('data',   got_commit)
    .on('end',    on_end)
    .on('error',  error)

  return stream  

  function got_commit(commit) {
    refs.pause()
    output(commit)
    return walktree(find, commit, seen)
      .on('data',   output)
      .on('error',  error)
      .on('end',    onend)

    function onend() {
      refs.resume()
    }
  }

  function on_end() {
    stream.queue(null)
  }

  function output(obj) {
    seen[obj.hash] = true
    stream.queue(new Meta(
      obj.type
    , obj.stack || null
    , (obj._raw || []).length
    , obj 
    ))
  }
}

function Meta(type, path, size, obj) {
  this.type = type
  this.path = path
  this.size = size
  this.obj = obj
}

