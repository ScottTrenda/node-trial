
require('colors')
var es = require('event-stream')
var concat = require('concat-stream')
var http = require('http')
var url = require('url')

var handlers = []
var host
var team


function verify(trial, opts, result, callback) {

  makeVerifyRequest(trial, opts, result, function(res) {
    // determine results of the trial
    if (!results(res, trial, result)) return callback && callback()

    // grab all the data out of the response
    res.pipe(es.wait(function(err, data) {
      var next = res.headers['x-trial']
      if (!next) return congrats()

      // run the user's trial solution
      data = JSON.parse(data.toString())
      run(next, data)
    }))

  })

}


// Run the user's implementation of the trial solution

function run(trial, options) {
  var instruct = instructions.bind(null, trial, options.description)
  var args = [].concat(options.args)
  var fn = handlers.shift()

  if (!fn) return instruct()

  var callback = function(err, result) {
    if (err) return (console.error(error), instruct())
    if (result) {
      if (Array.isArray(result)) result = JSON.stringify(result)
      result = (new Buffer(result)).toString('base64')
    }

    verify(trial, options, result, instruct)
  }

  // add a concat stream or normal callback
  if (options.stream === true)
    args.push(concat(callback.bind(null, null)))
  else
    args.push(callback)

  console.log('\nAttempting %s', trial.blue)

  try {
    fn.apply(null, args)
  } catch(ex) {
    instruct()
    throw ex
  }
}


function makeVerifyRequest(trial, opts, result, callback) {

  var httpOpts = url.parse(host)
  httpOpts.method = 'POST'
  httpOpts.headers = {
    'x-team': team,
    'x-trial': trial,
    'x-options': JSON.stringify(opts || '')
  }

  var req = http.request(httpOpts, callback)
    .on('error', function(e) {
      console.log("Got error: " + e.message)
    })

  req.end(result)
}


function congrats() {
  console.log('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.rainbow)
  console.log(' Congratulations on completing all trials!')
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.rainbow)
}



function results(res, trial, result) {
  var status = res.statusCode

  if (status == 404) return console.error('\nTrial "%s" not found', trial.red)

  if (status == 401) {
    console.error('\nIncorrect result for "%s"', trial.red)
    return false
  }

  if (status != 200) {
    return console.error('\nSomething crazy went wrong'.red)
  }

  // first trial doesn't have a result, so don't show a message for it
  if (result) {
    // if (result instanceof Buffer) result = result.toString()
    // console.log('\nSuccess!'.green + ' "%s" was the correct result for trial "%s"!', result.blue, trial.blue)
    console.log('\nSuccess!'.green + ' You got the correct result for trial "%s"!', trial.blue)
  }
  return true
}



function instructions(name, desc) {
  console.log('\nInstructions for "%s%s'.white, name.blue, '"'.white)
  console.log(desc)
}



module.exports = {

  get serverHost() { return host },
  set serverHost(val) { host = val },

  get teamName() { return team },
  set teamName(val) { team = val },

  add: function(fn) {
    handlers.push(fn)
  },

  start: function() {
    if (!host) throw new Error('serverHost must be set prior to calling start()')
    var parsed = url.parse(host)
    if (!parsed.hostname) throw new Error('serverHost must be a valid url.')
    if (!parsed.protocol) host = 'http://' + host

    verify('start')
  }

}

