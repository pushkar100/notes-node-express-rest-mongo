const mongoose = require('mongoose')
const assert = require('assert')
const User = require('../src/user')
const BlogPost = require('../src/blogPost')

describe('Middleware', () => {
  let joe, blogPost

  beforeEach(done => {
    // 1. Setup records in collections:
    joe = new User({ name: 'joe' })
    blogPost = new BlogPost({ title: 'blog', content: 'post' })

    // 2. Populate related data just like normal js operations:
    joe.blogPosts.push(blogPost)

    // 3. Save records into respective collections:
    Promise.all([joe.save(), blogPost.save()])
      .then(() => done())
  })

  it('Users clean up dangling blog post on remove', done => {
    joe.remove()
      .then(() => BlogPost.countDocuments())
      .then(count => {
        assert(count === 0)
        done()
      })
  })
})