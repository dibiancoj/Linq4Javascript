/// <reference path="jlinq.ts" />
self.addEventListener('message', function (e) {
    //let's import the jlinq library
    importScripts('jlinq.js');
    //let's go parse the json which is the query
    var Query = JSON.parse(e.data);
    //let's rebuild the tree
    var TreeRebuilt = ToracTechnologies.JLinq.RebuildTree(Query);
    //go build up the results and pass back the array
    self.postMessage(TreeRebuilt.ToArray(), null, null);
}, false);
//# sourceMappingURL=JLinqWebWorker.js.map