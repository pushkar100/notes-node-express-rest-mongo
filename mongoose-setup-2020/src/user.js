const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = require('./post')

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be greater than 2 characters.'
    }
  },
  posts: [PostSchema],
  blogPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'blogpost'
  }],
  likes: Number
})

UserSchema.virtual('postCount').get(function() {
  return this.posts.length
})

// 1. Before removing a user record:
UserSchema.pre('remove', function(next) { // Use next in middleware
  // 2. Fetch the related collection model:
  const BlogPost = mongoose.model('blogpost')
  // 3. Use the remove (deleteMany) method on it:
  // 4. Use the `$in` operator to select records where the id 
  // is contained in the current schema's property:
  BlogPost.deleteMany({
    _id: {
      $in: this.blogPosts
    }
  }).then(() => next()) // Once successful, call the next middleware
})

// Create a collection (if it does not exist)
// using `.model()` method.
const User = mongoose.model('user', UserSchema)

module.exports = User