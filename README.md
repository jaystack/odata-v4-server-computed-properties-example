# JayStack OData V4 Server - computed properties

With the latest version of the JayStack OData V4 Server library, you can even more easily create computed properties on your entity models as before. If you are not yet familiar with the basic concepts of the _odata-v4-server_ module, consider reading a comprehensive tutorial [here](http://jaydata.org/blog/jaystack-odata-v4-server-with-mongodb-tutorial).

# Entity model declaration

In this tutorial, we will use this simple _Person_ entity type to show you how to use computed properties.

```typescript
class Person{
    @Edm.Int32
    @Edm.Key
    Id:number

    @Edm.String
    FirstName:string

    @Edm.String
    LastName:string
}
```

# Creating real computed properties

To create computed properties on OData entity or complex types, we will use simple property getters and annotate them with an _Edm_ type decorator. We extend our former example entity model like this:

```typescript
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
```

Please notice, that we added the _FullName_ property getter to the _Person_ class. Inside the getter function, _this_ will be your result entity instance. We will see the computed property in the [service metadata](http://localhost:3000/$metadata) and if we implement a controller using the _Person_ entity type, we can see it in the [result](http://localhost:3000/People(1)) too.

The _Edm.Computed_ property decorator is only used for annotational purpose. In the metadata, the property will be annotated properly as the OData v4 standard with an _Annotation_ element.

You can see the full working example [here](http://github.com/jaystack/odata-v4-server-computed-properties-example).