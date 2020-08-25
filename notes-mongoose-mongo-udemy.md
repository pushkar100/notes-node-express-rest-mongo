# Mongo DB & Mongoose Notes

[Course - Udemy](https://www.udemy.com/course/the-complete-developers-guide-to-mongodb)

Installation:
- Brew (Package manager for OSX)
- Node & NPM (via Brew)
- Mongo (via Brew)
- RoboMongo (A GUI for browsing the contents of our mongodb databases i.e helpful)

## What is Mongo?

Mongo is a database. Specifically, it is a NoSQL database (not very relational, contains JSON data, and is easy to scale)

Generally, we use mongo with an ORM (or ODM) which stands for "Object Relational Mapper" which helps us query the Mongo database in a language of our choice (instead of learning something like SQL). Therefore, mongo can be used with many languages and not just javascript

### What is Mongoose? 

**Mongoose** is the most popular ORM for mongo. We use that to connect to mongo and query it. You can, however, use mongo directly without needing an ORM but you can only do so by launching mongo directly (but not from say, a node application. For that you require an ORM)

### How is Mongo accessed in the real-world?

1. The client application (website or native app) interacts with a server
2. The server (say, Node) has an ORM installed on its app (say, Mongoose)
3. The ORM interacts with the mongo instance which is also running on that server (as a separate process)

## Structure of Mongo

- Whenever you start mongo, you get a **mongo instance**
- The mongo instance can **contain multiple databases** (so that we can work on different projects at the same time without needing to dump data)
- Each database has something known as **collections** (These contain a set of resources that we want to club together)
- Each collection has many **resources** as records (Ex: A book in a collection of books)

## Core database operations (CRUD)

The most common and useful database operations are:

1. Create (store new data)
2. Read (fetch existing data)
3. Update (change existing data)
4. Delete (delete existing data)

## Using Mongoose

1. Setup a project `npm init`
2. **`npm i -S mongoose`**
3. Additionally, for testing your javascript (mongoose) code, install a test library like `mocha`. Use it to test your CRUD operations

### Connecting to a Mongo database with Mongoose

* Require the `mongoose` package
* Run `mongoose.connect('mongodb://<ipaddress:port>/<databasename>')`. This connects to a mongodb instance running on a port of a server and links to a particular database inside it. *If database does not exist, it creates it!*
* Once a connection starts, it happens over time and asynchronously. To be able to know when the connection was successful (or an error was thrown) we latch onto the events of `mongoose.connection` object. 
* We listen `once` to the `'open'` event i.e successful connection. Later, we listen to any `'error'` events using `on`

Example:

```js
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/users_test')
mongoose.connection
  .once('open', () => console.log('Good to go'))
  .on('error', error => console.warn('Warning', error))
```

**Note:**

1. Mongoose uses a parser to parse the URL we provide in the `connect` method. However, this parser is deprecated and throws a warning on execution. To use the new parser, add a second argument, an object, like so: `mongoose.connect('mongodb://localhost/users_test', { useNewUrlParser: true })`
2. You might also want to add in `useUnifiedTopology: true` since the server discovery and monitoring engine is deprecated as well
3. For certain query methods such as `findOneAndRemove()` and similar ones, you need to have `useFindAndModify: false`  in the connect configuration

To be on the safer side, connect using the following:

```js
mongoose.connect('mongodb://localhost/users_test', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true
  })

// Alternatively, you can set them individually with:
// mongoose.set('<property', <value>)
```

### Models for schema

Mongoose lets us create "models" for schema. Every individual record (resource) inside a collection can be forced to follow certain rules for properties and their values that it contains. This constraint is enforced via a schema. Therefore, schema is a *class* (like a blueprint) and the actual records are instances of the schema i.e instances of the model

We can think of a model of a *single representation of all the records* (items) in a collection!

Example: The mongoose method for creating a schema model

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema // Note the uppercase `S` since it's a class
```

### Making a model from a schema (Creating a collection)

The following are the steps:

1. Create a schema for a record in a collection
2. Schema properties will be properties that records can have. Schema values are the data types of the values. You may use javascript built-in constructors for those types
3. Create a collection that follows a model that uses this schema with `mongoose.model(<collection-name>, <schema>)`

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String // The values can be javascript data types
})

// Create a collection (if it does not exist)
// using `.model()` method.
const User = mongoose.model('user', UserSchema)

module.exports = User
```

Note that the collection we create using `.model` is conventionally singular in its name. This might be confusing since it refers to not a single record but a "collection of records". That is why we use capital letter to indicate that it is a class of records (i.e collection) and not a record

**Important:**

1. The model for a collection is singular and capital like a class name (Ex: **'user'** as argument to the `model()` method and then assign the expression to the **User** variable by convention)
2. While accessing collections, we will use the plural form though! Ex: `mongoose.connection.collections.users`

### Accessing a collection

`mongoose.connection.collections` contains the collections of the database we are connected to. Therefore, we can do **`mongoose.connection.collections.<collection-name>`** to fetch a collection 

The collection name used should have been the same name we passed to `.model()` method to create it

### Dropping a collection

Just like how you drop a RDBMS database i.e get rid of it and its data, we can drop a collection in mongo with **`mongoose.connection.collections.<collection-name>.drop()`**

Example: `mongoose.connection.collections.users.drop()`

The `.drop()` provides a callback as argument to be run once a collection has been dropped

### Creating and saving a record

Once a collection is created, we can instantiate a record inside it in an OOP manner. After that the record that is created will itself have a **`.save()`** method

Example:

```js
// 1. Create a record from a collection (based on model(i.e schema))
const joe = new User({ name: 'joe' })
// 2. Save record to database collection
joe.save()
```

Use robomongo to visually verify the creation of the record

### Testing if a record was saved into a collection

The `save()` method on a record returns a **promise**. We can use this promise to latch onto the `then()` clause which will execute itself on a successful save of the record

A record itself has a **`.isNew`** property which is true until it is saved inside the database using `.save()`. 

Example: 

```js
const joe = new User({ name: 'joe' })
joe.isNew // true
joe.save().then(() => {
	joe.isNew // false
})
```

### Reading records (Querying)

We can do it in two ways:

1. By matching criteria (For example, matching a property like `name`)
2. By matching a *unique id* that mongo assigns to every record

All the querying (search) methods will use the collection model and not an individual record.

#### Matching criteria

- **`<Collection>.find(<criteria>)`** will return all matching records as an *array*
- **`<Collection>.findOne(<criteria>)`** will return the *first* matching record i.e the value of that record

Both return a *promise* when executed

Examples:

```js
User.find({ name: 'joe' })
      .then(users => {
        console.log(users) // Ex: [ { _id: 5f43b8d4bea63d0afaae2372, name: 'joe', __v: 0 } ]
      })
```

**Note:** **`<collection>.find({})`** will return *all the records* (documents) of a collection

#### Matching the unique id

Many records might share the same properties. But, an ID will always be unique!

Therefore, we can compare two IDs by matching the **`_id`** property of the record. We can do it with `find()` & `findOne()` promises as well

Example:

```js
// Assume `joe` is a record stored in a variable
User.findOne({ _id: joe._id })
	.then(joe => /* have access to record that matched */)

// NOTE: that we cannot pass a string to match `_id`. Since `joe` was a
// stored record, `joe._id` basically matched an object for `_id` 
// and that is what it requires to be matched in find() & findOne() using `_id`
```

#### A note on **`_id`**

We cannot match `_id`s directly since they are not plain strings or numbers but are objects in the internal representation. We must first convert `<record>._id` to a string using `<record>._id.toString()` and then read and compare the values

### Deleting records

In mongo, delete is referred to as **remove**. There are 4 ways to do this:

Methods on a model instance (i.e a record):

1. `remove()`: It removes the record

Methods on the model class (i.e collection & its schema):

1. `findOneAndRemove()`: Finds a matching record in the collection and removes it
2. `findByIdAndRemove()`: Finds a record in the collection matching the ID and removes it
3. `remove()`: Removes *all* matching records. *This method has been deprecated. Use `deleteOne()` or `deleteMany()` instead!*

All the above operations return *promises*

An example of `<record>.remove()`:

```js
joe.remove()
      .then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        assert(user === null)
        done()
      })
```

An example of `<model>.remove()` (can match many instead of just one):

```js
User.deleteMany() // `<model>.remove()` is deprecated!
      .then(() => User.findOne({ name: 'joe' }))
      .then(user => {
        assert(user === null)
        done()
      })
```

### Updating records

There are 6 ways to do this:

Methods on a model instance (i.e a record):

1. `update()`: Updates the record. 
	- `update` is **deprecated** now. Use **`updateOne`**
2. `set()` &`save()`: We can set a record's property *in memory* & save it back to the database collection! A common pattern is to apply many `set` and in the end, perform one `save`

Methods on the model class (i.e collection & its schema):

1. `update()`: Updates *all the matching records*. 
	- `update` is **deprecated** now. Use **`updateOne`**, **`updateMany`**, or **`bulkWrite`** instead
2. `findOneAndUpdate()`: Updates one matching record
3. `findByIdAndUpdate()`: Updates one record if it matches the id passed to it

The above methods take ***two arguments***: 
- An object (or `_id` according to which method is being called) to match the record, and
- Another object to update the matched record

Example of `set()` & `save()`:

```js
joe.set('name', 'alex')
joe.save()
```

Example of model instance `updateOne`:

```js
joe.updateOne({ name: 'alex' })
```

Example of model class update methods:

```js
User.updateOne({ name: 'joe' }, { name: 'alex' })
// ...
User.findOneAndUpdate({ name: 'joe' }, { name: 'alex' })
// ...
User.findByIdAndUpdate(joe._id, { name: 'alex' })
```

### Note: Some of the above methods are deprecated!

[Link to replacements](https://mongoosejs.com/docs/deprecations.html)

1. `<model>.remove()` is deprecated. Use **`deleteOne()`** or **`deleteMany()`**
2. `<model>.update()` is deprecated. Use **`updateOne()`**, **`updateMany()`**, or **`replaceOne()`**
3. `count()`  is deprecated. Use **`countDocuments()`** instead

## Testing Mongoose & Mongo

### Connecting successfully before testing

If we try to perform CRUD operations before the database can connect, we will get errors. Hence, make sure that the database is up and running **`before()`** starting any tests.

We can place code similar what's below in a test helper file that runs when run the tests:

```js
// Make sure that the conncection is made 
// and opened successfully before running any of the tests
// Use `before()`:
before(done => {
  mongoose.connect('mongodb://localhost/users_test', { 
	  useNewUrlParser: true, 
	  useUnifiedTopology: true 
  })
  mongoose.connection
    .once('open', () => /* Continue testing: */ done())
    .on('error', error => console.warn('Warning', error))
})
```

### Testing CRUD operations

We can use a tool like mocha or jest and setup `describe` and `it` blocks. Inside those blocks, we can get hold of a collection from a database and perform the necessary assertions on it.

When creating data, we might generate duplicates that might interfere with testing. Therefore, it is a *good practice to clear the database before every test* (Note that this will be a database specifically for testing and not for production deployment)

**Steps:**

1. Start test suite
2. Drop the database
3. Run an `it` test
4. Drop the database
5. Run an `it` test
6. & so on...

We can use `beforeEach` or similar methods to automate the dropping of the database before each test

```js
beforeEach(done => {
  mongoose.connection.collections.users.drop(() => {
    done()
  })
})
```

### Example of a ***Create*** (& Save) test:

```js
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
```

### Example of a ***Read*** (Query) test:

```js
const assert = require('assert')
const User = require('../src/user')

describe('Reading users out of the database', () => {
  // 0. Save reference to a record you create
  let joe

  // 1. Create a record before running tests to find it:
  beforeEach(done => {
    joe = new User({ name: 'joe' })
    joe.save().then(() => done())
  })

  // 2. Find the created record:
  it('finds a user with a name of joe', done => {
    User.find({ name: 'joe' })
      .then(users => {
	    // 3. It's a good idea to compare the ids:
        assert(users[0]._id.toString() === joe._id.toString())
        done()
      })
  })

  // Similar to (2) but using `findOne()` and `_id` match:
  it('find a user with a particular id', done => {
    User.findOne({ _id: joe._id })
      .then(user => {
        assert(user.name === 'joe')
        done()
      })
  })
})
```

### Examples of a *Delete* records test

```js
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
    assertUserDeleted(User.deleteMany(), done) 
    // Using `deleteMany` because `<model>.remove()` is deprecated!
  })

  it('class method findAndRemove', done => {
    assertUserDeleted(User.findOneAndRemove({ name: 'joe' }), done)
  })

  it('class method findByIdAndRemove', done => {
    assertUserDeleted(User.findByIdAndRemove(joe._id), done)
  })
})
```

### Examples of *Updating* records test

```js
const assert = require('assert')
const User = require('../src/user')

describe('Updating users', () => {
  // 0. Save reference to a record you create
  let joe

  // 1. Create a record before running tests to update it:
  beforeEach(done => {
    joe = new User({ name: 'joe' })
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
})
```

## Update operators

The brute force approach to update records from a collection is to (a) fetch the records (b) update it & (c) save it. However, fetching data to the server to update it is expensive i.e it involves a round trip. What if we can just convey to the database to find & update it in custom ways i.e give it directions? In this way, we don't have to fetch any data. Mongo [update operators](https://docs.mongodb.com/manual/reference/operator/update/) help us do this

Some of the common operators are:

- `$inc`: Increment the value by an amount
- `$mul`: multiplies the value by an amount
- `$set`: Sets a field
- `$unset`: Removes a field
- `$rename`: Renames a property

Example of how to use an update operator:

```js
// Increment using $inc:
User.updateOne({ name: 'joe' }, {
	$inc: {
		postCount: 1 // Increments postCount of a record with name 'joe' by 1
	}
})

// Decrement using $inc but a negative number:
User.updateOne({ name: 'joe' }, {
	$inc: {
		postCount: -2 // Decrements postCount of a record with name 'joe' by 2
	}
})
```

## Validating records

### What is validation?

It is a process of checking whether the values are safe to add into our database. *Validating a record during its creation*

### Adding validation to the schema

We can add objects to schema properties instead of a simple type. This object can contain the type and other validation fields (Ex: `type` & `required`)

The **`required`** field inside a schema takes in a 2-element array. First value being a boolean and the second is an error message to be displayed when validation fails

Example of a schema with validation:

```js
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  postCount: Number
})
```

### Checking if the value is valid

Once you have added validation and want to test if the record creation was validated (created or reject) or not, you can user `<record>.validate()` or `<record>.validateSync(result => { ... })`

The result that comes back is an object with a lot of data. It contains an `errors` property where we can find the `message` against the property that failed the validation

Example:

```js
const user = new User({ name: undefined })
const validationResult = user.validateSync()
const { message } = validationResult.errors.name
```

### Testing validation inside a test suite

Example:

```js
it('requires a username', () => {
  const user = new User({ name: undefined })
  const validationResult = user.validateSync()
  const { message } = validationResult.errors.name

  assert(message === 'Name is required.')
})
```

### Adding a custom validator function

`required` is good for mandatory properties but if we needed more complex validations, we need to add our custom checks. For this, mongoose allows us to have a validator function inside the schema.

Inside our schema we can have a **`validate`** property for a schema field. This property is an object with the following properties:

1. `validator()`: A method that takes in the value of the field and returns a boolean. If `true`, the check has passed else it has failed
2. `message`: The message to display when the validation fails

Example of a schema with validator function:

```js
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be greater than 2 characters.'
    }
  },
  postCount: Number
})
```

Example of testing a schema's validator function:

```js
it('requires a user name with more than 2 characters', () => {
  const user = new User({ name: 'Al' })
  const validationResult = user.validateSync()
  const { message } = validationResult.errors.name

  assert(message === 'Name must be greater than 2 characters.')
})
```

### Handling failure in saving of invalid records to database

When you create a record and run `<record>.save()`, it will return a promise that rejects. The `catch()` clause will receive the validation result

Example of testing failed record from being saved into the database:

```js
it('disallows invalid records from being saved', done => {
    const user = new User({ name: 'Al' })
    user.save()
      .catch(validationResult => {
        const { message } = validationResult.errors.name
        assert(message === 'Name must be greater than 2 characters.')
        done()
      })
  })
```

