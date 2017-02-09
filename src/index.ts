import { Edm, odata, ODataController, ODataServer } from "odata-v4-server";

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
    get(@odata.key id:number){
        return {
            Id: id,
            FirstName: "John",
            LastName: "Doe"
        };
    }
}


@odata.controller(PeopleController, true)
class PeopleServer extends ODataServer{}

PeopleServer.create(3000);