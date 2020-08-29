const assert = require('assert')
const User = require('../src/user')

describe('Virtual types', () => {
  it('postCount returns a number of posts', done => {
    // 1. Create record (without defining the virtual type):
    const joe = new User({
      name: 'joe',
      posts: [{ title: 'A post' }]
    }) 

    // 2. We can test the count in memory itself
    // but as a good practice we will save & test:
    joe.save()
      .then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        // 3. Assert that the virtual type has the correct value:
        assert(user.postCount === 1)
        done()
      })
  })
})