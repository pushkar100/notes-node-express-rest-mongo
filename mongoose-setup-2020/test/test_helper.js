const mongoose = require('mongoose')

// Make sure that the conncection is made 
// and opened successfully before running any of the tests
// Use `before()`:
before(done => {
  mongoose.connect('mongodb://localhost/users_test', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true
  })
  mongoose.connection
    .once('open', () => done())
    .on('error', error => console.warn('Warning', error))
})

beforeEach(done => {
  const { users, blogposts, comments } = mongoose.connection.collections
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done()
      })
    })
  })
})