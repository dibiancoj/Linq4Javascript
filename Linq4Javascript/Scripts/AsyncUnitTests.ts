/// <reference path="qunit.d.ts"/>
/// <reference path="unittestframework.ts" />

//#region Unit Tests

//#region Where

QUnit.test("JLinq.WhereAsync.Test.1", function(assert) {
    assert.expect(1);
    debugger;
    //grab only 2 items so it's easier to test
    var shorterList = UnitTestFramework._Array.Where(x => x.Id == 1 || x.Id == 2).ToArray();

    //test as queryable
    var asQueryableResults = shorterList.AsQueryable();

    var callBack = (Result: UnitTestFramework.ITestObject[]) => {
        debugger;
        //check the length
        equal(Result.length, 2);

        //check the first element
        equal(Result[0].Id, 1);

        //check the second element
        equal(Result[1].Id, 2);
    };

    var errorCallBack = (ErrorObject: ErrorEvent) => {
        throw 'JLinq.WhereAsync.Test.1 - Error';
    };

    setTimeout(() => {

        //results
        var results = asQueryableResults.ToArrayAsync(callBack, errorCallBack);
    },3000);
});

//#endregion

//#endregion