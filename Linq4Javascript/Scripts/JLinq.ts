//********************************Torac Technologies***************************************
//Description: Linq Style Methods In Javascript To Manipulate Collections                 *
//Release Date: 10/17/2013                                                                *
//Current Version: 2.5.4                                                                  *
//Release History In JLinqChangeLog.txt                                                   *
//*****************************************************************************************

//* Change Log Is In It's Own Text File. I want to keep the js file as small as possible

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

module ToracTechnologies {

    export module JLinq {

        //#region Iterator Class

        //Class is used to throw the methods on a common class that we can inherit from
        export class Iterator<T> {

            //#region Properties

            //this is an abstract proeprty
            public TypeOfObject: string;

            //this is an abstract property
            public PreviousExpression: IChainable<any, any>;

            //holds the methods we need to serialize when we run async
            public AsyncSerialized: Array<KeyValuePair<string, string>>;

            //#endregion

            //#region Linq Functionality Methods

            //selects the items that meet the predicate criteria
            public Where(WhereClauseSelector: (ItemToTest: T) => boolean): WhereIterator<T> {
                return new WhereIterator<T>(this, WhereClauseSelector);
            }

            //grabs the first item (error if not found) that meet the predicate criteria
            public First(WhereClauseSelector?: (ItemToTest: T) => boolean): T {

                //grab the result
                var ResultOfQuery: T = new FirstOrDefaultIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //if it's null then throw an error
                if (ResultOfQuery == null) {
                    throw "Can't Find First Item. Query Returned 0 Rows";
                }

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //grabs the first item (null if not found) that meet the predicate criteria
            public FirstOrDefault(WhereClauseSelector?: (ItemToTest: T) => boolean): T {

                //grab the result
                var ResultOfQuery: T = new FirstOrDefaultIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //grabs the only item (error if not found) that meet the predicate criteria
            public Single(WhereClauseSelector?: (ItemToTest: T) => boolean): T {

                //grab the result
                var ResultOfQuery: T = new SingleOrDefaultIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //if it's null then throw an error
                if (ResultOfQuery == null) {
                    throw "Can't Find A Single Item. Query Returned 0 Rows";
                }

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //grabs the first item (null if not found) that meet the predicate criteria
            public SingleOrDefault(WhereClauseSelector?: (ItemToTest: T) => boolean): T {

                //grab the result
                var ResultOfQuery: T = new SingleOrDefaultIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //selects a new object type from the object of T Passed in
            public Select<TNewObject>(SelectCreatorPredicate: (ItemToTest: T) => TNewObject): SelectIterator<T, TNewObject> {
                return new SelectIterator<T, TNewObject>(this, SelectCreatorPredicate);
            }

            //selects a collection in T...then flattens it out and returns the new object type you want to create
            public SelectMany<TCollectionType>(CollectionPropertySelector: (CollectionProperty: T) => Array<TCollectionType>): ToracTechnologies.JLinq.SelectManyIterator<T, TCollectionType> {
                return new SelectManyIterator<T, TCollectionType>(this, CollectionPropertySelector);
            }

            //grabs the distinct property values that are found from the list
            public Distinct<TPropertyType>(PropertySelector: (ItemToTest: T) => TPropertyType): DistinctIterator<T, TPropertyType> {
                return new DistinctIterator<T, TPropertyType>(this, PropertySelector);
            }

            //takes the number of elements and returns them
            public Take(HowManyToTake: number): TakeIterator<T> {

                //return the x number of items and return it
                return new TakeIterator<T>(this, HowManyToTake);
            }

            //will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression
            public TakeWhile(PredicateToTakeWhile: (ItemToTest: T) => boolean): TakeWhileIterator<T> {

                //return the x number of items and return it
                return new TakeWhileIterator<T>(this, PredicateToTakeWhile);
            }

            //skips x about of items and returns the rst
            public Skip(HowManyToSkip: number): SkipIterator<T> {

                //return the x number of items and return it
                return new SkipIterator<T>(this, HowManyToSkip);
            }

            //will Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. "Where" will return everything that meet the condition. SkipWhile will find the first element where the condition is met, and return the rest of the elements
            public SkipWhile(PredicateToSkipUntil: (ItemToTest: T) => boolean): SkipWhileIterator<T> {

                //return the x number of items and return it
                return new SkipWhileIterator<T>(this, PredicateToSkipUntil);
            }

            //creates a running total "T" then passes it in for each element
            public Aggregate(AggregatePredicate: (WorkingT: T, NextT: T) => T): T {

                //grab the result
                var ResultOfQuery: T = new AggregateIterator<T>(this, AggregatePredicate).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //makes sure all elements match the predicate. Returns if they all are successful in the predicate
            public All(WhereClauseSelector: (ItemToTest: T) => boolean): boolean {

                //grab the result
                var ResultOfQuery: boolean = new AllIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //determines there are any items that meet the predicate passed in (shared between this and AnyItem [which is any with no predicate])
            public Any(WhereClauseSelector?: (ItemToTest: T) => boolean): boolean {

                //grab the result
                var ResultOfQuery: boolean = new AnyIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //grab the last item in the data source (shared between this and LastItem [which is just the last item in the collection])
            public Last(WhereClauseSelector?: (ItemToTest: T) => boolean): T {

                //grab the result
                var ResultOfQuery: T = new LastIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //go setup the iterator to concat a iterator and another query
            public ConcatQuery(QueryToConcat: Iterator<T>): ConcatIterator<T> {
                //just return the concat iterator
                return new ConcatIterator(this, QueryToConcat);
            }

            //go setup the iterator to concat a iterator and an array
            public Concat(ArrayToCombine: Array<T>): ConcatIterator<T> {
                //just return the concat iterator
                return new ConcatIterator(this, new Queryable(ArrayToCombine));
            }

            //go setup the iterator to union a iterator and another query
            public UnionQuery(QueryToUnion: Iterator<T>): UnionIterator<T> {
                //just return the union iterator
                return new UnionIterator(this, QueryToUnion);
            }

            //go setup the iterator to union a iterator and an array
            public Union(ArrayToCombine: Array<T>): UnionIterator<T> {
                //just return the union iterator
                return new UnionIterator(this, new Queryable(ArrayToCombine));
            }

            //counts the number of items that match the predicate
            public Count(WhereClauseSelector?: (ItemToTest: T) => boolean): number {

                //grab the result
                var ResultOfQuery: number = new CountIterator<T>(this, WhereClauseSelector).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //grabs the smallest number in the data source
            public Min(): number {

                //grab the result
                var ResultOfQuery: number = new MinIterator(<any>this).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //grabs the largest number in the data source
            public Max(): number {

                //grab the result
                var ResultOfQuery: number = new MaxIterator(<any>this).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //calculates the sum of the data source
            public Sum(): number {

                //grab the result
                var ResultOfQuery: number = new SumIterator(<any>this).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //calculates the avg of the data source (this will ignore nulls and skip right over them)
            public Average(): number {

                //grab the result
                var ResultOfQuery: number = new AverageIterator(<any>this).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //group the data source 
            public GroupBy<TKey>(GroupBySelector: (ItemToTest: T) => TKey): Array<ToracTechnologies.JLinq.IGrouping<TKey, T>> {

                //grab the result
                var ResultOfQuery: Array<ToracTechnologies.JLinq.IGrouping<TKey, T>> = new GroupIterator<T, TKey>(<any>this, GroupBySelector).Next().CurrentItem;

                //reset the iterator
                this.ResetQuery();

                //now return the result
                return ResultOfQuery;
            }

            //creates a dictionary from the data source
            public ToDictionary<TKey>(KeySelector: (PropertyToKeyOn: T) => TKey): ToracTechnologies.JLinq.IDictionary<TKey, T> {

                //create the dictionary which we will build and return
                var DictionaryToReturn: IDictionary<TKey, T> = new Dictionary<TKey, T>();

                //go build the dictionary off of the iterator
                DictionaryToReturn.BuildDictionary(this, KeySelector);

                //return the dictionary now
                return DictionaryToReturn;
            }

            //creates a hashset from the data source
            public ToHashSet(): ToracTechnologies.JLinq.IHashSet<T> {

                //create the hashset which we will build and return
                var HashSetToReturn: IHashSet<T> = new HashSet<T>();

                //go build the hashset off of the iterator
                HashSetToReturn.BuildHashSet(this);

                //return the hashset now
                return HashSetToReturn;
            }

            //paginates the data
            public Paginate(CurrentPageNumber: number, HowManyRecordsPerPage: number): TakeIterator<T> {

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
                return new SkipIterator<T>(this,((CurrentPageNumber - 1) * HowManyRecordsPerPage)).Take(HowManyRecordsPerPage);
            }

            //order by from data source
            public OrderBy<TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): OrderByIterator<T> {

                //go build the iterator (which is really lazy loaded, its more to give them the order "then by" functionality
                return new OrderByIterator(this, SortOrder.Ascending, SortPropertySelector, null);
            }

            //order by descending from the data source
            public OrderByDescending<TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): OrderByIterator<T> {

                //go build the iterator (which is really lazy loaded, its more to give them the order "then by" functionality
                return new OrderByIterator(this, SortOrder.Descending, SortPropertySelector, null);
            }

            //#endregion

            //#region Public Non Linq Iterator Functionality Methods

            //materializes the expression to an array
            public ToArray(): Array<T> {

                //go reset the iterator. incase they do a while...then they are calling ToArray()
                this.ResetQuery();

                //declare the array to return
                var ArrayToBeReturned = new Array<T>();

                //holds the item we are currently up to
                var CurrentItem: IteratorResult<T>;

                //loop through the array until we are done (the last call to next will reset the iterator for the next calls)
                while ((CurrentItem = this.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

                    //add the item to the array
                    ArrayToBeReturned.push(CurrentItem.CurrentItem);
                }

                //go traverse the tree and reset the iterator for each call in the chain
                this.ResetQuery();

                //return the array now
                return ArrayToBeReturned;
            }

            //materializes the expression to an array in a web worker so it doesn't feeze the ui. if a web worker is not available it will just call the ToArray()
            public ToArrayAsync(CallbackWhenQueryIsComplete: (Result: Array<T>) => void): void {

                if (typeof (Worker) !== "undefined") {
                    // Yes! Web worker support!

                    //go create the web worker
                    var workerToRun = new Worker('../Scripts/AsyncWebWorkerForDebugging.js');

                    //attach the event handler
                    workerToRun.addEventListener('message', e => {
                        debugger;
                        CallbackWhenQueryIsComplete(e.data);
                        //callback(e);
                    }, false);

                    //we need to go grab all the methods and push them to a string so we can rebuild it in the web worker. ie. Where => convert the Where method the dev passes in.

                    //go run the method (stringify the query)
                    workerToRun.postMessage(JSON.stringify(Iterator.SerializeAsyncFuncToStringTree(this)));

                } else {
                    // No Web Worker support.. just return the data
                    CallbackWhenQueryIsComplete(this.ToArray());
                }
            }

            //this is an abstract method
            public Next(): IteratorResult<T> {
                throw new Error('This method is abstract');
            }

            //this is an abstract method (this should be considered private)
            public ResetIterator() {
                throw new Error('This method is abstract');
            }

            //if you traverse the results (not calling ToArray()). we need to reset all the variables if you want to run the query again. this will do it
            //ToArray() automatically resets this
            public ResetQuery() {

                //go reset the iterator
                ResetIterator(this);
            }

            //#endregion

            //#region Private Static Methods

            public static BuildAsyncTree<T>(Query: Iterator<T>): Iterator<T> {
                debugger;
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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                throw new Error('This method is abstract');
            }

            public SerializeMethod(MethodToSerialize: any) {
                if (MethodToSerialize == null) {
                    return '';
                } else {
                    return MethodToSerialize.toString();
                }
            }

            //#endregion

            //#region Public Static Methods

            //pushes the query chain to an array
            public static ChainableTreeWalker<T>(Query: Iterator<T>): Array<IChainable<any, any>> {

                //declare the array we are going to return
                var IChainablesToReturn: Array<IChainable<any, any>> = new Array<IChainable<any, any>>();

                //declare the current query's previous expres
                var PreviousLambdaExpression: IChainable<any, any> = null;

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
                    PreviousLambdaExpression = (<any>PreviousLambdaExpression).PreviousExpression;
                }

                //return the array now
                return IChainablesToReturn;
            }

            //serialize the func 
            public static SerializeAsyncFuncToStringTree<T>(Query: Iterator<T>): Iterator<T> {
                debugger;
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
            }

            //#endregion

        }

        //#endregion

        //#region Iterator Re-Setting

        //reset's the chain of expressions so we can iterate through it again if we need too
        function ResetIterator(Expression: IChainable<any, any>) {

            //reset this iterator
            Expression.ResetIterator();

            //holds the working previous lambda expression

            //if we are coming from ToDictionary the root could be queryable...so we check that we have a previous expression
            //if (Expression.PreviousExpression != null) {

            //grab the queryable's next expression
            var PreviousLambdaExpression: IChainable<any, any> = Expression.PreviousExpression;
            //}

            //loop until we get to the queryable
            while (PreviousLambdaExpression != null && PreviousLambdaExpression.PreviousExpression != null) {

                //let's go call the reset Iterator on each method
                PreviousLambdaExpression.ResetIterator();

                //grab the next collection source
                PreviousLambdaExpression = (<any>PreviousLambdaExpression).PreviousExpression;
            }

            //check to see if its not null (base could be iqueryable)
            if (PreviousLambdaExpression != null) {

                //we should be at the queryable...so reset this queryable now
                PreviousLambdaExpression.ResetIterator();
            }
        }

        //#endregion

        //#region Interfaces

        //used to chain several iterators together so we can have a common interface between items
        export interface IChainable<T, TResult> {
            Next(): IteratorResult<TResult>;
            //CollectionSource: any;
            TypeOfObject: string;
            PreviousExpression: IChainable<any, T>;
            ResetIterator();
            AsyncSerializedFunc(): Array<KeyValuePair<string, string>>;
             
            //holds the methods we need to serialize when we run async
            AsyncSerialized: Array<KeyValuePair<string, string>>;
        }

        //used as a return object in the GroupBy Method
        export interface IGrouping<TKey, T> {

            //holds the key to the group by
            Key: TKey;

            //holds the item that are grouped in here because there key match the key to this item
            Items: Array<T>;
        }

        //Dictionary interface type
        export interface IDictionary<TKey, TValue> {

            //builds a dictionary from a Iterator / Collection
            BuildDictionary(DictionaryDataSource: Iterator<TValue>, KeySelector: (KeyPropertySelector: TValue) => TKey);

            //tries to find the key in the dictionary
            ContainsKey(Key: TKey): boolean;

            //add an item to the dictionary
            Add(Key: TKey, Value: TValue);

            //get a dictionary item
            GetItem(Key: TKey): TValue;

            //gets all the keys in the dictionary
            Keys(): Array<TKey>;

            //gets all the values in the dictionary
            Values(): Array<TValue>;

            //removes an item by key
            Remove(Key: TKey);

            //gets the count of items in the dictionary
            Count(): number;

            //gets all the items in the dictionary and returns a key value pair
            GetAllItems(): Array<KeyValuePair<TKey, TValue>>;

        }

        //Hashset interface type
        export interface IHashSet<TValue> {

            //tries to find the key / object in the hashset
            ContainsItem(ItemToRetrieve: TValue): boolean;

            //add an item to the hashset. Will return true if it was added. Returns false if it already exists in the hashset
            Add(ValueToAdd: TValue): boolean;

            //gets all the values in the hashset
            Values(): Array<TValue>;

            //removes an item
            Remove(KeyToRemove: TValue);

            //Builds a hashset from a Iterator, so if we have an iterator we don't need to materialize that AND a hashset and a key selector
            BuildHashSet(HashSetDataSource: Iterator<TValue>);

            //gets the count of items in the hashset
            Count(): number

        }

        //holds a key value pair data type
        export interface IKeyValuePair<TKey, TValue> {
            Key: TKey;
            Value: TValue;
        }

        //holds the interface which the "ThenBy" parameters in the order by
        export interface IThenByPropertySelectorParameters<T> {
            PropertySelector: (PropertyToSortOn: T) => any;
            ThenBySortOrder: SortOrder;
        }

        //#endregion

        //#region Enums

        export enum SortOrder {
            Ascending,
            Descending
        }

        //#endregion

        //#region Key Value Pair Object

        //key value pair
        export class KeyValuePair<TKey, TValue> implements IKeyValuePair<TKey, TValue> {

            //#region Constructor

            constructor(KeyToSet: TKey, ValueToSet: TValue) {

                //set the key
                this.Key = KeyToSet;

                //set the value
                this.Value = ValueToSet;
            }

            //#endregion 

            //#region Properties 

            public Key: TKey;
            public Value: TValue;

            //#endregion

        }

        //#endregion

        //#region Callback Iterator

        //allows you to create a callback iterator using a callback function. Currently not used, because you tend to cache this and use closures, so it will be slower. Leaving it in here incase I ever need it
        export class CallbackIterator<TCallBackResult> {

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

            constructor(EachItemCallBack: (TCallBackResult) => any, CollectionResultExecution: () => any) {

                //set the callback method. For each item which is found it will call the call back so the calling function can grab it
                this.ForEachItemCallBack = EachItemCallBack;

                //this method will do whatever and return the result
                this.ExecuteResults = CollectionResultExecution;
            }

            //#endregion

            //#region Properties

            //holds the callback to be made for each item
            public ForEachItemCallBack: (TCallBackResult) => any;

            //holds the method that will create the results.
            public ExecuteResults: () => void;

            //#endregion

        }

        //#endregion

        //#region Iterator Result

        //holds the status of an iterator
        export enum IteratorStatus {
            NotYetStarted = 0,
            Running = 1,
            Completed = 2
        }

        //holds the result of iterating through 1 element in an iterator
        export class IteratorResult<TResult> {

            //#region Constructor

            constructor(CurrentItemToSet: TResult, IteratorRunningStatus: IteratorStatus) {

                //set the return value
                this.CurrentItem = CurrentItemToSet;

                //set the current status
                this.CurrentStatus = IteratorRunningStatus;
            }

            //#endregion 

            //#region Properties 

            //Holds the current item the iterator has found.
            public CurrentItem: TResult;

            //Holds the current status of the iterator.
            public CurrentStatus: IteratorStatus;

            //#endregion

        }

        //#endregion

        //#region Queryable Class

        //Class used to turn a collection into something we can chain together with all the Iterator methods
        export class Queryable<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(Collection: Array<T>) {

                //throw the collection into a variable
                this.CollectionSource = Collection;

                //we always loop backwards from the length to 0...so set the index to the array length
                this.Index = 0;

                //let's store the collection source so we have it without going to the array (is length a property or method on javascript array)
                this.CollectionLength = this.CollectionSource.length;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "Queryable";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            //holds the index we are up to when iterating through collection
            private Index: number;

            //caches teh collection length
            private CollectionLength: number;

            //holds the base collection source which we are iterating over
            private CollectionSource: Array<T>;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //reset the index
                this.Index = 0;
            }

            //moves root of the query to the next available item
            public Next(): IteratorResult<T> {

                //are we at the end of the array?
                if (this.Index === this.CollectionLength) {

                    //let's return a null to kill the loop...
                    return new IteratorResult(null, IteratorStatus.Completed);

                } else {

                    //grab the next item in the collection and increment the index
                    return new IteratorResult(this.CollectionSource[this.Index++], IteratorStatus.Running);
                }
            }

            //#endregion

        }

        //#endregion

        //#region Linq Functionality Classes

        //Class is used to implement the Where Method Iterator
        export class WhereIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, WherePredicate: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.WhereClausePredicate = WherePredicate;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "WhereIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private WhereClausePredicate: (ItemToTest: T) => boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('WhereClausePredicate', super.SerializeMethod(this.WhereClausePredicate))];
            }

            //#endregion

        }

        //Class is used to grab the first record which meets the predicate
        export class FirstOrDefaultIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, WherePredicate?: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.WhereClausePredicate = WherePredicate;

                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                this.HasNullWhereClause = this.WhereClausePredicate == null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "FirstOrDefaultIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private WhereClausePredicate: (ItemToTest: T) => boolean;
            private HasNullWhereClause: boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('WhereClausePredicate', super.SerializeMethod(this.WhereClausePredicate))];
            }

            //#endregion

        }

        //Class is used to grab a single record which meets the predicate. It will throw an error if we have more then 1 record that meets the criteria. Will return null if nothing is found
        export class SingleOrDefaultIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, WherePredicate?: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.WhereClausePredicate = WherePredicate;

                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                this.HasNullWhereClause = this.WhereClausePredicate == null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "SingleOrDefaultIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private WhereClausePredicate: (ItemToTest: T) => boolean;
            private HasNullWhereClause: boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<T> {

                //holds the current selected items
                var CurrentSelectedItem: T = null;

                //do we have a match already? (faster to lookup a boolean then check the object against null)
                var WeHaveAMatch: boolean = false;

                //holds the next available item
                var NextItem: IteratorResult<T>;

                //we are going to keep looping until the previous expression is complete
                while ((NextItem = this.PreviousExpression.Next()).CurrentStatus !== ToracTechnologies.JLinq.IteratorStatus.Completed) {

                    //do we match the predicate?
                    if (this.HasNullWhereClause || this.WhereClausePredicate(NextItem.CurrentItem)) {

                        //we have a match...now we only want 1 item, otherwise we raise an error (that is the single logic)
                        //do we already have a match?
                        if (WeHaveAMatch) {
                            //we already have a match..throw an error
                            throw 'We Already Have A Match. SingleOrDefault Must Only Have 1 or 0 Items Returned. Use FirstOrDefault If You Are Expecting Multiple Items And Just Want To Grab The First Item';

                        } else {

                            //flip the flag so we know we already have a match
                            WeHaveAMatch = true;

                            //set the current item to this guy
                            CurrentSelectedItem = NextItem.CurrentItem;
                        }
                    }
                }

                //we are done iterating through the previous expression, just return the result
                return new IteratorResult(CurrentSelectedItem, IteratorStatus.Completed);
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('WhereClausePredicate', super.SerializeMethod(this.WhereClausePredicate))];
            }

            //#endregion

        }

        //Class is used to implement the Select Method Iterator
        export class SelectIterator<T, TNewObject> extends Iterator<TNewObject>
            implements IChainable<T, TNewObject> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, SelectCreatorPredicate: (ItemToTest: T) => TNewObject) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.SelectPredicate = SelectCreatorPredicate;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "SelectIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private SelectPredicate: (ItemToTest: T) => TNewObject;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<TNewObject> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('SelectPredicate', super.SerializeMethod(this.SelectPredicate))];
            }

            //#endregion

        }

        //Class is used to implement the Select Many Method Iterator
        export class SelectManyIterator<T, TCollectionType> extends Iterator<TCollectionType>
            implements IChainable<T, TCollectionType> {

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

            constructor(PreviousLambdaExpression: IChainable<T, T>, CollectionPropertySelector: (ItemToGetCollectionFrom: T) => Array<TCollectionType>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to grab the collection type
                this.CollectionPropertySelector = CollectionPropertySelector;

                //set the array holder to null
                this.CollectionItemsToReturn = null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "SelectManyIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            //holds the property selector which grabs the collection
            private CollectionPropertySelector: (ItemToGetCollectionFrom: T) => Array<TCollectionType>;

            //holds the items we need to return. when we select the collection we need to return multiple items. so we populate this guy until we return each of the items.
            //we then set it to null, then it will go to the next property to grab the next collection
            private CollectionItemsToReturn: Queryable<TCollectionType>;

            //#endregion

            //#region Methods

            public ResetIterator() {

                //we are going to reset the array holder which tells us this collection needs to be returned. when this is set to null, we go to the next collection and go through that guy
                this.CollectionItemsToReturn = null;
            }

            public Next(): IteratorResult<TCollectionType> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {

                    //do we have any guys to be returned?
                    if (this.CollectionItemsToReturn != null) {

                        //holds the sub property next value
                        var SubCollectionItem: IteratorResult<TCollectionType> = this.CollectionItemsToReturn.Next();

                        //is this sub collection done iterating through the sub collection?
                        if (SubCollectionItem.CurrentStatus === IteratorStatus.Completed) {

                            //we are done with the sub collection...set the queryable to null
                            this.CollectionItemsToReturn = null;

                        } else {
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
                    var SubCollectionToFlatten: Array<TCollectionType> = this.CollectionPropertySelector(NextItem.CurrentItem);

                    //if we have items in this sub collection and it's not null then we will build the sub collection item
                    if (SubCollectionToFlatten != null && SubCollectionToFlatten.length > 0) {

                        //we have sub collection items, so build up a queryable and re-use the queryable logic
                        this.CollectionItemsToReturn = new Queryable(SubCollectionToFlatten);
                    }

                    //we will keep looping. otherwise we need to handle the sub collection down here or right after the while(true)
                    //this way it will just loop around and we can handle it in 1 spot
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('CollectionPropertySelector', super.SerializeMethod(this.CollectionPropertySelector))];
            }

            //#endregion

        }

        //Class is used to return all the distinct values found
        export class DistinctIterator<T, TPropertyType> extends Iterator<TPropertyType>
            implements IChainable<T, TPropertyType> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, PropertySelector: (ItemToTest: T) => TPropertyType) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.PropertySelector = PropertySelector;

                //init the distinct lookup to a blank object
                this.DistinctLookup = new HashSet<TPropertyType>();

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "DistinctIterator";

                //go init the base class
                super();
            }

            //#endregion

            //#region Properties

            private PropertySelector: (ItemToTest: T) => TPropertyType;
            private DistinctLookup: IHashSet<TPropertyType>;

            //#endregion

            //#region Methods

            public ResetIterator() {

                //reset the lookup
                this.DistinctLookup = new HashSet<TPropertyType>();
            }

            public Next(): IteratorResult<TPropertyType> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
                    var PropertyValue: TPropertyType = this.PropertySelector(NextItem.CurrentItem);

                    //let's check if its in the list
                    if (PropertyValue != null && this.DistinctLookup.Add(PropertyValue)) {

                        //if we get a true from the Hashset.Add() method then it means its a new item...so return it now because it's distinct
                        return new IteratorResult(PropertyValue, IteratorStatus.Running);
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('PropertySelector', super.SerializeMethod(this.PropertySelector))];
            }

            //#endregion

        }

        //Class is used to implement the Take Method Iterator
        export class TakeIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, HowManyToTake: number) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the number of items to take
                this.HowManyToTake = HowManyToTake;

                //let's initialize how many we have returned
                this.HowManyHaveWeReturned = 0;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "TakeIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private HowManyToTake: number;
            private HowManyHaveWeReturned: number;

            //#endregion

            //#region Methods

            public ResetIterator() {

                //reset how many we have returned
                this.HowManyHaveWeReturned = 0;
            }

            public Next(): IteratorResult<T> {

                //if we are already at the max number we want to return, the just return null
                if (this.WeReturnedWhatWeWantedAlready()) {
                    //we have what we want just return null
                    return new IteratorResult(null, IteratorStatus.Completed);
                }

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            private WeReturnedWhatWeWantedAlready(): boolean {
                return this.HowManyHaveWeReturned === this.HowManyToTake;
            }

            //#endregion

        }

        //will return all the elements before the test no longer passes. "Where" will return everything that meet the condition. TakeWhile will exit the routine wasn't it doesnt pass the expression
        export class TakeWhileIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, TakeWhilePredicate: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the predicate to take while
                this.PredicateToTakeWhile = TakeWhilePredicate;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "TakeWhileIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private PredicateToTakeWhile: (ItemToTest: T) => boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
                    return new IteratorResult<T>(null, IteratorStatus.Completed);
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('PredicateToTakeWhile', super.SerializeMethod(this.PredicateToTakeWhile))];
            }

            //#endregion

        }

        //Class is used to implement the Skip Method Iterator
        export class SkipIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, HowManyToSkip: number) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the number of items to skip
                this.HowManyToSkip = HowManyToSkip;

                //let's initialize how many we have skipped
                this.HowManyHaveWeSkipped = 0;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "SkipIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private HowManyToSkip: number;
            private HowManyHaveWeSkipped: number;

            //#endregion

            //#region Methods

            public ResetIterator() {

                //reset how many we have skipped
                this.HowManyHaveWeSkipped = 0;
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
                    } else {
                        //we found this guy so return it...after we return this method we will jump a level to the next level down the tree
                        return NextItem;
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

        }

        //will Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. "Where" will return everything that meet the condition. SkipWhile will find the first element where the condition is met, and return the rest of the elements
        export class SkipWhileIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, SkipUntilPredicate: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the predicate to skip until
                this.PredicateSkipUntil = SkipUntilPredicate;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "SkipWhileIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private PredicateSkipUntil: (ItemToTest: T) => boolean;
            private ReturnRestOfElements: boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {

                //reset the met false condition property
                this.ReturnRestOfElements = false;
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
                        return new IteratorResult<T>(NextItem.CurrentItem, IteratorStatus.Running);
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('PredicateSkipUntil', super.SerializeMethod(this.PredicateSkipUntil))];
            }

            //#endregion

        }

        //  //creates a running total "T" then passes it in for each element
        export class AggregateIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, AggregatePredicate: (WorkingT: T, NextT: T) => T) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the running set clause
                this.PredicateAggregate = AggregatePredicate;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "AggregateIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private PredicateAggregate: (WorkingT: T, NextT: T) => T;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

                //working T
                var WorkingT: T = null;

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
                    } else {

                        //now let's keep setting T
                        WorkingT = this.PredicateAggregate(WorkingT, NextItem.CurrentItem);
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('PredicateAggregate', super.SerializeMethod(this.PredicateAggregate))];
            }

            //#endregion

        }

        //Class is used to determine if all elements match the where predicate
        export class AllIterator<T> extends Iterator<boolean>
            implements IChainable<T, boolean> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, WherePredicate: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.WhereClausePredicate = WherePredicate;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "AllIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private WhereClausePredicate: (ItemToTest: T) => boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<boolean> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('WhereClausePredicate', super.SerializeMethod(this.WhereClausePredicate))];
            }

            //#endregion

        }

        //Class is used to determine if there are any elements in the collection
        export class AnyIterator<T> extends Iterator<boolean>
            implements IChainable<T, boolean> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, WherePredicate: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.WhereClausePredicate = WherePredicate;

                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                this.HasNullWhereClause = this.WhereClausePredicate == null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "AnyIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private HasNullWhereClause: boolean;
            private WhereClausePredicate: (ItemToTest: T) => boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<boolean> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('WhereClausePredicate', super.SerializeMethod(this.WhereClausePredicate))];
            }

            //#endregion

        }

        //Class is used to determine the last item in the collection
        export class LastIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, WherePredicate: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.WhereClausePredicate = WherePredicate;

                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                this.HasNullWhereClause = this.WhereClausePredicate == null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "LastIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private HasNullWhereClause: boolean;
            private WhereClausePredicate: (ItemToTest: T) => boolean;
            private LastItemFound: T;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //reset the last item found
                this.LastItemFound = null;
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('WhereClausePredicate', super.SerializeMethod(this.WhereClausePredicate))];
            }

            //#endregion

        }

        //Class is used to implement concat between 2 iterator's
        export class ConcatIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, QueryToConcat: Iterator<T>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set query you want to concat together
                this.ConcatThisQuery = QueryToConcat;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "ConcatIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private ConcatThisQuery: Iterator<T>;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //reset the other iterator
                this.ConcatThisQuery.ResetQuery();
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {

                    //grab the first level next item.
                    NextItem = this.PreviousExpression.Next();

                    //are we done with the first iterator? if so, we need to move on to the 2nd iterator / array that we are going to combine
                    if (NextItem.CurrentStatus !== IteratorStatus.Completed) {

                        //we are not complete, so return this guy. (once we are done with the first iterator we will start the second)
                        return NextItem;
                    } else {

                        //we are done with the first query, so start looping through the 2nd query
                        while (true) {

                            //grab the previous expression for this guy and just keep returning this guy
                            return this.ConcatThisQuery.Next();
                        }
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

        }

        //Class is used to implement the union's between 2 iterator's
        export class UnionIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, QueryToUnion: Iterator<T>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set query you want to union together
                this.UnionThisQuery = QueryToUnion;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "UnionIterator";

                //create a new dictionary
                this.HashSetStore = new HashSet<T>();

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private UnionThisQuery: Iterator<T>;
            private HashSetStore: IHashSet<T>;

            //#endregion

            //#region Methods

            public ResetIterator() {

                //reset the other iterator
                this.UnionThisQuery.ResetQuery();

                //reset the dictionary
                this.HashSetStore = new HashSet<T>();
            }

            public Next(): IteratorResult<T> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {

                    //grab the first level next item.
                    NextItem = this.PreviousExpression.Next();

                    //are we done with the first iterator? if so, we need to move on to the 2nd iterator / array that we are going to combine
                    if (NextItem.CurrentStatus !== IteratorStatus.Completed && this.HashSetStore.Add(NextItem.CurrentItem)) {

                        //we are not complete and we just added this guy, so return this guy. (once we are done with the first iterator we will start the second)
                        return NextItem;

                    } else {

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

        }

        //Class is used to implement a count with a where predicate
        export class CountIterator<T> extends Iterator<number>
            implements IChainable<T, number> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, WherePredicate: (ItemToTest: T) => boolean) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the filter to run the where clause on
                this.WhereClausePredicate = WherePredicate;

                //let's store if the where clause is null. This way we don't need to check it everytime we loop around. 
                this.HasNullWhereClause = this.WhereClausePredicate == null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "CountIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private HasNullWhereClause: boolean;
            private WhereClausePredicate: (ItemToTest: T) => boolean;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //nothing to reset
            }

            public Next(): IteratorResult<number> {

                //holds the count of how many items we have
                var NumberOfItems: number = 0;

                //holds the next available item
                var NextItem: IteratorResult<T>;

                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {

                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();

                    //go grab the next item...is it null? which means we are done with the record set
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {

                        //no more items. return the count of items
                        return new IteratorResult(NumberOfItems, IteratorStatus.Completed);

                    } else if (this.HasNullWhereClause || this.WhereClausePredicate(NextItem.CurrentItem)) {

                        //we either have no where clause or we have a where clause and it matches the where clause
                        NumberOfItems++;
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('WhereClausePredicate', super.SerializeMethod(this.WhereClausePredicate))];
            }

            //#endregion

        }

        //Class is used to determine what the lowest value number is in data source
        export class MinIterator extends Iterator<number>
            implements IChainable<number, number> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<number, number>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //go init the current lowest number to null
                this.CurrentLowestNumber = null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "MinIterator";

                //go init the base class
                super();
            }

            //#endregion

            //#region Properties

            private CurrentLowestNumber: number;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //set the current lowest number back to the init phase
                this.CurrentLowestNumber = null;
            }

            public Next(): IteratorResult<number> {

                //holds the next available item
                var NextItem: IteratorResult<number>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

        }

        //Class is used to determine what the largest value number is in data source
        export class MaxIterator extends Iterator<number>
            implements IChainable<number, number> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<number, number>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //init the current larget number to null
                this.CurrentLargestNumber = null;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "MaxIterator";

                //go init the base class
                super();
            }

            //#endregion

            //#region Properties

            private CurrentLargestNumber: number;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //set the current largest number back to the init phase
                this.CurrentLargestNumber = null;
            }

            public Next(): IteratorResult<number> {

                //holds the next available item
                var NextItem: IteratorResult<number>;

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

        }

        //Class is used to calculate the sum of the data source
        export class SumIterator extends Iterator<number>
            implements IChainable<number, number> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<number, number>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //let's init the current sum tally
                this.CurrentSumTally = 0;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "SumIterator";

                //go init the base class
                super();
            }

            //#endregion

            //#region Properties

            private CurrentSumTally: number;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //set the current tally back to 0
                this.CurrentSumTally = 0;
            }

            public Next(): IteratorResult<number> {

                //holds the next available item
                var NextItem: IteratorResult<number>;

                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {

                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();

                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {

                        //if we get here we have no more records...just pass back the sum
                        return new IteratorResult(this.CurrentSumTally, IteratorStatus.Completed);

                    } else {

                        //if the number is not null then add it to the tally
                        //add this current number to the tally
                        this.CurrentSumTally += NextItem.CurrentItem;
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

        }

        //Class is used to calculate the averge of the data source (this will skip over nulls and not use them in the formula)
        export class AverageIterator extends Iterator<number>
            implements IChainable<number, number> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<number, number>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //let's reset the sum tally
                this.CurrentSumTally = 0;

                //reset the current count tally;
                this.CurrentItemCountTally = 0;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "AverageIterator";

                //go call the base class init
                super();
            }

            //#endregion

            //#region Properties

            private CurrentSumTally: number;
            private CurrentItemCountTally: number;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //set the current tally's back to 0
                this.CurrentSumTally = 0;
                this.CurrentItemCountTally = 0;
            }

            public Next(): IteratorResult<number> {

                //holds the next available item
                var NextItem: IteratorResult<number>;

                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {

                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();

                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {

                        //if we get here we have no more records...just pass back the sum
                        return new IteratorResult(this.CurrentSumTally / this.CurrentItemCountTally, IteratorStatus.Completed);

                    } else {
                        //if the number is not null then add it to the tally  
                        //add this current number to the tally
                        this.CurrentSumTally += NextItem.CurrentItem;

                        //add the counter by 1 now 
                        this.CurrentItemCountTally++;
                    }
                }
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

        }

        //Class is used to group the data
        export class GroupIterator<T, TKey> extends Iterator<IGrouping<TKey, T>[]>
            implements IChainable<T, IGrouping<TKey, T>[]> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, IGrouping<TKey, T>>, GroupBySelector: (ItemToGetKeyFrom: T) => TKey) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the group by selector
                this.GroupBySelector = GroupBySelector;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "GroupIterator";

                //call the super for the base class
                super();
            }

            //#endregion

            //#region Properties

            //holds the selector which will chunk the data by
            private GroupBySelector: (ItemToGetKeyFrom: T) => TKey;

            //#endregion

            //#region Methods

            public ResetIterator() {
                //reset the igrouping tally
            }

            public Next(): IteratorResult<IGrouping<TKey, T>[]> {

                //holds the next available item
                var NextItem: IteratorResult<T>;

                //declare the internal dictionary we used to hold the values
                var DictionaryOfGroupings = new Dictionary<TKey, T[]>();

                //just keep looping as we recurse through the CollectionSource which contains all the calls down the tree
                while (true) {

                    //grab the next level and then the next guy for that level
                    NextItem = this.PreviousExpression.Next();

                    //if its null or we want to grab this guy because he meets the criteria then jump out of the loop
                    if (NextItem.CurrentStatus === IteratorStatus.Completed) {

                        //we are all done, return the array now
                        return new IteratorResult(DictionaryOfGroupings.GetAllItems().Select(x => { return { Key: x.Key, Items: x.Value }; }).ToArray(), IteratorStatus.Completed);
                    }

                    //let's grab this item's key
                    var NextItemKey: TKey = this.GroupBySelector(NextItem.CurrentItem);

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
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('GroupBySelector', super.SerializeMethod(this.GroupBySelector))];
            }

            //#endregion

        }

        //used to order a query
        export class OrderByIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, DirectionToSort: SortOrder, PropertySortSelector: (PropertyToSortOn: T) => any, AdditionalSortPropertySelectors: Array<IThenByPropertySelectorParameters<T>>) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //set the sort order
                this.SortDirection = DirectionToSort;

                //set the initial property sort selector
                this.SortPropertySelector = PropertySortSelector;

                //set the "then by" items
                this.ThenBySortPropertySelectors = AdditionalSortPropertySelectors;

                //set the flag that we need to build the data source
                this.NeedToBuildDataSource = true;

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "OrderByIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Properties

            private SortDirection: SortOrder;
            private SortPropertySelector: (PropertyToSortOn: T) => any;

            //holds the additional sort properties (this gets set from OrderThenByIterator)
            public ThenBySortPropertySelectors: Array<IThenByPropertySelectorParameters<T>>;

            //holds the data source we materialize so we can pass the full array into the Array.sort method
            private DataSource: Queryable<T>;

            //holds if we set the data source already
            private NeedToBuildDataSource: boolean;

            //#endregion

            //#region Public Methods

            //#region IChainable Methods

            public ResetIterator() {

                //go reset the data source
                this.DataSource = null;

                //reset the data soure is built flag
                this.NeedToBuildDataSource = true;
            }

            public Next(): IteratorResult<T> {

                //have we build the data source yet?
                if (this.NeedToBuildDataSource) {

                    //first thing we are going to do is push the previous expression to an array...this way we can sort it
                    //go sort the item and throw it into the data source
                    this.DataSource = new Queryable<T>(this.SortData((<Iterator<T>>this.PreviousExpression).ToArray(), this.SortPropertySelector, this.SortDirection, this.ThenBySortPropertySelectors));

                    //set the flag now
                    this.NeedToBuildDataSource = false;
                }

                //just keep returning until the data source is completed
                return this.DataSource.Next();
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return [new KeyValuePair('SortPropertySelector', super.SerializeMethod(this.SortPropertySelector))];
            }

            //#endregion

            //#region ThenBy and ThenByDescending Methods

            //additional order by "ThenBy"
            public ThenBy<TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): OrderThenByIterator<T> {

                //go create the OrderThenByIterator
                return new OrderThenByIterator<T>(this, SortPropertySelector, SortOrder.Ascending);
            }

            //additional order by "ThenByDescending"
            public ThenByDescending<TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): OrderThenByIterator<T> {

                //go create the OrderThenByIterator
                return new OrderThenByIterator<T>(this, SortPropertySelector, SortOrder.Descending);
            }

            //#endregion

            //#endregion

            //#region Private Methods

            //sorts the actual data
            private SortData<T>(Collection: Array<T>, SortPropertySelector: (PropertyToSortOn: T) => any, OrderToSort: SortOrder, ThenBySortPropertySelectors: Array<IThenByPropertySelectorParameters<T>>): Array<T> {

                //Less than 0: Sort "a" to be a lower index than "b"
                //Zero: "a" and "b" should be considered equal, and no sorting performed.
                //Greater than 0: Sort "b" to be a lower index than "a".

                //throw if we have "then by" selectors that are filled out
                var HasThenBySelectors: boolean = ThenBySortPropertySelectors != null && ThenBySortPropertySelectors.Any();

                //throw how many sort by selectors we have
                var ThenBySelectorCount: number = null;

                //selectors come into play, so so set the count
                if (HasThenBySelectors) {

                    //just grab the count of the property selectors so we can cache the length
                    ThenBySelectorCount = ThenBySortPropertySelectors.Count();
                }

                //are we sorting asc
                var SortAsc = OrderToSort === SortOrder.Ascending;

                //go sort ascending
                Collection.sort((FirstItem: T, SecondItem: T): any => {

                    //grab the difference between the items (using the first order by property selector)
                    var ResultOfComparison: number = this.DetermineSortIndex(FirstItem, SecondItem, SortPropertySelector, SortAsc);

                    //if they are equal then we want to go to the additional sort by property selectors (thats really only scenario where then "ThenBy" selectors come into play)
                    if (ResultOfComparison === 0 && HasThenBySelectors) {

                        //we have "ThenBy"...so let's run through them until we get a final answer
                        for (var i = 0; i < ThenBySelectorCount; i++) {

                            //grab the guy we are up to
                            var CurrentSelector = ThenBySortPropertySelectors[i];

                            //go run the next comparison property selector
                            ResultOfComparison = this.DetermineSortIndex(FirstItem, SecondItem, CurrentSelector.PropertySelector, CurrentSelector.ThenBySortOrder === SortOrder.Ascending);

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
            }

            //determines if "A" should be after "B" in the sort order. Broker out into own methods so we can loop through multi sorts
            private DetermineSortIndex<T>(FirstItem: T, SecondItem: T, SortPropertySelector: (PropertyToSortOn: T) => any, SortAsc: boolean): number {

                //Less than 0: Sort "a" to be a lower index than "b"
                //Zero: "a" and "b" should be considered equal, and no sorting performed.
                //Greater than 0: Sort "b" to be a lower index than "a".

                //is an object array (use the property in the object)
                var FirstItemValue: any = SortPropertySelector(FirstItem);
                var SecondItemValue: any = SortPropertySelector(SecondItem);

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
                    } else {
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
                    } else {
                        //second item is null so "a" should be before "b"
                        return -1;
                    }

                }

                //is the first item greater than the second item?
                if (FirstItemValue > SecondItemValue) {

                    //which way to return
                    if (SortAsc) {
                        //"b" should be before "a"
                        return 1;
                    } else {
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
                    } else {
                        //"b" should be before "a"
                        return 1;
                    }
                }

                //they are equal return 0
                return 0;
            }

            //#endregion

        }

        export class OrderThenByIterator<T> extends Iterator<T>
            implements IChainable<T, T> {

            //#region Constructor

            constructor(PreviousLambdaExpression: IChainable<T, T>, SortPropertySelector: (PropertyToSortOn: T) => any, WhichSortOrder: SortOrder) {

                //set the queryable source
                this.PreviousExpression = PreviousLambdaExpression;

                //go build the dependancy on order by (so inject whatever we need in the "order by" branch
                this.BuildDependencyOnOrderBy(PreviousLambdaExpression, SortPropertySelector, WhichSortOrder);

                //throw this into a variable so we can debug this thing when we go from CollectionSource To CollectionSource and check the type
                this.TypeOfObject = "OrderThenByIterator";

                //because we inherit from Iterator we need to call the base class
                super();
            }

            //#endregion

            //#region Public Methods

            //#region IChainable Methods

            public ResetIterator() {
            }

            public Next(): IteratorResult<T> {

                //just return the previous expression, because the "OrderBy" will sort the "ThenBy" items. So just loop until we are done because we are already sorted
                return this.PreviousExpression.Next();
            }

            public AsyncSerializedFunc(): Array<KeyValuePair<string, string>> {
                return null;
            }

            //#endregion

            //#region ThenBy and ThenByDescending Methods

            //additional order by "ThenBy"
            public ThenBy<TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): OrderThenByIterator<T> {

                //go create the OrderThenByIterator
                return new OrderThenByIterator(this, SortPropertySelector, SortOrder.Ascending);
            }

            //additional order by "ThenByDescending"
            public ThenByDescending<TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): OrderThenByIterator<T> {

                //go create the OrderThenByIterator
                return new OrderThenByIterator(this, SortPropertySelector, SortOrder.Descending);
            }

            //#endregion

            //#endregion

            //#region Private Helper Methods

            private BuildDependencyOnOrderBy(WorkingQuery: IChainable<T, T>, SortPropertySelector: (PropertyToSortOn: T) => any, WhichSortOrder: SortOrder) {

                //traverse down the tree until we find an "OrderByIterator"...and attach this call to the additional sort properties (this way we only sort everything once)
                var FirstOrderByIterator: OrderByIterator<T> = <any>Iterator.ChainableTreeWalker(<any>WorkingQuery).FirstOrDefault(x => x.TypeOfObject === 'OrderByIterator');

                //did we find it?
                if (FirstOrderByIterator == null) {

                    //throw an error because we can't find the order by
                    throw "Can't Find Order By Statement. Set An 'OrderBy' Or 'OrderByDescending' Before Calling 'ThenBy' / 'ThenByDescending'";
                }

                //we have a sort iterator. So let's add the additional order by's (first check to make sure it's not null)
                if (FirstOrderByIterator.ThenBySortPropertySelectors == null) {

                    //go create the array
                    FirstOrderByIterator.ThenBySortPropertySelectors = new Array<IThenByPropertySelectorParameters<T>>();
                }

                //add the parameters to add
                var AdditionalSortPropertyToAdd: IThenByPropertySelectorParameters<T> = {
                    PropertySelector: SortPropertySelector,
                    ThenBySortOrder: WhichSortOrder
                };

                //now add the call
                FirstOrderByIterator.ThenBySortPropertySelectors.push(AdditionalSortPropertyToAdd);
            }

            //#endregion

        }

        //#endregion

        //#region Dictionary Class

        //Dictionary class. Uses a javascript object internally. Supports multi-key objects with the following sample key selector { Key1: x.Prop1, Key2: x.Prop2};
        export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {

            //#region Properties

            //holds the internal dictionary as a javascript object.
            private InternalDictionary: any = {};

            //holds the type of T so if we need to cast it back we can
            private TypeOfTKey: string = null;

            //when we have multi key objects, we need a way of grabbbing the date properties when we convert it back. So we store the date property names
            private DatePropertiesForMultiKey: IDictionary<string, boolean> = null;

            //#endregion

            //#region Public Methods

            //tries to find the key in the dictionary
            public ContainsKey(KeyToCheckFor: TKey): boolean {

                //return the result if we found a match (check if that property exists)
                return this.InternalDictionary.hasOwnProperty(this.TKeyToInternalKey(KeyToCheckFor));
            }

            //add an item to the dictionary
            public Add(Key: TKey, Value: TValue) {

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

                        } else {

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
            }

            //get a dictionary item
            public GetItem(Key: TKey): TValue {

                //return the item
                return this.GetItemHelper(this.TKeyToInternalKey(Key));
            }

            //gets all the keys in the dictionary
            public Keys(): Array<TKey> {

                //keys to return
                var KeysToReturn: Array<TKey> = new Array<TKey>();

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
            }

            //gets all the values in the dictionary
            public Values(): Array<TValue> {

                //keys to return
                var ValuesToReturn: Array<TValue> = new Array<TValue>();

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
            }

            //removes an item by key
            public Remove(Key: TKey) {
                //delete this item
                delete this.InternalDictionary[this.TKeyToInternalKey(Key)];
            }

            //Builds a dictionary from a Iterator, so if we have an iterator we don't need to materialize that AND a dictionary and a key selector
            public BuildDictionary(DictionaryDataSource: Iterator<TValue>, KeySelector: (KeyPropertySelector: TValue) => TKey) {

                //holds the data source which we will use to build the dictionary as we loop through iterator
                var CurrentIteratorResult: IteratorResult<TValue>;

                //let's just reset this iterator first
                DictionaryDataSource.ResetQuery();

                //let's start iterating through the data source (this way we don't have to materialize the data source to another array)
                while ((CurrentIteratorResult = DictionaryDataSource.Next()).CurrentStatus !== IteratorStatus.Completed) {

                    //add the item to the dictionary (the value is item)
                    this.Add(KeySelector(CurrentIteratorResult.CurrentItem), CurrentIteratorResult.CurrentItem);
                }

                //go reset the iterator again
                DictionaryDataSource.ResetQuery();
            }

            //gets the count of items in the dictionary
            public Count(): number {

                //holds the count of items
                var CountOfItems: number = 0;

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
            }

            //gets all the items in the dictionary and returns a key value pair
            public GetAllItems(): Array<IKeyValuePair<TKey, TValue>> {

                //declare our array to be returned
                var ArrayToBeReturned = new Array<IKeyValuePair<TKey, TValue>>();

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
            }

            //#endregion

            //#region Private Methods

            //internal helper so we can pass in if we want the internal key dictionary format
            private GetItemHelper(InternalFormatKey: string): TValue {

                //return the item
                return this.InternalDictionary[InternalFormatKey];
            }

            //converts the TKey passed in, to the internal key
            private TKeyToInternalKey(KeyValue: TKey): string {

                if (this.TypeOfTKey === 'date') {
                    return <any>KeyValue;
                } else {
                    return JSON.stringify(KeyValue);
                }
            }

            //When getting the keys (since they are stored as strings) we will need to convert them back to TKey data type
            private InternalKeyToTKey(KeyValue: string): TKey {

                //is this just a regular date key?
                if (this.TypeOfTKey === 'date') {
                    return <any>KeyValue;
                }
                else {

                    //throw the dictionary into a variable so we have access to it in the 

                    //parse reviver needs to be in a closure so we can access the dictionary
                    return <any>JSON.parse(KeyValue,(key, value) => {

                        //is this a date item
                        if (this.DatePropertiesForMultiKey != null && this.DatePropertiesForMultiKey.ContainsKey(key)) {
                            //it's a date so create a new date with the value and return it
                            return new Date(value);
                        } else {
                            //just return the value
                            return value;
                        }
                    });
                }
            }

            //is this a date data type?
            private IsDateProperty(ValueToCheck: any): boolean {
                return (ValueToCheck instanceof Date && !isNaN(<any>ValueToCheck.valueOf()));
            }

            //gets all the date properties in a multi key object
            private DateColumnsInMultiKeyObject(KeyValue: TKey): IDictionary<string, boolean> {

                //this is a multi key (object) item. Declare the new dictionary so we can keep track if there are any date columns in this array
                var DatePropertiesInMultiObjectKey = new Dictionary<string, boolean>();

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
            }

            //#endregion

        }

        //#endregion

        //#region HashSet Class

        //HashSet Class. Uses a Dictionary internally. Supports multi-key objects with the following sample key selector { Key1: x.Prop1, Key2: x.Prop2};
        export class HashSet<TValue> {

            //#region Properties

            //holds the internal dictionary as a javascript object. (uses boolean as the value to keep the memory footprint as low as possible
            private InternalHashSet: Dictionary<TValue, boolean> = new Dictionary<TValue, boolean>();

            //#endregion

            //#region Public Methods

            //tries to find the key / object in the hashset
            public ContainsItem(ItemToRetrieve: TValue): boolean {

                //use the dictionary method to check for the key
                return this.InternalHashSet.ContainsKey(ItemToRetrieve);
            }

            //add an item to the hashset. Will return true if it was added. Returns false if it already exists in the hashset
            public Add(ValueToAdd: TValue): boolean {

                //check to see if we have it...dictionary will throw an error if we already have it. Hashset will just return false
                if (this.ContainsItem(ValueToAdd)) {

                    //we already have this guy in the internal dictionary, for hashset, just return false
                    return false;
                }

                //add the item to the internal dictionary (pass in null as the value to keep the memory footprint low)
                this.InternalHashSet.Add(ValueToAdd, null);

                //we returned it, so now return true
                return true;
            }

            //gets all the values in the hashset
            public Values(): Array<TValue> {

                //use the dictionary keys to grab all the data
                return this.InternalHashSet.Keys();
            }

            //removes an item
            public Remove(KeyToRemove: TValue) {

                //go remove the item from the dictionary method
                this.InternalHashSet.Remove(KeyToRemove);
            }

            //Builds a hashset from a Iterator, so if we have an iterator we don't need to materialize that AND a hashset and a key selector
            public BuildHashSet(HashSetDataSource: Iterator<TValue>) {

                //go build the hashset (since this doesn't match the dictionary value, because we aren't deriving the key from the value, we will loop 1 by 1)
                var CurrentIteratorResult: IteratorResult<TValue>;

                //let's just reset this iterator first
                HashSetDataSource.ResetQuery();

                //let's start iterating through the data source (this way we don't have to materialize the data source to another array)
                while ((CurrentIteratorResult = HashSetDataSource.Next()).CurrentStatus !== IteratorStatus.Completed) {

                    //add the item to the dictionary (the value is item)
                    this.Add(CurrentIteratorResult.CurrentItem);
                }

                //go reset the iterator again
                HashSetDataSource.ResetQuery();
            }

            //gets the count of items in the hashset
            public Count(): number {

                //go grab the count
                return this.InternalHashSet.Count();
            }

            //#endregion

        }

        //#endregion

    }

}

//#region Extension Methods

//#region Array Interface

interface Array<T> {

    AsQueryable(): ToracTechnologies.JLinq.Queryable<T>;

    Where(WhereClauseSelector: (ItemToTest: T) => boolean): ToracTechnologies.JLinq.WhereIterator<T>;

    First(WhereClauseSelector?: (ItemToTest: T) => boolean): T;
    FirstOrDefault(WhereClauseSelector?: (ItemToTest: T) => boolean): T;
    Single(WhereClauseSelector?: (ItemToTest: T) => boolean): T;
    SingleOrDefault(WhereClauseSelector?: (ItemToTest: T) => boolean): T;

    Select<TNewObject>(Creator: (ItemToSelect: T) => TNewObject): ToracTechnologies.JLinq.SelectIterator<T, TNewObject>;
    SelectMany<TCollectionType>(CollectionPropertySelector: (thisCollectionProperty: T) => Array<TCollectionType>): ToracTechnologies.JLinq.SelectManyIterator<T, TCollectionType>;
    Distinct<TPropertyType>(PropertySelector: (ItemToTest: T) => TPropertyType): ToracTechnologies.JLinq.DistinctIterator<T, TPropertyType>;

    Take(HowManyToTake: number): ToracTechnologies.JLinq.TakeIterator<T>;
    TakeWhile(PredicateToTakeWhile: (ItemToTest: T) => boolean): ToracTechnologies.JLinq.TakeWhileIterator<T>;

    Skip(HowManyToSkip: number): ToracTechnologies.JLinq.SkipIterator<T>;
    SkipWhile(PredicateToSkipUntil: (ItemToTest: T) => boolean): ToracTechnologies.JLinq.SkipWhileIterator<T>;

    Aggregate(AggregatePredicate: (WorkingT: T, NextT: T) => T): T;
    All(WhereClauseSelector: (ItemToTest: T) => boolean): boolean;

    Any(WhereClauseSelector?: (ItemToTest: T) => boolean): boolean;
    Last(WhereClauseSelector?: (ItemToTest: T) => boolean): T;

    ConcatQuery(QueryToConcat: ToracTechnologies.JLinq.Iterator<T>): ToracTechnologies.JLinq.ConcatIterator<T>;
    Concat(ArrayToConcat: Array<T>): ToracTechnologies.JLinq.ConcatIterator<T>;
    UnionQuery(QueryToUnion: ToracTechnologies.JLinq.Iterator<T>): ToracTechnologies.JLinq.UnionIterator<T>;
    Union(ArrayToUnion: Array<T>): ToracTechnologies.JLinq.UnionIterator<T>;

    Count(): number;
    Count(WhereClauseSelector?: (ItemToTest: T) => boolean): number;
    Min(): number;
    Max(): number;
    Sum(): number;
    Average(): number;

    GroupBy<TKey>(GroupBySelector: (ItemKeyToTest: T) => TKey): Array<ToracTechnologies.JLinq.IGrouping<TKey, T>>;
    ToDictionary<TKey>(KeySelector: (PropertyToKeyOn: T) => TKey): ToracTechnologies.JLinq.IDictionary<TKey, T>;
    ToHashSet(): ToracTechnologies.JLinq.IHashSet<T>;
    Paginate(CurrentPageNumber: number, HowManyRecordsPerPage: number): ToracTechnologies.JLinq.TakeIterator<T>;

    OrderBy<TSortPropertyType>(SortPropertySelector: (thisPropertyToSortOn: T) => TSortPropertyType): ToracTechnologies.JLinq.OrderByIterator<T>;
    OrderByDescending<TSortPropertyType>(SortPropertySelector: (thisPropertyToSortOn: T) => TSortPropertyType): ToracTechnologies.JLinq.OrderByIterator<T>;
}

//#endregion

//#region Prototypes

Array.prototype.AsQueryable = function <T>(): ToracTechnologies.JLinq.Queryable<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this);
}

Array.prototype.Where = function <T>(WhereClauseSelector: (ItemToTest: T) => boolean): ToracTechnologies.JLinq.WhereIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Where(WhereClauseSelector);
};

Array.prototype.First = function <T>(WhereClauseSelector?: (ItemToTest: T) => boolean): T {
    return new ToracTechnologies.JLinq.Queryable<T>(this).First(WhereClauseSelector);
};

Array.prototype.FirstOrDefault = function <T>(WhereClauseSelector?: (ItemToTest: T) => boolean): T {
    return new ToracTechnologies.JLinq.Queryable<T>(this).FirstOrDefault(WhereClauseSelector);
};

Array.prototype.Single = function <T>(WhereClauseSelector?: (ItemToTest: T) => boolean): T {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Single(WhereClauseSelector);
};

Array.prototype.SingleOrDefault = function <T>(WhereClauseSelector?: (ItemToTest: T) => boolean): T {
    return new ToracTechnologies.JLinq.Queryable<T>(this).SingleOrDefault(WhereClauseSelector);
};

Array.prototype.Select = function <T, TNewObject>(Creator: (ItemToCreate: T) => TNewObject): ToracTechnologies.JLinq.SelectIterator<T, TNewObject> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Select(Creator);
};

Array.prototype.SelectMany = function <T, TCollectionType>(CollectionPropertySelector: (CollectionProperty: T) => Array<TCollectionType>): ToracTechnologies.JLinq.SelectManyIterator<T, TCollectionType> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).SelectMany(CollectionPropertySelector);
};

Array.prototype.Distinct = function <T, TPropertyType>(PropertySelector: (ItemToTest: T) => TPropertyType): ToracTechnologies.JLinq.DistinctIterator<T, TPropertyType> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Distinct(PropertySelector);
};

Array.prototype.Take = function <T>(HowManyToTake: number): ToracTechnologies.JLinq.TakeIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Take(HowManyToTake);
};

Array.prototype.TakeWhile = function <T>(PredicateToTakeWhile: (ItemToTest: T) => boolean): ToracTechnologies.JLinq.TakeWhileIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).TakeWhile(PredicateToTakeWhile);
};

Array.prototype.Skip = function <T>(HowManyToSkip: number): ToracTechnologies.JLinq.SkipIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Skip(HowManyToSkip);
};

Array.prototype.SkipWhile = function <T>(PredicateToSkipUntil: (ItemToTest: T) => boolean): ToracTechnologies.JLinq.SkipWhileIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).SkipWhile(PredicateToSkipUntil);
};

Array.prototype.Aggregate = function <T>(AggregatePredicate: (WorkingT: T, NextT: T) => T): T {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Aggregate(AggregatePredicate);
};

Array.prototype.All = function <T>(WhereClauseSelector: (ItemToTest: T) => boolean): boolean {
    return new ToracTechnologies.JLinq.Queryable<T>(this).All(WhereClauseSelector);
};

Array.prototype.Any = function <T>(WhereClauseSelector?: (ItemToTest: T) => boolean): boolean {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Any(WhereClauseSelector);
};

Array.prototype.Last = function <T>(WhereClauseSelector?: (ItemToTest: T) => boolean): T {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Last(WhereClauseSelector);
};

Array.prototype.ConcatQuery = function <T>(QueryToConcat: ToracTechnologies.JLinq.Iterator<T>): ToracTechnologies.JLinq.ConcatIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).ConcatQuery(QueryToConcat);
};

Array.prototype.Concat = function <T>(ArrayToConcat: Array<T>): ToracTechnologies.JLinq.ConcatIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Concat(ArrayToConcat);
};

Array.prototype.UnionQuery = function <T>(QueryToUnion: ToracTechnologies.JLinq.Iterator<T>): ToracTechnologies.JLinq.UnionIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).UnionQuery(QueryToUnion);
};

Array.prototype.Union = function <T>(ArrayToUnion: Array<T>): ToracTechnologies.JLinq.UnionIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Union(ArrayToUnion);
};

Array.prototype.Count = function <T>(): number {
    //don't even calculate this...just return the length
    return this.length;
};

Array.prototype.Count = function <T>(WhereClauseSelector?: (ItemToTest: T) => boolean): number {

    //otherwise use the regular method with the predicate
    return new ToracTechnologies.JLinq.Queryable<T>(this).Count(WhereClauseSelector);
};

Array.prototype.Min = function (): number {
    return new ToracTechnologies.JLinq.Queryable<number>(this).Min();
};

Array.prototype.Max = function (): number {
    return new ToracTechnologies.JLinq.Queryable<number>(this).Max();
};

Array.prototype.Sum = function (): number {
    return new ToracTechnologies.JLinq.Queryable<number>(this).Sum();
};

Array.prototype.Average = function (): number {
    return new ToracTechnologies.JLinq.Queryable<number>(this).Average();
};

Array.prototype.GroupBy = function <TKey, T>(GroupBySelector: (ItemKey: T) => TKey): ToracTechnologies.JLinq.IGrouping<TKey, T>[] {
    return new ToracTechnologies.JLinq.Queryable<T>(this).GroupBy(GroupBySelector);
};

Array.prototype.ToDictionary = function <TKey, TValue>(KeySelector: (PropertyToKeyOn: TValue) => TKey): ToracTechnologies.JLinq.IDictionary<TKey, TValue> {
    return new ToracTechnologies.JLinq.Queryable<TValue>(this).ToDictionary<TKey>(KeySelector);
};

Array.prototype.ToHashSet = function <T>(): ToracTechnologies.JLinq.IHashSet<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).ToHashSet();
};

Array.prototype.Paginate = function <T>(CurrentPageNumber: number, HowManyRecordsPerPage: number): ToracTechnologies.JLinq.TakeIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).Paginate(CurrentPageNumber, HowManyRecordsPerPage);
};

Array.prototype.OrderBy = function <T, TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): ToracTechnologies.JLinq.OrderByIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).OrderBy<TSortPropertyType>(SortPropertySelector);
};

Array.prototype.OrderByDescending = function <T, TSortPropertyType>(SortPropertySelector: (PropertyToSortOn: T) => TSortPropertyType): ToracTechnologies.JLinq.OrderByIterator<T> {
    return new ToracTechnologies.JLinq.Queryable<T>(this).OrderByDescending<TSortPropertyType>(SortPropertySelector);
};

//#endregion

//#endregion