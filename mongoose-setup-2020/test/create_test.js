const assert = require('assert')
const User = require('../src/user')

describe('Create records', () => {
  it('Save a user', done => {
    // 1. Create a record from a collection (based on model(i.e schema))
    const joe = new User({ name: 'joe' })
    // 2. Save record to database
    joe.save()
      .then(() => {
        // 3. Check if record was indeed saved!
        assert(!joe.isNew)
        done()
      })

  })
})