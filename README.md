# JayStack OData V4 Server - basic authentication

Last time, we created a little example server to demonstrate [computed properties](http://jaydata.org/blog/jaystack-odata-v4-server-computed-properties). Now, we will extend that example with basic authentication using the popular [Passport](https://github.com/jaredhanson/passport) module and using the example server as an express.js router middleware.

# Include Passport

First, we need to import some extra modules:

```typescript
import { Edm, odata, ODataController, ODataServer, ODataErrorHandler, ODataHttpContext, HttpRequestError } from "odata-v4-server";
import * as express from "express";
import * as passport from "passport";
import { BasicStrategy } from "passport-http";
import { STATUS_CODES } from "http";
```

As you can notice, we imported new features from the _odata-v4-server_ module, the _ODataHttpContext_ interface and the _HttpRequestError_ custom error class.

Configuration of the Passport layer is very simple, we implement our basic authentication verify function as this (the username and password will be hardcoded here):

```typescript
passport.use(new BasicStrategy((userid:string, password:string, done:(error:any, user?:any) => void) => {
    if (userid == "admin" && password == "admin") return done(null, "admin");
    done(new AuthenticationError());
}));
```

If the authentication is successful, we call the _done_ function with _null_ as the error and _admin_ as the user parameter. You can pass any type of user instance here, for simplicity, we use the username. We can use this later in the controller.

If the authentication fails, we pass a new _AuthenticationError_ instance as the first parameter of _done_. This custom error class is very easy to implement using _HttpRequestError_ from the _odata-v4-server_ module.

```typescript
class AuthenticationError extends HttpRequestError{
    constructor(){
        super(401, STATUS_CODES[401]);
    }
}
```

You just have to extend the _HttpRequestError_ class and call the super constructor with an error status code and a message. The message will be the default message for status code 401, provided by the _http_ built-in node.js module.

# Accessing authenticated user

In the example _People_ OData controller, you can access the authenticated user on the request object by using the _context_ parameter decorator from the _odata_ decorator system. The parameter type will be a _ODataHttpContext_ so we can use the interface to get the type annotations of the _context_ object.

```typescript
@odata.type(Person)
class PeopleController extends ODataController{
    @odata.GET
    get(@odata.key id:number, @odata.context context:ODataHttpContext){
        return {
            Id: id,
            FirstName: context.request.user,
            LastName: context.request.user
        };
    }
}
```

# Using the server as a middleware

As the last step, we wire up the express.js middlewares.

```typescript
const app = express();
app.use(
    passport.authenticate("basic", { session: false, failWithError: true }),
    PeopleServer.create(),
    ODataErrorHandler
);
app.listen(3000);
```

In the previous example, we used the _PeopleServer.create_ function to start a standalone HTTP server. This time, without using any parameters, we can access an express.js router middleware. To maintain OData standard error messages in our service, we need to add the _ODataErrorHandler_ middleware as the express.js error handler. This way even if the authentication fails the response will be a standard OData error response. Finally we just start the express.js server on port 3000.

We created a very basic authentication example here, but you can extend this to implement more robust and advanced authentication for your OData server.

You can see the full working example [here](http://github.com/jaystack/odata-v4-server-computed-properties-example/tree/basic-authentication).