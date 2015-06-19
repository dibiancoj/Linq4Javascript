#### Linq4Javascript
JLinq.ts(.js) is an implementation of .Net's Linq To Objects. It is built using iterators for complete lazy evaluation to reduce memory and improve performance.

##### Why I Built This Library
I wanted to learn TypeScript along with building a linq library which had method names and syntax much like the .Net version. I love underscore but I always had to lookup the method name I was looking for.

##### Features
* Implement's .Net Linq methods with the same syntax
* Complete lazy evaluation to reduce memory footprint while improving performance
* You can use the Typescript file for type safety or use the .js version for plain old Javascript.
* Drastically outperforms Underscore.js in Chrome, Firefox, and Safari

**Samples**

_declare my array that I will query_  
`var _Array= [];`    

    //let's throw some sample data into my array
    for (var i = 0; i < 10; i++) {  
        _Array.push({  
            id: i,  
            txt: i.toString(),  
            subArray: [1,2,3]  
        });  
    }  

Let's run a sample where clause (the return value will be a iterator)  
`var myQuery = _Array.Where(function (x) { return x.id > 5; });`

How do I get my results from my query above?  
* Call .ToArray() which will evaluate the results right away and return an array from the where clause  
`var results = _Array.Where(function (x) { return x.id > 5; }).ToArray();`

Please see the wiki for full documentation: https://github.com/dibiancoj/Linq4Javascript/wiki
