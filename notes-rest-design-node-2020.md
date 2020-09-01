# Designing & Building REST APIs

[Course link](https://www.udemy.com/course/rest-api)

## What the course covers

1. Evolution of REST APIs
2. Designing REST APIs
3. Securing REST APIs
4. Documentation: Swagger 2.0 / Open API initiative specifications
5. API management

Overall, one would be able to:

- Setup best practices for building APIs
- Understand API management
- Build some API as Proof of Concept

## Can we use mLab for hosted mongo services?

**No!**

MLab as a company got acquired by Mongo. Therefore, they have integrated it into an offering called **MongoDB Atlas**

We can use MongoDB Atlas by signing up at [cloud.mongodb.com](https://cloud.mongodb.com). It allows us to create "MongoDB Clusters" in the public cloud. For testing and learning, free, shared clusters are available

1. Once a cluster gets created, add a user for the database (Security > Database Access > Add Database User)
2. Under clusters, you can create one ("Add my own data" option). Give it a database & a collection name
3. You may insert a document with "insert document" & add the fields, values, & their types
4. The "filter" search bar helps us type in JS objects & search for documents
5. The database name on the left has an trash icon next to it. Use this to delete a whole database

## Why is REST popular?

1. Design principles (that can be adopted by API developer to quickly launch their API services)
2. Proven best practices (A large community of developers contribute to patterns & ready-to-use libraries)
3. Simplicity & flexibility (Low network latency, less bandwidth required, not complex, etc as compared to SOAP)

REST API is however, not tied to any specific data format like JSON (it can be based entirely on the client's needs). You can also build REST APIs with other application layer protocols instead of HTTP. However, no one does this as such. Therefore, REST rests on HTTP for the most part

REST APIs are not tied to standards like WSDL in SOAP. This makes it more flexible

TODAY: **REST/JSON** has become the de-facto standard for APIs

A **resource** in the context of REST is anything. It can be an item, a book, an account, a thing, an object, or even a real-world entity

## Types of API consumers & APIs

The 3 types of consumers are:

* Private or Internal: Your own developers within the organisation
* Public or external: Anybody who builds apps that access your application on the public internet
* Partner: A trusted organisation outside of your own

Similarly, there are 3 types of APIs that map directly to each of the above consumers:

* Private or Internal: Usually fully trusted so all capabilities are made available & less security checks are required (Ex: API call from your own website)
* Public or external: Since anyone can use it, a higher level of security is established
* Partner: The API will be used within the network of a trusted partner who might use it on their public facing interfaces (ex: website)

In general, private APIs have most capabilities, public the least, and partner a moderate amount of it. ***Note: The implementation of the API itself does not change among these 3 types***

## API management

Once the API is up & running, there are some ***considerations*** that come into play & these govern the way in which you continue providing the API service to your consumers

### Security

1. Private:
	- Developers are trusted
	- *Basic authentication* & *proprietary schemes* are enough
2. Public:
	- Developers cannot be trusted
	- *OAuth & key/secret schemes* or a combination of them are employed

### Documentation

1. Private:
	- It is a controlled environment. API details can be shared freely
	- Usually transferred through PDFs, internal websites or on spaces such as confluence docs
2. Public:
	- It is an uncontrolled environment where we do not know the API consuming developers
	- Hence, we provide a specific website for documentation known as a *developer portal*

**Good practice:** As an API developer, always create a developer portal! It does not matter if it is private or public

### Access request 

Who is allowed to access the API & how?

1. Private:
	- Controlled
	- Usually via *email access (official email)* or an *internal ticketing system*
2. Public:
	- Uncontrolled
	- The API can *either be freely accessed* or there exists workflow of *registering oneself on a portal* & access is granted via an automated process or a manual one. This information & flow can be on the developer portal itself 

**Good practice:** As an API developer, always manage access request flow on a developer portal! It does not matter if it is private or public

### SLA Management

**Service Level Agreement (SLA)** is a contract between an API provider and a consumer which lists out many aspects of the service

As an example of an SLA, a company can provide:

- 99.9% uptime of the server
- API calls limited to 20 calls/sec
- Support provided via email

Note that depending on the type of consumer, we can have multiple SLAs. Whenever a consumer signs up, it is common to place him/her in an **SLA tier**

Depending on the SLA tier, different services can be provided as per contract. For example, a public consumer's API call rate can be 20/min while a partner's might be 160/min.

**Good practice:** As an API developer, define an SLA and publicise it on a developer portal! It does not matter if it is private or public

## REST architectural constraints

In order to build a service that is RESTful (& not REST-like), we have to follow **6 design principles**:

1. Client-Server
2. Uniform interface
3. Statelessness
4. Caching
5. Layering
6. Code on-demand (optional)

### Client-Server

This constraint mentions two things:

>  "REST application should have a client-server architecture"

>  "Client & server should not run in the same process"

Client & server here means the API consumer (ex: website or app) and the API web service, respectively. Client requests the resource, the server provides it. Server can serve multiple clients

Client & server not running in the same process refers to **decoupling** which has a few advantages:

1. Server can think about security (rate limiting), persistence (DB management), scaling, and so on
2. Client can think about authentication & authorisation, multi form factor, app development, and so on

Client & server should have a **"uniform interface"** by which they communicate with each other (ex: request & response). This allows for **independent evolution** of client and server. For example, a client may popup that wants CSV instead of JSON. The server can make this possible, since the interface is common. Therefore client & server can evolve separately and the server can service different types of clients. There should not be an impact of such changes

### Uniform interface

This constraint suggests the following:

> "The client & server share common technical interface"

- Interface: The contract between client & server
- Technical: indicates that there is no business logic involved

**4 guiding principles used to build a uniform interface**

1. ***Individual resources are identified in the Request (URI/URL)***
	- For example, www.google.com/api/users/23 identifies a user based on the user id i.e 23
2. ***Representation of the resources***
	- Client receives representation of resource (Ex: client receives details of a car) which it uses to manipulate the resource itself
	- Note that the format of the resource data need not be same on server & client. For example, the data can be inside a DB on server and sent to client via JSON or CSV
3. ***Self-descriptive messages in metadata***
	- The client & server can share metadata about the messages. This is usually in the form of headers. As an example, the client can set the `Accepts` header to indicate to the user what type of data it can handle. The server can send back a header `content-type` in response which tells the actual format of the data. There are many more headers that act as metadata (Status code, `expiry`, `cache-control`, etc)
4. ***Hypermedia***
	- `Hypermedia = data + actions = links for discovery`
	- This principle suggests that server not only send back data but also hypermedia that lets client discover more data. For example, it can send back a URI to an API that fetches a post as part of the response to a request meant to get the list of post, say only its titles.
	- **HATEOAS** = HYPERMEDIA AS THE ENGINE OF APPLICATION STATE

### Statelessness

> "Client must manage its own state thus making the server stateless"

Whenever a server manages the application state on behalf of a client, it becomes complex and not good for scaling. Session based user management using cookies on the server is an example of stateful server and it is not a good practice in REST (That is why we use JWTs instead)

Therefore REST APIs adhere to the following:
1. Clients manage their own application state
2. Each request is treated independently on the server (Previous requests by the client or the state of the client do not matter)

Therefore, *all requests to the server are self-contained* (no dependence on server remembering data from previous requests)

**Challenges of statelessness**

1. Increased chattiness: The client & server might need to communicate more often
2. Request data size: The state will have to be shared with every request - more bandwidth consumed, longer latency
3. Performance impact: The first two points affects performance of the app - bad UX or delays, etc leading to higher bounce rate, monetary loss, and so on

### Caching

> "Use caching to achieve **higher scalability & performance**

Caching nullifies or negates the challenges that statefulness creates. Therefore, it will help us reduce the chatter as well as the data size of the requests

#### Caching on the server

1. *Database caching*. Ex: Caching the Database so that we can get ready made answers to DB queries instead of actually querying it every time
2. *Server caching*. Ex: When the server receives a request, depending on the parameters, path, & the resource, server may choose to send back cached resource rather than executing a whole process to generate it. It may also indicate to client that resource has not changed

***The caching on the server is in the control of the REST API designer.*** 

#### Caching outside the server

1. *Application caching* (on the client). Ex. browser
2. *Gateway/Proxy caching*. Ex: CDN server, Nginx load balancer server

As REST API designers, we don't have much control over the caching on these platforms. We can however, define cache-control directives that a well-behaved client can adhere to and implement. These are sent via HTTP headers

#### Cache directives as HTTP headers

1. **`Cache-Control`**: It is a header containing cache control directives. There can be many directives that are comma (`,`) separated. Also, some of them have an optional argument (`<dir>=<arg>`). Ex: `cache-control: public, max-age=31536000`
	- `No-Store`: Do not cache at all
	- `No-cache`: Cache it but every time you need to use it, check with server once (Mainly used with `Etag`)
	- `private`: Only the client i.e Intended user can cache the resource
	- `public`: Anyone can cache it i.e Not just the client but a gateway or a proxy (intermediary) too
	- `max-age`: The time in seconds for resource cache expiry
2. `Expires`: Sets the exact date and time (timestamp) until which the resource should be cached
3. `Last-Modified`: When was the last time that the resource was modified
4. `Etag`: It is a ***unique identifier*** for a resource (like a hash)

**Note**: If there is a Cache-Control header with the `max-age` or `s-maxage` directive in the response, the `Expires` header is ignored.

#### How is an Etag header helpful?

Etags help us make **conditional requests**

Syntax:

```shell
ETag: W/"<etag_value>"
ETag: "<etag_value>"
```

- When you request a resource for the first time, the data as well as an Etag header is sent back
- The client remembers the Etag value and in the subsequent requests to the same resource, sends this Etag header along as "if-none-match" or "if-match"
```
// Example:
If-None-Match: "<etag_value>"
If-None-Match: "<etag_value>", "<etag_value>", …
If-None-Match: *

// `If-Match`: the server will send back the requested resource only if it matches one of the listed ETags
```
- Server checks the received Etag and compares it with the Etag it has generates for the resource. 
- If Etags are the same, server sends back a **`304` response without a body**. This means that the content was not modified, so the client can use the cached resource
- If content was modified, then the data with the new Etag is passed along 

#### How does a server calculate the Etag?

Server has two ways:
1. ***Shallow check***: It generates or fetches the resource and then creates the Etag before sending the response. Checks the new Etag with the received one. If they match then it sends back `304`
2. ***Deep check***: When the Etag is received from the request, it is checked against an existing Etag for the current resource on the server thereby excluding the need to process the request as if it were new. It can immediately send back a `304` in case of a match

Shallow check only reduces response size and hence network latency. But, it does not reduce the server execution time i.e the time to fetch or process data afresh

Deep check reduces all three i.e Server execution time, response size, and network latency

Example of etag, last-modified, cache-control, & expires headers:

```shell
curl --head https://www.hotstar.com/assets/2220b001005f901871764a12537e6407.svg
HTTP/2 200
content-type: image/svg+xml
etag: W/"97f8-1743143c0f0"
last-modified: Sun, 30 Aug 2020 02:31:43 GMT
server: Akamai Resource Optimizer
x-powered-by: Express
x-cachestatus: 3
cache-control: public, max-age=31536000
expires: Wed, 01 Sep 2021 11:40:03 GMT
date: Tue, 01 Sep 2020 11:40:03 GMT
x-cachestatus: 1
x-cachettl: 31464405
x-origin-date: 1598960403
```

Examples of Etag and a `304` response:

```shell
# First request:
curl -I https://www.thepolyglotdeveloper.com/css/custom.min.css
HTTP/2 200
accept-ranges: bytes
cache-control: public, max-age=0, must-revalidate
content-length: 6235
content-type: text/css; charset=UTF-8
date: Tue, 01 Sep 2020 11:48:15 GMT
etag: "6686025177e732020fd0563cd1271c82-ssl"
strict-transport-security: max-age=31536000
age: 0
server: Netlify
x-nf-request-id: 60784331-6a70-4288-a158-28273e878841-14739554

# Second request with `if-none-match` header:
curl -I -H "if-none-match: \"6686025177e732020fd0563cd1271c82-ssl\"" https://www.thepolyglotdeveloper.com/css/custom.min.css
HTTP/2 304
cache-control: public, max-age=0, must-revalidate
date: Tue, 01 Sep 2020 11:48:42 GMT
etag: "6686025177e732020fd0563cd1271c82-ssl"
strict-transport-security: max-age=31536000
age: 1
server: Netlify
x-nf-request-id: 60784331-6a70-4288-a158-28273e878841-14750453
```

#### The W in an Etag

'W/' (case-sensitive) indicates that a ***weak validator*** is used. 

- Weak etags are easy to generate, but are far less useful for comparisons
- Strong validators are ideal for comparisons but can be very difficult to generate efficiently. 

Weak ETag values of two representations of the same resources might be semantically equivalent, but not byte-for-byte identical. This means weak etags prevent caching when byte range requests are used, but strong etags mean range requests can still be cached.

#### Last modified header & its use

It is a header that mentions when was the last time a resource was modified. It is supposed to e less accurate than an ETag header, it is a fallback mechanism.

- The `If-Modified-Since` request HTTP header makes the request conditional: the server will send back the requested resource, with a `200` status, only if it has been last modified after the given date. 
- If the request has not been modified since, the response will be a `304` without any body; the `Last-Modified` response header of a previous request will contain the date of last modification.

`If-Unmodified-Since` request header does the opposite with a `412` status if request has changed

### Layering

A ***layered architecture*** is one in which the *dependencies are simplified*. Every entity forms a tier i.e Client is a tier, Server is a tier, Gateway is a tier, DB too!

When you have multiple tiers, it is called a layered architecture. In this architecture the dependency is *unidirectional* & *at the most on the next tier*. For example, client depends on a gateway only, the gateway depends on a load balancer only, the load balancer depends on one of the origin servers only, the server depends on the DB only

In this layered approach:

- There is space for architecture to evolve (Ex: Introducing a load balancer & multiple servers)
- At the most, the layer in question & one other layer are impacted due to changed

*REST APIs tend to work very well with layered architectures* and hence it is recommended we use them during REST API design

### Code on demand

> "Server can extend the functionality of the client by sending code"

This constraint is **optional**. If only this constraint is not addressed but all others are then your API is still RESTful

Consider a HTML page. Server has sent the HTML as data but it also contains anchor tags and javascript. Both of these provide some functionality and hence are known as *actions* (or code)

Similarly, in REST we can send back data but also links (*API paths*) to access other data. For example, if we are browsing the titles of a blog post, in the same response we can list the link to get the full contents of that blog post

As a second example, if we have a tourist package data come in the response, it may contain links to actions such as one to book the package, or retrieve reviews, and so on

**Benefits**

1. Server knows resource state (not client app state!) and hence is efficient. Ex: Client does not need to make more requests just to get the endpoint for another resource
2. Server may change the API URI endpoint for a resource since that data becomes available as code on demand in other API calls (client need not remember the URI)
3. Server may add new functionality i.e it may evolve. Also, client can also evolve independently

If we support code on demand then it is known as **HATEOAS** (Hypermedia As The Engine Of Application State). The links we get back in the API responses are known as *HATEOAS Links*

*In short, server extends the functionality of the client*

### Measuring the RESTfulness of an API

We use the **Richardson Maturity Model (RMM)**. It is a way to measure RESTfulness of an API. This model was built by analysing 100s of web services

RMM provides an API service a score between `0` & `3`. If you have scored `0` then it means the API is not at all RESTful. If you have scored `1` then it means the API is fully REST compliant

