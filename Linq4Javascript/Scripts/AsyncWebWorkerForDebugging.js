/// <reference path="asynctester.ts" />
/// <reference path="jlinq.ts" />
self.addEventListener('message', function (e) {
    debugger;
    //let's import the jlinq library
    importScripts('jlinq.js');
    //let's go parse the json which is the query
    var Query = JSON.parse(e.data);
    //now we need to copy all the base methods for each level of the tree
    //flatten the tree
    var FlatTree = ToracTechnologies.JLinq.Iterator.ChainableTreeWalker(Query);
    //grab the queryable
    //var Queryable: any = <ToracTechnologies.JLinq.Queryable<any>>FlatTree[0].PreviousExpression;
    ////loop through the tree (going backwards starting with queryable)
    //for (var i = FlatTree.length - 1; i >= 0; i--) {
    //    //grab the current item
    //    var CurrentLevelOfTree = FlatTree[i];
    //    //go build this tree nodes
    //    Queryable = new ToracTechnologies.JLinq.WhereIterator(Queryable, null);
    //}
    var results = new Array();
    //var results = (<TestData[]>e.data).Where(x => x.Id == 2 || x.Id == 4).ToArray();
    //self.postMessage(ArrayToBeReturned, 'JLinq', null);
    self.postMessage(results, null, null);
}, false);
//# sourceMappingURL=AsyncWebWorkerForDebugging.js.map