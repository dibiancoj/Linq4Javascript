/// <reference path="qunit.d.ts"/>

//#region Configuration

/****** Notes ******/
//Every object is going to be immutable. This way we can't accIdentally add items

/*******************/

//holds the interface with the object type that is in the list that we will be querying
interface ITestObjectPerformance {
    Id: number;
    Txt: string;
    IsActive: boolean;
    GroupByKey: string;
    GroupByKey2: string;
    CreatedDate: Date;
    Property10: string;
    Property11: string;
    Property12: string;
    Property13: string;
    Property14: string;
    Property15: string;
    Property16: string;
    Property17: string;
    Property18: string;
    Property19: string;
    Property20: string;

    lst: Array<number>;
}

//method to build up the list of data
function BuildPerformanceArray(HowManyItems): Array<ITestObjectPerformance> {

    //declare the array which we will populate
    var lst: Array<ITestObjectPerformance> = new Array<ITestObjectPerformance>();

    //loop through each of the items to add an object into the list
    for (var i = 0; i < HowManyItems; i++) {

        //we will also test sub list's. so we will build a new number array insIde this object
        var SubList: Array<number>;

        //depending on which item we are up on we will populate the sub list differently
        if (i === 0) {
            SubList = null;
        }
        else if (i === 1) {
            SubList = [];
        } else {
            SubList = [i, (i + 100)];
        }

        //finally push the object to the array
        lst.push({
            Id: i,
            Txt: i.toString(),
            IsActive: (i === 1 ? true : false),
            GroupByKey: (i < 3 ? 'test' : 'test1'),
            GroupByKey2: (i < 2 ? 'z1' : 'z2'),
            CreatedDate: (i === 1 ? _FirstIndexDate : _DateOfTest),
            Property10: 'Property10',
            Property11: 'Property11',
            Property12: 'Property12',
            Property13: 'Property13',
            Property14: 'Property14',
            Property15: 'Property15',
            Property16: 'Property16',
            Property17: 'Property17',
            Property18: 'Property18',
            Property19: 'Property19',
            Property20: 'Property20',

            lst: SubList
        });
    }

    //return the list now
    return lst;
}

//method to build up the distinct method array
function BuildDistinctArray(HowManyItems): Array<ITestObjectPerformance> {

    //go build the initial array
    var TempArray: Array<ITestObjectPerformance> = BuildPerformanceArray(HowManyItems);

    //push the new values into the array
    TempArray.push(BuildPerformanceArray(1).FirstOrDefault(x => true));
    TempArray.push(BuildPerformanceArray(2).FirstOrDefault(x => true));

    //return the array
    return TempArray;
}

//method used to build up an array for the dictionary date test
function BuildDictionaryDateArray(HowManyItems): Array<ITestObjectPerformance> {
    
    //go build a custom array
    var TempArray: Array<ITestObjectPerformance> = BuildPerformanceArray(HowManyItems);

    //create a new date which is our starting point
    var StartDate: Date = new Date();

    //loop through the elements and add a month for each date
    for (var i = 0, CollectionLength = TempArray.length; i < CollectionLength; i++) {

        //set the date
        TempArray[i].CreatedDate = new Date(StartDate.getTime());

        //add a month now
        StartDate.setDate(StartDate.getDate() + 1);
    }

    //reutrn the array now
    return TempArray;
}

//default items to build
var _DefaultItemsToBuild: number = 200000;

//store the date to set so we can compare it
var _DateOfTest = Object.freeze(new Date());

//holds the index == 1 date
var _FirstIndexDate = Object.freeze(new Date('12/1/1980'));

//holds the build _Array so we don't have to keep building it each method
var _Array: Array<ITestObject> = Object.freeze(BuildPerformanceArray(_DefaultItemsToBuild));

//holds the array for the concat and union multiple array items
var _SecondaryArray: Array<ITestObject> = Object.freeze(BuildPerformanceArray(2000));

//holds the distinct array
var _DistinctTestArray: ITestObject[] = Object.freeze(BuildDistinctArray(2000));

//holds the dictionary date array
var _DictionaryDateTestArray: ITestObject[] = Object.freeze(BuildDictionaryDateArray(2000));

//#endregion 

//#region Performance Tests

//#region Group By

test('JLinq.GroupBy.PerformanceTest.StringKey.ToArray', function () {

    _Array.GroupBy(x => x.GroupByKey);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.GroupBy.PerformanceTest.ObjectKey.ToArray', function () {

    _Array.GroupBy(x => { return { Key1: x.GroupByKey, Key2: x.GroupByKey2 }; });

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Select Many

test('JLinq.SelectMany.PerformanceTest.ToArray', function () {

    _Array.SelectMany(x => x.lst).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.SelectMany.PerformanceTest.Iterator', function () {

    //this is a select many with a where before it

    //go build the query
    var QueryToRun = _Array.SelectMany(x => x.lst);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Where

test('JLinq.Where.PerformanceTest.ToArray', function () {

    _Array.Where(x => x.Id >= 15000 && x.Id < 30000).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Where.PerformanceTest.Iterator', function () {

    //go build the query
    var QueryToRun = _Array.Where(x => x.Id >= 15000 && x.Id < 30000);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<ITestObject>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Concat

test('JLinq.Concat.PerformanceTest.ToArray', function () {

    _Array.Concat(_SecondaryArray).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Concat.PerformanceTest.Iterator', function () {

    var QueryToRun = _Array.Concat(_SecondaryArray);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<ITestObject>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Concat Query

test('JLinq.ConcatQuery.PerformanceTest.ToArray', function () {

    _Array.ConcatQuery(_SecondaryArray.Where(x => true)).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.ConcatQuery.PerformanceTest.Iterator', function () {

    //go build the query
    var QueryToRun = _Array.Where(x => true).ConcatQuery(_SecondaryArray.Where(x => true));

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<ITestObject>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Union

test('JLinq.Union.PerformanceTest.ToArray', function () {

    _Array.Select(x => x.Id).Union(_SecondaryArray.Select(x => x.Id).ToArray()).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Union.PerformanceTest.Iterator', function () {

    var QueryToRun = _Array.Select(x => x.Id).ToArray().Union(_SecondaryArray.Select(x => x.Id).ToArray());

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Union Query

test('JLinq.UnionQuery.PerformanceTest.ToArray', function () {

    _Array.Select(x => x.Id).UnionQuery(_SecondaryArray.Select(x => x.Id)).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.UnionQuery.PerformanceTest.Iterator', function () {

    var QueryToRun = _Array.Select(x => x.Id).ToArray().UnionQuery(_SecondaryArray.Where(x => true).Select(x => x.Id));

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Take

test('JLinq.Take.PerformanceTest.ToArray', function () {

    _Array.Take(10000).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Take.PerformanceTest.Iterator', function () {

    var QueryToRun = _Array.Take(10000);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<ITestObject>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Skip

test('JLinq.Skip.PerformanceTest.ToArray', function () {

    _Array.Skip(15000).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Skip.PerformanceTest.Iterator', function () {

    var QueryToRun = _Array.Skip(15000);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<ITestObject>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Paginate

test('JLinq.Paginate.PerformanceTest.ToArray', function () {

    _Array.Paginate(1, 100).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Paginate.PerformanceTest.Iterator', function () {

    //go build the query make sure we have all the records
    var QueryToRun = _Array.Paginate(1, 3);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<ITestObject>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region First

test('JLinq.First.PerformanceTest.ToArray', function () {

    _Array.First(x => x.Id === 15000);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.FirstWithNoPredicate.PerformanceTest.ToArray', function () {

    _Array.Where(x => x.Id > 5000).First();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region First Or Default

test('JLinq.FirstOrDefault.PerformanceTest.ToArray', function () {

    _Array.FirstOrDefault(x => x.Id === 15000);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.FirstOrDefaultWithNoPredicate.PerformanceTest.ToArray', function () {

    _Array.Where(x => x.Id > 5000).FirstOrDefault();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Single 

test('JLinq.Single.PerformanceTest.ToArray', function () {

    _Array.Single(x => x.Id === 15000);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Single.PerformanceTest.ToArray', function () {

    _Array.Where(x => x.Id > 5000).Take(1).Single();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Single Or Default

test('JLinq.SingleOrDefault.PerformanceTest.ToArray', function () {

    _Array.SingleOrDefault(x => x.Id === 15000);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.SingleOrDefault.PerformanceTest.ToArray', function () {

    _Array.Where(x => x.Id > 5000).Take(1).SingleOrDefault();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Select

test('JLinq.Select.PerformanceTest.ToArray', function () {

    _Array.Select(function (x) { return { newId: x.Id, newTxt: x.Id + 1 }; }).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Select.PerformanceTest.Iterator', function () {

    var QueryToRun = _Array.Select(function (x) { return { newId: x.Id, newTxt: x.Id + 1 }; });

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<any>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region All

test('JLinq.All.PerformanceTest.ToArray', function () {

    _Array.All(x => x.Id < 15000);

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Any Items With No Predicate

//[Depreciated 10/6/2014] - Use Any()
test('JLinq.AnyItems.PerformanceTest.ToArray', function () {

    _Array.Any();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Any With Null Predicate - (Depreciated) - Don't Use AnyItem, Use Any()

test('JLinq.AnyWithNullPredicate.PerformanceTest.ToArray', function () {

    _Array.Any();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Any With Predicate

test('JLinq.Any.PerformanceTest.ToArray', function () {

    _Array.Any(x => x.Id > 15000);

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Last Item With No Predicate

//[Depreciated 10/6/2014] - Use Last()
test('JLinq.LastItem.PerformanceTest.ToArray', function () {

    _Array.Last();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Last With Null Predicate - (Depreciated) - Don't Use LastItem, Use Last()

test('JLinq.LastWithNullPredicate.PerformanceTest.ToArray', function () {

    _Array.Last();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Last With Where

test('JLinq.Last.PerformanceTest.ToArray', function () {

    _Array.Last(x => x.Id > 15000);

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Distinct

test('JLinq.Distinct.PerformanceTest.ToArray', function () {

    //let's build on to the default array
    var arrayToTestAgainst: ITestObject[] = _DistinctTestArray;

    arrayToTestAgainst.Distinct(x => x.Id).ToArray();

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Distinct.PerformanceTest.Iterator', function () {

    //let's build on to the default array
    var arrayToTestAgainst: ITestObject[] = _DistinctTestArray;

    //go build the query
    var QueryToRun = arrayToTestAgainst.Distinct(x => x.Id);

    //****Lazy Execution Test****
    var CurrentResult: ToracTechnologies.JLinq.IteratorResult<number>;

    //loop through the results 1 record at a time. this will never materialize an array
    while ((CurrentResult = QueryToRun.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
    }

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Min

test('JLinq.Min.PerformanceTest.ToArray', function () {

    _Array.Min();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Max

test('JLinq.Max.PerformanceTest.ToArray', function () {

    _Array.Max();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Order By

//#region Order By Number

test('JLinq.OrderBy.Asc.Number.PerformanceTest.ToArray', function () {

    _Array.OrderBy(x => x.Id);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.OrderBy.Desc.Number.PerformanceTest.ToArray()', function () {

    _Array.OrderByDescending(x => x.Id);

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Order By String

test('JLinq.OrderBy.Asc.String.PerformanceTest.ToArray', function () {

    _Array.OrderBy(x => x.Txt);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.OrderBy.Desc.String.PerformanceTest.ToArray()', function () {

    _Array.OrderByDescending(x => x.Txt);

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Order By Boolean

test('JLinq.OrderBy.Asc.Boolean.PerformanceTest.ToArray', function () {

    _Array.OrderBy(x => x.IsActive);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.OrderBy.Desc.Boolean.PerformanceTest.ToArray()', function () {

    _Array.OrderByDescending(x => x.IsActive);

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Order By Date

test('JLinq.OrderBy.Asc.Date.PerformanceTest.ToArray', function () {

    _Array.OrderBy(x => x.CreatedDate);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.OrderBy.Desc.Date.PerformanceTest.ToArray()', function () {

    _Array.OrderByDescending(x => x.CreatedDate);

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#endregion

//#region Sum

test('JLinq.Sum.PerformanceTest.ToArray', function () {

    _Array.Select(x => x.Id).Sum();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Count

test('JLinq.Count.PerformanceTest.ToArray', function () {

    _Array.Where(x => x.Id >= 15000).Count();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region Average

test('JLinq.Average.PerformanceTest.ToArray', function () {

    _Array.Select(x => x.Id).Average();

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#region To Dictionary

test('JLinq.Dictionary.Number.PerformanceTest.ToDictionary', function () {

    _DictionaryDateTestArray.ToDictionary(x => x.Id);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Dictionary.Date.PerformanceTest.ToDictionary', function () {

    //go run the custom array for this
    _DictionaryDateTestArray.ToDictionary(x => x.CreatedDate);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Dictionary.Boolean.PerformanceTest.ToDictionary', function () {

    _DictionaryDateTestArray.Take(1).ToDictionary(x => x.IsActive);

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Dictionary.MultiKeyObject.PerformanceTest.ToDictionary', function () {

    //push the list to a dictionary
    _DictionaryDateTestArray.ToDictionary(x => { return { Id: x.Id, Active: x.IsActive }; });

    //need atleast 1 test 
    equal(1, 1);
});

test('JLinq.Dictionary.MultiKeyObjectWithDate.PerformanceTest.ToDictionary', function () {

    //push the list to a dictionary
    _DictionaryDateTestArray.ToDictionary(x => { return { Id: x.Id, Dt: x.CreatedDate }; });

    //need atleast 1 test 
    equal(1, 1);
});

//#endregion

//#endregion