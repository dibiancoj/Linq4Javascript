/// <reference path="asynctester.ts" />

self.addEventListener('message', e => {
    debugger;
    importScripts('jlinq.js');

    var results = (<TestData[]>e.data).Where(x => x.Id == 2 || x.Id == 4).ToArray();

    //self.postMessage(ArrayToBeReturned, 'JLinq', null);
    self.postMessage(results, null, null);

}, false);