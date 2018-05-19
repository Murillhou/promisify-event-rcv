const EventEmitter = require('events')
module.exports = 
  (
    eventEmitter,
    eventName,
    callback = (() => Promise.resolve()),
    { rejectionEvents = ['error'], timeout = 1000 } = { rejectionEvents: ['error'], timeout: 1000 }
  ) => 
  new Promise((resolve, reject) => {
    if (eventEmitter == null || !(eventEmitter instanceof EventEmitter)) {
      return reject(new Error('"eventEmitter" must be present and must be a valid Node.js event emitter.'))
    }

    if (eventName == null || typeof(eventName) !== 'string') {
      return reject(new Error('"eventName" must be present and must be a string representing the desired event name.'))
    }

    let promiseResolvingFunction
    if (typeof(callback) !== 'function') {
      promiseResolvingFunction = function() {
        return Promise.resolve()
      }
    } else {
      promiseResolvingFunction = function(...args) {
        try {
          return Promise.resolve(callback(...args))
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }

    if (rejectionEvents) {
      rejectionEvents.forEach(eventName => {
        eventEmitter.once(eventName, (...args) => reject(...args))
      })
    }

    let resolved = false

    eventEmitter.once(eventName, (...args) => {
      promiseResolvingFunction(...args)
      .then(result => {
        resolved = true
        return resolve(result)
      })
      .catch(error => reject(error))
    })

    if (timeout === parseInt(timeout, 10)) {
      setTimeout(() => {
        if (!resolved) {
          return reject(new Error(`Timeout exceeded waiting for the event "${eventName}".`))
        }
      }, timeout)
    }
  })
