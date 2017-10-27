//#region Framework Stuff

//JLinqUrlPath is located in the _Layout.cshtml
declare var JLinqUrlPath: string; //

function ErrorCallBack(MethodName: string): (ErrorObject: ErrorEvent) => void {

    return (ErrorObject: ErrorEvent) => {
        throw MethodName;
    };
}

//declare var JLinqUrlPath: string;

//#endregion

//#region Unit Tests

//#region AsQueryable

asyncTest("JLinq.AsQueryable.Test.1", function () {

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
    var shorterList = UnitTestFramework._MutableArrayTest.Where(x => x.Id == 1 || x.Id == 2).ToArray();

    //test as queryable
    var asQueryableResults = shorterList.AsQueryable();

    //go run the async operation
    asQueryableResults.ToArrayAsync(callBack, ErrorCallBack('AsQueryable.Test.1'), JLinqUrlPath);
});

asyncTest("JLinq.AsQueryable.FallBack.Test.1", function () {

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
    var shorterList = UnitTestFramework._MutableArrayTest.Where(x => x.Id == 1 || x.Id == 2).ToArray();

    //test as queryable
    var asQueryableResults = shorterList.AsQueryable();

    //go run the async operation
    asQueryableResults.ToArrayAsync(callBack, ErrorCallBack('AsQueryable.FallBack.Test.1'), JLinqUrlPath, false);
});

//#endregion

//#region Select Many

asyncTest('JLinq.SelectMany.Test.1', function () {

    expect(7);

    var callBack = (Result: Array<number>) => {

        //****To-UnitTestFramework._MutableArrayTest Test**** (we * 2 because we always set in our test...2 items per collection)
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
    var howManyItemsShouldWeHave: number = (UnitTestFramework._MutableArrayTest.length - 2) * 2;

    //let's go grab the query and throw it into a variable
    var QueryToRun = UnitTestFramework._MutableArrayTest.SelectMany(x => x.lst);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SelectMany.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.SelectMany.FallBack.Test.1', function () {

    expect(7);

    var callBack = (Result: Array<number>) => {

        //****To-UnitTestFramework._MutableArrayTest Test**** (we * 2 because we always set in our test...2 items per collection)
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
    var howManyItemsShouldWeHave: number = (UnitTestFramework._MutableArrayTest.length - 2) * 2;

    //let's go grab the query and throw it into a variable
    var QueryToRun = UnitTestFramework._MutableArrayTest.SelectMany(x => x.lst);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SelectMany.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.SelectMany.Test.2', function () {

    expect(3);

    var callBack = (Result: Array<number>) => {

        //****To-UnitTestFramework._MutableArrayTest Test**** (we * 2 because we always set in our test...2 items per collection)
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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 4).SelectMany(x => x.lst);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SelectMany.Test.2'), JLinqUrlPath);
});

asyncTest('JLinq.SelectMany.Test.3', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test**** (we * 2 because we always set in our test...2 items per collection)
        equal(Result.length, 2);

        equal(Result[0].mapId, 4);
        equal(Result[1].mapId, 104);

        // THIS IS KEY: it "restarts" the test runner, saying
        // "OK I'm done waiting on async stuff, continue running tests"
        start();
    };

    //this is a select many with a where before it and then a select after it

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 4).SelectMany(x => x.lst).Select(x => { return { mapId: x }; });

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SelectMany.Test.3'), JLinqUrlPath);
});

//#endregion

//#region Where

asyncTest('JLinq.Where.Test.1', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');
        equal(Result.length, 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.Where.FallBack.Test.1', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');
        equal(Result.length, 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.Where.Test.2', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');

        equal(Result[1].Id, 2);
        equal(Result[1].Txt, '2');

        equal(Result.length, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1 || x.Id === 2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.Test.2'), JLinqUrlPath);
});

asyncTest('JLinq.Where.ChainTest.1', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        equal(Result.length, 1);
        equal(Result[0].Id, 1);
        equal(Result[0].Txt, '1');

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1 || x.Id === 2).Take(1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.Where.ChainTest.2', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Take(5).Where(x => x.Id === 1 || x.Id === 2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Where.ChainTest.2'), JLinqUrlPath);
});

//#endregion

//#region Concat

//#region Concat Off Of Query With Array

asyncTest('JLinq.Concat.TestOffOfQueryWithArray.1', function () {

    expect(7);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1).Concat(UnitTestFramework.BuildArray(2));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Concat.TestOffOfQueryWithArray.1'), JLinqUrlPath);
});

asyncTest('JLinq.Concat.FallBack.TestOffOfQueryWithArray.1', function () {

    expect(7);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1).Concat(UnitTestFramework.BuildArray(2));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Concat.FallBack.TestOffOfQueryWithArray.1'), JLinqUrlPath, false);
});

//#endregion

//#region Concat Query Off Of Array With Array

asyncTest('JLinq.Concat.TestOffOfArrayWithArray.1', function () {

    expect(15);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Concat(UnitTestFramework.BuildArray(2));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Concat.TestOffOfArrayWithArray.1'), JLinqUrlPath);
});

asyncTest('JLinq.Concat.FallBack.TestOffOfArrayWithArray.1', function () {

    expect(15);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Concat(UnitTestFramework.BuildArray(2));

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Concat.FallBack.TestOffOfArrayWithArray.1'), JLinqUrlPath, false);
});

//#endregion

//#endregion

//#region Union

//#region Union Off Of Query With Array

asyncTest('JLinq.Union.TestOffOfQueryWithArray.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result[0], 1);
        equal(Result[0], '1');
        equal(Result[1], 0);
        equal(Result[1], '0');
        equal(Result.length, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1).Select(x => x.Id).Union(UnitTestFramework.BuildArray(2).Select(x => x.Id).ToArray());

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Union.TestOffOfQueryWithArray.1'), JLinqUrlPath);
});

asyncTest('JLinq.Union.FallBack.TestOffOfQueryWithArray.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result[0], 1);
        equal(Result[0], '1');
        equal(Result[1], 0);
        equal(Result[1], '0');
        equal(Result.length, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id === 1).Select(x => x.Id).Union(UnitTestFramework.BuildArray(2).Select(x => x.Id).ToArray());

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Union.FallBack.TestOffOfQueryWithArray.1'), JLinqUrlPath, false);
});

//#endregion

//#region Union Query Off Of Array With Array

asyncTest('JLinq.Union.TestOffOfArrayWithArray.1', function () {

    expect(6);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        for (var i = 0; i < Result.length; i++) {

            equal(Result[i], i);
        }

        equal(Result.length, 5);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x => x.Id).ToArray().Union(UnitTestFramework.BuildArray(2).Select(x=> x.Id).ToArray());

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Union.TestOffOfArrayWithArray.1'), JLinqUrlPath);
});

asyncTest('JLinq.Union.FallBack.TestOffOfArrayWithArray.1', function () {

    expect(6);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        for (var i = 0; i < Result.length; i++) {

            equal(Result[i], i);
        }

        equal(Result.length, 5);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x => x.Id).ToArray().Union(UnitTestFramework.BuildArray(2).Select(x=> x.Id).ToArray());

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Union.FallBack.TestOffOfArrayWithArray.1'), JLinqUrlPath, false);
});

//#endregion

//#endregion

//#region Take

asyncTest('JLinq.Take.Test.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 2);

        equal(Result[0].Id, 0);
        equal(Result[0].Txt, '0');

        equal(Result[1].Id, 1);
        equal(Result[1].Txt, '1');

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Take(2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Take.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.Take.ChainTest.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id >= 2).Take(2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Take.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.Take.FallBack.ChainTest.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id >= 2).Take(2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Take.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Take While

asyncTest('JLinq.TakeWhile.Test.1', function () {
 
    //Remember...will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression
  
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('TakeWhile.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.TakeWhile.ChainTest.1', function () {

    //Remember...will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression
   
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('TakeWhile.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.TakeWhile.FallBack.ChainTest.1', function () {

    //Remember...will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression
   
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('TakeWhile.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Skip

asyncTest('JLinq.Skip.Test.1', function () {

    expect(9);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Skip(1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Skip.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.Skip.ChainTest.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id >= 2).Skip(1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Skip.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.Skip.FallBack.ChainTest.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id >= 2).Skip(1);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Skip.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Skip While

asyncTest('JLinq.SkipWhile.Test.1', function () {

    //Remember...after predicate is met, it will return everything after that
  
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SkipWhile.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.SkipWhile.ChainTest.1', function () {

    //Remember...after predicate is met, it will return everything after that
    
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SkipWhile.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.SkipWhile.FallBack.ChainTest.1', function () {

    //Remember...after predicate is met, it will return everything after that
    
    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
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
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('SkipWhile.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Paginate

asyncTest('JLinq.Paginate.Test.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Paginate(1, 100);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.Paginate.Test.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Paginate(1, howManyRecordsPerPage);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.Test.2'), JLinqUrlPath);
});

asyncTest('JLinq.Paginate.Test.3', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Paginate(2, howManyRecordsPerPage);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.Test.3'), JLinqUrlPath);
});

asyncTest('JLinq.Paginate.ChainTest.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id > 1).Paginate(1, 100);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.Paginate.FallBack.ChainTest.1', function () {

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
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id > 1).Paginate(1, 100);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Paginate.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Select

asyncTest('JLinq.Select.Test.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(1, Result[1].newId);
        equal(2, Result[1].newTxt);

        //make sure the old properties aren't there
        equal(null,(<any>Result[1]).Id);
        equal(null,(<any>Result[1]).Txt);

        equal(5, Result.length);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(function (x) { return { newId: x.Id, newTxt: x.Id + 1 }; });

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Select.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.Select.ChainTest.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(3, Result.length);
        equal(2, Result[0]);
        equal(3, Result[1]);
        equal(4, Result[2]);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id >= 2).Select(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Select.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.Select.FallBack.ChainTest.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(3, Result.length);
        equal(2, Result[0]);
        equal(3, Result[1]);
        equal(4, Result[2]);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.Where(x => x.Id >= 2).Select(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Select.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Distinct

asyncTest('JLinq.Distinct.Number.Test.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 5);
        equal(Result[0], 0);

        start();
    }

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Distinct.Number.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.Distinct.Number.FallBack.Test.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 5);
        equal(Result[0], 0);

        start();
    }

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Distinct.Number.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.Distinct.Number.Test.2', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 5);
        equal(Result[0], 0);

        start();
    }

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Distinct.Number.Test.2'), JLinqUrlPath);
});

asyncTest('JLinq.Distinct.Date.Test.3', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {
   
        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 3);
        equal(JSON.stringify(Result[0]), JSON.stringify(UnitTestFramework._FirstIndexDate));
        equal(JSON.stringify(Result[1]), JSON.stringify(dtToAdd));
        equal(JSON.stringify(Result[2]), JSON.stringify(UnitTestFramework._DateOfTest));

        start();
    }

    //same test ...going to test with a date

    //grab a new date for the new items
    var dtToAdd: Date = new Date(2014, 0, 1);

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "1", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: dtToAdd });
    arrayToTestAgainst.push({ Id: 2, Txt: "2", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: dtToAdd });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.CreatedDate);

    //go run the async operation
    QueryToRun.OrderBy(x => x).ToArrayAsync(callBack, ErrorCallBack('Distinct.Date.Test.3'), JLinqUrlPath);
});

asyncTest('JLinq.Distinct.Date.FallBack.Test.3', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {
   
        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 3);
        equal(JSON.stringify(Result[0]), JSON.stringify(UnitTestFramework._FirstIndexDate));
        equal(JSON.stringify(Result[1]), JSON.stringify(dtToAdd));
        equal(JSON.stringify(Result[2]), JSON.stringify(UnitTestFramework._DateOfTest));

        start();
    }

    //same test ...going to test with a date

    //grab a new date for the new items
    var dtToAdd: Date = new Date(2014, 0, 1);

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "1", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: dtToAdd });
    arrayToTestAgainst.push({ Id: 2, Txt: "2", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: dtToAdd });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.CreatedDate);

    //go run the async operation
    QueryToRun.OrderBy(x => x).ToArrayAsync(callBack, ErrorCallBack('Distinct.Date.FallBack.Test.3'), JLinqUrlPath, false);
});

asyncTest('JLinq.Distinct.String.Test.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 6);
        equal(Result[0], 0);
        equal(Result[1], 1);
        equal(Result[2], 2);

        start();
    }

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 0, Txt: "0", IsActive: true, GroupByKey: "0", GroupByKey2: "0", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Txt);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Distinct.String.Test.2'), JLinqUrlPath);
});

asyncTest('JLinq.Distinct.String.FallBack.Test.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 6);
        equal(Result[0], 0);
        equal(Result[1], 1);
        equal(Result[2], 2);

        start();
    }

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 0, Txt: "0", IsActive: true, GroupByKey: "0", GroupByKey2: "0", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Txt);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Distinct.String.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.Distinct.ChainTest.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 5);
        equal(Result[0], 0);

        start();
    }

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Where(x => x.Id >= 0).Distinct(x=> x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Distinct.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.Distinct.FallBack.ChainTest.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //****To-UnitTestFramework._MutableArrayTest Test****
        equal(Result.length, 5);
        equal(Result[0], 0);

        start();
    }

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Where(x => x.Id >= 0).Distinct(x=> x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('Distinct.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Order By

//#region Order By Number

asyncTest('JLinq.OrderBy.Asc.Number.Test.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //go test the results
        for (var i = 0; i < Result.length; i++) {

            //just make sure the results are whatever i is
            equal(Result[i].Id, i);
        }

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderBy(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Number.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Asc.Number.ChainTest.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //go test the results
        for (var i = 0; i < Result.length; i++) {

            //just make sure the results are whatever i is
            equal(Result[i], i);
        }

        start();
    }

    //go materialize the results into the result
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x => x.Id).OrderBy(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Number.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Desc.Number.Test.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //initialize to 1 so we can just subtract the length
        var IdLengthCalculator = 1;

        //go test the results
        for (var i = 0; i < Result.length; i++) {

            //subtract the length from the index we are up to (starting at 1)
            equal(Result[i].Id, Result.length - IdLengthCalculator);

            //increase the tally
            IdLengthCalculator++;
        }

        start();
    }

    //go materialize the results into the result
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderByDescending(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.Number.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Desc.Number.ChainTest.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //initialize to 1 so we can just subtract the length
        var IdLengthCalculator = 1;

        //go test the results
        for (var i = 0; i < Result.length; i++) {

            //subtract the length from the index we are up to (starting at 1)
            equal(Result[i], Result.length - IdLengthCalculator);

            //increase the tally
            IdLengthCalculator++;
        }

        start();
    }

    //go materialize the results into the result
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x=> x.Id).OrderByDescending(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.Number.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Desc.Number.FallBack.ChainTest.1', function () {

    expect(5);

    var callBack = (Result: Array<any>) => {

        //initialize to 1 so we can just subtract the length
        var IdLengthCalculator = 1;

        //go test the results
        for (var i = 0; i < Result.length; i++) {

            //subtract the length from the index we are up to (starting at 1)
            equal(Result[i], Result.length - IdLengthCalculator);

            //increase the tally
            IdLengthCalculator++;
        }

        start();
    }

    //go materialize the results into the result
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x=> x.Id).OrderByDescending(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.Number.FallBack.ChainTest.1'), JLinqUrlPath, false);
});

//#endregion

//#region Order By String

asyncTest('JLinq.OrderBy.Asc.String.Test.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //go test the items
        equal(Result.Last().Txt, 'bcd');
        equal(Result[Result.length - 2].Txt, 'abc');

        start();
    }

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //add a random item in spot 2
    QueryToRun.splice(0, 0, { Id: 1001, Txt: 'bcd' });

    //reset the query now
    QueryToRun = QueryToRun.OrderBy(x => x.Txt);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.String.Test.1'));
});

asyncTest('JLinq.OrderBy.Asc.String.FallBack.Test.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //go test the items
        equal(Result.Last().Txt, 'bcd');
        equal(Result[Result.length - 2].Txt, 'abc');

        start();
    }

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //add a random item in spot 2
    QueryToRun.splice(0, 0, { Id: 1001, Txt: 'bcd' });

    //reset the query now
    QueryToRun = QueryToRun.OrderBy(x => x.Txt);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.String.FallBack.Test.1'), false);
});

asyncTest('JLinq.OrderBy.Asc.String.Test.2', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //go test the items
        equal(Result.Last().Txt, 'bcd');
        equal(Result[Result.length - 2].Txt, 'abc');
        equal(Result[Result.length - 3].Txt, 'ABC');

        start();
    }

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //push that same item into the first element spot (with captials)
    QueryToRun.splice(0, 0, { Id: 1000, Txt: 'ABC' });

    //add a random item
    QueryToRun.splice(0, 0, { Id: 1001, Txt: 'bcd' });

    //go reset the query
    var QueryToRun = QueryToRun.OrderBy(x => x.Txt);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.String.Test.2'));
});

asyncTest('JLinq.OrderBy.Asc.String.ChainTest.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {


        //is the last item bcd?
        equal(Result.Last(), 'bcd');
        equal(Result[Result.length - 2], 'abc');

        start();
    }

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.splice(0, 0, { Id: 1000, Txt: 'abc' });

    //add a random item
    QueryToRun.splice(0, 0, { Id: 1001, Txt: 'bcd' });

    //reset the query
    QueryToRun = QueryToRun.Select(x => x.Txt).OrderBy(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.String.ChainTest.1'));
});

asyncTest('JLinq.OrderBy.Desc.String.Test.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //go test the values
        equal(Result[0].Txt, 'bcd');
        equal(Result[1].Txt, 'abc');

        start();
    }

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //add a random item
    QueryToRun.push({ Id: 1001, Txt: 'bcd' });

    //go reset the query
    QueryToRun = QueryToRun.OrderByDescending(x => x.Txt);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.String.Test.1'));
});

asyncTest('JLinq.OrderBy.Desc.String.Test.2', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //go test the values
        equal(Result[0].Txt, 'bcd');
        equal(Result[1].Txt, 'abc');
        equal(Result[2].Txt, 'ABC');

        start();
    }

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //push that same item into the first element spot (with captials)
    QueryToRun.splice(0, 0, { Id: 1000, Txt: 'ABC' });

    //add a random item
    QueryToRun.push({ Id: 1001, Txt: 'bcd' });

    //reset the query now
    QueryToRun = QueryToRun.OrderByDescending(x => x.Txt);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.String.Test.2'));
});

asyncTest('JLinq.OrderBy.Desc.String.ChainTest.1', function () {

    expect(2);

    var callBack = (Result: Array<any>) => {

        //test the values now
        equal(Result[0], 'bcd');
        equal(Result[1], 'abc');

        start();
    }

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //add a random item
    QueryToRun.push({ Id: 1001, Txt: 'bcd' });

    //go reset the query
    QueryToRun = QueryToRun.Select(x => x.Txt).OrderByDescending(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.String.ChainTest.1'));
});

//#endregion

//#region Order By Boolean

asyncTest('JLinq.OrderBy.Asc.Boolean.Test.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result.Last().IsActive, true);

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderBy(x => x.IsActive);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Boolean.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Asc.Boolean.FallBack.Test.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result.Last().IsActive, true);

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderBy(x => x.IsActive);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Boolean.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.OrderBy.Asc.Boolean.ChainTest.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result.Last(), true);

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x => x.IsActive).OrderBy(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Boolean.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Desc.Boolean.Test.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].IsActive, false);

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderBy(x => x.IsActive);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.Boolean.Test.1'), JLinqUrlPath);
});

//#endregion

//#region Order By Date

asyncTest('JLinq.OrderBy.Asc.Date.Test.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        equal(JSON.stringify(Result[0].CreatedDate), JSON.stringify(new Date('12/1/1980')));

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderBy(x => x.CreatedDate);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Date.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Asc.Date.FallBack.Test.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        equal(JSON.stringify(Result[0].CreatedDate), JSON.stringify(new Date('12/1/1980')));

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderBy(x => x.CreatedDate);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Date.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.OrderBy.Asc.Date.ChainTest.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        equal(JSON.stringify(Result[0]), JSON.stringify(new Date('12/1/1980')));

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x => x.CreatedDate).OrderBy(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Asc.Date.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Desc.Date.Test.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        equal(JSON.stringify(Result.Last().CreatedDate), JSON.stringify(new Date('12/1/1980')));

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.OrderByDescending(x => x.CreatedDate);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.Date.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.OrderBy.Desc.Date.ChainTest.1', function () {

    expect(1);

    var callBack = (Result: Array<any>) => {

        equal(JSON.stringify(Result.Last()), JSON.stringify(new Date('12/1/1980')));

        start();
    }

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._MutableArrayTest.Select(x => x.CreatedDate).OrderByDescending(x => x);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('OrderBy.Desc.Date.ChainTest.1'), JLinqUrlPath);
});

//#endregion

//#endregion

//#region Then By Order

asyncTest('JLinq.ThenBy.Asc.Test.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {
       
        //go test the results
        equal(Result[0].Id, 1);
        equal(Result[1].Id, 2);
        equal(Result[2].Id, 3);
        equal(Result[3].Id, 4);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderBy(x => x.Txt).ThenBy(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Asc.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Asc.FallBack.Test.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {
       
        //go test the results
        equal(Result[0].Id, 1);
        equal(Result[1].Id, 2);
        equal(Result[2].Id, 3);
        equal(Result[3].Id, 4);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderBy(x => x.Txt).ThenBy(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Asc.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.ThenBy.Asc.Test.2', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Id, 2);
        equal(Result[1].Id, 1);
        equal(Result[2].Id, 3);
        equal(Result[3].Id, 4);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderBy(x => x.Txt).ThenByDescending(x => x.Txt2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Asc.Test.2'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Asc.Test.3', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Id, 2);
        equal(Result[1].Id, 1);
        equal(Result[2].Id, 3);
        equal(Result[3].Id, 4);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderBy(x => x.Txt).ThenByDescending(x => x.Txt2).ThenBy(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Asc.Test.3'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Asc.ChainTest.1', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Id, 1);
        equal(Result[1].Id, 2);
        equal(Result[2].Id, 3);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderBy(x => x.Txt).ThenBy(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Asc.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Asc.ChainTest.2', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0], 1);
        equal(Result[1], 2);
        equal(Result[2], 3);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderBy(x => x.Txt).ThenBy(x => x.Id).Select(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Asc.ChainTest.2'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Desc.Test.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Id, 4);
        equal(Result[1].Id, 3);
        equal(Result[2].Id, 2);
        equal(Result[3].Id, 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderByDescending(x => x.Txt).ThenByDescending(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Desc.Test.1'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Desc.FallBack.Test.1', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Id, 4);
        equal(Result[1].Id, 3);
        equal(Result[2].Id, 2);
        equal(Result[3].Id, 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderByDescending(x => x.Txt).ThenByDescending(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Desc.FallBack.Test.1'), JLinqUrlPath, false);
});

asyncTest('JLinq.ThenBy.Desc.Test.2', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Id, 4);
        equal(Result[1].Id, 3);
        equal(Result[2].Id, 1);
        equal(Result[3].Id, 2);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderByDescending(x => x.Txt).ThenBy(x => x.Txt2);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Desc.Test.2'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Desc.Test.3', function () {

    expect(4);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Txt, 'zzz');
        equal(Result[1].Txt, 'bcd');
        equal(Result[2].Txt, 'abc');
        equal(Result[3].Txt, 'abc');

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderByDescending(x => x.Txt).ThenBy(x => x.Txt2).ThenBy(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Desc.Test.3'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Desc.ChainTest.1', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0].Id, 3);
        equal(Result[1].Id, 2);
        equal(Result[2].Id, 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderByDescending(x => x.Txt).ThenByDescending(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Desc.ChainTest.1'), JLinqUrlPath);
});

asyncTest('JLinq.ThenBy.Desc.ChainTest.2', function () {

    expect(3);

    var callBack = (Result: Array<any>) => {

        //go test the results
        equal(Result[0], 3);
        equal(Result[1], 2);
        equal(Result[2], 1);

        start();
    }

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderByDescending(x => x.Txt).ThenByDescending(x => x.Id).Select(x => x.Id);

    //go run the async operation
    QueryToRun.ToArrayAsync(callBack, ErrorCallBack('ThenBy.Desc.ChainTest.2'), JLinqUrlPath);
});

//#endregion

//#endregion