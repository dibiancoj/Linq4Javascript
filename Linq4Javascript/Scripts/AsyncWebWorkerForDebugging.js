/// <reference path="asynctester.ts" />
/// <reference path="jlinq.ts" />
self.addEventListener('message', function (e) {
    //let's import the jlinq library
    importScripts('jlinq.js');
    //let's go parse the json which is the query
    var Query = JSON.parse(e.data);
    //now we need to copy all the base methods for each level of the tree
    //flatten the tree
    var FlatTree = ToracTechnologies.JLinq.Iterator.ChainableTreeWalker(Query);
    //grab the queryable
    var Queryable = new ToracTechnologies.JLinq.Queryable(FlatTree[FlatTree.length - 1].PreviousExpression.CollectionSource);
    for (var i = FlatTree.length - 1; i >= 0; i--) {
        //grab the current item
        var CurrentLevelOfTree = FlatTree[i];
        //go re-build this tree nodes
        Queryable = RebuildTree(CurrentLevelOfTree, Queryable);
    }
    self.postMessage(Queryable.ToArray(), null, null);
}, false);
function RebuildTree(CurrentLevelOfTree, Queryable) {
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
    //if (CurrentLevelOfTree.TypeOfObject == 'OrderThenByIterator') {
    //    return Queryable.OrderThenByIterator(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(x => x.Key == 'SortPropertySelector').Value));
    //}
    //if (CurrentLevelOfTree.TypeOfObject == 'OrderByIterator') {
    //    return new ToracTechnologies.JLinq.OrderByIterator(Queryable, Queryable(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(x => x.Key == 'SortPropertySelector').Value));
    //}
    //if (CurrentLevelOfTree.TypeOfObject == 'OrderByIterator') {
    //    return new ToracTechnologies.JLinq.OrderByIterator(Queryable, Queryable(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(x => x.Key == 'SortPropertySelector').Value));
    //}
    //if (CurrentLevelOfTree.TypeOfObject == 'ConcatIterator') {
    //    return Queryable.Concat(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(x => x.Key == 'WhereClausePredicate').Value));
    //}
    //if (CurrentLevelOfTree.TypeOfObject == 'UnionIterator') {
    //    return Queryable.Union(ToracTechnologies.JLinq.Iterator.StringToCompiledMethod(CurrentLevelOfTree.AsyncSerialized.First(x => x.Key == 'WhereClausePredicate').Value));
    //}
    alert('Level Not Implemented: ' + CurrentLevelOfTree.TypeOfObject);
}
//# sourceMappingURL=AsyncWebWorkerForDebugging.js.map