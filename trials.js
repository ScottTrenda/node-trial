var trials = require('trial-client/index')

// set the host name of the trials server:
trials.serverHost = 'http://10.0.1.99:3001'

// set your team name:
trials.teamName = 'Team Red' // Your Team Name

// Add each trial in the order that you solve
// them, from top to bottom, using `trials.add(fn)`

// You can write them all in this file:
trials.add(function(options, callback) {
  callback()
})

// Or in multiple files (recommended):
// trials.add(require('./trial1'))


// call `trials.start()` at the end.
trials.start()