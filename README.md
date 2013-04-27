# git-list-objects

given a find function, a list of hashes, and an optional
list of "end" hashes, list all git objects in recency order
as a stream.

```javascript
var list = require('git-list-objects')
  , open = require('git-fs-repo')

open('path/to/.git', function(err, repo) {
  var hashes = repo.refs.map(function(x) {
    return x.hash
  })

  list(repo.find, hashes)
    .on('data', function(meta) {
      meta.type // integer type
      meta.path // [{mode: 0000, name: '', hash: Buffer}]
      meta.size // integer byte size of object
      meta.obj  // original git object 
    }) 
}) 

```

## API

#### list(find, hashes[, endpoints]) -> list stream

create a stream that will start emitting data on the next tick. 

`find` is a function that takes a string object id and a `ready` node-style (err, data) callback.

`hashes` (and `endpoints`, if present) should be a list of string object ids.

# license

MIT
