//********************************Torac Technologies***************************************
//Description: Linq Style Methods In Javascript To Manipulate Collections                 *
//Release Date: 10/17/2013                                                                *
//Current Version: 3.0.5                                                                  *
//Release History In JLinqChangeLog.txt                                                   *
//*****************************************************************************************
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//* Change Log Is In It's Own Text File. I want to keep the js file as small as possible
//for node.js configuration
//For Node.js just use a require statement.This will allow access to the extension methods off of the array.Every array will have access to the methods of Linq4Javascript.JLinq is the file name where the Linq4Javascript code is in. If you change the file name then update this.The./ is set because it is in the root folder of the project.
//var linq = require('./JLinq');
//end of node.js configuration
/*Example of how to call this
  var queryable = array.Where(function (x) { return x.id > 1; }).Where(function (x) { return x.id == 2 || x.id == 3; }).Take(1);

  -lazy load option (more memory efficient if you have a large result set)
  var Result;
        (we need !== null because if you are doing a distinct with numbers, if a 0 gets passed back it won't loop through that item because it evaulates to false)
        while ((Result = queryable.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
            alert(Result.CurrentItem.id);
        }

        //only use this if you plan to re-run the query (this reset's the iterator)
        queryable.ResetQuery();
  
  -materialize the array now using queryable.ToArray(); (uses more memory if you have a large result set)
        No need to ResetQuery on this because it automatically does it
*/
/* Async Sample:
    var query = UnitTestFramework._Array.Where(x => x.Id == 1 || x.Id == 2);

    var runQuery = query.ToArrayAsync(function(result)
                                      {
                                            //do something with the result array
                                      }, function(errorMessageObject){
                                            //do something if there is an error. Web worker produces silent error without handler
                                      }, 'http://MyWebSite/Scripts/JLinq.js');
*/
var ToracTechnologies;
(function (ToracTechnologies) {
    var JLinq;
    (function (JLinq) {
        //#region Iterator Class
        //Class is used to throw the methods on a common class that we can inherit from
        var Iterator = /** @class */ (function () {
            function Iterator() {
            }
            //#endregion
            //#region Linq Functionality Methods
            //selects the items that meet the predicate criteria
            Iterator.prototype.Where = function (WhereClauseSelector) {
                return new WhereIterator(this, WhereClauseSelector);
            };
            //grabs the first item (error if not found) that meet the predicate criteria
            Iterator.prototype.First = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new FirstOrDefaultIterator(this, 'FirstIterator', WhereClauseSelector).Next().CurrentItem;
                //if it's null then throw an error
                if (ResultOfQuery == null) {
                    throw "Can't Find First Item. Query Returned 0 Rows";
                }
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //grabs the first item (null if not found) that meet the predicate criteria
            Iterator.prototype.FirstOrDefault = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new FirstOrDefaultIterator(this, 'FirstOrDefaultIterator', WhereClauseSelector).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //grabs the only item (error if not found) that meet the predicate criteria
            Iterator.prototype.Single = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new SingleOrDefaultIterator(this, 'SingleIterator', WhereClauseSelector).Next().CurrentItem;
                //if it's null then throw an error
                if (ResultOfQuery == null) {
                    throw "Can't Find A Single Item. Query Returned 0 Rows";
                }
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //grabs the first item (null if not found) that meet the predicate criteria
            Iterator.prototype.SingleOrDefault = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new SingleOrDefaultIterator(this, 'SingleOrDefaultIterator', WhereClauseSelector).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //selects a new object type from the object of T Passed in
            Iterator.prototype.Select = function (SelectCreatorPredicate) {
                return new SelectIterator(this, SelectCreatorPredicate);
            };
            //selects a collection in T...then flattens it out and returns the new object type you want to create
            Iterator.prototype.SelectMany = function (CollectionPropertySelector) {
                return new SelectManyIterator(this, CollectionPropertySelector);
            };
            //grabs the distinct property values that are found from the list
            Iterator.prototype.Distinct = function (PropertySelector) {
                return new DistinctIterator(this, PropertySelector);
            };
            //takes the number of elements and returns them
            Iterator.prototype.Take = function (HowManyToTake) {
                //return the x number of items and return it
                return new TakeIterator(this, HowManyToTake);
            };
            //will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression
            Iterator.prototype.TakeWhile = function (PredicateToTakeWhile) {
                //return the x number of items and return it
                return new TakeWhileIterator(this, PredicateToTakeWhile);
            };
            //skips x about of items and returns the rst
            Iterator.prototype.Skip = function (HowManyToSkip) {
                //return the x number of items and return it
                return new SkipIterator(this, HowManyToSkip);
            };
            //will Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. "Where" will return everything that meet the condition. SkipWhile will find the first element where the condition is met, and return the rest of the elements
            Iterator.prototype.SkipWhile = function (PredicateToSkipUntil) {
                //return the x number of items and return it
                return new SkipWhileIterator(this, PredicateToSkipUntil);
            };
            //creates a running total "T" then passes it in for each element
            Iterator.prototype.Aggregate = function (AggregatePredicate) {
                //grab the result
                var ResultOfQuery = new AggregateIterator(this, AggregatePredicate).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //makes sure all elements match the predicate. Returns if they all are successful in the predicate
            Iterator.prototype.All = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new AllIterator(this, WhereClauseSelector).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //determines there are any items that meet the predicate passed in (shared between this and AnyItem [which is any with no predicate])
            Iterator.prototype.Any = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new AnyIterator(this, WhereClauseSelector).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //grab the last item in the data source (shared between this and LastItem [which is just the last item in the collection])
            Iterator.prototype.Last = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new LastIterator(this, WhereClauseSelector).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //go setup the iterator to concat a iterator and an array
            Iterator.prototype.Concat = function (ArrayOrIteratorToCombine) {
                //iterator to convert into
                var ConvertToIterator;
                //if this is not a iterator...convert it\
                if (this.IsIterator(ArrayOrIteratorToCombine)) {
                    ConvertToIterator = ArrayOrIteratorToCombine;
                }
                else {
                    ConvertToIterator = new Queryable(ArrayOrIteratorToCombine);
                }
                //just return the concat iterator
                return new ConcatIterator(this, 'ConcatArrayOrQueryIterator', ConvertToIterator);
            };
            //go setup the iterator to union a iterator and an array
            Iterator.prototype.Union = function (ArrayOrIteratorToCombine) {
                //iterator to convert into
                var ConvertToIterator;
                //if this is not a iterator...convert it\
                if (this.IsIterator(ArrayOrIteratorToCombine)) {
                    ConvertToIterator = ArrayOrIteratorToCombine;
                }
                else {
                    ConvertToIterator = new Queryable(ArrayOrIteratorToCombine);
                }
                //just return the union iterator
                return new UnionIterator(this, 'UnionArrayOrQueryIterator', ConvertToIterator);
            };
            //counts the number of items that match the predicate
            Iterator.prototype.Count = function (WhereClauseSelector) {
                //grab the result
                var ResultOfQuery = new CountIterator(this, WhereClauseSelector).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //grabs the smallest number in the data source
            Iterator.prototype.Min = function () {
                //grab the result
                var ResultOfQuery = new MinIterator(this).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //grabs the largest number in the data source
            Iterator.prototype.Max = function () {
                //grab the result
                var ResultOfQuery = new MaxIterator(this).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //calculates the sum of the data source
            Iterator.prototype.Sum = function () {
                //grab the result
                var ResultOfQuery = new SumIterator(this).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //calculates the avg of the data source (this will ignore nulls and skip right over them)
            Iterator.prototype.Average = function () {
                //grab the result
                var ResultOfQuery = new AverageIterator(this).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //group the data source 
            Iterator.prototype.GroupBy = function (GroupBySelector) {
                //grab the result
                var ResultOfQuery = new GroupIterator(this, GroupBySelector).Next().CurrentItem;
                //reset the iterator
                this.ResetQuery();
                //now return the result
                return ResultOfQuery;
            };
            //creates a dictionary from the data source
            Iterator.prototype.ToDictionary = function (KeySelector) {
                //create the dictionary which we will build and return
                var DictionaryToReturn = new Dictionary();
                //go build the dictionary off of the iterator
                DictionaryToReturn.BuildDictionary(this, KeySelector);
                //return the dictionary now
                return DictionaryToReturn;
            };
            //creates a hashset from the data source
            Iterator.prototype.ToHashSet = function () {
                //create the hashset which we will build and return
                var HashSetToReturn = new HashSet();
                //go build the hashset off of the iterator
                HashSetToReturn.BuildHashSet(this);
                //return the hashset now
                return HashSetToReturn;
            };
            //paginates the data
            Iterator.prototype.Paginate = function (CurrentPageNumber, HowManyRecordsPerPage) {
                //just make sure we have a current page number and how many records in a valid range
                if (CurrentPageNumber < 1) {
                    //we can't have a page number less then 1 so throw an error
                    throw 'Current Page Number Has To Be Greater Than 0';
                }
                //make sure how many records per page is greater than 0
                if (HowManyRecordsPerPage < 1) {
                    //we can't have less then 1 record on a page so throw an error
                    throw 'How Many Records Per Page Has To Be Greater Than 0';
                }
                //go skip x amount of pages and only take however amount of records you want on a page. 
                return new SkipIterator(this, ((CurrentPageNumber - 1) * HowManyRecordsPerPage)).Take(HowManyRecordsPerPage);
            };
            //order by from data source
            Iterator.prototype.OrderBy = function (SortPropertySelector) {
                //go build the iterator (which is really lazy loaded, its more to give them the order "then by" functionality
                return new OrderByIterator(this, SortOrder.Ascending, SortPropertySelector, null);
            };
            //order by descending from the data source
            Iterator.prototype.OrderByDescending = function (SortPropertySelector) {
                //go build the iterator (which is really lazy loaded, its more to give them the order "then by" functionality
                return new OrderByIterator(this, SortOrder.Descending, SortPropertySelector, null);
            };
            //#region Element At Functionality
            //find an element at a specific index. Mainly added for when you have an iterator and want to find a specific index. Will throw an error if count of elements in higher then the Index passed in
            Iterator.prototype.ElementAt = function (Index) {
                //go find the result of the search
                var ResultOfSearch = this.ElementAtHelper(Index);
                //did we find a element that matches?
                if (ResultOfSearch.FoundElement) {
                    //return the found element
                    return ResultOfSearch.ElementFound;
                }
                //we never found it...exit the method
                throw ElementAtHelperResult.GenerateErrorMessage(ResultOfSearch.NumberOfElementsInQuery);
            };
            //find an element at a specific index. Mainly added for when you have an iterator and want to find a specific index. Will return null if count of elements in higher then the Index passed in
            Iterator.prototype.ElementAtDefault = function (Index) {
                //go find the result of the search
                var ResultOfSearch = this.ElementAtHelper(Index);
                //did we find a element that matches?
                if (ResultOfSearch.FoundElement) {
                    //return the found element
                    return ResultOfSearch.ElementFound;
                }
                //we never found it...return null
                return null;
            };
            Iterator.prototype.ElementAtHelper = function (Index) {
                //we want to prevent null meaning more then 1 thing. ie: not found versus a null object was found in that element. That is why we return ElementAtHelperResult
                //current record
                var CurrentRecord;
                //number we are currently on
                var Tally = 0;
                //keep looping through
                while ((CurrentRecord = this.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
                    //index we are looking for?
                    if (Tally === Index) {
                        //reset the iterator before we return
                        this.ResetQuery();
                        //exit the method and return what we have
                        return ElementAtHelperResult.ElementWasFound(CurrentRecord.CurrentItem);
                    }
                    //increase the tally
                    Tally++;
                }
                //reset the iterator
                this.ResetQuery();
                //now element found (returning null)
                return ElementAtHelperResult.ElementWasNotFound(Tally);
            };
            //#endregion
            //join 2 recordsets where the property selector matches on both collections
            Iterator.prototype.Join = function (OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector) {
                //iterator to convert into
                var ConvertToIterator;
                //if this is not a iterator...convert it\
                if (this.IsIterator(OuterJoinArray)) {
                    ConvertToIterator = OuterJoinArray;
                }
                else {
                    ConvertToIterator = new Queryable(OuterJoinArray);
                }
                return new JoinIterator(this, ConvertToIterator, InnerKeySelector, OuterKeySelector, JoinSelector);
            };
            //join 2 recordsets where the property selector matches on both collections. The outer table returns the collection in the result selector
            Iterator.prototype.GroupJoin = function (OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector) {
                //iterator to convert into
                var ConvertToIterator;
                //if this is not a iterator...convert it\
                if (this.IsIterator(OuterJoinArray)) {
                    ConvertToIterator = OuterJoinArray;
                }
                else {
                    ConvertToIterator = new Queryable(OuterJoinArray);
                }
                return new GroupJoinIterator(this, ConvertToIterator, InnerKeySelector, OuterKeySelector, JoinSelector);
            };
            //returns the default value of T if no items exists. If T is a class it will return null. If T is a number it will return 0. bool will return false, etc.
            Iterator.prototype.DefaultIfEmpty = function (DefaultValue) {
                return new DefaultIfEmptyIterator(this, DefaultValue);
            };
            //#endregion
            //#region Public Non Linq Iterator Functionality Methods
            //materializes the expression to an array
            Iterator.prototype.ToArray = function () {
                //go reset the iterator. incase they do a while...then they are calling ToArray()
                this.ResetQuery();
                //declare the array to return
                var ArrayToBeReturned = new Array();
                //holds the item we are currently up to
                var CurrentItem;
                //loop through the array until we are done (the last call to next will reset the iterator for the next calls)
                while ((CurrentItem = this.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
                    //add the item to the array
                    ArrayToBeReturned.push(CurrentItem.CurrentItem);
                }
                //go traverse the tree and reset the iterator for each call in the chain
                this.ResetQuery();
                //return the array now
                return ArrayToBeReturned;
            };
            //materializes the expression to an array in a web worker so it doesn't feeze the ui. if a web worker is not available it will just call the ToArray()
            Iterator.prototype.ToArrayAsync = function (CallBackWhenQueryIsComplete, OnErrorCallBack, JLinqJsUrlPath, IsAsyncAvailable) {
                //can we use async?
                var CanWeUseAsync;
                //did we cache the AsyncIsAvailable yet?
                if (Iterator.AsyncIsAvailable == null) {
                    //we need to go grab the value and cache it
                    Iterator.AsyncIsAvailable = Iterator.AsyncIsAvailableCheck(JLinqJsUrlPath);
                }
                //did they pass it in?
                if (IsAsyncAvailable == null) {
                    //use the jlinq implementation
                    CanWeUseAsync = Iterator.AsyncIsAvailable;
                }
                else {
                    //use whatever the user wants (if they want there own logic
                    CanWeUseAsync = IsAsyncAvailable;
                }
                //web worker to run
                var WorkerToRun = null;
                //let's try to build the worker. This should already be good. Incase there are any reason's why (even after AsyncIsAvailable tried to do this)...to is a double check
                try {
                    //try to build the web worker.
                    WorkerToRun = Iterator.BuildWebWorker(JLinqJsUrlPath);
                }
                catch (e) {
                    //flip the flag back
                    CanWeUseAsync = false;
                }
                //is the browser new enough to run web webworkers?
                if (CanWeUseAsync) {
                    // Yes! Web worker support!
                    //attach the event handler
                    WorkerToRun.addEventListener('message', function (e) {
                        //we are all done. go tell the user that the data is done with the callback
                        CallBackWhenQueryIsComplete(e.data);
                        //i'm going to cleanup after we run this call. I don't know how useful it is to keep it listening
                        WorkerToRun.terminate();
                        //going to null it out just for good sake
                        WorkerToRun = null;
                    }, false);
                    //add the on error event handler
                    WorkerToRun.addEventListener("error", function (e) {
                        //we are going to grab the error and pass it along, so we can cleanup the web worker
                        OnErrorCallBack(e);
                        //i'm going to cleanup after we run this call. I don't know how useful it is to keep it listening
                        WorkerToRun.terminate();
                        //going to null it out just for good sake
                        WorkerToRun = null;
                    }, false);
                    //we need to go grab all the methods and push them to a string so we can rebuild it in the web worker. ie. Where => convert the Where method the dev passes in.
                    WorkerToRun.postMessage({ Parameters: JSON.stringify(Iterator.SerializeAsyncFuncToStringTree(this)) });
                }
                else {
                    // No Web Worker support.. just return the data
                    CallBackWhenQueryIsComplete(this.ToArray());
                }
            };
            //if you traverse the results (not calling ToArray()). we need to reset all the variables if you want to run the query again. this will do it
            //ToArray() automatically resets this
            Iterator.prototype.ResetQuery = function () {
                //go reset the iterator
                ResetIterator(this);
            };
            //serializes a method to a string. So pass in x => x.Id;...will return the function in a string (serialized function)
            Iterator.prototype.SerializeMethod = function (MethodToSerialize) {
                //if we don't have any methods, then just return a blank string
                if (MethodToSerialize == null) {
                    return '';
                }
                else {
                    //we have a method, pusing toString() will return the string representation of the method
                    return MethodToSerialize.toString();
                }
            };
            //#endregion
            //#region Public Static Methods
            //builds the web worker without having to declare an external script page
            Iterator.BuildWebWorker = function (JLinqJsUrlPath) {
                //we need to pass in the path incase they use bundling. We have no way of saying JLinq is in this bundle (because the names may not be JLinq.ts)
                //did we already build the web worker?
                if (Iterator.WebWorkerBlobToCache == null) {
                    //let's build the function text now
                    var FunctionScript = "self.addEventListener('message', function(e) { \n" +
                        //let's import the jlinq library
                        " importScripts('" + JLinqJsUrlPath + "') \n" +
                        //let's go parse the json which is the query
                        " var Query = JSON.parse(e.data.Parameters); \n" +
                        //let's rebuild the tree
                        " var TreeRebuilt = ToracTechnologies.JLinq.RebuildTree(Query); \n" +
                        //go build up the results and pass back the array
                        " self.postMessage(TreeRebuilt.ToArray()); }, false);";
                    //go set the blob...
                    this.WebWorkerBlobToCache = new Blob([FunctionScript]);
                }
                //go build the worker and return it
                return new Worker(URL.createObjectURL(this.WebWorkerBlobToCache));
            };
            //check if the browser supports web workers
            Iterator.AsyncIsAvailableCheck = function (JLinqJsUrlPath) {
                //do we have a web worker?
                if (typeof (Worker) !== 'undefined') {
                    //we have a web worker...we need to make sure we can create a blob into a web worker now
                    //IE 10 has issues with creating a web worker from a blob. So we need to check that and we can create a web worker
                    try {
                        //try to build the web worker.
                        Iterator.BuildWebWorker(JLinqJsUrlPath);
                        //we can build the web worker, return true
                        return true;
                    }
                    catch (e) {
                        //we aren't able to create the web worker so return false
                        return false;
                    }
                }
                //fall back to false
                return false;
            };
            //builds an async tree from an iterator. Re-builds the entire tree by adding the methods it needs to run the query. (methods don't serialize)
            Iterator.BuildAsyncTree = function (Query) {
                //flatten the tree
                var FlatTree = Iterator.ChainableTreeWalker(Query);
                //loop through the tree
                for (var i = 0, len = FlatTree.length; i < len; i++) {
                    //grab the current item
                    var CurrentLevelOfTree = FlatTree[i];
                    //set the serialized info
                    CurrentLevelOfTree.AsyncSerialized = CurrentLevelOfTree.AsyncSerializedFunc();
                }
                //we have a built up query with serialized methods, go return it
                return Query;
            };
            //pushes the query chain to an array
            Iterator.ChainableTreeWalker = function (Query) {
                //declare the array we are going to return
                var IChainablesToReturn = new Array();
                //declare the current query's previous expres
                var PreviousLambdaExpression = null;
                //add the query object
                if (Query != null) {
                    //the query is not null, so it add it
                    IChainablesToReturn.push(Query);
                    //now set the previous expression
                    PreviousLambdaExpression = Query.PreviousExpression;
                }
                //loop until we get to the end
                while (PreviousLambdaExpression != null && PreviousLambdaExpression.PreviousExpression != null) {
                    //throw the variable into the array
                    IChainablesToReturn.push(PreviousLambdaExpression);
                    //grab the next collection source
                    PreviousLambdaExpression = PreviousLambdaExpression.PreviousExpression;
                }
                //return the array now
                return IChainablesToReturn;
            };
            //serialize the func 
            Iterator.SerializeAsyncFuncToStringTree = function (Query) {
                //flatten the tree
                var FlatTree = Iterator.ChainableTreeWalker(Query);
                //loop through the tree
                for (var i = 0, len = FlatTree.length; i < len; i++) {
                    //grab the current item
                    var CurrentLevelOfTree = FlatTree[i];
                    //set the serialized info
                    CurrentLevelOfTree.AsyncSerialized = CurrentLevelOfTree.AsyncSerializedFunc();
                }
                //we have a built up query with serialized methods, go return it
                return Query;
            };
            //make a function from a string
            Iterator.StringToCompiledMethod = function (MethodCode) {
                if (MethodCode == null || MethodCode.length === 0) {
                    return null;
                }
                return eval("(" + MethodCode + ")");
            };
            //#endregion
            //#region Private Methods
            //Is this an array? used for type guards
            Iterator.prototype.IsIterator = function (thingToCheck) {
                return thingToCheck.ToArray !== undefined;
            };
            //we are going to cache the jlinq blob
            Iterator.WebWorkerBlobToCache = null;
            //go check if async is available (this gets cached on first call to ArrayAsync)
            Iterator.AsyncIsAvailable = null;
            return Iterator;
        }());
        JLinq.Iterator = Iterator;
        //#endregion
        //#region Iterator Re-Setting
        //reset's the chain of expressions so we can iterate through it again if we need too
        function ResetIterator(Expression) {
            //reset this iterator
            Expression.ResetIterator();
            //holds the working previous lambda expression
            //if we are coming from ToDictionary the root could be queryable...so we check that we have a previous expression
            //if (Expression.PreviousExpression != null) {
            //grab the queryable's next expression
            var PreviousLambdaExpression = Expression.PreviousExpression;
            //}
            //loop until we get to the queryable
            while (PreviousLambdaExpression != null && PreviousLambdaExpression.PreviousExpression != null) {
                //let's go call the reset Iterator on each method
                PreviousLambdaExpression.ResetIterator();
                //grab the next collection source
                PreviousLambdaExpression = PreviousLambdaExpression.PreviousExpression;
            }
            //check to see if its not null (base could be iqueryable)
            if (PreviousLambdaExpression != null) {
                //we should be at the queryable...so reset this queryable now
                PreviousLambdaExpression.ResetIterator();
            }
        }
        //#endregion
        //#region Enums
        var SortOrder;
        (function (SortOrder) {
            SortOrder[SortOrder["Ascending"] = 0] = "Ascending";
            SortOrder[SortOrder["Descending"] = 1] = "Descending";
        })(SortOrder = JLinq.SortOrder || (JLinq.SortOrder = {}));
        //#endregion
        //#region Key Value Pair Object
        //key value pair
        var KeyValuePair = /** @class */ (function () {
            //#region Constructor
            function KeyValuePair(KeyToSet, ValueToSet) {
                //set the key
                this.Key = KeyToSet;
                //set the value
                this.Value = ValueToSet;
            }
            return KeyValuePair;
        }());
        JLinq.KeyValuePair = KeyValuePair;
        //#endregion
        //#region Callback Iterator
        //allows you to create a callback iterator using a callback function. Currently not used, because you tend to cache this and use closures, so it will be slower. Leaving it in here incase I ever need it
        var CallbackIterator = /** @class */ (function () {
            //#region Documentation
            //Example Of How To Use This
            //var CurrentDictionary = this;
            //this.PrivateGetDictionaryKeys(function (KeyValue: TKey) {
            //    //add the key to the list to be returned
            //    ValuesToReturn.push(CurrentDictionary.GetItem(KeyValue));
            //}).ExecuteResults();
            //private PrivateGetDictionaryKeys(CallBackMethodForEachKey: (KeyItem: TKey) => any): CallbackIterator<TKey> {
            //    //cache the dictionary so we have access to it when we go build the results
            //    var DictionaryToCache = this;
            //    //create the dynamic iterator and return it
            //    return new DynamicIterator<TKey>(CallBackMethodForEachKey, function () {
            //        //loop through each dictionary item
            //        for (var thisKey in DictionaryToCache.InternalDictionary) {
            //            //since keys are stored as strings / properties, we need to cast it back to the TKey Data Type
            //            CallBackMethodForEachKey(DictionaryToCache.ConvertKeyToTKeyDataType(thisKey));
            //        }
            //    });
            //}
            //#endregion
            //#region Constructor
            function CallbackIterator(EachItemCallBack, CollectionResultExecution) {
                //set the callback method. For each item which is found it will call the call back so the calling function can grab it
                this.ForEachItemCallBack = EachItemCallBack;
                //this method will do whatever and return the result
                this.ExecuteResults = CollectionResultExecution;
            }
            return CallbackIterator;
        }());
        JLinq.CallbackIterator = CallbackIterator;
        //#endregion
        //#region Iterator Result
        //holds the status of an iterator
        var IteratorStatus;
        (function (IteratorStatus) {
            IteratorStatus[IteratorStatus["NotYetStarted"] = 0] = "NotYetStarted";
            IteratorStatus[IteratorStatus["Running"] = 1] = "Running";
            IteratorStatus[IteratorStatus["Completed"] = 2] = "Completed";
        })(IteratorStatus = JLinq.IteratorStatus || (JLinq.IteratorStatus = {}));
        //holds the result of iterating through 1 element in an iterator
        var IteratorResult = /** @class */ (function () {
            //#region Constructor
            function IteratorResult(CurrentItemToSet, IteratorRunningStatus) {
                //set the return value
                this.CurrentItem = CurrentItemToSet;
                //set the current status
                this.CurrentStatus = IteratorRunningStatus;
            }
            return IteratorResult;
        }());
        JLinq.IteratorResult = IteratorResult;
        //#endregion
        //#region ElementAtHelperResult
        //result of the ElementAtHelper Method. Need multiple values to be returned from a method
        var ElementAtHelperResult = /** @class */ (function () {
            function ElementAtHelperResult() {
            }
            ElementAtHelperResult.ElementWasFound = function (ElementFoundItem) {
                var model = new ElementAtHelperResult();
                model.FoundElement = true;
                model.ElementFound = ElementFoundItem;
                return model;
            };
            ElementAtHelperResult.ElementWasNotFound = function (NumberOfElementsSearched) {
                var model = new ElementAtHelperResult();
                model.FoundElement = false;
                model.ElementFound = null;
                model.NumberOfElementsInQuery = NumberOfElementsSearched;
                return model;
            };
            ElementAtHelperResult.GenerateErrorMessage = function (NumberOfElementsSearched) {
                return 'ArgumentOutOfRangeException. The size of the collection is less then the index specified. There are only ' + NumberOfElementsSearched + ' elements in the query.';
            };
            return ElementAtHelperResult;
        }());
        JLinq.ElementAtHelperResult = ElementAtHelperResult;
        //#endregion
        //#region Queryable Class
        //Class used to turn a collection into something we can chain together with all the Iterator methods
        var Queryable = /** @class */ (function (_super) {
            __extends(Queryable, _super);
            //#region Constructor
            function Queryable(Collection) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //throw the collection into a variable
                _this.CollectionSource = Collection;
                //we always loop backwards from the length to 0...so set the index to the array length
                _this.Index = 0;
                //let's store the collection source so we have it without going to the array (is length a property or method on javascript array)
                _this.CollectionLength = _this.CollectionSource.length;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "Queryable";
                return _this;
            }
            //#endregion
            //#region Methods
            Queryable.prototype.ResetIterator = function () {
                //reset the index
                this.Index = 0;
            };
            //moves root of the query to the next available item
            Queryable.prototype.Next = function () {
                //are we at the end of the array?
                if (this.Index === this.CollectionLength) {
                    //let's return a null to kill the loop...
                    return new IteratorResult(null, IteratorStatus.Completed);
                }
                else {
                    //grab the next item in the collection and increment the index
                    return new IteratorResult(this.CollectionSource[this.Index++], IteratorStatus.Running);
                }
            };
            Queryable.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            return Queryable;
        }(Iterator));
        JLinq.Queryable = Queryable;
        //#endregion
        //#region Linq Functionality Classes
        //Class is used to implement the Where Method Iterator
        var DefaultIfEmptyIterator = /** @class */ (function (_super) {
            __extends(DefaultIfEmptyIterator, _super);
            //#region Constructor
            function DefaultIfEmptyIterator(PreviousLambdaExpression, DefaultElementIfEmpty) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                _this.HasFirstItem = null;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the default element if the collection before is empty
                _this.DefaultElementWhenEmpty = DefaultElementIfEmpty;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "DefaultIfEmptyIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            DefaultIfEmptyIterator.prototype.ResetIterator = function () {
                this.HasFirstItem = null;
            };
            DefaultIfEmptyIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //if we have already set it to false we are done
                    if (this.HasFirstItem != null && !this.HasFirstItem) {
                        return new IteratorResult(null, IteratorStatus.Completed);
                    }
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    //if it doesnt match the filter then we just keep going in the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed && !this.HasFirstItem) {
                        //flip the flag to false so when we come back we know we are done
                        this.HasFirstItem = false;
                        //otherwise return what they passed in
                        return new IteratorResult(this.DefaultElementWhenEmpty, IteratorStatus.Running);
                    }
                    else if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we found this guy so return it...after we return this method we will jump a level to the next level down the tree
                        return NextItem;
                    }
                    else if (this.HasFirstItem == null) {
                        //set that we have an item
                        this.HasFirstItem = true;
                        //return the item now
                        return NextItem;
                    }
                    else {
                        //has items...so just return it
                        return NextItem;
                    }
                }
            };
            DefaultIfEmptyIterator.prototype.AsyncSerializedFunc = function () {
                throw 'DefaultIfEmpty Method Not Supported In Async Mode';
            };
            return DefaultIfEmptyIterator;
        }(Iterator));
        JLinq.DefaultIfEmptyIterator = DefaultIfEmptyIterator;
        //Class is used to implement the join method iterator. Used to essentially build a database join type iterator
        var JoinIterator = /** @class */ (function (_super) {
            __extends(JoinIterator, _super);
            //#region Constructor
            function JoinIterator(PreviousLambdaExpression, OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //i believe pushing the outer to an array is more efficient since this will be used loop after loop. This way after there is a where with a group by...we won't have to run that each time. Its going to be tough to say which one is more efficient
                _this.OuterJoinArray = OuterJoinArray.ToArray();
                _this.InnerKeyFuncSelector = InnerKeySelector;
                _this.OuterKeyFuncSelector = OuterKeySelector;
                _this.JoinFuncSelector = JoinSelector;
                //create a new array so we don't have to deal with a null array
                _this.Matches = new Array();
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "JoinIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            JoinIterator.prototype.ResetIterator = function () {
                //reset the match array
                this.Matches = new Array();
            };
            JoinIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //loop through the matches and return it
                    if (this.Matches.length > 0) {
                        return new IteratorResult(this.Matches.shift(), IteratorStatus.Running);
                    }
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //are we done with the inner data set?
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //just return the item so we can be done
                        return new IteratorResult(null, IteratorStatus.Completed);
                    }
                    else {
                        //loop through all the outers and if we have a match then we need to return it
                        for (var i = 0; i < this.OuterJoinArray.length; i++) {
                            //throw the current item into a variable
                            var CurrentItem = this.OuterJoinArray[i];
                            //do we have a match if we try to match the properties?
                            if (this.InnerKeyFuncSelector(NextItem.CurrentItem) == this.OuterKeyFuncSelector(CurrentItem)) {
                                //we have a match...add it to the array
                                this.Matches.push(this.JoinFuncSelector(NextItem.CurrentItem, CurrentItem));
                            }
                        }
                    }
                }
            };
            JoinIterator.prototype.AsyncSerializedFunc = function () {
                throw 'Join Method Not Supported In Async Mode';
            };
            return JoinIterator;
        }(Iterator));
        JLinq.JoinIterator = JoinIterator;
        //Class is used to implement the group join method iterator.
        var GroupJoinIterator = /** @class */ (function (_super) {
            __extends(GroupJoinIterator, _super);
            //#region Constructor
            function GroupJoinIterator(PreviousLambdaExpression, OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //i believe pushing the outer to an array is more efficient since this will be used loop after loop. This way after there is a where with a group by...we won't have to run that each time. Its going to be tough to say which one is more efficient
                _this.OuterJoinArray = OuterJoinArray.ToArray();
                _this.InnerKeyFuncSelector = InnerKeySelector;
                _this.OuterKeyFuncSelector = OuterKeySelector;
                _this.JoinFuncSelector = JoinSelector;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "GroupJoinIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            GroupJoinIterator.prototype.ResetIterator = function () {
            };
            GroupJoinIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //are we done with the inner data set?
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //just return the item so we can be done
                        return new IteratorResult(null, IteratorStatus.Completed);
                    }
                    else {
                        //hold the matches
                        var Matches = new Array();
                        //loop through all the outers and if we have a match then we need to return it
                        for (var i = 0; i < this.OuterJoinArray.length; i++) {
                            //throw the current item into a variable
                            var CurrentItem = this.OuterJoinArray[i];
                            //do we have a match if we try to match the properties?
                            if (this.InnerKeyFuncSelector(NextItem.CurrentItem) === this.OuterKeyFuncSelector(CurrentItem)) {
                                //we have a match...add it to the array
                                Matches.push(CurrentItem);
                            }
                        }
                        //go return this item
                        return new IteratorResult(this.JoinFuncSelector(NextItem.CurrentItem, Matches), IteratorStatus.Running);
                    }
                }
            };
            GroupJoinIterator.prototype.AsyncSerializedFunc = function () {
                throw 'GroupJoin Method Not Supported In Async Mode';
            };
            return GroupJoinIterator;
        }(Iterator));
        JLinq.GroupJoinIterator = GroupJoinIterator;
        //Class is used to implement the Where Method Iterator
        var WhereIterator = /** @class */ (function (_super) {
            __extends(WhereIterator, _super);
            //#region Constructor
            function WhereIterator(PreviousLambdaExpression, WherePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.WhereClausePredicate = WherePredicate;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "WhereIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            WhereIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            WhereIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    //if it doesnt match the filter then we just keep going in the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed || this.WhereClausePredicate(NextItem.CurrentItem)) {
                        //we found this guy so return it...after we return this method we will jump a level to the next level down the tree
                        return NextItem;
                    }
                }
            };
            WhereIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('WhereClausePredicate', _super.prototype.SerializeMethod.call(this, this.WhereClausePredicate))];
            };
            return WhereIterator;
        }(Iterator));
        JLinq.WhereIterator = WhereIterator;
        //Class is used to grab the first record which meets the predicate
        var FirstOrDefaultIterator = /** @class */ (function (_super) {
            __extends(FirstOrDefaultIterator, _super);
            //#region Constructor
            function FirstOrDefaultIterator(PreviousLambdaExpression, WhichTypeOfObject, WherePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.WhereClausePredicate = WherePredicate;
                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                _this.HasNullWhereClause = _this.WhereClausePredicate == null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = WhichTypeOfObject;
                return _this;
            }
            //#endregion
            //#region Methods
            FirstOrDefaultIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            FirstOrDefaultIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    //if it doesnt match the filter then we just keep going in the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed || this.HasNullWhereClause || this.WhereClausePredicate(NextItem.CurrentItem)) {
                        //we found this guy so return it...after we return this method we will jump a level to the next level down the tree
                        return NextItem;
                    }
                }
            };
            FirstOrDefaultIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('WhereClausePredicate', _super.prototype.SerializeMethod.call(this, this.WhereClausePredicate))];
            };
            return FirstOrDefaultIterator;
        }(Iterator));
        JLinq.FirstOrDefaultIterator = FirstOrDefaultIterator;
        //Class is used to grab a single record which meets the predicate. It will throw an error if we have more then 1 record that meets the criteria. Will return null if nothing is found
        var SingleOrDefaultIterator = /** @class */ (function (_super) {
            __extends(SingleOrDefaultIterator, _super);
            //#region Constructor
            function SingleOrDefaultIterator(PreviousLambdaExpression, WhichTypeOfObject, WherePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.WhereClausePredicate = WherePredicate;
                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                _this.HasNullWhereClause = _this.WhereClausePredicate == null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = WhichTypeOfObject;
                return _this;
            }
            //#endregion
            //#region Methods
            SingleOrDefaultIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            SingleOrDefaultIterator.prototype.Next = function () {
                //holds the current selected items
                var CurrentSelectedItem = null;
                //do we have a match already? (faster to lookup a boolean then check the object against null)
                var WeHaveAMatch = false;
                //holds the next available item
                var NextItem;
                //we are going to keep looping until the previous expression is complete
                while ((NextItem = this.PreviousExpression.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {
                    //do we match the predicate?
                    if (this.HasNullWhereClause || this.WhereClausePredicate(NextItem.CurrentItem)) {
                        //we have a match...now we only want 1 item, otherwise we raise an error (that is the single logic)
                        //do we already have a match?
                        if (WeHaveAMatch) {
                            //we already have a match..throw an error
                            throw 'We Already Have A Match. SingleOrDefault Must Only Have 1 or 0 Items Returned. Use FirstOrDefault If You Are Expecting Multiple Items And Just Want To Grab The First Item';
                        }
                        else {
                            //flip the flag so we know we already have a match
                            WeHaveAMatch = true;
                            //set the current item to this guy
                            CurrentSelectedItem = NextItem.CurrentItem;
                        }
                    }
                }
                //we are done iterating through the previous expression, just return the result
                return new IteratorResult(CurrentSelectedItem, IteratorStatus.Completed);
            };
            SingleOrDefaultIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('WhereClausePredicate', _super.prototype.SerializeMethod.call(this, this.WhereClausePredicate))];
            };
            return SingleOrDefaultIterator;
        }(Iterator));
        JLinq.SingleOrDefaultIterator = SingleOrDefaultIterator;
        //Class is used to implement the Select Method Iterator
        var SelectIterator = /** @class */ (function (_super) {
            __extends(SelectIterator, _super);
            //#region Constructor
            function SelectIterator(PreviousLambdaExpression, SelectCreatorPredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.SelectPredicate = SelectCreatorPredicate;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "SelectIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            SelectIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            SelectIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if the previous call has no more records then return null
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //exit the chain because we have no more records
                        return new IteratorResult(null, IteratorStatus.Completed);
                    }
                    //now create this guy and return it
                    return new IteratorResult(this.SelectPredicate(NextItem.CurrentItem), IteratorStatus.Running);
                }
            };
            SelectIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('SelectPredicate', _super.prototype.SerializeMethod.call(this, this.SelectPredicate))];
            };
            return SelectIterator;
        }(Iterator));
        JLinq.SelectIterator = SelectIterator;
        //Class is used to implement the Select Many Method Iterator
        var SelectManyIterator = /** @class */ (function (_super) {
            __extends(SelectManyIterator, _super);
            /*Example:
             * Object1
             *      Id = 2
             *      List = 1,2,3
             *
             * Object2
             *      Id = 3
             *      List = 9,10,11
             *
             * Method should return 1,2,3,9,10,11
             */
            //#region Constructor
            function SelectManyIterator(PreviousLambdaExpression, CollectionPropertySelector) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to grab the collection type
                _this.CollectionPropertySelector = CollectionPropertySelector;
                //set the array holder to null
                _this.CollectionItemsToReturn = null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "SelectManyIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            SelectManyIterator.prototype.ResetIterator = function () {
                //we are going to reset the array holder which tells us this collection needs to be returned. when this is set to null, we go to the next collection and go through that guy
                this.CollectionItemsToReturn = null;
            };
            SelectManyIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //do we have any guys to be returned?
                    if (this.CollectionItemsToReturn != null) {
                        //holds the sub property next value
                        var SubCollectionItem = this.CollectionItemsToReturn.Next();
                        //is this sub collection done iterating through the sub collection?
                        if (SubCollectionItem.CurrentStatus === IteratorStatus.Completed) {
                            //we are done with the sub collection...set the queryable to null
                            this.CollectionItemsToReturn = null;
                        }
                        else {
                            //we still have the more items to iterate over...so return this guy
                            return SubCollectionItem;
                        }
                    }
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if the previous call has no more records then return null
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //exit the chain because we have no more records
                        return new IteratorResult(null, IteratorStatus.Completed);
                    }
                    //let's grab the collection...this way we can iterate through it and flatten it out
                    var SubCollectionToFlatten = this.CollectionPropertySelector(NextItem.CurrentItem);
                    //if we have items in this sub collection and it's not null then we will build the sub collection item
                    if (SubCollectionToFlatten != null && SubCollectionToFlatten.length > 0) {
                        //we have sub collection items, so build up a queryable and re-use the queryable logic
                        this.CollectionItemsToReturn = new Queryable(SubCollectionToFlatten);
                    }
                    //we will keep looping. otherwise we need to handle the sub collection down here or right after the while(true)
                    //this way it will just loop around and we can handle it in 1 spot
                }
            };
            SelectManyIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('CollectionPropertySelector', _super.prototype.SerializeMethod.call(this, this.CollectionPropertySelector))];
            };
            return SelectManyIterator;
        }(Iterator));
        JLinq.SelectManyIterator = SelectManyIterator;
        //Class is used to return all the distinct values found
        var DistinctIterator = /** @class */ (function (_super) {
            __extends(DistinctIterator, _super);
            //#region Constructor
            function DistinctIterator(PreviousLambdaExpression, PropertySelector) {
                var _this = 
                //go init the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.PropertySelector = PropertySelector;
                //init the distinct lookup to a blank object
                _this.DistinctLookup = new HashSet();
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "DistinctIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            DistinctIterator.prototype.ResetIterator = function () {
                //reset the lookup
                this.DistinctLookup = new HashSet();
            };
            DistinctIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if this record is null then return it
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we don't have any more records...
                        return new IteratorResult(null, IteratorStatus.Completed);
                    }
                    //let's grab the property value of this item now
                    var PropertyValue = this.PropertySelector(NextItem.CurrentItem);
                    //let's check if its in the list
                    if (PropertyValue != null && this.DistinctLookup.Add(PropertyValue)) {
                        //if we get a true from the Hashset.Add() method then it means its a new item...so return it now because it's distinct
                        return new IteratorResult(PropertyValue, IteratorStatus.Running);
                    }
                }
            };
            DistinctIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('PropertySelector', _super.prototype.SerializeMethod.call(this, this.PropertySelector))];
            };
            return DistinctIterator;
        }(Iterator));
        JLinq.DistinctIterator = DistinctIterator;
        //Class is used to implement the Take Method Iterator
        var TakeIterator = /** @class */ (function (_super) {
            __extends(TakeIterator, _super);
            //#region Constructor
            function TakeIterator(PreviousLambdaExpression, HowManyToTake) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the number of items to take
                _this.HowManyToTake = HowManyToTake;
                //let's initialize how many we have returned
                _this.HowManyHaveWeReturned = 0;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "TakeIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            TakeIterator.prototype.ResetIterator = function () {
                //reset how many we have returned
                this.HowManyHaveWeReturned = 0;
            };
            TakeIterator.prototype.Next = function () {
                //if we are already at the max number we want to return, the just return null
                if (this.WeReturnedWhatWeWantedAlready()) {
                    //we have what we want just return null
                    return new IteratorResult(null, IteratorStatus.Completed);
                }
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    //if it doesnt match the filter then we just keep going in the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed || !this.WeReturnedWhatWeWantedAlready()) {
                        //incase someone is using this property...we will check for not null and increment it
                        if (NextItem.CurrentStatus !== IteratorStatus.Completed) {
                            //it's a value we are returning, so increment the counter
                            this.HowManyHaveWeReturned++;
                        }
                        //we found this guy so return it...after we return this method we will jump a level to the next level down the tree
                        return NextItem;
                    }
                }
            };
            TakeIterator.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            TakeIterator.prototype.WeReturnedWhatWeWantedAlready = function () {
                return this.HowManyHaveWeReturned === this.HowManyToTake;
            };
            return TakeIterator;
        }(Iterator));
        JLinq.TakeIterator = TakeIterator;
        //will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression
        var TakeWhileIterator = /** @class */ (function (_super) {
            __extends(TakeWhileIterator, _super);
            //#region Constructor
            function TakeWhileIterator(PreviousLambdaExpression, TakeWhilePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the predicate to take while
                _this.PredicateToTakeWhile = TakeWhilePredicate;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "TakeWhileIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            TakeWhileIterator.prototype.ResetIterator = function () {
            };
            TakeWhileIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if we have no more records OR we match the predicate then return the iterator result
                    if (NextItem.CurrentStatus === IteratorStatus.Completed || this.PredicateToTakeWhile(NextItem.CurrentItem)) {
                        //we have no more items, just return the completed iterator
                        return NextItem;
                    }
                    //if we get here then the predicate doesn't match...so at that point we don't want to take any more and we want to return the complete iterator
                    return new IteratorResult(null, IteratorStatus.Completed);
                }
            };
            TakeWhileIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('PredicateToTakeWhile', _super.prototype.SerializeMethod.call(this, this.PredicateToTakeWhile))];
            };
            return TakeWhileIterator;
        }(Iterator));
        JLinq.TakeWhileIterator = TakeWhileIterator;
        //Class is used to implement the Skip Method Iterator
        var SkipIterator = /** @class */ (function (_super) {
            __extends(SkipIterator, _super);
            //#region Constructor
            function SkipIterator(PreviousLambdaExpression, HowManyToSkip) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the number of items to skip
                _this.HowManyToSkip = HowManyToSkip;
                //let's initialize how many we have skipped
                _this.HowManyHaveWeSkipped = 0;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "SkipIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            SkipIterator.prototype.ResetIterator = function () {
                //reset how many we have skipped
                this.HowManyHaveWeSkipped = 0;
            };
            SkipIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we are done, just return nextitem which is null
                        return NextItem;
                    }
                    //did we skip the correct amount?
                    if (this.HowManyToSkip > this.HowManyHaveWeSkipped) {
                        //we need to skip this guy, so increment the counter
                        this.HowManyHaveWeSkipped++;
                    }
                    else {
                        //we found this guy so return it...after we return this method we will jump a level to the next level down the tree
                        return NextItem;
                    }
                }
            };
            SkipIterator.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            return SkipIterator;
        }(Iterator));
        JLinq.SkipIterator = SkipIterator;
        //will Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. "Where" will return everything that meet the condition. SkipWhile will find the first element where the condition is met, and return the rest of the elements
        var SkipWhileIterator = /** @class */ (function (_super) {
            __extends(SkipWhileIterator, _super);
            //#region Constructor
            function SkipWhileIterator(PreviousLambdaExpression, SkipUntilPredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the predicate to skip until
                _this.PredicateSkipUntil = SkipUntilPredicate;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "SkipWhileIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            SkipWhileIterator.prototype.ResetIterator = function () {
                //reset the met false condition property
                this.ReturnRestOfElements = false;
            };
            SkipWhileIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //did we complete the data source? Or did we already find a false condition from a previous item (that means return everything after the false condition)?
                    if (this.ReturnRestOfElements || NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we already found a false condition, so we are going to return this guy until the end of collection
                        return NextItem;
                    }
                    //we haven't found a false yet, so let's check to see if the predicate is met. (if it's met, skip the item and move on to the next item. If not met, then flip the flag and return the item)
                    if (!this.PredicateSkipUntil(NextItem.CurrentItem)) {
                        //we didn't meet the condition, so we are going to return everything after this
                        //flip the flag 
                        this.ReturnRestOfElements = true;
                        //now return this item
                        return new IteratorResult(NextItem.CurrentItem, IteratorStatus.Running);
                    }
                }
            };
            SkipWhileIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('PredicateSkipUntil', _super.prototype.SerializeMethod.call(this, this.PredicateSkipUntil))];
            };
            return SkipWhileIterator;
        }(Iterator));
        JLinq.SkipWhileIterator = SkipWhileIterator;
        //  //creates a running total "T" then passes it in for each element
        var AggregateIterator = /** @class */ (function (_super) {
            __extends(AggregateIterator, _super);
            //#region Constructor
            function AggregateIterator(PreviousLambdaExpression, AggregatePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the running set clause
                _this.PredicateAggregate = AggregatePredicate;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "AggregateIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            AggregateIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            AggregateIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //working T
                var WorkingT = null;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if we are done, then return the current T
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we make it all the way through so return the working T
                        return new IteratorResult(WorkingT, IteratorStatus.Completed);
                    }
                    //if the working T is null then set it and keep going
                    if (WorkingT == null) {
                        //first real item, so set T
                        WorkingT = NextItem.CurrentItem;
                    }
                    else {
                        //now let's keep setting T
                        WorkingT = this.PredicateAggregate(WorkingT, NextItem.CurrentItem);
                    }
                }
            };
            AggregateIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('PredicateAggregate', _super.prototype.SerializeMethod.call(this, this.PredicateAggregate))];
            };
            return AggregateIterator;
        }(Iterator));
        JLinq.AggregateIterator = AggregateIterator;
        //Class is used to determine if all elements match the where predicate
        var AllIterator = /** @class */ (function (_super) {
            __extends(AllIterator, _super);
            //#region Constructor
            function AllIterator(PreviousLambdaExpression, WherePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.WhereClausePredicate = WherePredicate;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "AllIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            AllIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            AllIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    //if it doesnt match the filter then we just keep going in the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we make it all the way through so return true
                        return new IteratorResult(true, IteratorStatus.Completed);
                    }
                    //if it doesn't match then return null right away
                    if (!this.WhereClausePredicate(NextItem.CurrentItem)) {
                        //this item doens't match so we exit right away
                        return new IteratorResult(false, IteratorStatus.Completed);
                    }
                }
            };
            AllIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('WhereClausePredicate', _super.prototype.SerializeMethod.call(this, this.WhereClausePredicate))];
            };
            return AllIterator;
        }(Iterator));
        JLinq.AllIterator = AllIterator;
        //Class is used to determine if there are any elements in the collection
        var AnyIterator = /** @class */ (function (_super) {
            __extends(AnyIterator, _super);
            //#region Constructor
            function AnyIterator(PreviousLambdaExpression, WherePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.WhereClausePredicate = WherePredicate;
                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                _this.HasNullWhereClause = _this.WhereClausePredicate == null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "AnyIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            AnyIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            AnyIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //are we done looping through the dataset?
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we never found a match so return false
                        return new IteratorResult(false, IteratorStatus.Completed);
                    }
                    //if this is the form where we don't pass in a predicate then we just pass back the object
                    //or if we have a predicate and it matches the predicate
                    if (this.HasNullWhereClause || this.WhereClausePredicate(NextItem.CurrentItem)) {
                        //we  have an item its either going to be null or an object. the method that calls this will check to see if its null to determine the result
                        return new IteratorResult(true, IteratorStatus.Completed);
                    }
                }
            };
            AnyIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('WhereClausePredicate', _super.prototype.SerializeMethod.call(this, this.WhereClausePredicate))];
            };
            return AnyIterator;
        }(Iterator));
        JLinq.AnyIterator = AnyIterator;
        //Class is used to determine the last item in the collection
        var LastIterator = /** @class */ (function (_super) {
            __extends(LastIterator, _super);
            //#region Constructor
            function LastIterator(PreviousLambdaExpression, WherePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.WhereClausePredicate = WherePredicate;
                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                _this.HasNullWhereClause = _this.WhereClausePredicate == null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "LastIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            LastIterator.prototype.ResetIterator = function () {
                //reset the last item found
                this.LastItemFound = null;
            };
            LastIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //are we done looping through the data set?
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we don't have any more records...so let's return the last item variable
                        return new IteratorResult(this.LastItemFound, IteratorStatus.Completed);
                    }
                    //if this is the form where we don't pass in a predicate then we just pass back the object
                    //or if we have a predicate then run it and if it passes then store it in the last item variable
                    if (this.HasNullWhereClause || this.WhereClausePredicate(NextItem.CurrentItem)) {
                        //throw this into the last item found
                        this.LastItemFound = NextItem.CurrentItem;
                    }
                }
            };
            LastIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('WhereClausePredicate', _super.prototype.SerializeMethod.call(this, this.WhereClausePredicate))];
            };
            return LastIterator;
        }(Iterator));
        JLinq.LastIterator = LastIterator;
        //Class is used to implement concat between 2 iterator's
        var ConcatIterator = /** @class */ (function (_super) {
            __extends(ConcatIterator, _super);
            //#region Constructor
            function ConcatIterator(PreviousLambdaExpression, WhichTypeOfObject, QueryToConcat) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set query you want to concat together
                _this.ConcatThisQuery = QueryToConcat;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = WhichTypeOfObject;
                return _this;
            }
            //#endregion
            //#region Methods
            ConcatIterator.prototype.ResetIterator = function () {
                //reset the other iterator
                this.ConcatThisQuery.ResetQuery();
            };
            ConcatIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the first level next item.
                    NextItem = this.PreviousExpression.Next();
                    //are we done with the first iterator? if so, we need to move on to the 2nd iterator / array that we are going to combine
                    if (NextItem.CurrentStatus !== IteratorStatus.Completed) {
                        //we are not complete, so return this guy. (once we are done with the first iterator we will start the second)
                        return NextItem;
                    }
                    else {
                        //we are done with the first query, so start looping through the 2nd query
                        while (true) {
                            //grab the previous expression for this guy and just keep returning this guy
                            return this.ConcatThisQuery.Next();
                        }
                    }
                }
            };
            ConcatIterator.prototype.AsyncSerializedFunc = function () {
                //if we have a query, then we need to serialize all the parameters in the tree
                if (this.TypeOfObject === 'ConcatQueryIterator') {
                    //we dont have any parameters to serialize, but the query needs to be recursed and walked through to serialize the functions
                    Iterator.SerializeAsyncFuncToStringTree(this.ConcatThisQuery);
                }
                return null;
            };
            return ConcatIterator;
        }(Iterator));
        JLinq.ConcatIterator = ConcatIterator;
        //Class is used to implement the union's between 2 iterator's
        var UnionIterator = /** @class */ (function (_super) {
            __extends(UnionIterator, _super);
            //#region Constructor
            function UnionIterator(PreviousLambdaExpression, WhichTypeOfObject, QueryToUnion) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set query you want to union together
                _this.UnionThisQuery = QueryToUnion;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = WhichTypeOfObject;
                //create a new dictionary
                _this.HashSetStore = new HashSet();
                return _this;
            }
            //#endregion
            //#region Methods
            UnionIterator.prototype.ResetIterator = function () {
                //reset the other iterator
                this.UnionThisQuery.ResetQuery();
                //reset the dictionary
                this.HashSetStore = new HashSet();
            };
            UnionIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the first level next item.
                    NextItem = this.PreviousExpression.Next();
                    //are we done with the first iterator? if so, we need to move on to the 2nd iterator / array that we are going to combine
                    if (NextItem.CurrentStatus !== IteratorStatus.Completed && this.HashSetStore.Add(NextItem.CurrentItem)) {
                        //we are not complete and we just added this guy, so return this guy. (once we are done with the first iterator we will start the second)
                        return NextItem;
                    }
                    else {
                        //we are done with the first query, so start looping through the 2nd query
                        while (true) {
                            //go grab the next item
                            NextItem = this.UnionThisQuery.Next();
                            //are we done looping through the 2nd array
                            if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                                //we are done, just return the item
                                return NextItem;
                            }
                            else if (this.HashSetStore.Add(NextItem.CurrentItem)) {
                                //this isn't in the hashset yet, so return it. (once we are done with the first iterator we will start the second)
                                return NextItem;
                            }
                        }
                    }
                }
            };
            UnionIterator.prototype.AsyncSerializedFunc = function () {
                //if we have a query, then we need to serialize all the parameters in the tree
                if (this.TypeOfObject === 'UnionQueryIterator') {
                    //we dont have any parameters to serialize, but the query needs to be recursed and walked through to serialize the functions
                    Iterator.SerializeAsyncFuncToStringTree(this.UnionThisQuery);
                }
                return null;
            };
            return UnionIterator;
        }(Iterator));
        JLinq.UnionIterator = UnionIterator;
        //Class is used to implement a count with a where predicate
        var CountIterator = /** @class */ (function (_super) {
            __extends(CountIterator, _super);
            //#region Constructor
            function CountIterator(PreviousLambdaExpression, WherePredicate) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the filter to run the where clause on
                _this.WhereClausePredicate = WherePredicate;
                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                _this.HasNullWhereClause = _this.WhereClausePredicate == null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "CountIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            CountIterator.prototype.ResetIterator = function () {
                //nothing to reset
            };
            CountIterator.prototype.Next = function () {
                //holds the count of how many items we have
                var NumberOfItems = 0;
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //go grab the next item...is it null? which means we are done with the record set
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //no more items. return the count of items
                        return new IteratorResult(NumberOfItems, IteratorStatus.Completed);
                    }
                    else if (this.HasNullWhereClause || this.WhereClausePredicate(NextItem.CurrentItem)) {
                        //we either have no where clause or we have a where clause and it matches the where clause
                        NumberOfItems++;
                    }
                }
            };
            CountIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('WhereClausePredicate', _super.prototype.SerializeMethod.call(this, this.WhereClausePredicate))];
            };
            return CountIterator;
        }(Iterator));
        JLinq.CountIterator = CountIterator;
        //Class is used to determine what the lowest value number is in data source
        var MinIterator = /** @class */ (function (_super) {
            __extends(MinIterator, _super);
            //#region Constructor
            function MinIterator(PreviousLambdaExpression) {
                var _this = 
                //go init the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //go init the current lowest number to null
                _this.CurrentLowestNumber = null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "MinIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            MinIterator.prototype.ResetIterator = function () {
                //set the current lowest number back to the init phase
                this.CurrentLowestNumber = null;
            };
            MinIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //if we get here we have no more records...just pass back the lowest number
                        return new IteratorResult(this.CurrentLowestNumber, IteratorStatus.Completed);
                    }
                    else if (this.CurrentLowestNumber === null || NextItem.CurrentItem < this.CurrentLowestNumber) {
                        //is the current lowest number not set yet? Or is the set current lowest number not lower then the next item..
                        //set the variable to the new lowest number
                        this.CurrentLowestNumber = NextItem.CurrentItem;
                    }
                }
            };
            MinIterator.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            return MinIterator;
        }(Iterator));
        JLinq.MinIterator = MinIterator;
        //Class is used to determine what the largest value number is in data source
        var MaxIterator = /** @class */ (function (_super) {
            __extends(MaxIterator, _super);
            //#region Constructor
            function MaxIterator(PreviousLambdaExpression) {
                var _this = 
                //go init the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //init the current larget number to null
                _this.CurrentLargestNumber = null;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "MaxIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            MaxIterator.prototype.ResetIterator = function () {
                //set the current largest number back to the init phase
                this.CurrentLargestNumber = null;
            };
            MaxIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //if we get here we have no more records...just pass back the largest number
                        return new IteratorResult(this.CurrentLargestNumber, IteratorStatus.Completed);
                    }
                    else if (this.CurrentLargestNumber === null || NextItem.CurrentItem > this.CurrentLargestNumber) {
                        //is the current largest number not set yet...or is this number greater then the largest number which is set
                        //set the variable to the new largest number
                        this.CurrentLargestNumber = NextItem.CurrentItem;
                    }
                }
            };
            MaxIterator.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            return MaxIterator;
        }(Iterator));
        JLinq.MaxIterator = MaxIterator;
        //Class is used to calculate the sum of the data source
        var SumIterator = /** @class */ (function (_super) {
            __extends(SumIterator, _super);
            //#region Constructor
            function SumIterator(PreviousLambdaExpression) {
                var _this = 
                //go init the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //let's init the current sum tally
                _this.CurrentSumTally = 0;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "SumIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            SumIterator.prototype.ResetIterator = function () {
                //set the current tally back to 0
                this.CurrentSumTally = 0;
            };
            SumIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //if we get here we have no more records...just pass back the sum
                        return new IteratorResult(this.CurrentSumTally, IteratorStatus.Completed);
                    }
                    else {
                        //if the number is not null then add it to the tally
                        //add this current number to the tally
                        this.CurrentSumTally += NextItem.CurrentItem;
                    }
                }
            };
            SumIterator.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            return SumIterator;
        }(Iterator));
        JLinq.SumIterator = SumIterator;
        //Class is used to calculate the averge of the data source (this will skip over nulls and not use them in the formula)
        var AverageIterator = /** @class */ (function (_super) {
            __extends(AverageIterator, _super);
            //#region Constructor
            function AverageIterator(PreviousLambdaExpression) {
                var _this = 
                //go call the base class init
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //let's reset the sum tally
                _this.CurrentSumTally = 0;
                //reset the current count tally;
                _this.CurrentItemCountTally = 0;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "AverageIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            AverageIterator.prototype.ResetIterator = function () {
                //set the current tally's back to 0
                this.CurrentSumTally = 0;
                this.CurrentItemCountTally = 0;
            };
            AverageIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //if we get here we have no more records...just pass back the sum
                        return new IteratorResult(this.CurrentSumTally / this.CurrentItemCountTally, IteratorStatus.Completed);
                    }
                    else {
                        //if the number is not null then add it to the tally  
                        //add this current number to the tally
                        this.CurrentSumTally += NextItem.CurrentItem;
                        //add the counter by 1 now 
                        this.CurrentItemCountTally++;
                    }
                }
            };
            AverageIterator.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            return AverageIterator;
        }(Iterator));
        JLinq.AverageIterator = AverageIterator;
        //Class is used to group the data
        var GroupIterator = /** @class */ (function (_super) {
            __extends(GroupIterator, _super);
            //#region Constructor
            function GroupIterator(PreviousLambdaExpression, GroupBySelector) {
                var _this = 
                //call the super for the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the group by selector
                _this.GroupBySelector = GroupBySelector;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "GroupIterator";
                return _this;
            }
            //#endregion
            //#region Methods
            GroupIterator.prototype.ResetIterator = function () {
                //reset the igrouping tally
            };
            GroupIterator.prototype.Next = function () {
                //holds the next available item
                var NextItem;
                //declare the internal dictionary we used to hold the values
                var DictionaryOfGroupings = new Dictionary();
                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {
                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();
                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {
                        //we are all done, return the array now
                        return new IteratorResult(DictionaryOfGroupings.GetAllItems().Select(function (x) { return { Key: x.Key, Items: x.Value }; }).ToArray(), IteratorStatus.Completed);
                    }
                    //let's grab this item's key
                    var NextItemKey = this.GroupBySelector(NextItem.CurrentItem);
                    //lets try to see if we have this key yet (we are using json.Stringify so we can compare objects and there property..otherwise object equality will always return false)
                    var FoundKeyItemInCollection = DictionaryOfGroupings.GetItem(NextItemKey);
                    //now we are going to loop through each item in the collection we have and check if we have it
                    if (FoundKeyItemInCollection == null) {
                        //we don't have this key in the dictionary, we need to add it
                        DictionaryOfGroupings.Add(NextItemKey, [NextItem.CurrentItem]);
                    }
                    else {
                        //we have this key, so we just need to add it to the dictionary
                        FoundKeyItemInCollection.push(NextItem.CurrentItem);
                    }
                }
            };
            GroupIterator.prototype.AsyncSerializedFunc = function () {
                return [new KeyValuePair('GroupBySelector', _super.prototype.SerializeMethod.call(this, this.GroupBySelector))];
            };
            return GroupIterator;
        }(Iterator));
        JLinq.GroupIterator = GroupIterator;
        //used to order a query
        var OrderByIterator = /** @class */ (function (_super) {
            __extends(OrderByIterator, _super);
            //#region Constructor
            function OrderByIterator(PreviousLambdaExpression, DirectionToSort, PropertySortSelector, AdditionalSortPropertySelectors) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //set the sort order
                _this.SortDirection = DirectionToSort;
                //set the initial property sort selector
                _this.SortPropertySelector = PropertySortSelector;
                //set the "then by" items
                _this.ThenBySortPropertySelectors = AdditionalSortPropertySelectors;
                //set the flag that we need to build the data source
                _this.NeedToBuildDataSource = true;
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "OrderByIterator";
                return _this;
            }
            //#endregion
            //#region Public Methods
            //#region IChainable Methods
            OrderByIterator.prototype.ResetIterator = function () {
                //go reset the data source
                this.DataSource = null;
                //reset the data soure is built flag
                this.NeedToBuildDataSource = true;
            };
            OrderByIterator.prototype.Next = function () {
                //have we build the data source yet?
                if (this.NeedToBuildDataSource) {
                    //first thing we are going to do is push the previous expression to an array...this way we can sort it
                    //go sort the item and throw it into the data source
                    this.DataSource = new Queryable(this.SortData(this.PreviousExpression.ToArray(), this.SortPropertySelector, this.SortDirection, this.ThenBySortPropertySelectors));
                    //set the flag now
                    this.NeedToBuildDataSource = false;
                }
                //just keep returning until the data source is completed
                return this.DataSource.Next();
            };
            OrderByIterator.prototype.AsyncSerializedFunc = function () {
                var CompactedThenBySettings = new Array();
                //loop through the then by sort property selectors
                if (this.ThenBySortPropertySelectors != null) {
                    //loop through the property selectors
                    for (var i = 0; i < this.ThenBySortPropertySelectors.length; i++) {
                        //add the method to the array
                        CompactedThenBySettings.push(_super.prototype.SerializeMethod.call(this, this.ThenBySortPropertySelectors[i].PropertySelector));
                    }
                }
                return [new KeyValuePair('SortPropertySelector', _super.prototype.SerializeMethod.call(this, this.SortPropertySelector)),
                    new KeyValuePair('ThenBySortPropertySelectors', JSON.stringify(CompactedThenBySettings))];
            };
            //#endregion
            //#region ThenBy and ThenByDescending Methods
            //additional order by "ThenBy"
            OrderByIterator.prototype.ThenBy = function (SortPropertySelector) {
                //go create the OrderThenByIterator
                return new OrderThenByIterator(this, SortPropertySelector, SortOrder.Ascending);
            };
            //additional order by "ThenByDescending"
            OrderByIterator.prototype.ThenByDescending = function (SortPropertySelector) {
                //go create the OrderThenByIterator
                return new OrderThenByIterator(this, SortPropertySelector, SortOrder.Descending);
            };
            //#endregion
            //#endregion
            //#region Private Methods
            //sorts the actual data
            OrderByIterator.prototype.SortData = function (Collection, SortPropertySelector, OrderToSort, ThenBySortPropertySelectors) {
                //Less than 0: Sort "a" to be a lower index than "b"
                //Zero: "a" and "b" should be considered equal, and no sorting performed.
                //Greater than 0: Sort "b" to be a lower index than "a".
                var _this = this;
                //throw if we have "then by" selectors that are filled out
                var HasThenBySelectors = ThenBySortPropertySelectors != null && ThenBySortPropertySelectors.Any();
                //throw how many sort by selectors we have
                var ThenBySelectorCount = null;
                //selectors come into play, so so set the count
                if (HasThenBySelectors) {
                    //just grab the count of the property selectors so we can cache the length
                    ThenBySelectorCount = ThenBySortPropertySelectors.Count();
                }
                //are we sorting asc
                var SortAsc = OrderToSort === SortOrder.Ascending;
                //go sort ascending
                Collection.sort(function (FirstItem, SecondItem) {
                    //grab the difference between the items (using the first order by property selector)
                    var ResultOfComparison = _this.DetermineSortIndex(FirstItem, SecondItem, SortPropertySelector, SortAsc);
                    //if they are equal then we want to go to the additional sort by property selectors (thats really only scenario where then "ThenBy" selectors come into play)
                    if (ResultOfComparison === 0 && HasThenBySelectors) {
                        //we have "ThenBy"...so let's run through them until we get a final answer
                        for (var i = 0; i < ThenBySelectorCount; i++) {
                            //grab the guy we are up to
                            var CurrentSelector = ThenBySortPropertySelectors[i];
                            //go run the next comparison property selector
                            ResultOfComparison = _this.DetermineSortIndex(FirstItem, SecondItem, CurrentSelector.PropertySelector, CurrentSelector.ThenBySortOrder === SortOrder.Ascending);
                            //if we have something other then 0...return it, otherwise move onto the next "ThenBy" selector
                            if (ResultOfComparison !== 0) {
                                //we have a "should be before or after"...return it
                                return ResultOfComparison;
                            }
                        }
                    }
                    //return the comparison because we are done with processing
                    return ResultOfComparison;
                });
                //return the collection
                return Collection;
            };
            //determines if "A" should be after "B" in the sort order. Broker out into own methods so we can loop through multi sorts
            OrderByIterator.prototype.DetermineSortIndex = function (FirstItem, SecondItem, SortPropertySelector, SortAsc) {
                //Less than 0: Sort "a" to be a lower index than "b"
                //Zero: "a" and "b" should be considered equal, and no sorting performed.
                //Greater than 0: Sort "b" to be a lower index than "a".
                //is an object array (use the property in the object)
                var FirstItemValue = SortPropertySelector(FirstItem);
                var SecondItemValue = SortPropertySelector(SecondItem);
                //are they both null?
                if (FirstItemValue == null && SecondItemValue == null) {
                    //they are both null so they should be considered equal
                    return 0;
                }
                //is the first item null and the second item null?
                if (FirstItemValue == null && SecondItemValue != null) {
                    //which way to return
                    if (SortAsc) {
                        //first item is null so "a" should be before "b"
                        return -1;
                    }
                    else {
                        //first item is null so "b" should be before "a"
                        return 1;
                    }
                }
                //is the second item null and the first item not null
                if (FirstItemValue != null && SecondItemValue == null) {
                    //which way to return
                    if (SortAsc) {
                        //second item is null so "b" should be before "a"
                        return 1;
                    }
                    else {
                        //second item is null so "a" should be before "b"
                        return -1;
                    }
                }
                //string's need to be in lowercase because 'abc' is the same as 'ABC'
                if (typeof FirstItemValue === 'string') {
                    FirstItemValue = FirstItemValue.toLowerCase();
                }
                if (typeof SecondItemValue === 'string') {
                    SecondItemValue = SecondItemValue.toLowerCase();
                }
                //is the first item greater than the second item?
                if (FirstItemValue > SecondItemValue) {
                    //which way to return
                    if (SortAsc) {
                        //"b" should be before "a"
                        return 1;
                    }
                    else {
                        //"a" should be before "b"
                        return -1;
                    }
                }
                //is first item less than the second item
                if (FirstItemValue < SecondItemValue) {
                    //which way to return
                    if (SortAsc) {
                        //"a" should be before "b"
                        return -1;
                    }
                    else {
                        //"b" should be before "a"
                        return 1;
                    }
                }
                //they are equal return 0
                return 0;
            };
            return OrderByIterator;
        }(Iterator));
        JLinq.OrderByIterator = OrderByIterator;
        var OrderThenByIterator = /** @class */ (function (_super) {
            __extends(OrderThenByIterator, _super);
            //#region Constructor
            function OrderThenByIterator(PreviousLambdaExpression, SortPropertySelector, WhichSortOrder) {
                var _this = 
                //because we inherit from Iterator we need to call the base class
                _super.call(this) || this;
                //set the queryable source
                _this.PreviousExpression = PreviousLambdaExpression;
                //go build the dependancy on order by (so inject whatever we need in the "order by" branch
                _this.BuildDependencyOnOrderBy(PreviousLambdaExpression, SortPropertySelector, WhichSortOrder);
                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                _this.TypeOfObject = "OrderThenByIterator";
                return _this;
            }
            //#endregion
            //#region Public Methods
            //#region IChainable Methods
            OrderThenByIterator.prototype.ResetIterator = function () {
            };
            OrderThenByIterator.prototype.Next = function () {
                //just return the previous expression, because the "OrderBy" will sort the "ThenBy" items. So just loop until we are done because we are already sorted
                return this.PreviousExpression.Next();
            };
            OrderThenByIterator.prototype.AsyncSerializedFunc = function () {
                return null;
            };
            //#endregion
            //#region ThenBy and ThenByDescending Methods
            //additional order by "ThenBy"
            OrderThenByIterator.prototype.ThenBy = function (SortPropertySelector) {
                //go create the OrderThenByIterator
                return new OrderThenByIterator(this, SortPropertySelector, SortOrder.Ascending);
            };
            //additional order by "ThenByDescending"
            OrderThenByIterator.prototype.ThenByDescending = function (SortPropertySelector) {
                //go create the OrderThenByIterator
                return new OrderThenByIterator(this, SortPropertySelector, SortOrder.Descending);
            };
            //#endregion
            //#endregion
            //#region Private Helper Methods
            OrderThenByIterator.prototype.BuildDependencyOnOrderBy = function (WorkingQuery, SortPropertySelector, WhichSortOrder) {
                //traverse down the tree until we find an "OrderByIterator"...and attach this call to the additional sort properties (this way we only sort everything once)
                var FirstOrderByIterator = Iterator.ChainableTreeWalker(WorkingQuery).FirstOrDefault(function (x) { return x.TypeOfObject === 'OrderByIterator'; });
                //did we find it?
                if (FirstOrderByIterator == null) {
                    //throw an error because we can't find the order by
                    throw "Can't Find Order By Statement. Set An 'OrderBy' Or 'OrderByDescending' Before Calling 'ThenBy' / 'ThenByDescending'";
                }
                //we have a sort iterator. So let's add the additional order by's (first check to make sure it's not null)
                if (FirstOrderByIterator.ThenBySortPropertySelectors == null) {
                    //go create the array
                    FirstOrderByIterator.ThenBySortPropertySelectors = new Array();
                }
                //add the parameters to add
                var AdditionalSortPropertyToAdd = {
                    PropertySelector: SortPropertySelector,
                    ThenBySortOrder: WhichSortOrder
                };
                //now add the call
                FirstOrderByIterator.ThenBySortPropertySelectors.push(AdditionalSortPropertyToAdd);
            };
            return OrderThenByIterator;
        }(Iterator));
        JLinq.OrderThenByIterator = OrderThenByIterator;
        //#endregion
        //#region Dictionary Class
        //Dictionary class. Uses a javascript object internally. Supports multi-key objects with the following sample key selector { Key1: x.Prop1, Key2: x.Prop2};
        var Dictionary = /** @class */ (function () {
            function Dictionary() {
                //#region Properties
                //holds the internal dictionary as a javascript object.
                this.InternalDictionary = {};
                //holds the type of T so if we need to cast it back we can
                this.TypeOfTKey = null;
                //when we have multi key objects, we need a way of grabbbing the date properties when we convert it back. So we store the date property names
                this.DatePropertiesForMultiKey = null;
                //#endregion
            }
            //#endregion
            //#region Public Methods
            //tries to find the key in the dictionary
            Dictionary.prototype.ContainsKey = function (KeyToCheckFor) {
                //return the result if we found a match (check if that property exists)
                return this.InternalDictionary.hasOwnProperty(this.TKeyToInternalKey(KeyToCheckFor));
            };
            //add an item to the dictionary
            Dictionary.prototype.Add = function (Key, Value) {
                //if we don't have a type of key yet then add it
                if (this.TypeOfTKey == null && Key != null) {
                    //set it based on the type of
                    this.TypeOfTKey = typeof Key;
                    //if it's object, we need to loop through and set all the dates (a regular date key is an 'object')
                    if (this.TypeOfTKey === 'object') {
                        //we need to figure out if it's a multi key item or just a date
                        if (this.IsDateProperty(Key)) {
                            //this is a straight date key
                            this.TypeOfTKey = 'date';
                        }
                        else {
                            //this is a multi key (object) item. Declare the new dictionary so we can keep track if there are any date columns in this array
                            this.DatePropertiesForMultiKey = this.DateColumnsInMultiKeyObject(Key);
                        }
                    }
                }
                //check for duplicates
                if (this.ContainsKey(Key)) {
                    throw 'Dictionary Key Of ' + Key + ' Already Found In Dictionary';
                }
                //add the item to the dictionary
                this.InternalDictionary[this.TKeyToInternalKey(Key)] = Value;
            };
            //get a dictionary item
            Dictionary.prototype.GetItem = function (Key) {
                //return the item
                return this.GetItemHelper(this.TKeyToInternalKey(Key));
            };
            //gets all the keys in the dictionary
            Dictionary.prototype.Keys = function () {
                //keys to return
                var KeysToReturn = new Array();
                //let's loop through the dictionary and add the items
                for (var thisKey in this.InternalDictionary) {
                    //we need to make sure we are touching the base object and not any prototype properties
                    if (this.InternalDictionary.hasOwnProperty(thisKey)) {
                        //since keys are stored as strings / properties, we need to cast it back to the TKey Data Type
                        KeysToReturn.push(this.InternalKeyToTKey(thisKey));
                    }
                }
                //return the list
                return KeysToReturn;
            };
            //gets all the values in the dictionary
            Dictionary.prototype.Values = function () {
                //keys to return
                var ValuesToReturn = new Array();
                //let's loop through the dictionary and add the items
                for (var thisKey in this.InternalDictionary) {
                    //we need to make sure we are just looping through the properties and not the prototype properties / methods
                    if (this.InternalDictionary.hasOwnProperty(thisKey)) {
                        //add the key to the list to be returned
                        ValuesToReturn.push(this.GetItem(this.InternalKeyToTKey(thisKey)));
                    }
                }
                //return the list
                return ValuesToReturn;
            };
            //removes an item by key
            Dictionary.prototype.Remove = function (Key) {
                //delete this item
                delete this.InternalDictionary[this.TKeyToInternalKey(Key)];
            };
            //Builds a dictionary from a Iterator, so if we have an iterator we don't need to materialize that AND a dictionary and a key selector
            Dictionary.prototype.BuildDictionary = function (DictionaryDataSource, KeySelector) {
                //holds the data source which we will use to build the dictionary as we loop through iterator
                var CurrentIteratorResult;
                //let's just reset this iterator first
                DictionaryDataSource.ResetQuery();
                //let's start iterating through the data source (this way we don't have to materialize the data source to another array)
                while ((CurrentIteratorResult = DictionaryDataSource.Next()).CurrentStatus !== IteratorStatus.Completed) {
                    //add the item to the dictionary (the value is item)
                    this.Add(KeySelector(CurrentIteratorResult.CurrentItem), CurrentIteratorResult.CurrentItem);
                }
                //go reset the iterator again
                DictionaryDataSource.ResetQuery();
            };
            //gets the count of items in the dictionary
            Dictionary.prototype.Count = function () {
                //holds the count of items
                var CountOfItems = 0;
                //loop through each of the items
                for (var thisKey in this.InternalDictionary) {
                    //we need to make sure we are just looping through the properties and not the prototype properties / methods
                    if (this.InternalDictionary.hasOwnProperty(thisKey)) {
                        //increment the count of items
                        CountOfItems++;
                    }
                }
                //return the count
                return CountOfItems;
            };
            //gets all the items in the dictionary and returns a key value pair
            Dictionary.prototype.GetAllItems = function () {
                //declare our array to be returned
                var ArrayToBeReturned = new Array();
                //loop through each of the items
                for (var thisKey in this.InternalDictionary) {
                    //we need to make sure we are just looping through the properties and not the prototype properties / methods
                    if (this.InternalDictionary.hasOwnProperty(thisKey)) {
                        //go build up the key value pair, then add it to the array
                        ArrayToBeReturned.push(new KeyValuePair(this.InternalKeyToTKey(thisKey), this.GetItemHelper(thisKey)));
                    }
                }
                //return the array now
                return ArrayToBeReturned;
            };
            //#endregion
            //#region Private Methods
            //internal helper so we can pass in if we want the internal key dictionary format
            Dictionary.prototype.GetItemHelper = function (InternalFormatKey) {
                //return the item
                return this.InternalDictionary[InternalFormatKey];
            };
            //converts the TKey passed in, to the internal key
            Dictionary.prototype.TKeyToInternalKey = function (KeyValue) {
                if (this.TypeOfTKey === 'date') {
                    return KeyValue;
                }
                else {
                    return JSON.stringify(KeyValue);
                }
            };
            //When getting the keys (since they are stored as strings) we will need to convert them back to TKey data type
            Dictionary.prototype.InternalKeyToTKey = function (KeyValue) {
                var _this = this;
                //is this just a regular date key?
                if (this.TypeOfTKey === 'date') {
                    return KeyValue;
                }
                else {
                    //throw the dictionary into a variable so we have access to it in the 
                    //parse reviver needs to be in a closure so we can access the dictionary
                    return JSON.parse(KeyValue, function (key, value) {
                        //is this a date item
                        if (_this.DatePropertiesForMultiKey != null && _this.DatePropertiesForMultiKey.ContainsKey(key)) {
                            //it's a date so create a new date with the value and return it
                            return new Date(value);
                        }
                        else {
                            //just return the value
                            return value;
                        }
                    });
                }
            };
            //is this a date data type?
            Dictionary.prototype.IsDateProperty = function (ValueToCheck) {
                return (ValueToCheck instanceof Date && !isNaN(ValueToCheck.valueOf()));
            };
            //gets all the date properties in a multi key object
            Dictionary.prototype.DateColumnsInMultiKeyObject = function (KeyValue) {
                //this is a multi key (object) item. Declare the new dictionary so we can keep track if there are any date columns in this array
                var DatePropertiesInMultiObjectKey = new Dictionary();
                //loop through all the properties and grab just the dates
                for (var thisPropertyInKey in KeyValue) {
                    //make sure we have this property
                    if (this.IsDateProperty(KeyValue[thisPropertyInKey])) {
                        //it's a date throw the property name into the array
                        DatePropertiesInMultiObjectKey.Add(thisPropertyInKey, true);
                    }
                }
                //return the dictionary now
                return DatePropertiesInMultiObjectKey;
            };
            return Dictionary;
        }());
        JLinq.Dictionary = Dictionary;
        //#endregion
        //#region HashSet Class
        //HashSet Class. Uses a Dictionary internally. Supports multi-key objects with the following sample key selector { Key1: x.Prop1, Key2: x.Prop2};
        var HashSet = /** @class */ (function () {
            function HashSet() {
                //#region Properties
                //holds the internal dictionary as a javascript object. (uses boolean as the value to keep the memory footprint as low as possible
                this.InternalHashSet = new Dictionary();
                //#endregion
            }
            //#endregion
            //#region Public Methods
            //tries to find the key / object in the hashset
            HashSet.prototype.ContainsItem = function (ItemToRetrieve) {
                //use the dictionary method to check for the key
                return this.InternalHashSet.ContainsKey(ItemToRetrieve);
            };
            //add an item to the hashset. Will return true if it was added. Returns false if it already exists in the hashset
            HashSet.prototype.Add = function (ValueToAdd) {
                //check to see if we have it...dictionary will throw an error if we already have it. Hashset will just return false
                if (this.ContainsItem(ValueToAdd)) {
                    //we already have this guy in the internal dictionary, for hashset, just return false
                    return false;
                }
                //add the item to the internal dictionary (pass in null as the value to keep the memory footprint low)
                this.InternalHashSet.Add(ValueToAdd, null);
                //we returned it, so now return true
                return true;
            };
            //gets all the values in the hashset
            HashSet.prototype.Values = function () {
                //use the dictionary keys to grab all the data
                return this.InternalHashSet.Keys();
            };
            //removes an item
            HashSet.prototype.Remove = function (KeyToRemove) {
                //go remove the item from the dictionary method
                this.InternalHashSet.Remove(KeyToRemove);
            };
            //Builds a hashset from a Iterator, so if we have an iterator we don't need to materialize that AND a hashset and a key selector
            HashSet.prototype.BuildHashSet = function (HashSetDataSource) {
                //go build the hashset (since this doesn't match the dictionary value, because we aren't deriving the key from the value, we will loop 1 by 1)
                var CurrentIteratorResult;
                //let's just reset this iterator first
                HashSetDataSource.ResetQuery();
                //let's start iterating through the data source (this way we don't have to materialize the data source to another array)
                while ((CurrentIteratorResult = HashSetDataSource.Next()).CurrentStatus !== IteratorStatus.Completed) {
                    //add the item to the dictionary (the value is item)
                    this.Add(CurrentIteratorResult.CurrentItem);
                }
                //go reset the iterator again
                HashSetDataSource.ResetQuery();
            };
            //gets the count of items in the hashset
            HashSet.prototype.Count = function () {
                //go grab the count
                return this.InternalHashSet.Count();
            };
            return HashSet;
        }());
        JLinq.HashSet = HashSet;
        //#endregion
        //#region Async Tree Builders
        function RebuildTree(ParsedJsonQuery) {
            //now we need to copy all the base methods for each level of the tree
            //flatten the tree
            var FlatTree = ToracTechnologies.JLinq.Iterator.ChainableTreeWalker(ParsedJsonQuery);
            //queryable with the array
            var Queryable;
            //we need to get the collection souce.
            for (var j = 0; j < FlatTree.length; j++) {
                //grab the node
                var Node = FlatTree[j];
                //is this a queryable?
                if (Node.TypeOfObject === 'Queryable') {
                    //set this queryable
                    Queryable = new ToracTechnologies.JLinq.Queryable(Node.CollectionSource);
                    break;
                }
                else if (Node.PreviousExpression != null && Node.PreviousExpression.TypeOfObject === 'Queryable') {
                    //set this queryable
                    Queryable = new ToracTechnologies.JLinq.Queryable(Node.PreviousExpression.CollectionSource);
                    break;
                }
            }
            //make sure we have an iterator
            if (Queryable == null) {
                throw "Couldn't Find A Starting Point For Querable In RebuildTree";
            }
            //loop through the tree (going backwards starting with queryable)
            for (var i = FlatTree.length - 1; i >= 0; i--) {
                //grab the current item
                var CurrentLevelOfTree = FlatTree[i];
                //go rebuild the tree...and reset the queryable
                var RebuildTreeNode = RebuildSingleTreeNode(CurrentLevelOfTree, Queryable);
                //is it null? (null if its handles in a different manor. ie: orderthenby)
                if (RebuildTreeNode != null) {
                    Queryable = RebuildTreeNode;
                }
            }
            //return the queryable
            return Queryable;
        }
        JLinq.RebuildTree = RebuildTree;
        function RebuildSingleTreeNode(CurrentLevelOfTree, Queryable) {
            //order by handles this guy
            if (CurrentLevelOfTree.TypeOfObject === 'OrderThenByIterator') {
                return null;
            }
            if (CurrentLevelOfTree.TypeOfObject === 'WhereIterator') {
                return Queryable.Where(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'First') {
                return Queryable.First(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'FirstOrDefaultIterator') {
                return Queryable.FirstOrDefault(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'SingleIterator') {
                return Queryable.Single(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'SingleOrDefaultIterator') {
                return Queryable.Single(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'SelectIterator') {
                return Queryable.Select(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'SelectPredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'SelectManyIterator') {
                return Queryable.SelectMany(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'CollectionPropertySelector'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'DistinctIterator') {
                return Queryable.Distinct(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'PropertySelector'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'TakeIterator') {
                return Queryable.Take(CurrentLevelOfTree.HowManyToTake);
            }
            if (CurrentLevelOfTree.TypeOfObject === 'TakeWhileIterator') {
                return Queryable.TakeWhile(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'PredicateToTakeWhile'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'SkipIterator') {
                return Queryable.Skip(CurrentLevelOfTree.HowManyToSkip);
            }
            if (CurrentLevelOfTree.TypeOfObject === 'SkipWhileIterator') {
                return Queryable.SkipWhile(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'PredicateSkipUntil'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'AggregateIterator') {
                return Queryable.Aggregate(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'PredicateAggregate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'AllIterator') {
                return Queryable.All(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'AnyIterator') {
                return Queryable.Any(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'LastIterator') {
                return Queryable.Last(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'CountIterator') {
                return Queryable.Count(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'WhereClausePredicate'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'MinIterator') {
                return Queryable.Min();
            }
            if (CurrentLevelOfTree.TypeOfObject === 'MaxIterator') {
                return Queryable.Max();
            }
            if (CurrentLevelOfTree.TypeOfObject === 'SumIterator') {
                return Queryable.Sum();
            }
            if (CurrentLevelOfTree.TypeOfObject === 'AverageIterator') {
                return Queryable.Average();
            }
            if (CurrentLevelOfTree.TypeOfObject === 'GroupIterator') {
                return Queryable.GroupBy(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'GroupBySelector'; }).Value));
            }
            if (CurrentLevelOfTree.TypeOfObject === 'OrderByIterator') {
                //then by to set
                var ThenByToSet = new Array();
                //cast the queryable
                var CastedOrderBy = CurrentLevelOfTree;
                //loop through the then by settings (if we have some)
                var ThenBySettings = CastedOrderBy.AsyncSerialized.FirstOrDefault(function (x) { return x.Key === 'ThenBySortPropertySelectors'; });
                //do we have any settings to serialize back? (for the then by settings)?
                if (ThenBySettings != null) {
                    //cast it back to a key value pair
                    var CastedSelectors = JSON.parse(ThenBySettings.Value);
                    //loop through the selectors
                    for (var i = 0; i < CastedSelectors.length; i++) {
                        //push the then by properties
                        ThenByToSet.push({
                            ThenBySortOrder: CastedOrderBy.ThenBySortPropertySelectors[i].ThenBySortOrder,
                            PropertySelector: ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CastedSelectors[i])
                        });
                    }
                }
                //return a new order by iterator
                return new OrderByIterator(Queryable, CastedOrderBy.SortDirection, ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key === 'SortPropertySelector'; }).Value), ThenByToSet);
            }
            if (CurrentLevelOfTree.TypeOfObject === 'JoinIterator') {
                throw 'Join Iterator Not Supported In Async Mode';
            }
            //if (CurrentLevelOfTree.TypeOfObject === 'ConcatArrayIterator') {
            //    //cast the queryable
            //    var CastedConcat = (<ToracTechnologies.JLinq.ConcatIterator<any>>CurrentLevelOfTree);
            //    //we need to go rebuild the concat query tree...then pass it in
            //    return Queryable.Concat(RebuildTree(CastedConcat.ConcatThisQuery));
            //}
            if (CurrentLevelOfTree.TypeOfObject === 'ConcatArrayOrQueryIterator') {
                //cast the queryable
                var CastedConcatQuery = RebuildTree(CurrentLevelOfTree.ConcatThisQuery);
                //we need to go rebuild the concat query tree...then pass it in
                return Queryable.Concat(CastedConcatQuery);
            }
            if (CurrentLevelOfTree.TypeOfObject === 'UnionArrayOrQueryIterator') {
                //cast the queryable
                var CastedUnion = CurrentLevelOfTree;
                //we need to go rebuild the union query tree...then pass it in
                return Queryable.Union(RebuildTree(CastedUnion.UnionThisQuery));
            }
            //if (CurrentLevelOfTree.TypeOfObject === 'UnionQueryIterator') {
            //    //cast the queryable
            //    var CastedUnionQuery = RebuildTree((<ToracTechnologies.JLinq.UnionIterator<any>>CurrentLevelOfTree).UnionThisQuery);
            //    //we need to go rebuild the union query tree...then pass it in
            //    return Queryable.Unionery(CastedUnionQuery);
            //}
            if (CurrentLevelOfTree.TypeOfObject === 'Queryable') {
                //we need to go rebuild the concat query tree...then pass it in
                return new ToracTechnologies.JLinq.Queryable(CurrentLevelOfTree.CollectionSource);
            }
            //if (CurrentLevelOfTree.TypeOfObject == 'UnionIterator') {
            //    return Queryable.Union(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(x => x.Key == 'WhereClausePredicate').Value));
            //}
            //throw an error, in a web worker you can't display any alerts or console
            throw 'Level Not Implemented: ' + CurrentLevelOfTree.TypeOfObject;
        }
        JLinq.RebuildSingleTreeNode = RebuildSingleTreeNode;
        //#endregion
    })(JLinq = ToracTechnologies.JLinq || (ToracTechnologies.JLinq = {}));
})(ToracTechnologies || (ToracTechnologies = {}));
//#endregion
//#region Prototypes
Array.prototype.AsQueryable = function () {
    return new ToracTechnologies.JLinq.Queryable(this);
};
Array.prototype.Where = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).Where(WhereClauseSelector);
};
Array.prototype.First = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).First(WhereClauseSelector);
};
Array.prototype.FirstOrDefault = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).FirstOrDefault(WhereClauseSelector);
};
Array.prototype.Single = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).Single(WhereClauseSelector);
};
Array.prototype.SingleOrDefault = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).SingleOrDefault(WhereClauseSelector);
};
Array.prototype.Select = function (Creator) {
    return new ToracTechnologies.JLinq.Queryable(this).Select(Creator);
};
Array.prototype.SelectMany = function (CollectionPropertySelector) {
    return new ToracTechnologies.JLinq.Queryable(this).SelectMany(CollectionPropertySelector);
};
Array.prototype.Distinct = function (PropertySelector) {
    return new ToracTechnologies.JLinq.Queryable(this).Distinct(PropertySelector);
};
Array.prototype.Take = function (HowManyToTake) {
    return new ToracTechnologies.JLinq.Queryable(this).Take(HowManyToTake);
};
Array.prototype.TakeWhile = function (PredicateToTakeWhile) {
    return new ToracTechnologies.JLinq.Queryable(this).TakeWhile(PredicateToTakeWhile);
};
Array.prototype.Skip = function (HowManyToSkip) {
    return new ToracTechnologies.JLinq.Queryable(this).Skip(HowManyToSkip);
};
Array.prototype.SkipWhile = function (PredicateToSkipUntil) {
    return new ToracTechnologies.JLinq.Queryable(this).SkipWhile(PredicateToSkipUntil);
};
Array.prototype.Aggregate = function (AggregatePredicate) {
    return new ToracTechnologies.JLinq.Queryable(this).Aggregate(AggregatePredicate);
};
Array.prototype.All = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).All(WhereClauseSelector);
};
Array.prototype.Any = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).Any(WhereClauseSelector);
};
Array.prototype.Last = function (WhereClauseSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).Last(WhereClauseSelector);
};
Array.prototype.Concat = function (ArrayToConcat) {
    return new ToracTechnologies.JLinq.Queryable(this).Concat(ArrayToConcat);
};
Array.prototype.Union = function (ArrayToUnion) {
    return new ToracTechnologies.JLinq.Queryable(this).Union(ArrayToUnion);
};
Array.prototype.Count = function () {
    //don't even calculate this...just return the length
    return this.length;
};
Array.prototype.Count = function (WhereClauseSelector) {
    //otherwise use the regular method with the predicate
    return new ToracTechnologies.JLinq.Queryable(this).Count(WhereClauseSelector);
};
Array.prototype.Min = function () {
    return new ToracTechnologies.JLinq.Queryable(this).Min();
};
Array.prototype.Max = function () {
    return new ToracTechnologies.JLinq.Queryable(this).Max();
};
Array.prototype.Sum = function () {
    return new ToracTechnologies.JLinq.Queryable(this).Sum();
};
Array.prototype.Average = function () {
    return new ToracTechnologies.JLinq.Queryable(this).Average();
};
Array.prototype.GroupBy = function (GroupBySelector) {
    return new ToracTechnologies.JLinq.Queryable(this).GroupBy(GroupBySelector);
};
Array.prototype.ToDictionary = function (KeySelector) {
    return new ToracTechnologies.JLinq.Queryable(this).ToDictionary(KeySelector);
};
Array.prototype.ToHashSet = function () {
    return new ToracTechnologies.JLinq.Queryable(this).ToHashSet();
};
Array.prototype.Paginate = function (CurrentPageNumber, HowManyRecordsPerPage) {
    return new ToracTechnologies.JLinq.Queryable(this).Paginate(CurrentPageNumber, HowManyRecordsPerPage);
};
Array.prototype.OrderBy = function (SortPropertySelector) {
    return new ToracTechnologies.JLinq.Queryable(this).OrderBy(SortPropertySelector);
};
Array.prototype.OrderByDescending = function (SortPropertySelector) {
    return new ToracTechnologies.JLinq.Queryable(this).OrderByDescending(SortPropertySelector);
};
Array.prototype.ElementAt = function (Index) {
    //make sure we have enough elements
    if (this.length - 1 < Index) {
        //throw an out of range exception
        throw ToracTechnologies.JLinq.ElementAtHelperResult.GenerateErrorMessage(this.length);
    }
    //if you are trying to run an element at on an array...then just use the normal way for performance. Essentially we only need JLinq ElementAt off of Queryable 
    return this[Index];
};
Array.prototype.ElementAtDefault = function (Index) {
    //make sure we have enough elements
    if (this.length - 1 < Index) {
        //just return a null value
        return null;
    }
    //if you are trying to run an element at on an array...then just use the normal way for performance. Essentially we only need JLinq ElementAt off of Queryable 
    return this[Index];
};
Array.prototype.Join = function (OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).Join(OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector);
};
Array.prototype.GroupJoin = function (OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector) {
    return new ToracTechnologies.JLinq.Queryable(this).GroupJoin(OuterJoinArray, InnerKeySelector, OuterKeySelector, JoinSelector);
};
Array.prototype.DefaultIfEmpty = function (DefaultValue) {
    return new ToracTechnologies.JLinq.Queryable(this).DefaultIfEmpty(DefaultValue);
};
//#endregion
//#endregion 
//# sourceMappingURL=JLinq.js.map