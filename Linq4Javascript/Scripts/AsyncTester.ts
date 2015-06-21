interface TestData {
    Id: number;
    Txt: string;
}

var _ArrayToTest = new Array<TestData>();

for (var i = 0; i < 10; i++) {
    _ArrayToTest.push({ Id: i, Txt: i.toString() });
}

function RunQuery() {

    document.getElementById('Results').innerHTML = 'Running Query...';

    inlineWorker.postMessage(1);
    inlineWorker.postMessage(2);
    inlineWorker.postMessage(100);
    //scriptTagWorker.postMessage(1);
    //scriptTagWorker.postMessage(2);
    //scriptTagWorker.postMessage(100);

}

function DisplayResults(Results: Array<TestData>) {

    var html = '<ul>';

    for (var i = 0; i < Results.length; i++) {
        html += '<li>' + Results[i].Id + '</li>';
    }

    html += '</ul>';

    document.getElementById('Results').innerHTML = html;
}

///////////////////////////// 

//Make worker renders the script based on the string script
function MakeWorker(Script: String) {

    //TODO: Modernizer to make sure we have everything
    //var URL = window.URL || window.webkitURL;
    //var Blob = window.Blob;
    //var Worker = window.Worker;

    //if (!URL || !Blob || !Worker || !Script) {
    //    return null;
    //}

    return new Worker(URL.createObjectURL(new Blob([Script])));
}

// Load a worker from a string, and manually initialize the worker (this does the work...and returns the data)
var inlineWorkerText = "self.addEventListener('message', function(e) { setTimeout(function(){  postMessage(e.data * 2); },5000)} ,false);";

var inlineWorker = MakeWorker(inlineWorkerText);

//incase you want to troubleshoot
inlineWorker.onmessage = e => {
    document.getElementById('log').innerHTML += '<br />Inline: ' + e.data;
};


// Load a worker from a script of type=text/worker, and use the getWorker helper
//var scriptTagWorker = MakeWorker(document.getElementById('worker-script').textContent);

//scriptTagWorker.onmessage = e => {
//    document.getElementById('log').innerHTML += '<br />Script Tag: ' + e.data;
//};