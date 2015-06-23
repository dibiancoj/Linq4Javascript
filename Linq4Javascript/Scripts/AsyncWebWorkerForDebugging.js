/// <reference path="asynctester.ts" />
/// <reference path="jlinq.ts" />
self.addEventListener('message', function (e) {
    //let's import the jlinq library
    importScripts('jlinq.js');
    //let's go parse the json which is the query
    var Query = JSON.parse(e.data);
    //let's rebuild the tree
    var TreeRebuilt = RebuildTree(Query);
    //go build up the results and pass back the array
    self.postMessage(TreeRebuilt.ToArray(), null, null);
}, false);
function RebuildTree(ParsedJsonQuery) {
    //now we need to copy all the base methods for each level of the tree
    //flatten the tree
    var FlatTree = ToracTechnologies.JLinq.Iterator.ChainableTreeWalker(ParsedJsonQuery);
    //queryable with the array
    var Queryable;
    for (var j = 0; j < FlatTree.length; j++) {
        //grab the node
        var Node = FlatTree[j];
        //is this a queryable?
        if (Node.TypeOfObject == 'Queryable') {
            //set this queryable
            Queryable = new ToracTechnologies.JLinq.Queryable(Node.CollectionSource);
            break;
        }
        else if (Node.PreviousExpression != null && Node.PreviousExpression.TypeOfObject == 'Queryable') {
            //set this queryable
            Queryable = new ToracTechnologies.JLinq.Queryable(Node.PreviousExpression.CollectionSource);
            break;
        }
    }
    //make sure we have an iterator
    if (Queryable == null) {
        throw "Couldn't Find A Starting Point For Querable In RebuildTree";
    }
    for (var i = FlatTree.length - 1; i >= 0; i--) {
        //grab the current item
        var CurrentLevelOfTree = FlatTree[i];
        //go re-build this tree node
        Queryable = RebuildSingleTreeNode(CurrentLevelOfTree, Queryable);
    }
    //return the queryable
    return Queryable;
}
function RebuildSingleTreeNode(CurrentLevelOfTree, Queryable) {
    if (CurrentLevelOfTree.TypeOfObject == 'WhereIterator') {
        return Queryable.Where(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'First') {
        return Queryable.First(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'FirstOrDefaultIterator') {
        return Queryable.FirstOrDefault(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'SingleIterator') {
        return Queryable.Single(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'SingleOrDefaultIterator') {
        return Queryable.Single(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'SelectIterator') {
        return Queryable.Select(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'SelectPredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'SelectManyIterator') {
        return Queryable.SelectMany(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'CollectionPropertySelector'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'DistinctIterator') {
        return Queryable.Distinct(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'PropertySelector'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'TakeIterator') {
        return Queryable.Take(CurrentLevelOfTree.HowManyToTake);
    }
    if (CurrentLevelOfTree.TypeOfObject == 'TakeWhileIterator') {
        return Queryable.TakeWhile(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'PredicateToTakeWhile'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'SkipIterator') {
        return Queryable.Skip(CurrentLevelOfTree.HowManyToSkip);
    }
    if (CurrentLevelOfTree.TypeOfObject == 'SkipWhileIterator') {
        return Queryable.SkipWhile(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'PredicateSkipUntil'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'AggregateIterator') {
        return Queryable.Aggregate(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'PredicateAggregate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'AllIterator') {
        return Queryable.All(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'AnyIterator') {
        return Queryable.Any(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'LastIterator') {
        return Queryable.Last(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'CountIterator') {
        return Queryable.Count(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'WhereClausePredicate'; }).Value));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'MinIterator') {
        return Queryable.Min();
    }
    if (CurrentLevelOfTree.TypeOfObject == 'MaxIterator') {
        return Queryable.Max();
    }
    if (CurrentLevelOfTree.TypeOfObject == 'SumIterator') {
        return Queryable.Sum();
    }
    if (CurrentLevelOfTree.TypeOfObject == 'AverageIterator') {
        return Queryable.Average();
    }
    if (CurrentLevelOfTree.TypeOfObject == 'GroupIterator') {
        return Queryable.GroupBy(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'GroupBySelector'; }).Value));
    }
    //we can ignore the order then by iterator because this just modifies the regular order by
    //if (CurrentLevelOfTree.TypeOfObject == 'OrderThenByIterator') {
    //    return new ToracTechnologies.JLinq.OrderThenByIterator(Queryable, ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(x => x.Key == 'SortPropertySelector').Value));
    //}
    if (CurrentLevelOfTree.TypeOfObject == 'OrderByIterator') {
        //cast the queryable
        var CastedOrderBy = Queryable;
        //go return the order by
        return new ToracTechnologies.JLinq.OrderByIterator(Queryable, CastedOrderBy.SortDirection, ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(function (x) { return x.Key == 'SortPropertySelector'; }).Value), CastedOrderBy.ThenBySortPropertySelectors);
    }
    if (CurrentLevelOfTree.TypeOfObject == 'ConcatArrayIterator') {
        //cast the queryable
        var CastedConcat = CurrentLevelOfTree;
        //we need to go rebuild the concat query tree...then pass it in
        return Queryable.ConcatQuery(RebuildTree(CastedConcat.ConcatThisQuery));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'ConcatQueryIterator') {
        //cast the queryable
        var CastedConcatQuery = RebuildTree(CurrentLevelOfTree.ConcatThisQuery);
        //we need to go rebuild the concat query tree...then pass it in
        return Queryable.ConcatQuery(CastedConcatQuery);
    }
    if (CurrentLevelOfTree.TypeOfObject == 'UnionArrayIterator') {
        //cast the queryable
        var CastedUnion = CurrentLevelOfTree;
        //we need to go rebuild the union query tree...then pass it in
        return Queryable.UnionQuery(RebuildTree(CastedUnion.UnionThisQuery));
    }
    if (CurrentLevelOfTree.TypeOfObject == 'UnionQueryIterator') {
        //cast the queryable
        var CastedUnionQuery = RebuildTree(CurrentLevelOfTree.UnionThisQuery);
        //we need to go rebuild the union query tree...then pass it in
        return Queryable.ConcatQuery(CastedUnionQuery);
    }
    if (CurrentLevelOfTree.TypeOfObject == 'Queryable') {
        //we need to go rebuild the concat query tree...then pass it in
        return new ToracTechnologies.JLinq.Queryable(CurrentLevelOfTree.CollectionSource);
    }
    throw 'Level Not Implemented: ' + CurrentLevelOfTree.TypeOfObject;
}
//# sourceMappingURL=AsyncWebWorkerForDebugging.js.map