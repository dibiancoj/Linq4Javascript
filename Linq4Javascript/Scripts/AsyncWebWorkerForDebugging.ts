/// <reference path="asynctester.ts" />

self.addEventListener('message', e => {
    debugger;

    //let's import the jlinq library
    importScripts('jlinq.js');

    //let's go parse the json which is the query
    var Query = JSON.parse(e.data);

    var results = new Array<TestData>();
    //var results = (<TestData[]>e.data).Where(x => x.Id == 2 || x.Id == 4).ToArray();

    //self.postMessage(ArrayToBeReturned, 'JLinq', null);
    self.postMessage(results, null, null);

}, false);