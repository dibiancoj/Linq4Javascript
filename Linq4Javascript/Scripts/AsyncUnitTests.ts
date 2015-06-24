/// <reference path="qunit.d.ts"/>
/// <reference path="unittestframework.ts" />

//#region Unit Tests

//#region AsQueryable

asyncTest("JLinq.AsQueryable.Test.1", function () {

    //i'm going to run 3 asserts
    expect(3);

    //var called = 0;

    var callBack = (Result: UnitTestFramework.ITestObject[]) => {
        //check the length
        equal(Result.length, 2);

        //check the first element
        equal(Result[0].Id, 1);

        //check the second element
        equal(Result[1].Id, 2);

        // THIS IS KEY: it "restarts" the test runner, saying
        // "OK I'm done waiting on async stuff, continue running tests"
        start();
    }

    var errorCallBack = (ErrorObject: ErrorEvent) => {
        throw 'JLinq.WhereAsync.Test.1 - Error';
    };

    //grab only 2 items so it's easier to test
    var shorterList = UnitTestFramework._Array.Where(x => x.Id == 1 || x.Id == 2).ToArray();

    //test as queryable
    var asQueryableResults = shorterList.AsQueryable();

    //go run the async operation
    asQueryableResults.ToArrayAsync(callBack, errorCallBack);

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000); 
});

//#endregion

//#region Select Many

asyncTest('JLinq.SelectMany.Test.1', function () {

    //i'm going to run 3 asserts
    expect(7);

    var callBack = (Result: Array<number>) => {

        //****To-UnitTestFramework._Array Test**** (we * 2 because we always set in our test...2 items per collection)
        equal(Result.length, howManyItemsShouldWeHave);

        equal(Result[0], 2);
        equal(Result[1], 102);

        equal(Result[2], 3);
        equal(Result[3], 103);

        equal(Result[4], 4);
        equal(Result[5], 104);

        // THIS IS KEY: it "restarts" the test runner, saying
        // "OK I'm done waiting on async stuff, continue running tests"
        start();
    };

    var errorCallBack = (ErrorObject: ErrorEvent) => {
        throw 'JLinq.WhereAsync.Test.1 - Error';
    };

    //how many items we should have
    var howManyItemsShouldWeHave: number = (UnitTestFramework._Array.length - 2) * 2;

    //let's go grab the query and throw it into a variable
    var QueryToRun = UnitTestFramework._Array.SelectMany(x => x.lst);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, errorCallBack);

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000); 
});

asyncTest('JLinq.SelectMany.Test.2', function () {

    //i'm going to run 3 asserts
    expect(3);

    var callBack = (Result: Array<number>) => {

        //****To-UnitTestFramework._Array Test**** (we * 2 because we always set in our test...2 items per collection)
        equal(Result.length, 2);

        //check the actual values
        equal(Result[0], 4);
        equal(Result[1], 104);

        // THIS IS KEY: it "restarts" the test runner, saying
        // "OK I'm done waiting on async stuff, continue running tests"
        start();
    };

    var errorCallBack = (ErrorObject: ErrorEvent) => {
        throw 'JLinq.WhereAsync.Test.1 - Error';
    };

    //this is a select many with a where before it

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 4).SelectMany(x => x.lst);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, errorCallBack);

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000); 
});

asyncTest('JLinq.SelectMany.Test.3', function () {

    //i'm going to run 3 asserts
    expect(3);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test**** (we * 2 because we always set in our test...2 items per collection)
        equal(Result.length, 2);

        equal(Result[0].mapId, 4);
        equal(Result[1].mapId, 104);

        // THIS IS KEY: it "restarts" the test runner, saying
        // "OK I'm done waiting on async stuff, continue running tests"
        start();
    };

    var errorCallBack = (ErrorObject: ErrorEvent) => {
        throw 'JLinq.WhereAsync.Test.1 - Error';
    };

    //this is a select many with a where before it and then a select after it

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 4).SelectMany(x => x.lst).Select(x => { return { mapId: x }; });

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, errorCallBack);

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000); 
});

//#endregion

//#endregion