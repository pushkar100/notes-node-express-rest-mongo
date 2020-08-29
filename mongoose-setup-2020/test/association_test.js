const mongoose = require('mongoose')
const Schema = mongoose.Schema
const assert = require('assert')

const User = require('../src/user')
const BlogPost = require('../src/blogPost')
const Comment = require('../src/comment')

describe('Associations', () => {
  let joe, blogPost, comment

  beforeEach(done => {
    // 1. Setup records in collections:
    joe = new User({ name: 'joe' })
    blogPost = new BlogPost({ title: 'blog', content: 'post' })
    comment = new Comment({ content: 'comment' })

    // 2. Populate related data just like normal js operations:
    joe.blogPosts.push(blogPost)
    blogPost.comments.push(comment)
    comment.user = joe
    // Mongoose does the MAGIC of converting them to references!
    // i.e Map the IDs

    // 3. Save records into respective collections:
    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done())
  })

  it('saves a relation between a user & a blog post', done => {
    User.findOne({ name: 'joe' })
      // 4. Run the query modifier on the fetched data:
      .populate('blogPosts')
      .then(user => {
        assert(user.blogPosts[0].title === 'blog')
        done()
      })
  })

  it('saves a full relation graph', done => {
    User.findOne({ name: 'joe' })
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then(user => {
        const { name, blogPosts } = user
        const { title, comments } = blogPosts[0]
        const { content, user: commentUser } = comments[0]
        assert(name === 'joe')
        assert(title === 'blog')
        assert(content === 'comment')
        assert(commentUser.name === 'joe')

        done()
      })
  })
})