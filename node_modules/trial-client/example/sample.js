var trials = require('../index')

// set the host name of the trials server:
trials.serverHost = 'http://localhost:3001'

// set your team name:
trials.teamName = '' // Your Team Name

// Add each trial in the order that you solve
// them, from top to bottom, using `trials.add(fn)`

// You can write them all in this file:
// trials.add(function(options, callback) {
//   console.log('first trial', options)
//   callback()
// })

// Or in multiple files (recommended):
// trials.add(require('./trial1'))


// call `trials.start()` at the end.
trials.start()
