﻿interface TestData {
    Id: number;
    Txt: string;
}

var _ArrayToTest = new Array<TestData>();

for (var i = 0; i < 10; i++) {
    _ArrayToTest.push({ Id: i, Txt: i.toString() });
}

function RunQuery() {

    document.getElementById('Results').innerHTML = 'Running Query...';

    _ArrayToTest.Where(x => x.Id == 2 || x.Id == 4).ToArrayAsync(result => {
        DisplayResults(result);
    });

}

function DisplayResults(Results: Array<TestData>) {

    var html = '<ul>';

    for (var i = 0; i < Results.length; i++) {
        html += '<li>' + Results[i].Id + '</li>';
    }

    if (Results.length == 0) {
        html += '<li>No Data</li>';
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
var inlineWorkerText = "self.addEventListener('message', function(e) { setTimeout(function(){  postMessage(e.data); },5000)} ,false);";

//var inlineWorker = MakeWorker(inlineWorkerText);

//incase you want to troubleshoot
//inlineWorker.onmessage = e => {
//    DisplayResults(e.data);
//};