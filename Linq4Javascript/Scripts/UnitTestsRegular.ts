/// <reference path="qunit.d.ts"/>
/// <reference path="unittestframework.ts" />

//#region Unit Tests

//#region AsQueryable

test('JLinq.AsQueryable.Test.1', function () {

    //grab only 2 items so it's easier to test
    var shorterList = UnitTestFramework._Array.Where(x => x.Id == 1 || x.Id == 2).ToArray();

    //test as queryable
    var asQueryableResults = shorterList.AsQueryable();

    //results
    var results = asQueryableResults.ToArray();

    //check the length
    equal(results.length, 2);

    //check the first element
    equal(results[0].Id, 1);

    //check the second element
    equal(results[1].Id, 2);
});

//#endregion

//#region Select Many

test('JLinq.SelectMany.Test.1', function () {

    //how many items we should have
    var howManyItemsShouldWeHave: number = (UnitTestFramework._Array.length - 2) * 2;

    //let's go grab the query and throw it into a variable
    var QueryToRun = UnitTestFramework._Array.SelectMany(x => x.lst);

    //push the results to an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test**** (we * 2 because we always set in our test...2 items per collection)
    equal(QueryToRunResults.length, howManyItemsShouldWeHave);

    equal(QueryToRunResults[0], 2);
    equal(QueryToRunResults[1], 102);

    equal(QueryToRunResults[2], 3);
    equal(QueryToRunResults[3], 103);

    equal(QueryToRunResults[4], 4);
    equal(QueryToRunResults[5], 104);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        switch (ItemCount) {
            case 0:
                equal(CurrentResult.CurrentItem, 2);
                break;

            case 1:
                equal(CurrentResult.CurrentItem, 102);
                break;

            case 2:
                equal(CurrentResult.CurrentItem, 3);
                break;

            case 3:
                equal(CurrentResult.CurrentItem, 103);
                break;

            case 4:
                equal(CurrentResult.CurrentItem, 4);
                break;

            case 5:
                equal(CurrentResult.CurrentItem, 104);
                break;
        }

        ItemCount++;
    }

    //check how many items we have in the iterator patter
    equal(ItemCount, howManyItemsShouldWeHave);
});

test('JLinq.SelectMany.Test.2', function () {

    //this is a select many with a where before it

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 4).SelectMany(x => x.lst);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test**** (we * 2 because we always set in our test...2 items per collection)
    equal(QueryToRunResults.length, 2);

    //check the actual values
    equal(QueryToRunResults[0], 4);
    equal(QueryToRunResults[1], 104);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, 4);
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem, 104);
        }

        ItemCount++;
    }

    equal(ItemCount, 2);
});

test('JLinq.SelectMany.Test.3', function () {

    //this is a select many with a where before it and then a select after it

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 4).SelectMany(x => x.lst).Select(function (x) { return { mapId: x }; });

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test**** (we * 2 because we always set in our test...2 items per collection)
    equal(QueryToRunResults.length, 2);

    equal(QueryToRunResults[0].mapId, 4);
    equal(QueryToRunResults[1].mapId, 104);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<any>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.mapId, 4);
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.mapId, 104);
        }

        ItemCount++;
    }

    equal(ItemCount, 2);
});

//#endregion

//#region Group By

test('JLinq.GroupBy.Test.1', function () {

    //*** Group by doesn't have a lazy iterator...so we don't need to check that

    //go build the query
    var QueryToRun = UnitTestFramework._Array.GroupBy(x => x.GroupByKey);

    equal(QueryToRun.length, 2);
    equal(QueryToRun[0].Key, 'test');
    equal(QueryToRun[1].Key, 'test1');

    equal(QueryToRun[0].Items.length, 3);
    equal(QueryToRun[1].Items.length, 2);

    equal(QueryToRun[0].Items[0].GroupByKey, 'test');
    equal(QueryToRun[0].Items[1].GroupByKey, 'test');
    equal(QueryToRun[0].Items[2].GroupByKey, 'test');

    equal(QueryToRun[1].Items[0].GroupByKey, 'test1');
    equal(QueryToRun[1].Items[1].GroupByKey, 'test1');

    equal(QueryToRun[0].Items[0].Id, 0);
    equal(QueryToRun[0].Items[1].Id, 1);
    equal(QueryToRun[0].Items[2].Id, 2);

    equal(QueryToRun[1].Items[0].Id, 3);
    equal(QueryToRun[1].Items[1].Id, 4);
});

test('JLinq.GroupBy.Test.2', function () {

    //*** Group by doesn't have a lazy iterator...so we don't need to check that
    //go build the query
    var QueryToRun = UnitTestFramework._Array.GroupBy(function (x) { return { key1: x.GroupByKey, key2: x.GroupByKey2 }; });

    equal(QueryToRun.length, 3);
    equal(JSON.stringify(QueryToRun[0].Key), JSON.stringify({ key1: 'test', key2: 'z1' }));
    equal(JSON.stringify(QueryToRun[1].Key), JSON.stringify({ key1: 'test', key2: 'z2' }));
    equal(JSON.stringify(QueryToRun[2].Key), JSON.stringify({ key1: 'test1', key2: 'z2' }));

    equal(QueryToRun[0].Items.length, 2);
    equal(QueryToRun[1].Items.length, 1);
    equal(QueryToRun[2].Items.length, 2);

    equal(JSON.stringify({ key1: QueryToRun[0].Items[0].GroupByKey, key2: QueryToRun[0].Items[0].GroupByKey2 }), JSON.stringify({ key1: 'test', key2: 'z1' }));
    equal(JSON.stringify({ key1: QueryToRun[0].Items[1].GroupByKey, key2: QueryToRun[0].Items[1].GroupByKey2 }), JSON.stringify({ key1: 'test', key2: 'z1' }));

    equal(JSON.stringify({ key1: QueryToRun[1].Items[0].GroupByKey, key2: QueryToRun[1].Items[0].GroupByKey2 }), JSON.stringify({ key1: 'test', key2: 'z2' }));

    equal(JSON.stringify({ key1: QueryToRun[2].Items[0].GroupByKey, key2: QueryToRun[2].Items[0].GroupByKey2 }), JSON.stringify({ key1: 'test1', key2: 'z2' }));
    equal(JSON.stringify({ key1: QueryToRun[2].Items[1].GroupByKey, key2: QueryToRun[2].Items[1].GroupByKey2 }), JSON.stringify({ key1: 'test1', key2: 'z2' }));

    equal(QueryToRun[0].Items[0].Id, 0);
    equal(QueryToRun[0].Items[1].Id, 1);

    equal(QueryToRun[1].Items[0].Id, 2);

    equal(QueryToRun[2].Items[0].Id, 3);
    equal(QueryToRun[2].Items[1].Id, 4);
});

test('JLinq.GroupBy.ChainTest.1', function () {

    //*** Group by doesn't have a lazy iterator...so we don't need to check that

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id > 2).GroupBy(function (x) { return { key1: x.GroupByKey, key2: x.GroupByKey2 }; });

    equal(QueryToRun.length, 1);

    equal(QueryToRun[0].Key.key1, "test1");
    equal(QueryToRun[0].Key.key2, "z2");

    equal(QueryToRun[0].Items.length, 2);

    equal(QueryToRun[0].Items[0].Id, 3);
    equal(QueryToRun[0].Items[0].Txt, '3');

    equal(QueryToRun[0].Items[1].Id, 4);
    equal(QueryToRun[0].Items[1].Txt, '4');
});

//#endregion

//#region Where

test('JLinq.Where.Test.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[0].Txt, '1');
    equal(QueryToRunResults.length, 1);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.Txt, '1');
        }

        ItemCount++;
    }

    equal(ItemCount, 1);
});

test('JLinq.Where.Test.2', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1 || x.Id === 2);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[0].Txt, '1');

    equal(QueryToRunResults[1].Id, 2);
    equal(QueryToRunResults[1].Txt, '2');

    equal(QueryToRunResults.length, 2);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.Txt, '1');
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 2);
            equal(CurrentResult.CurrentItem.Txt, '2');
        }

        ItemCount++;
    }

    equal(ItemCount, 2);
});

test('JLinq.Where.ChainTest.1', function () {

    //go build the query
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id === 1 || x.Id === 2).Take(1).ToArray();

    equal(QueryToRunResults.length, 1);
    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[0].Txt, '1');
});

test('JLinq.Where.ChainTest.2', function () {

    //test the where clause when it's somewhere in the chain after the first call off of array
    var QueryToRunResults = UnitTestFramework._Array.Take(5).Where(x => x.Id === 1 || x.Id === 2).ToArray();

    equal(QueryToRunResults.length, 2);

    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[0].Txt, '1');

    equal(QueryToRunResults[1].Id, 2);
    equal(QueryToRunResults[1].Txt, '2');
});

//#endregion

//#region Concat

//#region Concat Off Of Query With Array

test('JLinq.Concat.TestOffOfQueryWithArray.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).Concat(UnitTestFramework.BuildArray(2));

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[0].Txt, '1');
    equal(QueryToRunResults[1].Id, 0);
    equal(QueryToRunResults[1].Txt, '0');
    equal(QueryToRunResults[2].Id, 1);
    equal(QueryToRunResults[2].Txt, '1');
    equal(QueryToRunResults.length, 3);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.Txt, '1');
        }
        else if (ItemCount === 1) {
            equal(QueryToRunResults[1].Id, 0);
            equal(QueryToRunResults[1].Txt, '0');
        }
        else if (ItemCount === 2) {
            equal(QueryToRunResults[2].Id, 1);
            equal(QueryToRunResults[2].Txt, '1');
        }

        ItemCount++;
    }

    equal(ItemCount, 3);
});

//#endregion

//#region Concat Query Off Of Array With Array

test('JLinq.Concat.TestOffOfArrayWithArray.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Concat(UnitTestFramework.BuildArray(2));

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    for (var i = 0; i < QueryToRunResults.length; i++) {

        //since we are mergeing 2 arrays...when we get to the 2nd array (i>=5...then we subtract 5 to get back to 0)
        var IntTest: number = i >= 5 ? i - 5 : i;

        equal(QueryToRunResults[i].Id, IntTest);
        equal(QueryToRunResults[i].Txt, IntTest.toString());
    }

    equal(QueryToRunResults.length, 7);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        var IntTest: number = ItemCount >= 5 ? ItemCount - 5 : ItemCount;

        equal(QueryToRunResults[IntTest].Id, IntTest);
        equal(QueryToRunResults[IntTest].Txt, IntTest.toString());

        ItemCount++;
    }

    equal(ItemCount, 7);
});

//#endregion

//#endregion

//#region Concat Query

//#region Concat Off Of Query With Another Query

test('JLinq.ConcatQuery.TestOffOfQueryWithQuery.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).Concat(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1));

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[0].Txt, '1');
    equal(QueryToRunResults[1].Id, 1);
    equal(QueryToRunResults[1].Txt, '1');
    equal(QueryToRunResults.length, 2);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.Txt, '1');
        }
        if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.Txt, '1');
        }

        ItemCount++;
    }

    equal(ItemCount, 2);
});

test('JLinq.ConcatQuery.TestOffOfQueryWithQuery.2', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id > 1).Concat(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1)).Where(x => x.Id === 4);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults[0].Id, 4);
    equal(QueryToRunResults[0].Txt, '4');
    equal(QueryToRunResults.length, 1);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 4);
            equal(CurrentResult.CurrentItem.Txt, '4');
        }

        ItemCount++;
    }

    equal(ItemCount, 1);
});

//#endregion

//#region Concat Query Off Of Array With Query

test('JLinq.ConcatQuery.TestOffOfArrayWithQuery.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Concat(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1));

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    for (var i = 0; i < QueryToRunResults.length; i++) {

        if (i === 5) {
            equal(QueryToRunResults[i].Id, 1);
            equal(QueryToRunResults[i].Txt, '1');
        } else {
            equal(QueryToRunResults[i].Id, i);
            equal(QueryToRunResults[i].Txt, i.toString());
        }
    }

    equal(QueryToRunResults.length, 6);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount < 5) {
            equal(QueryToRunResults[ItemCount].Id, ItemCount);
            equal(QueryToRunResults[ItemCount].Txt, ItemCount.toString());
        } else {
            equal(QueryToRunResults[ItemCount].Id, 1);
            equal(QueryToRunResults[ItemCount].Txt, '1');
        }

        ItemCount++;
    }

    equal(ItemCount, 6);
});

//#endregion

//#endregion

//#region Union

//#region Union Off Of Query With Array

test('JLinq.Union.TestOffOfQueryWithArray.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).Select(x => x.Id).Union(UnitTestFramework.BuildArray(2).Select(x => x.Id).ToArray());

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults[0], 1);
    equal(QueryToRunResults[0], '1');
    equal(QueryToRunResults[1], 0);
    equal(QueryToRunResults[1], '0');
    equal(QueryToRunResults.length, 2);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, 1);
        }
        else if (ItemCount === 1) {
            equal(QueryToRunResults[1], 0);
        }

        ItemCount++;
    }

    equal(ItemCount, 2);
});

//#endregion

//#region Union Query Off Of Array With Array

test('JLinq.Union.TestOffOfArrayWithArray.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Select(x => x.Id).ToArray().Union(UnitTestFramework.BuildArray(2).Select(x => x.Id).ToArray());

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    for (var i = 0; i < QueryToRunResults.length; i++) {

        equal(QueryToRunResults[i], i);
    }

    equal(QueryToRunResults.length, 5);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        equal(QueryToRunResults[ItemCount], ItemCount);

        ItemCount++;
    }

    equal(ItemCount, 5);
});

//#endregion

//#endregion

//#region Union Query

//#region Union Off Of Query With Another Query

test('JLinq.UnionQuery.TestOffOfQueryWithQuery.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id === 1).Select(x => x.Id).Union(UnitTestFramework.BuildArray(2).Select(x => x.Id));

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults[0], 1);
    equal(QueryToRunResults[1], 0);
    equal(QueryToRunResults.length, 2);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, 1);
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem, 0);
        }

        ItemCount++;
    }

    equal(ItemCount, 2);
});

//#endregion

//#region Union Query Off Of Array With Query

test('JLinq.UnionQuery.TestOffOfArrayWithQuery.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Select(x => x.Id).ToArray().Union(UnitTestFramework.BuildArray(2).Where(x => x.Id === 1).Select(x => x.Id));

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    for (var i = 0; i < QueryToRunResults.length; i++) {

        equal(QueryToRunResults[i], i);
    }

    equal(QueryToRunResults.length, 5);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
        equal(QueryToRunResults[ItemCount], ItemCount);

        ItemCount++;
    }

    equal(ItemCount, 5);
});

//#endregion

//#endregion

//#region Take

test('JLinq.Take.Test.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Take(2);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 2);

    equal(QueryToRunResults[0].Id, 0);
    equal(QueryToRunResults[0].Txt, '0');

    equal(QueryToRunResults[1].Id, 1);
    equal(QueryToRunResults[1].Txt, '1');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 0);
            equal(CurrentResult.CurrentItem.Txt, '0');
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.Txt, '1');
        }

        ItemCount++;
    }

    equal(2, ItemCount);
});

test('JLinq.Take.ChainTest.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id >= 2).Take(2);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    equal(2, QueryToRunResults.length);

    equal(QueryToRunResults[0].Id, 2);
    equal(QueryToRunResults[0].Txt, '2');

    equal(QueryToRunResults[1].Id, 3);
    equal(QueryToRunResults[1].Txt, '3');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 2);
            equal(CurrentResult.CurrentItem.Txt, '2');
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.Txt, '3');
        }

        ItemCount++;
    }

    equal(2, ItemCount);
});

//#endregion

//#region Take While

test('JLinq.TakeWhile.Test.1', function () {

    //Remember...will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression

    //go build the query
    var QueryToRun = [3, 3, 1, 1, 2, 3].TakeWhile(x => x === 3 || x === 1);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 4);

    //check the results
    equal(QueryToRunResults[0], 3);
    equal(QueryToRunResults[1], 3);
    equal(QueryToRunResults[2], 1);
    equal(QueryToRunResults[3], 1);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //if its 0 or 1 then just check 3
        if (ItemCount === 0 || ItemCount === 1) {

            //check against 1
            equal(CurrentResult.CurrentItem, 3);
        }
        else {

            //just use the regular number now
            equal(CurrentResult.CurrentItem, 1);
        }

        //increase the item count
        ItemCount++;
    }

    //check the item count
    equal(ItemCount, 4);
});

test('JLinq.TakeWhile.ChainTest.1', function () {

    //Remember...will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression

    //go build the query
    var QueryToRun = [100, 3, 3, 1, 1, 100, 2, 3].Where(x => x !== 100).TakeWhile(x => x === 3 || x === 1);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 4);

    //check the results
    equal(QueryToRunResults[0], 3);
    equal(QueryToRunResults[1], 3);
    equal(QueryToRunResults[2], 1);
    equal(QueryToRunResults[3], 1);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //if its 0 or 1 then just check 3
        if (ItemCount === 0 || ItemCount === 1) {

            //check against 1
            equal(CurrentResult.CurrentItem, 3);
        }
        else {

            //just use the regular number now
            equal(CurrentResult.CurrentItem, 1);
        }

        //increase the item count
        ItemCount++;
    }

    //check the item count
    equal(ItemCount, 4);
});

//#endregion

//#region Skip

test('JLinq.Skip.Test.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Skip(1);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 4);

    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[0].Txt, '1');

    equal(QueryToRunResults[1].Id, 2);
    equal(QueryToRunResults[1].Txt, '2');

    equal(QueryToRunResults[2].Id, 3);
    equal(QueryToRunResults[2].Txt, '3');

    equal(QueryToRunResults[3].Id, 4);
    equal(QueryToRunResults[3].Txt, '4');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        equal(CurrentResult.CurrentItem.Id, ItemCount + 1);
        equal(CurrentResult.CurrentItem.Txt, (ItemCount + 1).toString());

        ItemCount++;
    }

    equal(4, ItemCount);
});

test('JLinq.Skip.ChainTest.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id >= 2).Skip(1);

    //go materialize the query 
    var QueryToRunResults = QueryToRun.ToArray();

    equal(QueryToRunResults.length, 2);

    equal(QueryToRunResults[0].Id, 3);
    equal(QueryToRunResults[0].Txt, '3');

    equal(QueryToRunResults[1].Id, 4);
    equal(QueryToRunResults[1].Txt, '4');

    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        equal(CurrentResult.CurrentItem.Id, ItemCount + 3);
        equal(CurrentResult.CurrentItem.Txt, (ItemCount + 3).toString());

        ItemCount++;
    }
});

//#endregion

//#region Skip While

test('JLinq.SkipWhile.Test.1', function () {

    //Remember...after predicate is met, it will return everything after that

    //go build the query
    var QueryToRun = [3, 3, 1, 1, 2, 3].SkipWhile(x => x === 3);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 4);

    //check the results
    equal(QueryToRunResults[0], 1);
    equal(QueryToRunResults[1], 1);
    equal(QueryToRunResults[2], 2);
    equal(QueryToRunResults[3], 3);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //if its 0 then just check 1
        if (ItemCount === 0) {

            //check against 1
            equal(CurrentResult.CurrentItem, 1);
        }
        else {

            //just use the regular number now
            equal(CurrentResult.CurrentItem, ItemCount);
        }

        //increase the item count
        ItemCount++;
    }

    //check the item count
    equal(ItemCount, 4);
});

test('JLinq.SkipWhile.ChainTest.1', function () {

    //Remember...after predicate is met, it will return everything after that

    //go materialize the results into an array
    var QueryToRun = [100, 3, 3, 1, 1, 100, 2, 3].Where(x => x !== 100).SkipWhile(x => x === 3);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 4);

    //check the results
    equal(QueryToRunResults[0], 1);
    equal(QueryToRunResults[1], 1);
    equal(QueryToRunResults[2], 2);
    equal(QueryToRunResults[3], 3);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //if its 0 then just check 1
        if (ItemCount === 0) {

            //check against 1
            equal(CurrentResult.CurrentItem, 1);
        }
        else {

            //just use the regular number now
            equal(CurrentResult.CurrentItem, ItemCount);
        }

        //increase the item count
        ItemCount++;
    }

    //check the item count
    equal(ItemCount, 4);
});

//#endregion

//#region Aggregate

test('JLinq.Aggregate.Test.1', function () {

    //go build the query we will use to build the query and results
    var QueryToAggregate: Array<number> = [1, 2, 3, 4];

    //go build the query
    var ResultOfQuery = QueryToAggregate.Aggregate((WorkingT, CurrentT) => WorkingT + CurrentT);

    //check the result
    equal(ResultOfQuery, QueryToAggregate.Sum());
});

test('JLinq.Aggregate.Test.2', function () {

    //go build the query we will use to build the query and results
    var QueryToAggregate: Array<string> = ['1', '2', '3', '4'];

    //go build the query
    var ResultOfQuery = QueryToAggregate.Aggregate((WorkingT, CurrentT) => WorkingT + ',' + CurrentT);

    //check the result
    equal(ResultOfQuery, '1,2,3,4');
});

test('JLinq.Aggregate.ChainTest.1', function () {

    //go build the query we will use to build the query and results
    var QueryToAggregate: Array<number> = [1, 2, 3, 4];

    //go build the query
    var ResultOfQuery = QueryToAggregate.Where(x => x > 2).Aggregate((WorkingT, CurrentT) => WorkingT + CurrentT);

    //check the result
    equal(ResultOfQuery, QueryToAggregate.Where(x => x > 2).Sum());
});

//#endregion

//#region Paginate

test('JLinq.Paginate.Test.1', function () {

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Paginate(1, 100);

    //go materialize the array
    var QueryToRunResults = QueryToRun.ToArray();

    //check the count
    equal(QueryToRunResults.Count(), UnitTestFramework._DefaultItemsToBuild);

    equal(QueryToRunResults[0].Id, 0);
    equal(QueryToRunResults[0].Txt, '0');

    equal(QueryToRunResults[1].Id, 1);
    equal(QueryToRunResults[1].Txt, '1');

    equal(QueryToRunResults[2].Id, 2);
    equal(QueryToRunResults[2].Txt, '2');

    equal(QueryToRunResults[3].Id, 3);
    equal(QueryToRunResults[3].Txt, '3');

    equal(QueryToRunResults[4].Id, 4);
    equal(QueryToRunResults[4].Txt, '4');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        equal(CurrentResult.CurrentItem.Id, ItemCount);
        equal(CurrentResult.CurrentItem.Txt, ItemCount.toString());

        ItemCount++;
    }

    equal(ItemCount, UnitTestFramework._DefaultItemsToBuild);
});

test('JLinq.Paginate.Test.1', function () {

    //just make sure we get the 3 records for the first page

    //how many records per page
    var howManyRecordsPerPage = 3;

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Paginate(1, howManyRecordsPerPage);

    //materialize the array
    var results = QueryToRun.ToArray();

    //now make sure we have the correct records
    equal(results[0].Id, 0);
    equal(results[0].Txt, '0');

    equal(results[1].Id, 1);
    equal(results[1].Txt, '1');

    equal(results[2].Id, 2);
    equal(results[2].Txt, '2');

    //check the count
    equal(results.Count(), howManyRecordsPerPage);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        equal(CurrentResult.CurrentItem.Id, ItemCount);
        equal(CurrentResult.CurrentItem.Txt, ItemCount.toString());

        ItemCount++;
    }

    equal(ItemCount, howManyRecordsPerPage);
});

test('JLinq.Paginate.Test.3', function () {

    //just make sure we get the rest of the records on the 2nd page

    //how many records per page
    var howManyRecordsPerPage = 3;

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Paginate(2, howManyRecordsPerPage);

    //materialize the array
    var results = QueryToRun.ToArray();

    //now make sure we have the correct records
    equal(results[0].Id, 3);
    equal(results[1].Id, 4);

    //check the count
    equal(results.Count(), 2);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        equal(CurrentResult.CurrentItem.Id, ItemCount + 3);
        equal(CurrentResult.CurrentItem.Txt, (ItemCount + 3).toString());

        ItemCount++;
    }

    equal(ItemCount, 2);
});

test('JLinq.Paginate.ChainTest.1', function () {

    //go build the query make sure we have all the records
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id > 1).Paginate(1, 100);

    //go materialize the array
    var QueryToRunResults = QueryToRun.ToArray();

    //check the count
    equal(QueryToRunResults.Count(), UnitTestFramework._DefaultItemsToBuild - 2);

    equal(QueryToRunResults[0].Id, 2);
    equal(QueryToRunResults[0].Txt, '2');

    equal(QueryToRunResults[1].Id, 3);
    equal(QueryToRunResults[1].Txt, '3');

    equal(QueryToRunResults[2].Id, 4);
    equal(QueryToRunResults[2].Txt, '4');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        equal(CurrentResult.CurrentItem.Id, ItemCount + 2);
        equal(CurrentResult.CurrentItem.Txt, (ItemCount + 2).toString());

        ItemCount++;
    }

    equal(ItemCount, UnitTestFramework._DefaultItemsToBuild - 2);
});

//#endregion

//#region First

test('JLinq.First.Test.1', function () {

    //***First doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.First(x => x.Id === 1);

    equal(QueryToRunResults.Id, 1);
    equal(QueryToRunResults.Txt, '1');
});

test('JLinq.First.Test.2', function () {

    //***First doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.First(x => x.Id === 2);

    equal(QueryToRunResults.Id, 2);
    equal(QueryToRunResults.Txt, '2');
});

test('JLinq.First.Test.3', function () {

    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.First(function (x) { return <any>x.Id === 'test'; });
    }, "Can't Find First Item. Query Returned 0 Rows");
});

test('JLinq.First.TestWithNoPredicate.1', function () {

    //run it with no predicate
    equal(true, UnitTestFramework._Array.First() != null);
});

test('JLinq.First.TestWithNoPredicate.2', function () {

    //run it with no predicate (should blowup)
    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.Where(x => x.Id === -9999).First();
    }, "Can't Find First Item. Query Returned 0 Rows");
});

test('JLinq.First.TestWithNoPredicate.3', function () {

    //run it with no predicate
    equal(true, [].FirstOrDefault() == null);
});

test('JLinq.First.ChainTest.1', function () {

    //***First doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id >= 2).First(x => x.Id === 3);

    equal(QueryToRunResults.Id, 3);
});

test('JLinq.First.ResetIteratorTest.1', function () {

    //***First doesn't have a lazy iterator. It returns the first item right away

    //Testing to make sure the iterator reset's after we call FirstOrDefault

    //build the base query
    var baseQuery = UnitTestFramework._Array.Where(x => x.Id >= 1);

    //go materialize the results.
    var QueryToRunResults = baseQuery.First(x => x.Id === 3);

    equal(QueryToRunResults.Id, 3);
    equal(QueryToRunResults.Txt, '3');

    //now try to get something that = 1 because we are past that point in the loop
    var QueryToRunResults = baseQuery.First(x => x.Id === 1);

    equal(QueryToRunResults.Id, 1);
    equal(QueryToRunResults.Txt, '1');
});

//#endregion

//#region First Or Default

test('JLinq.FirstOrDefault.Test.1', function () {

    //***First or default doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.FirstOrDefault(x => x.Id === 1);

    equal(QueryToRunResults.Id, 1);
    equal(QueryToRunResults.Txt, '1');
});

test('JLinq.FirstOrDefault.Test.2', function () {

    //***First or default doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.FirstOrDefault(x => x.Id === 2);

    equal(QueryToRunResults.Id, 2);
    equal(QueryToRunResults.Txt, '2');
});

test('JLinq.FirstOrDefault.Test.3', function () {

    //***First or default doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.FirstOrDefault(function (x) { return <any>x.Id === 'test'; });

    equal(QueryToRunResults, null);
});

test('JLinq.FirstOrDefault.TestWithNoPredicate.1', function () {

    //run it with no predicate
    equal(true, UnitTestFramework._Array.FirstOrDefault() != null);
});

test('JLinq.FirstOrDefault.TestWithNoPredicate.2', function () {

    //run it with no predicate
    equal(true, UnitTestFramework._Array.Where(x => x.Id === -9999).FirstOrDefault() == null);
});

test('JLinq.FirstOrDefault.TestWithNoPredicate.3', function () {

    //run it with no predicate
    equal(true, [].FirstOrDefault() == null);
});

test('JLinq.FirstOrDefault.ChainTest.1', function () {

    //***First or default doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id >= 2).FirstOrDefault(x => x.Id === 3);

    equal(QueryToRunResults.Id, 3);
});

test('JLinq.FirstOrDefault.ResetIteratorTest.1', function () {

    //***First or default doesn't have a lazy iterator. It returns the first item right away

    //Testing to make sure the iterator reset's after we call FirstOrDefault

    //build the base query
    var baseQuery = UnitTestFramework._Array.Where(x => x.Id >= 1);

    //go materialize the results.
    var QueryToRunResults = baseQuery.FirstOrDefault(x => x.Id === 3);

    equal(QueryToRunResults.Id, 3);
    equal(QueryToRunResults.Txt, '3');

    //now try to get something that = 1 because we are past that point in the loop
    var QueryToRunResults = baseQuery.FirstOrDefault(x => x.Id === 1);

    equal(QueryToRunResults.Id, 1);
    equal(QueryToRunResults.Txt, '1');
});

//#endregion

//#region Single

test('JLinq.Single.Test.1', function () {

    //***Single doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.Single(x => x.Id === 1);

    equal(QueryToRunResults.Id, 1);
    equal(QueryToRunResults.Txt, '1');
});

test('JLinq.Single.Test.2', function () {

    //***Single doesn't have a lazy iterator. It returns the first item right away

    //this test will make sure it returns null if we have 0 items that meet the predicate

    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.Single(x => x.Id === 200);
    }, "Can't Find A Single Item.Query Returned 0 Rows");
});

test('JLinq.Single.Test.3', function () {

    //***Single doesn't have a lazy iterator. It returns the first item right away

    //this test will make sure it throw's an error if we have more then 1 item

    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.Single(x => x.Id === 2 || x.Id === 3);
    }, "Can't Find A Single Item.Query Returned 0 Rows");

});

test('JLinq.Single.Test.4', function () {

    //***Single doesn't have a lazy iterator. It returns the first item right away

    //check that it chains correctly
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id > 2).Single(x => x.Id === 3);

    equal(QueryToRunResults.Id, 3);
    equal(QueryToRunResults.Txt, '3');
});

test('JLinq.Single.Test.5', function () {

    //***Single doesn't have a lazy iterator. It returns the first item right away

    //check that it chains correctly while having more then 1 item which should throw an error
    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.Where(x => x.Id > 2).Single(x => x.Id === 3 || x.Id === 4);
    }, 'We Already Have A Match. Single Must Only Have 1 or 0 Items Returned. Use FirstOrDefault If You Are Expecting Multiple Items And Just Want To Grab The First Item');
});

test('JLinq.Single.TestWithNoPredicate.1', function () {

    //run it with no predicate
    equal(true, UnitTestFramework._Array.Take(1).Single() != null);
});

test('JLinq.Single.TestWithNoPredicate.2', function () {

    //run it with no predicate
    throws(function () {
        //go run the method that should blow up
        [].Single();
    }, 'We Already Have A Match. Single Must Only Have 1 or 0 Items Returned. Use FirstOrDefault If You Are Expecting Multiple Items And Just Want To Grab The First Item');
});

test('JLinq.Single.TestWithNoPredicate.3', function () {

    //run it with no predicate
    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.Where(x => x.Id === -9999).Single();
    }, 'We Already Have A Match. Single Must Only Have 1 or 0 Items Returned. Use FirstOrDefault If You Are Expecting Multiple Items And Just Want To Grab The First Item');
});

//#endregion

//#region Single Or Default

test('JLinq.SingleOrDefault.Test.1', function () {

    //***Single or default doesn't have a lazy iterator. It returns the first item right away

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.SingleOrDefault(x => x.Id === 1);

    equal(QueryToRunResults.Id, 1);
    equal(QueryToRunResults.Txt, '1');
});

test('JLinq.SingleOrDefault.Test.2', function () {

    //***Single or default doesn't have a lazy iterator. It returns the first item right away

    //this test will make sure it returns null if we have 0 items that meet the predicate

    //go materialize the results.
    var QueryToRunResults = UnitTestFramework._Array.SingleOrDefault(x => x.Id === 200);

    equal(QueryToRunResults, null);
});

test('JLinq.SingleOrDefault.Test.3', function () {

    //***Single or default doesn't have a lazy iterator. It returns the first item right away

    //this test will make sure it throw's an error if we have more then 1 item

    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.SingleOrDefault(x => x.Id === 2 || x.Id === 3);
    }, 'We Already Have A Match. SingleOrDefault Must Only Have 1 or 0 Items Returned. Use FirstOrDefault If You Are Expecting Multiple Items And Just Want To Grab The First Item');

});

test('JLinq.SingleOrDefault.Test.4', function () {

    //***Single or default doesn't have a lazy iterator. It returns the first item right away

    //check that it chains correctly
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id > 2).SingleOrDefault(x => x.Id === 3);

    equal(QueryToRunResults.Id, 3);
    equal(QueryToRunResults.Txt, '3');
});

test('JLinq.SingleOrDefault.Test.5', function () {

    //***Single or default doesn't have a lazy iterator. It returns the first item right away

    //check that it chains correctly while having more then 1 item which should throw an error
    throws(function () {
        //go run the method that should blow up
        UnitTestFramework._Array.Where(x => x.Id > 2).SingleOrDefault(x => x.Id === 3 || x.Id === 4);
    }, 'We Already Have A Match. SingleOrDefault Must Only Have 1 or 0 Items Returned. Use FirstOrDefault If You Are Expecting Multiple Items And Just Want To Grab The First Item');
});

test('JLinq.SingleOrDefault.TestWithNoPredicate.1', function () {

    //run it with no predicate
    equal(true, UnitTestFramework._Array.Take(1).SingleOrDefault() != null);
});

test('JLinq.SingleOrDefault.TestWithNoPredicate.2', function () {

    //run it with no predicate
    equal(true, [].SingleOrDefault() == null);
});

test('JLinq.SingleOrDefault.TestWithNoPredicate.3', function () {

    //run it with no predicate
    equal(true, UnitTestFramework._Array.Where(x => x.Id === -9999).SingleOrDefault() == null);
});

//#endregion

//#region Select

test('JLinq.Select.Test.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Select(function (x) { return { newId: x.Id, newTxt: x.Id + 1 }; });

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(1, QueryToRunResults[1].newId);
    equal(2, QueryToRunResults[1].newTxt);

    //make sure the old properties aren't there
    equal(null, (<any>QueryToRunResults[1]).Id);
    equal(null, (<any>QueryToRunResults[1]).Txt);

    equal(5, QueryToRunResults.length);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<any>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 1) {
            equal(1, CurrentResult.CurrentItem.newId);
            equal(2, CurrentResult.CurrentItem.newTxt);

            //make sure the old properties aren't there
            equal(null, CurrentResult.CurrentItem.Id);
            equal(null, CurrentResult.CurrentItem.Txt);
        }

        ItemCount++;
    }
});

test('JLinq.Select.ChainTest.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id >= 2).Select(x => x.Id);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(3, QueryToRunResults.length);
    equal(2, QueryToRunResults[0]);
    equal(3, QueryToRunResults[1]);
    equal(4, QueryToRunResults[2]);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(2, CurrentResult.CurrentItem);
        }
        else if (ItemCount === 1) {
            equal(3, CurrentResult.CurrentItem);
        }
        else if (ItemCount === 2) {
            equal(4, CurrentResult.CurrentItem);
        }

        ItemCount++;
    }

    equal(3, ItemCount);
});

//#endregion

//#region All

test('JLinq.All.Test.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.All(x => x.Id < 100), true);
});

test('JLinq.All.Test.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.All(x => x.Id === 2), false);
});

test('JLinq.All.ChainTest.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.Where(x => x.Id === 2).All(x => x.Id === 2), true);
    equal(UnitTestFramework._Array.Where(x => x.Id > 2).All(x => x.Id === 2), false);
});

//#endregion

//#region Any With Null Predicate - (Depreciated) - Don't Use AnyItem, Use Any()

test('JLinq.AnyWithNullPredicate.Test.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.Any(), true);
});

test('JLinq.AnyWithNullPredicate.Test.2', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal([].Any(), false);
});

test('JLinq.AnyWithNullPredicate.ResetIteratorTest.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //Testing to make sure the iterator reset's after we call FirstOrDefault

    //we need to reset the iterator after we call this method. This test method does that.
    var query = UnitTestFramework._Array.Where(x => x.Id >= 1);

    //grab the count value
    equal(true, query.Any());

    //now check to make sure we have the same amount
    equal(query.Count(), 4);
});

test('JLinq.AnyWithNullPredicate.ChainTest.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //build this off of a query then run any items(found by user)
    equal(UnitTestFramework._Array.Where(x => x.Id === 2).Any(), true);
    equal(UnitTestFramework._Array.Where(x => x.Id === 100).Any(), false);
});

//#endregion

//#region Any With Predicate

test('JLinq.Any.Test.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.Any(x => x.Id > 100), false);
});

test('JLinq.Any.Test.2', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.Any(x => x.Id === 2), true);
});

test('JLinq.Any.ChainTest.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.Where(x => x.Id > 1).Any(x => x.Id === 2), true);
    equal(UnitTestFramework._Array.Where(x => x.Id === 1).Any(x => x.Id === 2), false);
});

//#endregion

//#region Last With Null Predicate

test('JLinq.LastWithNullPredicate.Test.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    var QueryToRunResults = UnitTestFramework._Array.Last();

    equal(4, QueryToRunResults.Id);
    equal('4', QueryToRunResults.Txt);
});

test('JLinq.LastWithNullPredicate.Test.2', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal([].Last(), null);
});

test('JLinq.LastWithNullPredicate.ChainTest.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //build this off of a query then run any items(found by user)
    var LastItemResult = UnitTestFramework._Array.Where(x => x.Id > 1).Last();

    equal(LastItemResult.Id, 4);
    equal(LastItemResult.Txt, '4');

    //test something where we can't find any result
    LastItemResult = UnitTestFramework._Array.Where(x => x.Id > 1000).Last();

    equal(LastItemResult, null);
});

//#endregion

//#region Last With Where

test('JLinq.Last.Test.1', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    var QueryToRunResults = UnitTestFramework._Array.Last(x => x.Id === 2);

    equal(2, QueryToRunResults.Id);
    equal('2', QueryToRunResults.Txt);
});

test('JLinq.Last.Test.2', function () {

    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    equal(UnitTestFramework._Array.Last(x => x.Id === 100), null);
});

test('JLinq.Last.Test.3', function () {


    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    var QueryToRunResults = UnitTestFramework._Array.Last(x => x.Id === 4);


    equal(4, QueryToRunResults.Id);
    equal('4', QueryToRunResults.Txt);
});

test('JLinq.Last.ChainTest.1', function () {


    //*** all just returns a boolean, there is no lazy iterator

    //go materialize the results into an array
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id > 1).Last(x => x.Id === 4);

    equal(4, QueryToRunResults.Id);
    equal('4', QueryToRunResults.Txt);
});

//#endregion

//#region Distinct

test('JLinq.Distinct.Number.Test.1', function () {

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Id);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 5);
    equal(QueryToRunResults[0], 0);


    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, 0);
        }

        ItemCount++;
    }

    equal(ItemCount, 5);
});

test('JLinq.Distinct.Number.Test.2', function () {

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Id);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 5);
    equal(QueryToRunResults[0], 0);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, 0);
        }

        ItemCount++;
    }

    equal(ItemCount, 5);
});

test('JLinq.Distinct.Date.Test.3', function () {

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

    //go sort the iterator and return the results (no need to call ToArray() on the sort method, it has no lazy iterator)
    var sortedResults = QueryToRun.OrderBy(x => x).ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(sortedResults.length, 3);
    equal(sortedResults[0], UnitTestFramework._FirstIndexDate);
    equal(sortedResults[1], dtToAdd);
    equal(sortedResults[2], UnitTestFramework._DateOfTest);


    //****Lazy Execution Test****

    //sort doesn't use lazy iterator...so we will just check the results in an index manner
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<Date>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, UnitTestFramework._DateOfTest);
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem, UnitTestFramework._FirstIndexDate);
        }
        else if (ItemCount === 2) {
            equal(CurrentResult.CurrentItem, dtToAdd);
        }

        ItemCount++;
    }

    equal(ItemCount, 3);
});

test('JLinq.Distinct.String.Test.2', function () {

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 0, Txt: "0", IsActive: true, GroupByKey: "0", GroupByKey2: "0", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Txt);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 6);
    equal(QueryToRunResults[0], 0);
    equal(QueryToRunResults[1], 1);
    equal(QueryToRunResults[2], 2);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<string>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, 0);
        }
        else if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem, 1);
        }
        else if (ItemCount === 2) {
            equal(CurrentResult.CurrentItem, 2);
        }

        ItemCount++;
    }

    equal(ItemCount, 6);
});

test('JLinq.Distinct.ChainTest.1', function () {

    //let's build on to the default array
    var arrayToTestAgainst: UnitTestFramework.ITestObject[] = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push the new values into the array
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });
    arrayToTestAgainst.push({ Id: 1, Txt: "100", IsActive: true, GroupByKey: "1", GroupByKey2: "1", lst: null, CreatedDate: UnitTestFramework._DateOfTest });

    //go build the query
    var QueryToRun = arrayToTestAgainst.Where(x => x.Id >= 0).Distinct(x => x.Id);

    //go materialize the results into an array
    var QueryToRunResults = QueryToRun.ToArray();

    //****To-UnitTestFramework._Array Test****
    equal(QueryToRunResults.length, 5);
    equal(QueryToRunResults[0], 0);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem, 0);
        }

        ItemCount++;
    }

    equal(ItemCount, 5);
});

//#endregion

//#region Min

test('JLinq.Min.Test.1', function () {

    //*** Min doesn't have a lazy iterator...it just returns the min value.

    //go materialize the results into the result
    equal(UnitTestFramework._Array.Select(x => x.Id).Min(), 0);
});

test('JLinq.Min.Test.2', function () {

    //*** Min doesn't have a lazy iterator...it just returns the min value.

    equal([3, 2, 1].Min(), 1);
});

test('JLinq.Min.ChainTest.1', function () {

    //*** Min doens't have a lazy iterator...it just returns the min.

    //go build the query
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id > 1).Select(x => x.Id);

    //check the min
    equal(QueryToRunResults.Min(), 2);

    //now run the original query and get a count to make sure the iterator is reset
    equal(QueryToRunResults.Count(), 3);
});

//#endregion

//#region Max

test('JLinq.Max.Test.1', function () {

    //*** Max doesn't have a lazy iterator...it just returns the max value.

    //go materialize the results into the result
    equal(UnitTestFramework._Array.Select(x => x.Id).Max(), 4);
});

test('JLinq.Max.Test.2', function () {

    //*** Max doesn't have a lazy iterator...it just returns the max value.

    equal([1, 2, 3].Max(), 3);
});

test('JLinq.Max.ResetIteratorTest.1', function () {

    //*** Max doens't have a lazy iterator...it just returns the max.

    //go build the query
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id > 1).Select(x => x.Id);

    //check the max
    equal(QueryToRunResults.Max(), 4);

    //now run the original query and get a count to make sure the iterator is reset
    equal(QueryToRunResults.Count(), 3);
});

//#endregion

//#region Sum

test('JLinq.Sum.Test.1', function () {

    //*** Sum doens't have a lazy iterator...it just returns the sum.

    //go materialize the sum
    equal(UnitTestFramework._Array.Select(x => x.Id).Sum(), 10);
});

test('JLinq.Sum.ChainTest.1', function () {

    //*** Sum doens't have a lazy iterator...it just returns the sum.

    //go materialize the sum
    equal([1, 2, 3].Sum(), 6);
});

test('JLinq.Sum.ResetIteratorTest.1', function () {

    //*** Sum doens't have a lazy iterator...it just returns the sum.

    //go build the query
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id > 1).Select(x => x.Id);

    //check the sum
    equal(QueryToRunResults.Sum(), 9);

    //now run the original query and get a count to make sure the iterator is reset
    equal(QueryToRunResults.Count(), 3);
});

//#endregion

//#region Count

test('JLinq.Count.Test.1', function () {

    //*** Count doens't have a lazy iterator...it just returns the count

    //this is a where with a count off of a chain

    //go materialize the count
    equal(UnitTestFramework._Array.Where(x => x.Id >= 3).Count(), 2);
});

test('JLinq.Count.Test.2', function () {

    //*** Count doens't have a lazy iterator...it just returns the count

    //* this test the count with a chain

    //this is 2 where's with a count

    //go materialize the count
    equal(UnitTestFramework._Array.Where(x => x.Id >= 1).Where(x => x.Id >= 3).Count(), 2);
});

test('JLinq.Count.Test.3', function () {

    //*** Count doens't have a lazy iterator...it just returns the count

    //go materialize the count

    //this is a count with a predicate off of an array
    equal(UnitTestFramework._Array.Count(x => x.Id >= 3), 2);
});

test('JLinq.Count.Test.4', function () {

    //*** Count doens't have a lazy iterator...it just returns the count

    //run count off of an array with no predicate (just a shorthand call to array.length)
    equal(UnitTestFramework._Array.Count(), UnitTestFramework._Array.length);
});

test('JLinq.Count.ResetIteratorTest.1', function () {

    //*** Count doens't have a lazy iterator...it just returns the count

    //Testing to make sure the iterator reset's after we call Count

    //we need to reset the iterator after we call this method. This test method does that.
    var QueryToRun = UnitTestFramework._Array.Where(x => x.Id > 0);

    //what should the count be
    var CountShouldBe: number = 4;

    //grab the count value
    equal(QueryToRun.Count(), CountShouldBe);

    //now run through the query
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //declare the item count
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //increase the count
        ItemCount++;
    }

    //does the count equal what it should
    equal(ItemCount, CountShouldBe);
});

//#endregion

//#region Average

test('JLinq.Average.Test.1', function () {

    //*** Avg doens't have a lazy iterator...it just returns the average.

    //go materialize the average
    equal(UnitTestFramework._Array.Select(x => x.Id).Average(), 2);
});

test('JLinq.Average.Test.2', function () {

    //*** Avg doens't have a lazy iterator...it just returns the average.

    //build the temporary array to test
    //get the average and test it
    equal([1, 2.25, 3.5].Average(), 2.25);
});

test('JLinq.Average.ResetIteratorTest.1', function () {

    //*** Average doens't have a lazy iterator...it just returns the average.

    //go build the query
    var QueryToRunResults = UnitTestFramework._Array.Where(x => x.Id > 1).Select(x => x.Id);

    //check the average
    equal(QueryToRunResults.Average(), 3);

    //now run the original query and get a count to make sure the iterator is reset
    equal(QueryToRunResults.Count(), 3);
});

//#endregion

//#region To Dictionary

test('JLinq.Dictionary.Number.Test.1', function () {

    //push the list to a dictionary
    var DictionaryResult = UnitTestFramework._Array.ToDictionary(x => x.Id);

    //going to add another dictionary so we know its instance safe
    var InstanceSafeDictionary = new ToracTechnologies.JLinq.Dictionary();

    //add an item to the instance safe dictionary
    InstanceSafeDictionary.Add(1, 1);

    //check the instance safe dictionary keys
    equal(InstanceSafeDictionary.ContainsKey(1), true);

    //check the instance safe dictionary count.
    equal(InstanceSafeDictionary.Count(), 1);

    //check to make sure we have these keys
    equal(DictionaryResult.ContainsKey(0), true);
    equal(DictionaryResult.ContainsKey(1), true);
    equal(DictionaryResult.ContainsKey(2), true);
    equal(DictionaryResult.ContainsKey(3), true);
    equal(DictionaryResult.ContainsKey(4), true);
    equal(DictionaryResult.ContainsKey(5), false);

    //grab these items and check the get items
    equal(DictionaryResult.GetItem(0).Txt, '0');
    equal(DictionaryResult.GetItem(1).Txt, '1');
    equal(DictionaryResult.GetItem(2).Txt, '2');
    equal(DictionaryResult.GetItem(3).Txt, '3');
    equal(DictionaryResult.GetItem(4).Txt, '4');

    //grab the keys so we can check them
    var KeysResult = DictionaryResult.Keys();

    //run through each key and check that
    equal(KeysResult[0], '0');
    equal(KeysResult[1], '1');
    equal(KeysResult[2], '2');
    equal(KeysResult[3], '3');
    equal(KeysResult[4], '4');

    //grab the values so we can check them
    var ValuesResult = DictionaryResult.Values();

    //check the value snow
    equal(ValuesResult[0].Txt, '0');
    equal(ValuesResult[1].Txt, '1');
    equal(ValuesResult[2].Txt, '2');
    equal(ValuesResult[3].Txt, '3');
    equal(ValuesResult[4].Txt, '4');

    //check the counts
    equal(DictionaryResult.Count(), 5);

    //let's make sure the get all items works
    var GetAllItemsResult = DictionaryResult.GetAllItems();

    //loop through all the items in the dictionary
    for (var i = 0; i < GetAllItemsResult.length; i++) {

        //check the key
        equal(GetAllItemsResult[i].Key, i);

        //check the value
        equal(GetAllItemsResult[i].Value.Txt, i.toString());
    }

    //let's test the remove now
    DictionaryResult.Remove(0);

    //now make sure we have 4 items
    equal(DictionaryResult.Count(), 4);

    //let's make sure the remove works
    var GetAllItemsRemoveResultTest = DictionaryResult.GetAllItems();

    //loop through all the items in the dictionary
    for (var i = 0; i < GetAllItemsRemoveResultTest.length; i++) {

        //check the key
        equal(GetAllItemsRemoveResultTest[i].Key, i + 1);

        //check the value
        equal(GetAllItemsRemoveResultTest[i].Value.Txt, (i + 1).toString());
    }
});

test('JLinq.Dictionary.Date.Test.1', function () {

    //push the list to a dictionary
    var DictionaryResult = UnitTestFramework._Array.Where(x => x.CreatedDate === UnitTestFramework._FirstIndexDate).ToDictionary(x => x.CreatedDate);

    //going to add another dictionary so we know its instance safe
    var InstanceSafeDictionary = new ToracTechnologies.JLinq.Dictionary();

    //add an item to the instance safe dictionary
    InstanceSafeDictionary.Add(1, 1);

    //does the instance safe dictionary contain this key
    equal(InstanceSafeDictionary.ContainsKey(1), true);

    //check the dictionary count of items
    equal(InstanceSafeDictionary.Count(), 1);

    //check the keys of the original dictionary
    equal(DictionaryResult.ContainsKey(UnitTestFramework._FirstIndexDate), true);
    equal(DictionaryResult.ContainsKey(UnitTestFramework._DateOfTest), false);
    equal(DictionaryResult.ContainsKey(new Date()), false);

    //grab the keys of the dictionary so we can test it
    var KeysResult = DictionaryResult.Keys();

    //check the count of keys
    equal(KeysResult.Count(), 1);

    //check the first key value
    equal(KeysResult[0], UnitTestFramework._FirstIndexDate);

    //grab the values so we can test that
    var ValuesResult = DictionaryResult.Values();

    //how many values do we have?
    equal(ValuesResult.Count(), 1);

    //check the first value in the dictionary
    equal(ValuesResult[0].Txt, '1');

    //check the counts
    equal(DictionaryResult.Count(), 1);

    //let's make sure the get all items works
    var GetAllItemsResult = DictionaryResult.GetAllItems();

    //loop through all the items in the dictionary
    for (var i = 0; i < GetAllItemsResult.length; i++) {

        //check the key
        equal(GetAllItemsResult[i].Key, UnitTestFramework._FirstIndexDate);

        //check the value
        equal(GetAllItemsResult[i].Value.Txt, "1");
    }
});

test('JLinq.Dictionary.Boolean.Test.1', function () {

    //push the list to a dictionary
    var DictionaryResult = UnitTestFramework._Array.Where(x => x.CreatedDate === UnitTestFramework._FirstIndexDate).ToDictionary(x => x.IsActive);

    //going to add another dictionary so we know its instance safe
    var InstanceSafeDictionary = new ToracTechnologies.JLinq.Dictionary();

    //add an item to the instance safe dictionary
    InstanceSafeDictionary.Add(1, 1);

    //does the instance safe dictionary contain this key
    equal(InstanceSafeDictionary.ContainsKey(1), true);

    //check the dictionary count of items
    equal(InstanceSafeDictionary.Count(), 1);

    //check the keys of the original dictionary
    equal(DictionaryResult.ContainsKey(true), true);
    equal(DictionaryResult.ContainsKey(false), false);

    //grab the keys of the dictionary so we can test it
    var KeysResult = DictionaryResult.Keys();

    //check the count of keys
    equal(KeysResult.Count(), 1);

    //just check the first key
    equal(KeysResult[0], true);

    //grab all the values so we can test it
    var ValuesResult = DictionaryResult.Values();

    //check the values count
    equal(ValuesResult.Count(), 1);

    //go check the first item in the dictionary
    equal(ValuesResult[0].Txt, '1');

    //check the counts
    equal(DictionaryResult.Count(), 1);

    //let's make sure the get all items works
    var GetAllItemsResult = DictionaryResult.GetAllItems();

    //loop through all the items in the dictionary
    for (var i = 0; i < GetAllItemsResult.length; i++) {

        //check the key
        equal(GetAllItemsResult[i].Key, true);

        //check the value
        equal(GetAllItemsResult[i].Value.Txt, "1");
    }
});

test('JLinq.Dictionary.MultiKeyObject.Test.1', function () {

    //push the list to a dictionary
    var DictionaryResult = UnitTestFramework._Array.Where(x => x.CreatedDate === UnitTestFramework._FirstIndexDate).ToDictionary(x => { return { Id: x.Id, Active: x.IsActive }; });

    //let's check to make sure we can find these guys in the dictionary
    equal(DictionaryResult.ContainsKey({ Id: 1, Active: true }), true);
    equal(DictionaryResult.ContainsKey({ Id: 1, Active: false }), false);

    //grab the keys so we can check them
    var KeysResult = DictionaryResult.Keys();

    //do we have the correct amount of keys?
    equal(KeysResult.Count(), 1);

    //check the actual key value off of the .Active property
    equal(KeysResult[0].Active, true);

    //grab the values so we can check them
    var ValuesResult = DictionaryResult.Values();

    //check the count of values
    equal(ValuesResult.Count(), 1);

    //does the value of this item match
    equal(ValuesResult[0].Txt, '1');

    //check the counts
    equal(DictionaryResult.Count(), 1);

    //let's make sure the get all items works
    var GetAllItemsResult = DictionaryResult.GetAllItems();

    //loop through all the items in the dictionary
    for (var i = 0; i < GetAllItemsResult.length; i++) {

        //check the key
        equal(GetAllItemsResult[i].Key.Active, true);

        //check the value
        equal(GetAllItemsResult[i].Value.Txt, "1");
    }

    //let's test the remove now
    DictionaryResult.Remove({ Id: 1, Active: true });

    //now make sure we have 4 items
    equal(DictionaryResult.Count(), 0);
});

test('JLinq.Dictionary.MultiKeyObjectWithDatePartialKey.Test.1', function () {

    //push the list to a dictionary
    var DictionaryResult = UnitTestFramework._Array.Take(2).ToDictionary(x => { return { Id: x.Id, Dt: x.CreatedDate }; });

    //check to make sure the keys are found in the dictionary
    equal(DictionaryResult.ContainsKey({ Id: 0, Dt: UnitTestFramework._DateOfTest }), true);
    equal(DictionaryResult.ContainsKey({ Id: 1, Dt: UnitTestFramework._FirstIndexDate }), true);
    equal(DictionaryResult.ContainsKey({ Id: 1, Dt: new Date() }), false);

    //grab the keys so we can check them
    var KeysResult = DictionaryResult.Keys().OrderBy(x => x.Id).ToArray();

    //check the key count
    equal(KeysResult.Count(), 2);

    //check the key Dt property values now
    equal(KeysResult[0].Dt.toString(), UnitTestFramework._DateOfTest.toString());
    equal(KeysResult[1].Dt.toString(), UnitTestFramework._FirstIndexDate.toString());

    //grab the values so we can check them
    var ValuesResult = DictionaryResult.Values();

    //do we have the correct number of values?
    equal(ValuesResult.Count(), 2);

    //check the actual values of the valueitems in the dictionary
    equal(ValuesResult[0].Txt, '0');
    equal(ValuesResult[1].Txt, '1');

    //check the counts
    equal(DictionaryResult.Count(), 2);

    //let's make sure the get all items works
    var GetAllItemsResult = DictionaryResult.GetAllItems();

    //loop through all the items in the dictionary
    for (var i = 0; i < GetAllItemsResult.length; i++) {

        //is this the first item?
        if (i === 0) {

            //check the key
            equal(GetAllItemsResult[i].Key.Dt.toString(), UnitTestFramework._DateOfTest.toString());

            //check the value
            equal(GetAllItemsResult[i].Value.Txt, "0");

        } else {

            //check the key
            equal(GetAllItemsResult[i].Key.Dt.toString(), UnitTestFramework._FirstIndexDate.toString());

            //check the value
            equal(GetAllItemsResult[i].Value.Txt, "1");
        }
    }

    //let's test the remove now
    DictionaryResult.Remove({ Id: 0, Dt: UnitTestFramework._DateOfTest });

    //now make sure we have 4 items
    equal(DictionaryResult.Count(), 1);

    //make sure the only record is what is hould be
    var OnlyRecordLeft = DictionaryResult.GetAllItems()[0];

    //check the .Id property off of the key
    equal(OnlyRecordLeft.Key.Id, 1);

    //check the .Dt property off of the key
    equal(OnlyRecordLeft.Key.Dt.toString(), UnitTestFramework._FirstIndexDate.toString());
});

//#endregion

//#region HashSet

test('JLinq.HashSet.Number.Test.1', function () {

    //just grab the ids
    var HashSetToTest = UnitTestFramework._Array.Select(x => x.Id).ToHashSet();

    //going to add another hashset so we know its instance safe
    var InstanceSafeHashSet = new ToracTechnologies.JLinq.HashSet();

    //add some items to the instance safe hashset
    equal(InstanceSafeHashSet.Add(1), true);
    equal(InstanceSafeHashSet.Add(1), false);
    equal(InstanceSafeHashSet.Add(2), true);

    //make sure we have those keys
    equal(InstanceSafeHashSet.ContainsItem(1), true);
    equal(InstanceSafeHashSet.ContainsItem(2), true);
    equal(InstanceSafeHashSet.ContainsItem(3), false);

    //check the count of how many items we have in the hashset
    equal(InstanceSafeHashSet.Count(), 2);

    //let's make sure these keys exist in the regular dictionary
    equal(HashSetToTest.ContainsItem(0), true);
    equal(HashSetToTest.ContainsItem(1), true);
    equal(HashSetToTest.ContainsItem(2), true);
    equal(HashSetToTest.ContainsItem(3), true);
    equal(HashSetToTest.ContainsItem(4), true);
    equal(HashSetToTest.ContainsItem(5), false);

    //let's go check the values in the hashset
    var ValuesResult = HashSetToTest.Values();

    //do the values match?
    equal(ValuesResult[0], 0);
    equal(ValuesResult[1], 1);
    equal(ValuesResult[2], 2);
    equal(ValuesResult[3], 3);
    equal(ValuesResult[4], 4);

    //check the counts
    equal(HashSetToTest.Count(), 5);

    //let's make sure the get all items works
    var GetAllItemsResult = HashSetToTest.Values();

    //loop through all the items in the dictionary
    for (var i = 0; i < GetAllItemsResult.length; i++) {

        //check the hashset value
        equal(GetAllItemsResult[i], i);
    }

    //remove an item
    HashSetToTest.Remove(4);

    //check the count now
    equal(HashSetToTest.Count(), 4);

    //loop through make sure it deleted the correct entry
    for (var i = 0; i < GetAllItemsResult.length; i++) {

        //check result with whatever i is
        equal(GetAllItemsResult[i], i);
    }
});

test('JLinq.HashSet.Date.Test.1', function () {

    //declare the hashset
    var HashSetToTest = UnitTestFramework._Array.Where(x => x.CreatedDate === UnitTestFramework._FirstIndexDate).Select(x => x.CreatedDate).ToHashSet();

    //make sure we only have 1 item
    equal(HashSetToTest.Count(), 1);

    //make sure we have the only item we want
    equal(HashSetToTest.ContainsItem(UnitTestFramework._FirstIndexDate), true);

    //make sure we don't have another item
    equal(HashSetToTest.ContainsItem(UnitTestFramework._DateOfTest), false);

    //make sure the current date is not in the hashset
    equal(HashSetToTest.ContainsItem(new Date()), false);

    //go grab all the items
    var ValuesResult = HashSetToTest.Values();

    //do we have 1 item?
    equal(ValuesResult.Count(), 1);

    //make sure it's the correct item
    equal(ValuesResult[0], UnitTestFramework._FirstIndexDate);

    //try to add the same item now
    equal(false, HashSetToTest.Add(UnitTestFramework._FirstIndexDate));

    //try to add another item and make sure it was added
    equal(true, HashSetToTest.Add(UnitTestFramework._DateOfTest));

    //make sure we have 2 items now
    equal(HashSetToTest.Count(), 2);

    //make sure we have the 2nd item in the hashset
    equal(HashSetToTest.ContainsItem(UnitTestFramework._DateOfTest), true);

    //now remove the first item
    HashSetToTest.Remove(UnitTestFramework._FirstIndexDate);

    //make sure we only have 1 item (the UnitTestFramework._DateOfTest)
    equal(HashSetToTest.Count(), 1);

    //now make sure we have the UnitTestFramework._DateOfTest
    equal(HashSetToTest.ContainsItem(UnitTestFramework._DateOfTest), true);

    //make sure we don't have first index date
    equal(HashSetToTest.ContainsItem(UnitTestFramework._FirstIndexDate), false);
});

test('JLinq.HashSet.MultiKeyObject.Test.1', function () {

    //we will grab id == 2 and id == 3 to grab the specific item
    var SecondIdToTest = UnitTestFramework._Array.First(x => x.Id === 2);
    var ThirdIdToTest = UnitTestFramework._Array.First(x => x.Id === 3);
    var FourthIdToTest = UnitTestFramework._Array.First(x => x.Id === 4);

    //declare the hashset
    var HashSetToTest = new ToracTechnologies.JLinq.HashSet<UnitTestFramework.ITestObject>();

    //go build the hashset
    HashSetToTest.BuildHashSet(UnitTestFramework._Array.Where(x => x.Id === 2 || x.Id === 3));

    //make sure we only have 2 items
    equal(HashSetToTest.Count(), 2);

    //make sure we have the second id
    equal(HashSetToTest.ContainsItem(SecondIdToTest), true);

    //make sure we have the third id
    equal(HashSetToTest.ContainsItem(ThirdIdToTest), true);

    //make sure we don't have another item
    equal(HashSetToTest.ContainsItem(UnitTestFramework._Array.First(x => x.Id === 4)), false);

    //go grab all the items
    var ValuesResult = HashSetToTest.Values();

    //do we have 1 item?
    equal(ValuesResult.Count(), 2);

    //make sure it's the correct item
    equal(ValuesResult[0].Id, 2);
    equal(ValuesResult[1].Id, 3);

    //try to add the same item now
    equal(false, HashSetToTest.Add(UnitTestFramework._Array.First(x => x.Id === 2)));

    //try to add another item and make sure it was added
    equal(true, HashSetToTest.Add(UnitTestFramework._Array.First(x => x.Id === 4)));

    //make sure we have 3 items now
    equal(HashSetToTest.Count(), 3);

    //make sure we have the 2nd item in the hashset
    equal(HashSetToTest.ContainsItem(SecondIdToTest), true);

    //now remove the first item
    HashSetToTest.Remove(SecondIdToTest);

    //make sure we only have 2 item (the id == 3 and id == 4)
    equal(HashSetToTest.Count(), 2);

    //now make sure we have the third id to test
    equal(HashSetToTest.ContainsItem(ThirdIdToTest), true);

    //make sure we have the fourth item to test
    equal(HashSetToTest.ContainsItem(FourthIdToTest), true);
});

test('JLinq.HashSet.Generic.Test.1', function () {

    //just make sure a hashset works off of an array
    equal(UnitTestFramework._Array.ToHashSet().Count(), UnitTestFramework._Array.Count());
});

//#endregion

//#region Order By

//#region Order By Number

test('JLinq.OrderBy.Asc.Number.Test.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._Array.OrderBy(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    for (var i = 0; i < QueryToRunResults.length; i++) {

        //just make sure the results are whatever i is
        equal(QueryToRunResults[i].Id, i);
    }

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, Index);

        //increase the tally
        Index++;
    }
});

test('JLinq.OrderBy.Asc.Number.ChainTest.1', function () {

    //go materialize the results into the result
    var QueryToRun = UnitTestFramework._Array.Select(x => x.Id).OrderBy(x => x);

    //go materialize the array
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    for (var i = 0; i < QueryToRunResults.length; i++) {

        //just make sure the results are whatever i is
        equal(QueryToRunResults[i], i);
    }

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //declare the index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem, Index);

        //increase the index
        Index++;
    }
});

test('JLinq.OrderBy.Desc.Number.Test.1', function () {

    //go materialize the results into the result
    var QueryToRun = UnitTestFramework._Array.OrderByDescending(x => x.Id);

    //go materialize the array
    var QueryToRunResults = QueryToRun.ToArray();

    //initialize to 1 so we can just subtract the length
    var IdLengthCalculator = 1;

    //go test the results
    for (var i = 0; i < QueryToRunResults.length; i++) {

        //subtract the length from the index we are up to (starting at 1)
        equal(QueryToRunResults[i].Id, QueryToRunResults.length - IdLengthCalculator);

        //increase the tally
        IdLengthCalculator++;
    }

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //reset the id
    IdLengthCalculator = 1;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //subtract the length from the index we are up to (starting at 1)
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults.length - IdLengthCalculator);

        //increase the tally
        IdLengthCalculator++;
    }
});

test('JLinq.OrderBy.Desc.Number.ChainTest.1', function () {

    //go materialize the results into the result
    var QueryToRun = UnitTestFramework._Array.Select(x => x.Id).OrderByDescending(x => x);

    //go materialize the array
    var QueryToRunResults = QueryToRun.ToArray();

    //initialize to 1 so we can just subtract the length
    var IdLengthCalculator = 1;

    //go test the results
    for (var i = 0; i < QueryToRunResults.length; i++) {

        //subtract the length from the index we are up to (starting at 1)
        equal(QueryToRunResults[i], QueryToRunResults.length - IdLengthCalculator);

        //increase the tally
        IdLengthCalculator++;
    }

    //reset the id
    IdLengthCalculator = 1;

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //subtract the length from the index we are up to (starting at 1)
        equal(CurrentResult.CurrentItem, QueryToRunResults.length - IdLengthCalculator);

        //increase the tally
        IdLengthCalculator++;
    }
});

//#endregion

//#region Order By String

test('JLinq.OrderBy.Asc.String.Test.1', function () {

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //add a random item in spot 2
    QueryToRun.splice(0, 0, { Id: 1001, Txt: 'bcd' });

    //reset the query now
    QueryToRun = QueryToRun.OrderBy(x => x.Txt);

    //go sort the array
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the items
    equal(QueryToRunResults.Last().Txt, 'bcd');
    equal(QueryToRunResults[QueryToRunResults.length - 2].Txt, 'abc');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //holds the index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //is this the guys we added after we build the array?
        if (Index === 5) {
            equal(CurrentResult.CurrentItem.Id, 1000);
        }
        else if (Index === 6) {
            equal(CurrentResult.CurrentItem.Id, 1001);
        } else {
            //just make sure the results are whatever i is
            equal(CurrentResult.CurrentItem.Id, Index);
        }

        //increase the index
        Index++;
    }
});

test('JLinq.OrderBy.Asc.String.Test.2', function () {

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

    //now go materialize the array
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the items
    equal(QueryToRunResults.Last().Txt, 'bcd');
    equal(QueryToRunResults[QueryToRunResults.length - 2].Txt, 'abc');
    equal(QueryToRunResults[QueryToRunResults.length - 3].Txt, 'ABC');


    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //holds the index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //is this the guys we added after we build the array?
        if (Index === 5) {
            equal(CurrentResult.CurrentItem.Txt, 'ABC');
        }
        else if (Index === 6) {
            equal(CurrentResult.CurrentItem.Txt, 'abc');
        } else if (Index === 7) {
            //just make sure the results are whatever i is
            equal(CurrentResult.CurrentItem.Txt, 'bcd');
        } else {
            equal(CurrentResult.CurrentItem.Txt, Index.toString());
        }

        //increase the index
        Index++;
    }
});

test('JLinq.OrderBy.Asc.String.ChainTest.1', function () {

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.splice(0, 0, { Id: 1000, Txt: 'abc' });

    //add a random item
    QueryToRun.splice(0, 0, { Id: 1001, Txt: 'bcd' });

    //reset the query
    QueryToRun = QueryToRun.Select(x => x.Txt).OrderBy(x => x);

    //go sort the array
    var QueryToRunResults = QueryToRun.ToArray();

    //is the last item bcd?
    equal(QueryToRunResults.Last(), 'bcd');
    equal(QueryToRunResults[QueryToRunResults.length - 2], 'abc');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //holds the index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //is this the guys we added after we build the array?
        if (Index === 5) {
            equal(CurrentResult.CurrentItem, 'abc');
        }
        else if (Index === 6) {
            equal(CurrentResult.CurrentItem, 'bcd');
        } else {
            equal(CurrentResult.CurrentItem, Index.toString());
        }

        //increase the index
        Index++;
    }
});

test('JLinq.OrderBy.Desc.String.Test.1', function () {

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //add a random item
    QueryToRun.push({ Id: 1001, Txt: 'bcd' });

    //go reset the query
    QueryToRun = QueryToRun.OrderByDescending(x => x.Txt);

    //go sort descending
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the values
    equal(QueryToRunResults[0].Txt, 'bcd');
    equal(QueryToRunResults[1].Txt, 'abc');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //holds the index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //validate against the array since we know the array is correct
        equal(CurrentResult.CurrentItem.Txt, QueryToRunResults[Index].Txt);

        //increase the index
        Index++;
    }
});

test('JLinq.OrderBy.Desc.String.Test.2', function () {

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

    //go sort descending
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the values
    equal(QueryToRunResults[0].Txt, 'bcd');
    equal(QueryToRunResults[1].Txt, 'abc');
    equal(QueryToRunResults[2].Txt, 'ABC');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //holds the index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //validate against the array since we know the array is correct
        equal(CurrentResult.CurrentItem.Txt, QueryToRunResults[Index].Txt);

        //increase the index
        Index++;
    }
});

test('JLinq.OrderBy.Desc.String.ChainTest.1', function () {

    //go build the query
    var QueryToRun: any = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //push a new item now
    QueryToRun.push({ Id: 1000, Txt: 'abc' });

    //add a random item
    QueryToRun.push({ Id: 1001, Txt: 'bcd' });

    //go reset the query
    QueryToRun = QueryToRun.Select(x => x.Txt).OrderByDescending(x => x);

    //go sort descending
    var QueryToRunResults = QueryToRun.ToArray();

    //test the values now
    equal(QueryToRunResults[0], 'bcd');
    equal(QueryToRunResults[1], 'abc');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.ITestObject>;

    //holds the index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //validate against the array since we know the array is correct
        equal(CurrentResult.CurrentItem.Txt, QueryToRunResults[Index].Txt);

        //increase the index
        Index++;
    }
});

//#endregion

//#region Order By Boolean

test('JLinq.OrderBy.Asc.Boolean.Test.1', function () {

    //go materialize the results into an array
    var QueryToRunResults = UnitTestFramework._Array.OrderBy(x => x.IsActive);

    //go test the results
    equal(QueryToRunResults.Last().IsActive, true);
});

test('JLinq.OrderBy.Asc.Boolean.ChainTest.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Select(x => x.IsActive).OrderBy(x => x);

    //go test the results
    equal(QueryToRun.Last(), true);
});

test('JLinq.OrderBy.Desc.Boolean.Test.1', function () {

    //go materialize the results into an array
    var QueryToRunResults = UnitTestFramework._Array.OrderBy(x => x.IsActive).ToArray();

    //go test the results
    equal(QueryToRunResults[0].IsActive, false);
});

test('JLinq.OrderBy.Desc.Boolean.ChainTest.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Select(x => x.IsActive).OrderBy(x => x).ToArray();

    //go test the results
    equal(QueryToRun[0], false);
});

//#endregion

//#region Order By Date

test('JLinq.OrderBy.Asc.Date.Test.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.OrderBy(x => x.CreatedDate).ToArray();

    equal(QueryToRun[0].CreatedDate.toString(), new Date('12/1/1980').toString());
});

test('JLinq.OrderBy.Asc.Date.ChainTest.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Select(x => x.CreatedDate).OrderBy(x => x).ToArray();

    equal(QueryToRun[0].toString(), new Date('12/1/1980').toString());
});

test('JLinq.OrderBy.Desc.Date.Test.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.OrderByDescending(x => x.CreatedDate).ToArray();

    equal(QueryToRun.Last().CreatedDate.toString(), new Date('12/1/1980').toString());
});

test('JLinq.OrderBy.Desc.Date.ChainTest.1', function () {

    //go materialize the results into an array
    var QueryToRun = UnitTestFramework._Array.Select(x => x.CreatedDate).OrderByDescending(x => x).ToArray();

    equal(QueryToRun.Last().toString(), new Date('12/1/1980').toString());
});

//#endregion

//#endregion

//#region Then By Order

test('JLinq.ThenBy.Asc.Test.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderBy(x => x.Txt).ThenBy(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[1].Id, 2);
    equal(QueryToRunResults[2].Id, 3);
    equal(QueryToRunResults[3].Id, 4);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults[Index].Id);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Asc.Test.2', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderBy(x => x.Txt).ThenByDescending(x => x.Txt2);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Id, 2);
    equal(QueryToRunResults[1].Id, 1);
    equal(QueryToRunResults[2].Id, 3);
    equal(QueryToRunResults[3].Id, 4);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults[Index].Id);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Asc.Test.3', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderBy(x => x.Txt).ThenByDescending(x => x.Txt2).ThenBy(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Id, 2);
    equal(QueryToRunResults[1].Id, 1);
    equal(QueryToRunResults[2].Id, 3);
    equal(QueryToRunResults[3].Id, 4);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults[Index].Id);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Asc.ChainTest.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderBy(x => x.Txt).ThenBy(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Id, 1);
    equal(QueryToRunResults[1].Id, 2);
    equal(QueryToRunResults[2].Id, 3);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults[Index].Id);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Asc.ChainTest.2', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderBy(x => x.Txt).ThenBy(x => x.Id).Select(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0], 1);
    equal(QueryToRunResults[1], 2);
    equal(QueryToRunResults[2], 3);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem, QueryToRunResults[Index]);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Desc.Test.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderByDescending(x => x.Txt).ThenByDescending(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Id, 4);
    equal(QueryToRunResults[1].Id, 3);
    equal(QueryToRunResults[2].Id, 2);
    equal(QueryToRunResults[3].Id, 1);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults[Index].Id);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Desc.Test.2', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderByDescending(x => x.Txt).ThenBy(x => x.Txt2);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Id, 4);
    equal(QueryToRunResults[1].Id, 3);
    equal(QueryToRunResults[2].Id, 1);
    equal(QueryToRunResults[3].Id, 2);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults[Index].Id);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Desc.Test.3', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.OrderByDescending(x => x.Txt).ThenBy(x => x.Txt2).ThenBy(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Txt, 'zzz');
    equal(QueryToRunResults[1].Txt, 'bcd');
    equal(QueryToRunResults[2].Txt, 'abc');
    equal(QueryToRunResults[3].Txt, 'abc');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Txt, QueryToRunResults[Index].Txt);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Desc.ChainTest.1', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderByDescending(x => x.Txt).ThenByDescending(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0].Id, 3);
    equal(QueryToRunResults[1].Id, 2);
    equal(QueryToRunResults[2].Id, 1);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IObject>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem.Id, QueryToRunResults[Index].Id);

        //increase the tally
        Index++;
    }
});

test('JLinq.ThenBy.Desc.ChainTest.2', function () {

    //go build the query
    var QueryToRun = UnitTestFramework._SortOrderArray.Where(x => x.Id <= 3).OrderByDescending(x => x.Txt).ThenByDescending(x => x.Id).Select(x => x.Id);

    //push the results
    var QueryToRunResults = QueryToRun.ToArray();

    //go test the results
    equal(QueryToRunResults[0], 3);
    equal(QueryToRunResults[1], 2);
    equal(QueryToRunResults[2], 1);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //holds the current index
    var Index = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //just make sure the results are whatever i is
        equal(CurrentResult.CurrentItem, QueryToRunResults[Index]);

        //increase the tally
        Index++;
    }
});

//#endregion

//#region ElementAt

test('JLinq.ElementAt.Test.1', function () {

    //*** ElementAt doens't have a lazy iterator...it just returns the element.

    //go build the query
    var ElementAt0 = UnitTestFramework._Array.ElementAt(0);
    var ElementAt1 = UnitTestFramework._Array.ElementAt(1);

    //****To-UnitTestFramework._Array Test****

    //element at 0...should be 0
    equal(ElementAt0.Id, 0);
    equal(ElementAt0.Txt, '0');

    //element at 1...should be 1
    equal(ElementAt1.Id, 1);
    equal(ElementAt1.Txt, '1');

    //element at 5...there aren't 5 elements so this should blow up. I want to run an edge case to ensure the less then and equals is working
    throws(function () {

        //go run the method that should blow up
        UnitTestFramework._Array.ElementAt(5)
    }, 'ArgumentOutOfRangeException. The size of the collection is less then the index specified. There are only ' + UnitTestFramework._Array.length + ' elements in the query.');
});

test('JLinq.ElementAt.ChainTest.1', function () {

    //*** ElementAt doens't have a lazy iterator...it just returns the element.
    //build the base query
    var BaseQuery = UnitTestFramework._Array.Where(x => x.Id > 1);

    //go build the query
    var ElementAt0 = BaseQuery.ElementAt(0);
    var ElementAt1 = BaseQuery.ElementAt(1);

    //****To-UnitTestFramework._Array Test****

    //element at 0...should be 2
    equal(ElementAt0.Id, 2);
    equal(ElementAt0.Txt, '2');

    //element at 1...should be 2
    equal(ElementAt1.Id, 3);
    equal(ElementAt1.Txt, '3');

    //element at 5...there aren't 5 elements so this should blow up. I want to run an edge case to ensure the less then and equals is working
    throws(function () {

        //go run the method that should blow up
        UnitTestFramework._Array.Where(x => x.Id > 1).ElementAt(5)
    }, 'ArgumentOutOfRangeException. The size of the collection is less then the index specified. There are only ' + BaseQuery.Count() + ' elements in the query.');
});

//#endregion

//#region ElementAtDefault

test('JLinq.ElementAtDefault.Test.1', function () {

    //*** ElementAt doens't have a lazy iterator...it just returns the element.

    //go build the query
    var ElementAtDefault0 = UnitTestFramework._Array.ElementAtDefault(0);
    var ElementAtDefault1 = UnitTestFramework._Array.ElementAtDefault(1);

    //****To-UnitTestFramework._Array Test****

    //element at 0...should be 0
    equal(ElementAtDefault0.Id, 0);
    equal(ElementAtDefault0.Txt, '0');

    //element at 1...should be 1
    equal(ElementAtDefault1.Id, 1);
    equal(ElementAtDefault1.Txt, '1');

    //element at 5...there aren't 5 elements so this should return null
    UnitTestFramework._Array.ElementAtDefault(5);
});

test('JLinq.ElementAtDefault.ChainTest.1', function () {

    //*** ElementAt doens't have a lazy iterator...it just returns the element.
    var BaseQuery = UnitTestFramework._Array.Where(x => x.Id > 1);

    //go build the query
    var ElementAtDefault0 = BaseQuery.ElementAtDefault(0);
    var ElementAtDefault1 = BaseQuery.ElementAtDefault(1);

    //****To-UnitTestFramework._Array Test****

    //element at 0...should be 2
    equal(ElementAtDefault0.Id, 2);
    equal(ElementAtDefault0.Txt, '2');

    //element at 1...should be 2
    equal(ElementAtDefault1.Id, 3);
    equal(ElementAtDefault1.Txt, '3');

    //element at 5...there aren't 5 elements so this should return null
    UnitTestFramework._Array.ElementAtDefault(5);
});

//#endregion

//#region Join

test('JLinq.Join.Test.WithOuterArray.1', function () {

    var OuterJoinData = new Array<UnitTestFramework.IJoinOuter>();

    OuterJoinData.push({ Id: 1, Description: 'NY' });
    OuterJoinData.push({ Id: 3, Description: 'NJ' });

    //test that the left get's returned when the id matches and we have more then 1 item per id
    OuterJoinData.push({ Id: 3, Description: 'DuplicateState' });

    //go build the query
    var InnerArray = UnitTestFramework._Array;

    //selector to join. seperating so its readable
    var JoinSelector: (Inner: UnitTestFramework.IObject, Outer: UnitTestFramework.IJoinOuter) => UnitTestFramework.IJoinResult = function (inner, outer) { return { Id: inner.Id, StateName: outer.Description }; };

    //go build the base query
    var QueryToRun = InnerArray.Join<UnitTestFramework.IObject, UnitTestFramework.IJoinOuter, number, UnitTestFramework.IJoinResult>(OuterJoinData, x => x.Id, y => y.Id, JoinSelector);

    //result to array
    var ResultOfQuery = QueryToRun.ToArray();

    //make sure we have 2 items that match
    equal(ResultOfQuery.length, 3);

    //test the Ny vs Nj
    equal(ResultOfQuery[0].Id, 1);
    equal(ResultOfQuery[0].StateName, 'NY');

    //test the Nj
    equal(ResultOfQuery[1].Id, 3);
    equal(ResultOfQuery[1].StateName, 'NJ');

    //test the duplicate
    equal(ResultOfQuery[2].Id, 3);
    equal(ResultOfQuery[2].StateName, 'DuplicateState');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IJoinResult>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //first item in the result set
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.StateName, 'NY');
        }

        //2nd item in the result set
        if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'NJ');
        }

        //3rd item in the result set
        if (ItemCount === 2) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'DuplicateState');
        }

        ItemCount++;
    }
});

test('JLinq.Join.ChainTest.WithOuterArray.1', function () {

    var OuterJoinData = new Array<UnitTestFramework.IJoinOuter>();

    OuterJoinData.push({ Id: 1, Description: 'NY' });
    OuterJoinData.push({ Id: 3, Description: 'NJ' });

    //test that the left get's returned when the id matches and we have more then 1 item per id
    OuterJoinData.push({ Id: 3, Description: 'DuplicateState' });

    //go build the query
    var InnerArray = UnitTestFramework._Array;

    //selector to join. seperating so its readable
    var JoinSelector: (Inner: UnitTestFramework.IObject, Outer: UnitTestFramework.IJoinOuter) => UnitTestFramework.IJoinResult = function (inner, outer) { return { Id: inner.Id, StateName: outer.Description }; };

    //go build the base query
    var QueryToRun = InnerArray.Where(x => x.Id == 3).Join<UnitTestFramework.IObject, UnitTestFramework.IJoinOuter, number, UnitTestFramework.IJoinResult>(OuterJoinData, x => x.Id, y => y.Id, JoinSelector);

    //result to array
    var ResultOfQuery = QueryToRun.ToArray();

    //make sure we have 2 items that match
    equal(ResultOfQuery.length, 2);

    //test the Nj
    equal(ResultOfQuery[0].Id, 3);
    equal(ResultOfQuery[0].StateName, 'NJ');

    equal(ResultOfQuery[1].Id, 3);
    equal(ResultOfQuery[1].StateName, 'DuplicateState');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IJoinResult>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //1st item in the result set
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'NJ');
        }

        //2nd item in the result set
        if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'DuplicateState');
        }

        ItemCount++;
    }
});

test('JLinq.Join.Test.WithOuterQuery.1', function () {

    var OuterJoinData = new Array<UnitTestFramework.IJoinOuter>();

    OuterJoinData.push({ Id: 1, Description: 'NY' });
    OuterJoinData.push({ Id: 3, Description: 'NJ' });
    OuterJoinData.push({ Id: 4, Description: 'MA' });

    //test that the left get's returned when the id matches and we have more then 1 item per id
    OuterJoinData.push({ Id: 4, Description: 'DuplicateState' });

    //go build the query
    var InnerArray = UnitTestFramework._Array;

    //selector to join. seperating so its readable
    var JoinSelector: (Inner: UnitTestFramework.IObject, Outer: UnitTestFramework.IJoinOuter) => UnitTestFramework.IJoinResult = function (inner, outer) { return { Id: inner.Id, StateName: outer.Description }; };

    //go build the base query
    var QueryToRun = InnerArray.Join<UnitTestFramework.IObject, UnitTestFramework.IJoinOuter, number, UnitTestFramework.IJoinResult>(OuterJoinData.Where(x => x.Description != 'MA'), x => x.Id, y => y.Id, JoinSelector);

    //result to array
    var ResultOfQuery = QueryToRun.ToArray();

    //make sure we have 2 items that match
    equal(ResultOfQuery.length, 3);

    //test the Ny vs Nj
    equal(ResultOfQuery[0].Id, 1);
    equal(ResultOfQuery[0].StateName, 'NY');

    //test the Nj
    equal(ResultOfQuery[1].Id, 3);
    equal(ResultOfQuery[1].StateName, 'NJ');

    //test the duplicate
    equal(ResultOfQuery[2].Id, 4);
    equal(ResultOfQuery[2].StateName, 'DuplicateState');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IJoinResult>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //first item in the result set
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.StateName, 'NY');
        }

        //2nd item in the result set
        if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'NJ');
        }

        //3rd item in the result set
        if (ItemCount === 2) {
            equal(CurrentResult.CurrentItem.Id, 4);
            equal(CurrentResult.CurrentItem.StateName, 'DuplicateState');
        }

        ItemCount++;
    }
});

test('JLinq.Join.ChainTest.WithOuterQuery.1', function () {

    var OuterJoinData = new Array<UnitTestFramework.IJoinOuter>();

    OuterJoinData.push({ Id: 1, Description: 'NY' });
    OuterJoinData.push({ Id: 3, Description: 'NJ' });
    OuterJoinData.push({ Id: 4, Description: 'MA' });

    //test that the left get's returned when the id matches and we have more then 1 item per id
    OuterJoinData.push({ Id: 4, Description: 'DuplicateState' });

    //go build the query
    var InnerArray = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //selector to join. seperating so its readable
    var JoinSelector: (Inner: UnitTestFramework.IObject, Outer: UnitTestFramework.IJoinOuter) => UnitTestFramework.IJoinResult = function (inner, outer) { return { Id: inner.Id, StateName: outer.Description }; };

    //go build the base query
    var QueryToRun = InnerArray.Where(x => x.Id == 3).Join<UnitTestFramework.IObject, UnitTestFramework.IJoinOuter, number, UnitTestFramework.IJoinResult>(OuterJoinData.Where(x => x.Description != 'MA'), x => x.Id, y => y.Id, JoinSelector);

    //result to array
    var ResultOfQuery = QueryToRun.ToArray();

    //make sure we have 2 items that match
    equal(ResultOfQuery.length, 1);

    //test the Nj
    equal(ResultOfQuery[0].Id, 3);
    equal(ResultOfQuery[0].StateName, 'NJ');

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IJoinResult>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //1st item in the result set
        if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'NJ');
        }

        //2nd item in the result set
        if (ItemCount === 2) {
            equal(CurrentResult.CurrentItem.Id, 4);
            equal(CurrentResult.CurrentItem.StateName, 'DuplicateState');
        }

        ItemCount++;
    }
});

test('JLinq.Join.Test.FunctionalWhereInnerJoinHasMultipleRecords.1', function () {

    var OuterJoinData = new Array<UnitTestFramework.IJoinOuter>();

    OuterJoinData.push({ Id: 1, Description: 'NY' });
    OuterJoinData.push({ Id: 3, Description: 'NJ' });

    //test that the left get's returned when the id matches and we have more then 1 item per id
    OuterJoinData.push({ Id: 3, Description: 'DuplicateState' });

    //go build the query
    var InnerArray = UnitTestFramework.BuildArray(UnitTestFramework._DefaultItemsToBuild);

    //add another item to make the duplicate
    InnerArray.push({
        Id: 1,
        Txt: 'InnerJoinCollectionDuplicate',
        CreatedDate: null,
        GroupByKey: null,
        GroupByKey2: null,
        IsActive: null,
        lst: null
    });

    //selector to join. seperating so its readable
    var JoinSelector: (Inner: UnitTestFramework.IObject, Outer: UnitTestFramework.IJoinOuter) => UnitTestFramework.IJoinResult = function (inner, outer) { return { Id: inner.Id, StateName: outer.Description }; };

    //go build the base query
    var QueryToRun = InnerArray.Join<UnitTestFramework.IObject, UnitTestFramework.IJoinOuter, number, UnitTestFramework.IJoinResult>(OuterJoinData, x => x.Id, y => y.Id, JoinSelector);

    //result to array
    var ResultOfQuery = QueryToRun.ToArray();

    //make sure we have 2 items that match
    equal(ResultOfQuery.length, 4);

    //test the Ny vs Nj
    equal(ResultOfQuery[0].Id, 1);
    equal(ResultOfQuery[0].StateName, 'NY');

    //test the Nj
    equal(ResultOfQuery[1].Id, 3);
    equal(ResultOfQuery[1].StateName, 'NJ');

    //test the outer duplicate
    equal(ResultOfQuery[2].Id, 3);
    equal(ResultOfQuery[2].StateName, 'DuplicateState');

    //test the inner duplicate
    equal(ResultOfQuery[3].Id, 1);
    equal(ResultOfQuery[3].StateName, 'NY'); //because the state name is taken from the outer colleciton

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<UnitTestFramework.IJoinResult>;
    var ItemCount = 0;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

        //first item in the result set
        if (ItemCount === 0) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.StateName, 'NY');
        }

        //2nd item in the result set
        if (ItemCount === 1) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'NJ');
        }

        //3rd item in the result set
        if (ItemCount === 2) {
            equal(CurrentResult.CurrentItem.Id, 3);
            equal(CurrentResult.CurrentItem.StateName, 'DuplicateState');
        }

        //4th item in the result set which is the inner duplicate
        if (ItemCount === 3) {
            equal(CurrentResult.CurrentItem.Id, 1);
            equal(CurrentResult.CurrentItem.StateName, 'NY');  //because the state name is taken from the outer colleciton
        }

        ItemCount++;
    }
});

//#endregion

//#endregion