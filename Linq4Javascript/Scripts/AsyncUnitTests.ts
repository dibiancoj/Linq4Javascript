/// <reference path="qunit.d.ts"/>
/// <reference path="unittestframework.ts" />

//#region Framework Stuff

function ErrorCallBack(MethodName: string): (ErrorObject: ErrorEvent) => void {

    return (ErrorObject: ErrorEvent) => {
        throw MethodName;
    };
}

//#endregion

//#region Unit Tests

//#region AsQueryable

asyncTest("JLinq.AsQueryable.Test.1", function () {

    //i'm going to run 3 asserts
    expect(3);

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

    //grab only 2 items so it's easier to test
    var shorterList = UnitTestFramework._Array.Where(x => x.Id == 1 || x.Id == 2).ToArray();

    //test as queryable
    var asQueryableResults = shorterList.AsQueryable();

    //go run the async operation
    asQueryableResults.ToArrayAsync(callBack, ErrorCallBack('AsQueryable.Test.1'));

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

    //how many items we should have
    var howManyItemsShouldWeHave: number = (UnitTestFramework._Array.length - 2) * 2;

    //let's go grab the query and throw it into a variable
    var QueryToRun = UnitTestFramework._Array.SelectMany(x => x.lst);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SelectMany.Test.1'));

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

    //this is a select many with a where before it

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 4).SelectMany(x => x.lst);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SelectMany.Test.2'));

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

    //this is a select many with a where before it and then a select after it

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 4).SelectMany(x => x.lst).Select(x => { return { mapId: x }; });

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SelectMany.Test.3'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Where

asyncTest('JLinq.Where.Test.1', function () {

    //i'm going to run 3 asserts
    expect(3);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');
        equal(Result.length, 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Where.Test.2', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');

        equal(Result[1].Id, 2);
        equal(Result[1].Txt, '2');

        equal(Result.length, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1 || x.Id === 2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.Test.2'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Where.ChainTest.1', function () {

    //i'm going to run 3 asserts
    expect(3);

    var callBack = (Result: Array<any>) => {

        equal(Result.length, 1);
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1 || x.Id === 2).Take(1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.ChainTest.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Where.ChainTest.2', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        equal(Result.length, 2);

        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');

        equal(Result[1].Id, 2);
        equal(Result[1].Txt, '2');

        start();
    }

    //test the where clause when it's somewhere in the chain after the first call off of array
    var QueryToRun = UnitTestFramework._Array.Take(5).Where(x => x.Id === 1 || x.Id === 2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.ChainTest.2'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Concat

//#region Concat Off Of Query With Array

asyncTest('JLinq.Concat.TestOffOfQueryWithArray.1', function () {

    //i'm going to run 3 asserts
    expect(7);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');
        equal(Result[1].Id, 0);
        equal(Result[1].Txt, '0');
        equal(Result[2].Id, 1);
        equal(Result[2].Txt, '1');
        equal(Result.length, 3);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).Concat(UnitTestFramework.BuildArray(2));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Concat.TestOffOfQueryWithArray.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Concat Query Off Of Array With Array

asyncTest('JLinq.Concat.TestOffOfArrayWithArray.1', function () {

    //i'm going to run 2 * number of records
    expect(15);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        for (var i = 0; i < Result.length; i++) {

            //since we are mergeing 2 arrays...when we get to the 2nd array (i>=5...then we subtract 5 to get back to 0)
            var IntTest: number = i >= 5 ? i - 5 : i;

            equal(Result[i].Id, IntTest);
            equal(Result[i].Txt, IntTest.toString());
        }

        equal(Result.length, 7);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Concat(UnitTestFramework.BuildArray(2));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Concat.TestOffOfArrayWithArray.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#endregion

//#region Concat Query

//#region Concat Off Of Query With Another Query

asyncTest('JLinq.ConcatQuery.TestOffOfQueryWithQuery.1', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');
        equal(Result[1].Id, 1);
        equal(Result[1].Txt, '1');
        equal(Result.length, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).ConcatQuery(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ConcatQuery.TestOffOfQueryWithQuery.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.ConcatQuery.TestOffOfQueryWithQuery.2', function () {

    //i'm going to run 3 asserts
    expect(3);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result[0].Id, 4);
        equal(Result[0].Txt, '4');
        equal(Result.length, 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id > 1).ConcatQuery(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1)).Where(x=> x.Id === 4);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('JLinq.ConcatQuery.TestOffOfQueryWithQuery.2'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Concat Query Off Of Array With Query

asyncTest('JLinq.ConcatQuery.TestOffOfArrayWithQuery.1', function () {

    //i'm going to run 3 asserts
    expect(12);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        for (var i = 0; i < Result.length; i++) {

            if (i === 5) {
                equal(Result[i].Id, 1);
                equal(Result[i].Txt, '1');
            } else {
                equal(Result[i].Id, i);
                equal(Result[i].Txt, i.toString());
            }
        }

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.ConcatQuery(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ConcatQuery.TestOffOfArrayWithQuery.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#endregion

//#endregion