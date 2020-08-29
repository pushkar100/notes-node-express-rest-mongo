const assert = require('assert')
const User = require('../src/user')

describe('Deleting a user', () => {
  // 0. Save reference to a record you create
  let joe

  // 1. Create a record before running tests to remove it:
  beforeEach(done => {
    joe = new User({ name: 'joe' })
    joe.save().then(() => done())
  })

  function assertUserDeleted(operation, done) {
    operation.then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        assert(user === null)
        done()
      })
  }

  // 2. Run the operation to delete a record or records & assert it:
  it('model instance remove', done => {
    // 3. Remove the record & wait for it to complete.
    // 4. Then search in collection for removed record: Must not find it!
    assertUserDeleted(joe.remove({ name: 'joe' }), done)   
  })

  it('class method remove', done => {
    // 5. Use model class to remove many matches:
    assertUserDeleted(User.deleteMany(), done) // `<model>.remove()` is deprecated!
  })

  it('class method findAndRemove', done => {
    assertUserDeleted(User.findOneAndRemove({ name: 'joe' }), done)
  })

  it('class method findByIdAndRemove', done => {
    assertUserDeleted(User.findByIdAndRemove(joe._id), done)
  })
})