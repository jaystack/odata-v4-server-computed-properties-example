import { Edm, odata, ODataController, ODataServer, ODataErrorHandler, ODataHttpContext, HttpRequestError } from "odata-v4-server";
import * as express from "express";
import * as passport from "passport";
import { BasicStrategy } from "passport-http";
import { STATUS_CODES } from "http";

class Person{
    @Edm.Int32
    @Edm.Key
    Id:number

    @Edm.String
    FirstName:string

    @Edm.String
    LastName:string

    @Edm.Computed
    @Edm.String
    get FullName():string{
        return `${this.FirstName} ${this.LastName}`;
    }
}

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

@odata.controller(PeopleController, true)
class PeopleServer extends ODataServer{}

class AuthenticationError extends HttpRequestError{
    constructor(){
        super(401, STATUS_CODES[401]);
    }
}

passport.use(new BasicStrategy((userid:string, password:string, done:(error:any, user?:any) => void) => {
    if (userid == "admin" && password == "admin") return done(null, "admin");
    done(new AuthenticationError());
}));

const app = express();
app.use(
    passport.authenticate("basic", { session: false, failWithError: true }),
    PeopleServer.create(),
    ODataErrorHandler
);
app.listen(3000);