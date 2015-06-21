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

}

function DisplayResults(Results: Array<TestData>) {

    var html = '<ul>';

    for (var i = 0; i < Results.length; i++) {
        html += '<li>' + Results[i].Id + '</li>';
    }

    html += '</ul>';

    document.getElementById('Results').innerHTML = html;
}