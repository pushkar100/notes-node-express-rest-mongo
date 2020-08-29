const assert = require('assert')
const User = require('../src/user')

describe('Updating users', () => {
  // 0. Save reference to a record you create
  let joe

  // 1. Create a record before running tests to update it:
  beforeEach(done => {
    joe = new User({ name: 'joe', likes: 0 })
    joe.save().then(() => done())
  })

  function assertName(operation, done) {
    operation
      .then(() => User.find({})) // Empty object fetches all records (documents) 
      .then(users => {
        assert(users.length === 1)
        assert(users[0].name === 'alex')
        done()
      })
  }

  // 2. Run the tests to update the record(s)
  it('Model instance set & save', done => {
    joe.set('name', 'alex')
    // 3. Find all the users after setting & saving
      // 4. Make sure when you update the collection of one user
      // the count is still 1 record & the value of that record 
      // matches the update:
    assertName(joe.save(), done)
  })

  it('Model instance update', done => {
    assertName(joe.updateOne({ name: 'alex' }), done)
  })

  it('Model class can update many', done => {
    assertName(User.updateOne({ name: 'joe' }, { name: 'alex' }), done)
  })

  it('Model class can find one & update', done => {
    assertName(User.findOneAndUpdate({ name: 'joe' }, { name: 'alex' }), done)
  })

  it('Model class can find one by id & update', done => {
    assertName(User.findByIdAndUpdate(joe._id, { name: 'alex' }), done)
  })

  it('A user can have their likes incremented by one', done => {
    User.updateOne({ name: 'joe' }, {
      $inc: { likes: 1 }
    })
    .then(() => User.findOne({ name: 'joe' }))
    .then(user => {
      assert(user.likes === 1)
      done()
    })
  })
})