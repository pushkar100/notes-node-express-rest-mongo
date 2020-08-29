const assert = require('assert')
const User = require('../src/user')

describe('Reading users out of the database', () => {
  // 0. Save reference to a record you create
  let joe, maria, alex, zack

  // 1. Create a record before running tests to find it:
  beforeEach(done => {
    joe = new User({ name: 'joe' })
    alex = new User({ name: 'alex' })
    maria = new User({ name: 'maria' })
    zack = new User({ name: 'zack' })

    Promise.all([alex.save(), joe.save(), maria.save(), zack.save()])
      .then(() => done())
  })

  // 2. Find the created record:
  it('finds a user with a name of joe', done => {
    User.find({ name: 'joe' })
      .then(users => {
        assert(users[0]._id.toString() === joe._id.toString())
        done()
      })
  })

  it('find a user with a particular id', done => {
    User.findOne({ _id: joe._id })
      .then(user => {
        assert(user.name === 'joe')
        done()
      })
  })

  it('can skip & limit test results', done => {
    User.find({}) // fetches all user
      // Skip the 1st user, and limit to 2 users
      .skip(1)
      .limit(2)
      // Sort so that we can reliably predict the result order
      .sort({ name: 1 }) // ascending order
      .then(users => {
        assert(users.length === 2)
        assert(users[0].name === 'joe')
        assert(users[1].name === 'maria')
        done()
      })
  })
})

