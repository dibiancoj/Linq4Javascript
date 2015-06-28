var _ArrayToTest = new Array();
for (var i = 0; i < 10; i++) {
    _ArrayToTest.push({ Id: i, Txt: i.toString() });
}
function RunQuery() {
    document.getElementById('Results').innerHTML = 'Running Query...';
    _ArrayToTest.Where(function (x) { return x.Id > 2; }).Take(2).OrderByDescending(function (x) { return x.Id; }).ToArrayAsync(function (result) {
        DisplayResults(result);
    }, function (errMsg) {
        alert(errMsg.message);
    }, 'http://' + window.location.host + '/Scripts/JLinq.js');
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
//# sourceMappingURL=ConfigForWorkingAsync.js.map