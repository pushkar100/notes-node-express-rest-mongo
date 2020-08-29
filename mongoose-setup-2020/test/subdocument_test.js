const assert = require('assert')
const User = require('../src/user')
const { Schema } = require('mongoose')

describe('Subdocument tests', () => {
  it('Can create a sub-document', done => {
    // 1. Create new user with a subdocument that
    // matches the subdocument schema:
    const joe = new User({
      name: 'joe',
      posts: [{ title: 'A post title' }] // Make sure sub-dcoument follows schema
    })

    // 2. Save record
    joe.save()
      .then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        // 3. Make sure to test subdocument by testing 
        // the value for it that was saved!
        assert(user.posts[0].title === 'A post title')
        done()
      })
  })

  it('Can add a sub-document to existing record', done => {
    // 0. First create a record & save it:
    const joe = new User({
      name: 'joe',
      posts: []
    }) 

    joe.save()
      // 1. Fetch an existing record:
      .then(() => User.findOne({ name: 'joe' }))
      // 2. Update the sub-document & save it back:
      .then(user => {
        user.posts.push({ title: 'A new post'})
        return user.save()
      })
      // 3. Fetch the record again & assert the addition of a sub-document:
      .then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        assert(user.posts[0].title === 'A new post')
        done()
      })
  })

  it('Can remove an existing sub-document', done => {
    // 0. First create a record & save it:
    const joe = new User({
      name: 'joe',
      posts: [{ title: 'New post'}]
    }) 

    joe.save()
      // 1. Fetch an existing record:
      .then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        // 2. Fetch a sub-document:
        const post = user.posts[0]
        // 3. Remove it with `remove()`:
        post.remove()
        // 4. Resave the document (record):
        // DON'T make the mistake of saving the sub-document instead of the record!
        return user.save()
      })
      // 5. Fetch it again and assert that the sub-document was removed:
      .then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        assert(user.posts.length === 0)
        done()
      })
  })
})