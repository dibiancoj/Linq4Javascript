var _ArrayToTest = new Array();
for (var i = 0; i < 10; i++) {
    _ArrayToTest.push({ Id: i, Txt: i.toString() });
}
function RunQuery() {
    document.getElementById('Results').innerHTML = 'Running Query...';
    _ArrayToTest.Where(function (x) {
        //this is seconds per item
        var SecondsToWait = .6;
        //what time do we want to go until
        var TimeToGoUntil = new Date().getTime() + (SecondsToWait * 1000);
        //keep looping until we get to the time
        while (new Date().getTime() <= TimeToGoUntil) {
        }
        //then finally return the real result
        return x.Id > 2;
    }).Take(2).OrderByDescending(function (x) { return x.Id; }).ToArrayAsync(function (result) {
        DisplayResults(result);
    }, function (errMsg) {
        alert(errMsg.message);
    }, JLinqUrlPath); //JLinqUrlPath is located in the _Layout.cshtml
}
function SpinWait(SecondsToWait) {
}
function DisplayResults(Results) {
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
