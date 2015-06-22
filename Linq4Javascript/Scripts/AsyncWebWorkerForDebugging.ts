self.addEventListener('message', e => {
    debugger;
    importScripts('jlinq.js');

    //self.postMessage(ArrayToBeReturned, 'JLinq', null);
    self.postMessage(e.data, null, null);

}, false);