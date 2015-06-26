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

//#region Union

//#region Union Off Of Query With Array

asyncTest('JLinq.Union.TestOffOfQueryWithArray.1', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result[0], 1);
        equal(Result[0], '1');
        equal(Result[1], 0);
        equal(Result[1], '0');
        equal(Result.length, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).Select(x => x.Id).Union(UnitTestFramework.BuildArray(2).Select(x => x.Id).ToArray());

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Union.TestOffOfQueryWithArray.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Union Query Off Of Array With Array

asyncTest('JLinq.Union.TestOffOfArrayWithArray.1', function () {

    //i'm going to run 3 asserts
    expect(6);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        for (var i = 0; i < Result.length; i++) {

            equal(Result[i], i);
        }

        equal(Result.length, 5);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Select(x => x.Id).ToArray().Union(UnitTestFramework.BuildArray(2).Select(x=> x.Id).ToArray());

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Union.TestOffOfArrayWithArray.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#endregion

//#region Union Query

//#region Union Off Of Query With Another Query

asyncTest('JLinq.UnionQuery.TestOffOfQueryWithQuery.1', function () {

    //i'm going to run 3 asserts
    expect(3);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result[0], 1);
        equal(Result[1], 0);
        equal(Result.length, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).Select(x => x.Id).UnionQuery(UnitTestFramework.BuildArray(2).Select(x => x.Id));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('UnionQuery.TestOffOfQueryWithQuery.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Union Query Off Of Array With Query

asyncTest('JLinq.UnionQuery.TestOffOfArrayWithQuery.1', function () {

    //i'm going to run 3 asserts
    expect(6);

    var callBack = (Result: Array<any>) => {
        
        //****To-UnitTestFramework._Array Test****
        for (var i = 0; i < Result.length; i++) {

            equal(Result[i], i);
        }

        equal(Result.length, 5);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Select(x => x.Id).ToArray().UnionQuery(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1).Select(x => x.Id));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('UnionQuery.TestOffOfArrayWithQuery.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#endregion

//#region Take

asyncTest('JLinq.Take.Test.1', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result.length, 2);

        equal(Result[0].Id, 0);
        equal(Result[0].Txt, '0');

        equal(Result[1].Id, 1);
        equal(Result[1].Txt, '1');

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Take(2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Take.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Take.ChainTest.1', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        equal(2, Result.length);

        equal(Result[0].Id, 2);
        equal(Result[0].Txt, '2');

        equal(Result[1].Id, 3);
        equal(Result[1].Txt, '3');

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id >= 2).Take(2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Take.ChainTest.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Take While

asyncTest('JLinq.TakeWhile.Test.1', function () {
 
    //Remember...will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result.length, 4);

        //check the results
        equal(Result[0], 3);
        equal(Result[1], 3);
        equal(Result[2], 1);
        equal(Result[3], 1);

        start();
    }
  
    //go build the query
    var QueryToRun = [3, 3, 1, 1, 2, 3].TakeWhile(x => x === 3 || x === 1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('TakeWhile.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.TakeWhile.ChainTest.1', function () {

    //Remember...will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result.length, 4);

        //check the results
        equal(Result[0], 3);
        equal(Result[1], 3);
        equal(Result[2], 1);
        equal(Result[3], 1);

        start();
    }

    //go build the query
    var QueryToRun = [100, 3, 3, 1, 1, 100, 2, 3].Where(x => x !== 100).TakeWhile(x => x === 3 || x === 1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('TakeWhile.ChainTest.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Skip

asyncTest('JLinq.Skip.Test.1', function () {

    //i'm going to run 3 asserts
    expect(9);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result.length, 4);

        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');

        equal(Result[1].Id, 2);
        equal(Result[1].Txt, '2');

        equal(Result[2].Id, 3);
        equal(Result[2].Txt, '3');

        equal(Result[3].Id, 4);
        equal(Result[3].Txt, '4');

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Skip(1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Skip.ChainTest.1', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        equal(Result.length, 2);

        equal(Result[0].Id, 3);
        equal(Result[0].Txt, '3');

        equal(Result[1].Id, 4);
        equal(Result[1].Txt, '4');

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id >= 2).Skip(1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);

});

//#endregion

//#region Skip While

asyncTest('JLinq.SkipWhile.Test.1', function () {

    //Remember...after predicate is met, it will return everything after that

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result.length, 4);

        //check the results
        equal(Result[0], 1);
        equal(Result[1], 1);
        equal(Result[2], 2);
        equal(Result[3], 3);

        start();
    }

    //go build the query
    var QueryToRun = [3, 3, 1, 1, 2, 3].SkipWhile(x => x === 3);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SkipWhile.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.SkipWhile.ChainTest.1', function () {

    //Remember...after predicate is met, it will return everything after that

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(Result.length, 4);

        //check the results
        equal(Result[0], 1);
        equal(Result[1], 1);
        equal(Result[2], 2);
        equal(Result[3], 3);

        start();
    }

    //go materialize the results into an array
    var QueryToRun = [100, 3, 3, 1, 1, 100, 2, 3].Where(x => x !== 100).SkipWhile(x => x === 3);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SkipWhile.ChainTest.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Paginate

asyncTest('JLinq.Paginate.Test.1', function () {

    //i'm going to run 3 asserts
    expect(11);

    var callBack = (Result: Array<any>) => {

        //check the count
        equal(Result.Count(), UnitTestFramework._DefaultItemsToBuild);

        equal(Result[0].Id, 0);
        equal(Result[0].Txt, '0');

        equal(Result[1].Id, 1);
        equal(Result[1].Txt, '1');

        equal(Result[2].Id, 2);
        equal(Result[2].Txt, '2');

        equal(Result[3].Id, 3);
        equal(Result[3].Txt, '3');

        equal(Result[4].Id, 4);
        equal(Result[4].Txt, '4');

        start();
    }

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Paginate(1, 100);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Paginate.Test.1', function () {

    //i'm going to run 3 asserts
    expect(7);

    var callBack = (Result: Array<any>) => {

        //now make sure we have the correct records
        equal(Result[0].Id, 0);
        equal(Result[0].Txt, '0');

        equal(Result[1].Id, 1);
        equal(Result[1].Txt, '1');

        equal(Result[2].Id, 2);
        equal(Result[2].Txt, '2');

        //check the count
        equal(Result.Count(), howManyRecordsPerPage);

        start();
    }

    //just make sure we get the 3 records for the first page

    //how many records per page
    var howManyRecordsPerPage = 3;

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Paginate(1, howManyRecordsPerPage);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.Test.2'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Paginate.Test.3', function () {

    //i'm going to run 3 asserts
    expect(3);

    var callBack = (Result: Array<any>) => {

        //now make sure we have the correct records
        equal(Result[0].Id, 3);
        equal(Result[1].Id, 4);

        //check the count
        equal(Result.Count(), 2);

        start();
    }

    //just make sure we get the rest of the records on the 2nd page

    //how many records per page
    var howManyRecordsPerPage = 3;

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Paginate(2, howManyRecordsPerPage);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.Test.3'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Paginate.ChainTest.1', function () {

    //i'm going to run 3 asserts
    expect(7);

    var callBack = (Result: Array<any>) => {

        //check the count
        equal(Result.Count(), UnitTestFramework._DefaultItemsToBuild - 2);

        equal(Result[0].Id, 2);
        equal(Result[0].Txt, '2');

        equal(Result[1].Id, 3);
        equal(Result[1].Txt, '3');

        equal(Result[2].Id, 4);
        equal(Result[2].Txt, '4');

        start();
    }

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id > 1).Paginate(1, 100);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.ChainTest.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#region Select

asyncTest('JLinq.Select.Test.1', function () {

    //i'm going to run 3 asserts
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(1, Result[1].newId);
        equal(2, Result[1].newTxt);

        //make sure the old properties aren't there
        equal(null,(<any>Result[1]).Id);
        equal(null,(<any>Result[1]).Txt);

        equal(5, Result.length);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Select(function (x) { return { newId: x.Id, newTxt: x.Id + 1 }; });

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Select.Test.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

asyncTest('JLinq.Select.ChainTest.1', function () {

    //i'm going to run 3 asserts
    expect(4);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._Array Test****
        equal(3, Result.length);
        equal(2, Result[0]);
        equal(3, Result[1]);
        equal(4, Result[2]);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id >= 2).Select(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Select.ChainTest.1'));

    //wait about 5 seconds before calling the test
    setTimeout(callBack, 5000);
});

//#endregion

//#endregion