/// <reference path="asynctester.ts" />
self.addEventListener('message', function (e) {
    debugger;
    importScripts('jlinq.js');
    var results = e.data.Where(function (x) { return x.Id == 2 || x.Id == 4; }).ToArray();
    //self.postMessage(ArrayToBeReturned, 'JLinq', null);
    self.postMessage(results, null, null);
}, false);
//# sourceMappingURL=AsyncWebWorkerForDebugging.js.map