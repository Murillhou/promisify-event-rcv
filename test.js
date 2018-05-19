// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const EventEmitter = require('events'),
  sinon = require('sinon'),
  chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  path = require('path'),
  appRoot = require('app-root-path').toString(),
  promisify = require(path.join(appRoot, 'index.js'))

chai.use(chaiAsPromised)
chai.should()

class MyEmitter extends EventEmitter {}
let emitter
let testString = 'testing!'
let testError = new Error(testString)

describe('--> parse parameters', () => {
  beforeEach(() => {
    emitter = new MyEmitter()
  })
  it('should reject if any of "eventEmitter" or "eventName" parameters is not present or is invalid', done => {
    Promise.all([
      promisify(),
      promisify(emitter),
      promisify(emitter, null),
      promisify(emitter, {}),
      promisify({}, 'error'),
      promisify(null, 'error'),
      promisify(undefined, 'error'),
      promisify('emitter', 'error')
    ]).should.be.rejected.and.notify(done)
  })
  it(`should use an "empty resolving function" as "callback" parameter when it is not present or other thing than a function was passed.`, done => {
    Promise.all([
      promisify(emitter, 'event').should.eventually.be.undefined,
      promisify(emitter, 'event', 'non function').should.eventually.be.undefined
    ]).should.be.fulfilled.and.notify(done)
    emitter.emit('event')
  })
  afterEach(() => {
    emitter = null
  })
})

describe('--> do the work', () => {
  beforeEach(() => {
    emitter = new MyEmitter()
  })
  it(`should return a promise that is resolved as soon as the event "eventName" is detected on the object "eventEmitter".`, done => {
    promisify(emitter, 'event').should.be.fulfilled.and.notify(done)
    emitter.emit('event')
  })
  it(`should work both with any type of functions that returns a Promise or any type of regular functions, resolving to the returned value
    if present and rejecting if any exception occured during the execution.`, done => {
    emitter.setMaxListeners(15)
    Promise.all([
      promisify(emitter, 'event', function() { return testString }).should.eventually.equal(testString),
      promisify(emitter, 'event', function namedFunction() { return testString }).should.eventually.equal(testString),
      promisify(emitter, 'event', () => { return testString }).should.eventually.equal(testString),
      promisify(emitter, 'event', () => testString).should.eventually.equal(testString),
      promisify(emitter, 'event', function() { return Promise.resolve(testString) }).should.eventually.equal(testString),
      promisify(emitter, 'event', function namedFunction() { return Promise.resolve(testString) }).should.eventually.equal(testString),
      promisify(emitter, 'event', () => { return Promise.resolve(testString) }).should.eventually.equal(testString),
      promisify(emitter, 'event', () => Promise.resolve(testString)).should.eventually.equal(testString),
      promisify(emitter, 'event', function() { throw testError }).should.be.rejectedWith(testError),
      promisify(emitter, 'event', function namedFunction() { throw testError }).should.be.rejectedWith(testError),
      promisify(emitter, 'event', () => { throw testError }).should.be.rejectedWith(testError),
      promisify(emitter, 'event', function() { return Promise.reject(testError) }).should.be.rejectedWith(testError),
      promisify(emitter, 'event', function namedFunction() { return Promise.reject(testError) }).should.be.rejectedWith(testError),
      promisify(emitter, 'event', () => { return Promise.reject(testError) }).should.be.rejectedWith(testError),
      promisify(emitter, 'event', () => Promise.reject(testError)).should.be.rejectedWith(testError)
    ]).should.be.fulfilled.and.notify(done)
    emitter.emit('event')
  })
  it(`should call the callback with any number of arguments that the event have.`, done => {
    promisify(emitter, 'event', (arg1, arg2, arg3) => arg1+arg2+arg3).should.eventually.eql(6).and.notify(done)
    emitter.emit('event', 1, 2, 3)
  })
  afterEach(() => {
    emitter = null
  })
})

describe('--> use options if present', () => {
  beforeEach(() => {
    emitter = new MyEmitter()
  })
  it(`should resolve once the event is detected and with the expected result of the callback function when it was passed.`, done => {
    promisify(emitter, 'event', () => Promise.resolve(testString)).should.eventually.eql(testString).and.notify(done)
    emitter.emit('event')
  })
  it(`should reject with an error when the option timeout is set to a positive integer (representing millisecopnds) everytime the timeout is
    exceeded before the desired event is emitted.`, done => {
      promisify(emitter, 'event', () => Promise.resolve(testString), {timeout: 10}).should.be.rejected.and.notify(done)
  })
  it(`should reject with an error containing the first parameter of any event that is emitted by the "eventEmitter" object
     and whose name is present on the "rejectionEvents" option, before the desired event is emitted or the timeout (if set) expires.`, done => {
      promisify(emitter, 'event', () => setTimeout(() => Promise.resolve(testString), 1000), {rejectionEvents: ['error', 'close']}).should.be.rejectedWith(testError).and.notify(done)
      emitter.emit('error', testError)
  })
  afterEach(() => {
    emitter = null
  })
})