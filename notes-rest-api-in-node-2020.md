# RESTful Web API Design with NodeJS

- [RESTful Web API Design with NodeJS](#restful-web-api-design-with-nodejs)
  * [HTTP Request](#http-request)
  * [HTTP Response](#http-response)
  * [Identifying REST Resources](#identifying-rest-resources)
  * [What is REST?](#what-is-rest-)
  * [Installation](#installation)
  * [High level overview of a REST API service using Express](#high-level-overview-of-a-rest-api-service-using-express)
    + [Client](#client)
    + [Server](#server)
  * [1. Basic Express setup](#1-basic-express-setup)
  * [2. Testing Express routes](#2-testing-express-routes)
  * [3. Refactoring app to router & controllers](#3-refactoring-app-to-router---controllers)
  * [4. Setting up models with Mongoose](#4-setting-up-models-with-mongoose)
  * [5. Parsing request bodies](#5-parsing-request-bodies)
  * [6. Testing database connections](#6-testing-database-connections)

**API** (Application programming interface) is an *interface* that hides or abstracts complex functionality. For example, power button is an interface to the startup/shutdown functionality.

APIs do at least three things:

- Perform tasks (For example, using Twitter API to tweet)
- Retrieve a set of data (For example, using Facebook API to retrieve a list of friends)
- Manipulating data (For example, using Android API to add a new coontact)

What is a **Web API**?

It is an API that works over the internet. That means, the data or functionality that it is supposed to supply is spread over the internet.

## HTTP Request

The HTTP request is the *message* that a client sends to an HTTP server. It has the following parts:

- Method: An HTTP method is a *verb* used on a resource (eg. GET/POST/PUT/DELETE)
- URL: Identifier for server-side resource such as a static file, script or dynamic content (eg. www.google.com or /index.html)
- Protocol Version (eg. HTTP 1.1 or HTTP 2)
- Headers: They consist of *key-value* pairs that add more data to our request (metadata). It consists of Host/Domain name, Content-Length, Content-Type, etc.
- Body: Any message that the client wants to send the server (The body of the request, typically containing the parameters we want to send to a server such as in a POST request)

**HTTP Methods (Verbs)**

- GET: Used to retrieve data (cacheable) and it attaches parameters to URL (so do not use it to send sensitive data)
- POST: Used to submit data to the server (eg. creating a new entry in the DB)
- PUT: Used to update files on the server (or eg. updating an entry in the DB)
- DELETE: Used to delete files on the server (or eg. deleting an entry in the DB)

In general, *GET* and *DELETE* do **not** have a request **body** (while *POST* and *PUT* do!)

**Common HTTP Headers**

- `Host`: Tells the server the hostname that the user entered in the address bar.
- `Content-Length`: Tells the receiver the size of the message's *body*.
- `Content-Type`: Tells the receiver the format of the data.

**Two types of `body` data**

`body` is the message that is sent along with the request. The data can be submitted via form action or separately as json (usually in an ajax request).

- *URL-encoded form data* format. Ex: `user=pushkar&password=mypassword`
- *JSON-encoded data* format. Ex: `{ "user": "pushkar", "password": "mypassword" }`

## HTTP Response

The HTTP response is the *message* that a server sends to a client in **response** to a request. It has the following parts:

- Protocol Version (eg. HTTP 1.1 or HTTP 2)
- Status Code: A three digit number that shows the *result* of the request (eg. 200, 201, 404, etc).
- Reason Phrase: A textual description of the status code (eg. Status code `200` = Reason Phrase `OK`)
- Headers: They consist of *key-value* pairs that specify the response structure. It consists of Server info, Content-Length, Content-Type, charset, etc.
- Body: The server replies with its own message to a client's request. This message is usually HTML content, API response as  JSON data, or a static file, etc.

**Response Status Codes**

There are over 30 status codes in the HTTP spec. The common ones are:

- Status codes starting with **2** (**200**, **201**, …): Means the result was a *success* and resource was found (eg. 200 OK, 201 Created, etc).
- Status codes starting with **3** (**300**, **301**, …): Means *redirection* (eg. 301 means resource was moved permanently to a new location).
- Status codes starting with **4** (**400**, **401**, …): Means *client-side error* has occurred (eg. 404 means resource not found - the request route does not have anything to give)
- Status codes starting with **5** (**500**, **501**, …): Means *server-side error* has occurred (eg. 500 means internal server error - something went wrong at the server end)

## Identifying REST Resources

What is a REST **collection**? It is a group of **elements** with the same representation (eg. List of events and a list of messages). 

Therefore, REST deals with three things:

- A ***collection***
- A collection's ***elements***
- ***procedures***

What is a **collection's interface** and what does it look like? It is a gateway that allows access to collections. It has two parts:

- A *Collection Endpoint*: The HTTP URL path which ends with the collection's name (eg: `/events` or `/user-500/messages`).
- A *Method* (eg. GET).

**HTTP Verbs and Collections**

- GET: *List* the collection's elements.
- POST: *Insert* an element to the collection.
- PUT: *Replace* the entire collection with another.
- DELETE: *Delete* the entire collection.

*Example 1*: `GET /notes` fetches all the notes with success status: `200 OK` (if successful) preferrably in `json` format (specify headers).

*Example 2*: `POST /notes` which sends data in the *request* `body` (eg. a new note) and it gets saved in a DB (or wherever). We only send the data and not the `id` of the data - it is the job of the server to save the data and give us back the `id`. The server responds with the same data with extra info (such as `id` of the saved data) back to the client with a status of `201 Created` (since data was created in the notes collection).

*Example 3*: `PUT /notes` which replaces the entire collection with a new collection (data for that new collection is sent in the `body`). The server replies with a status code of 200 if successful or else with an error status code. Developers debate over the usage of PUT in this way because it is supposed to be **idempotent**, that is, calling it multiple times must be the same as calling it once. Hence, `id` of each of the elements inside the collection is passed in the request body to uphold this property of PUT.

*Example 4*: `DELETE /notes` deletes all the notes inside the notes collection. If successful, a `200 OK` status code is sent back in response (else an error code).

**Elements**

An element represents a *single enitity* inside a collection. 

An element's end-point (HTTP URL path) *ends* with the element's `id`. (eg. `/events/12345`, `/user-500/messages/16`)

- GET: *Get* the element
- PUT: *Update* the element (only the element and not replace the collection itself)
- DELETE: *Deletes* the element (only the element and not delete the collection itself)

There is no such thing as POST for an element because we cannot create/add into the element. We can only add entire elements and that is done on the collection (without `id`).

**Rules of thumb for procedures**

- Use a verb that describes the procedure being executed (eg. `/search` or `/reply`)
- Use GET for safe procedures and POST/PUT/DELETE for unsafe procedures

A procedure is safe when it has no side-effects. Calling it once is the same as calling it multiple times and the state of the server or response must not change.

## What is REST?

REST stands for **Representational State Transfer**. It is an architecture for designing network-based applications. It has to do with structuring the system so that it is *easily scalable*.

REST is **NOT** a *protocol* nor a *framework* nor a *standard*. HTTP is the protocol that REST uses. There is no such thing as a REST SDK that we can download and plugin - so it's not a framework. Every API can implement REST differently - hence it is not a standard.

**REST** does the following:

- It follows ***Client-Server model***: Separation of concerns. Client handles UI while server handles Data Storage, in the middle is the REST API.
- REST servers are ***stateless***: It knows nothing about client beyond what is included in the request. Session storage is kept entirely on the client-side.

**Benefits of stateless servers**:

- *Visibility*: Monitoring systems need not go beyond a request to trace a bug.
- *Reliability*: Easy to recover from system failures
- *Scalability*: Servers can quickly free up resources

**Drawbacks of stateless servers**:

- *Network bandwidth*: Clients send state with every request
- *Complexity*: All clients must handle their states (the logic for storing and sending their state)
- All REST responses must be labeled as *cacheable* or not. **Benefits** of caching are:
  - Performance boost: `stateless + caching = caching anywhere`
  - Fewer requests need to go all the way to the server.
  - *Reduces load on server* (Scalability): With fewer requests, server can handle more clients.
- **Drawbacks** of caching:
  - Clients may use *stale data*. If some resources is changing frequently, it does not make sense to cache it.

**Uniform Interface of a REST API**

Everything is accessed using *URL endpoints* and *data representations*. Clients should *not* know the internal implementations such as database used to store data.

**Facets of a Uniform Interface**

- *Identification of resources*: All resources are identified at the end of an HTTP URL path (endpoints of a protocol).
- *Manipulation of resources throught these representations*: Resource representations *need not* mimic data on the server. Any server-side data can be manipulated with data representations used in REST (eg. JSON or XML).
- *Self-descriptive messages*: Server includes *metadata* that helps clients process the response (eg. `Content-Type` header).
- *Hypermedia as the engine of application state (HATEOS)*: The client only assumes a fixed entry-point to the API. The server tells clients all other available actions through *hyperlinks*. (**Most APIs do not use this facet of an interface though**)

**Drawbacks of a Uniform Interface**

- Degraded Efficiency: All clients receive the same data. Some clients may not use all the data that they get in a response

**Layered Systems**

Intermediate components can transform the content of the messages. A layer added in front of another should be able to add features by transforming message contents. **Benefits** of layering are:

- *Encapsulation*: Hides implementation details and simplies interface (to a legacy server) - easily add a layer that acts as a middleman between the legacy server and our REST API.
- *Scalability (Load Balancing)*: Layers enable load balancing by distributing traffic across multiple servers. It increases scalability of our API.
- *Improves Security*: Layering is important for security since they add access control rules to data crossing a boundary, just like a firewall (eg. only allow authorised users).

**Drawbacks of layered systems**

- *Latency*: Multiple layers increases latency (wait time) in processing data.

*Optional* feature of REST: **Code on Demand** (It is not a required constraint).

## Installation

* We need Node & NPM on the machine. 
* We need MongoDB server on a machine or on service provider like MLab
* We need Express framework (makes it easy to create servers)
* A testing suite to test our routes & db operations (like Jest or Mocha)
* Mongoose ORM package to work with the Mongo database

**`npm i -S express mongoose mocha`**

## High level overview of a REST API service using Express

### Client 

The client i.e a browser will make an HTTP request via the REST protocol to our server (Ex: `GET`/`POST`/`PUT`/`DELETE`) on a particular route (Ex: `/api/drivers/`, `/api/drivers/:id`, etc)

### Server

The server is running on Node using the Express framework. Express will handle routes & the processes that must run (Ex: updating the DB, responding with query results)

Our Express app must possess 3 things:

1. **Router**: Looks at the route (& method) & sends it off to the appropriate part of the application (route handler)
2. **Controller**: Contains all the logic on how to respond to a particular request (the function to run on a route)
3. **Model**: The data part of the application that the controller interfaces with (Ex: mongoose, mongoDB part)

Via the Mongoose ORM, the server is connected to the running MongoDB server

## 1. Basic Express setup

```js
// app.js
const express = require('express')
const app = express() // Invoking express function creates a new app

// Router handler for GET requests to "localhost:3050/api"
app.get('/api', (req, res) => {
  res.send({
    hi: 'there'
  })
})

module.exports = app
```

```js
// index.js
const app = require('./app')

app.listen(3050, () => {
  console.log('Running on PORT 3050');
})
```

Start the server with **`node index.js`**

## 2. Testing Express routes

With a test suite, we can test the express route handling & the response it sends back. There is a package called **`supertest`** which helps us make (fake) requests to our running express app

```js
// test/app_test.js
const assert = require('assert')
const request = require('supertest')
const app = require('../app')

describe('The Express app', () => {
  it('Handles a GET request to /api', done => {
    request(app)
      .get('/api')
      .end((err, response) => {
        assert(response.body.hi === 'there')
        done()
      })
  })
})
```

## 3. Refactoring app to router & controllers

Once the Express app starts, we can delegate request routing to a separate module (router). Define this as a function that takes in an app and uses it to define certain routes

The router can then decide which controller function to call for processing that particular request. The controller method then gets access to the `req, res` properties, can perform logical operations and send back a result. 

In brief, this is how we refactor our REST API app in Node & Express to become more modular & manageable

```
Example folder structure:
- package.json
- app.js
- index.js
- routes/
	- routes.js
- controllers/
	- driver_controllers.js
- test/

// NOTE: THE FLOW:
// App => routes => controllers => model
```

```js
// app.js
const express = require('express')
const app = express()
const routes = require('./routes/routes')

routes(app)

module.exports = app
```

```js
// routes/routes.js
const DriversController = require('../controllers/drivers_controller')

module.exports = (app) => {
  app.get('/api', DriversController.greeting)
}
```

```js
// controllers/drivers_controller.js
module.exports = {
  greeting(req, res) {
    res.send({
      hi: 'there'
    })
  }
}
```

## 4. Setting up models with Mongoose

We need a `models` folder. This will hold the mongoose models & schemas that eventually interact with the Mongo DB

```
- app.js
- models/
	- driver.js
- routes/
- controllers/
```

***Note that for each collections i.e a list, we can have a model***. It is kind of the convention

```js
// models/driver.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DriverSchema = new Schema({
  email: {
    type: String,
    require: true
  },
  driving: {
    type: Boolean,
    default: false
})

const Driver = mongoose.model('driver', DriverSchema)

module.exports = Driver
```

## 5. Parsing request bodies

By default, a node server receives a request in "chunks" i.e bit by bit like a stream. It is very hard to read this stream by ourselves and construct the final body. Instead, we use a *middleware* called **`body-parser`** to parse the request chunks and when all of it has finally arrived, puts it into **`body`** property of the request

**`npm i -S body-parser`**

Usage: `bodyParser.json()` assumes that the request body is in the `json` format and it will convert it into a JS object

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./routes/routes')

app.use(bodyParser.json())

routes(app)

module.exports = app
```

## 6. Testing database connections

For production, use a particular mongo database. For testing, use another, In this way, dropping collections & CRUD operations during testing don't affect production data. 

We can use an environment variable for the same (Ex: `NODE_ENV=test` and accessing it inside node via `process.env.NODE_ENV`)

```js
// Inside app code:
if (process.env.NODE_ENV !== 'test') {
	mongoose.connect('mongo://localhost/prod_db')
}

// Inside test code:
before(done => {
  mongoose.connect('mongo://localhost/test_db')
  mongoose.connection
    .once('open', () => {
      // Can go ahead and drop collections before starting tests
    })
    .on('error', () => {})
}
```

