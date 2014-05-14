var trials = require('trial-client/index')
var http = require('http')
var async = require('async')

// set the host name of the trials server:
trials.serverHost = 'http://10.0.1.99:3001'

// set your team name:
trials.teamName = 'Team Red' // Your Team Name

// Add each trial in the order that you solve
// them, from top to bottom, using `trials.add(fn)`

// You can write them all in this file:
trials.add(function(options, callback) {
  // HAHA I FOUND A BUG
  callback()
})

trials.add(function(urls, callback) {
  // Provide a function that takes two arguments, `urls` (array) and `callback`. Make an HTTP GET
  // request to each url in the `urls` array, and place each response body result
  // into a new array at the same position the request's url is in it's array.
  // This is essentially an asynchronous version of `Array.prototype.map`. Invoke
  // the callback with the resulting array (error first!).

  async.map(urls, function(url, callback) {
    var body = ''
    http.get(url, function(res) {
      res.on('data', function(chunk) { body += chunk })
      res.on('end', function() { callback(null, body) })
    })
  }, callback)
})



// Or in multiple files (recommended):
// trials.add(require('./trial1'))


// call `trials.start()` at the end.
trials.start()