//#region Configuration
/****** Notes ******/
//Every object is going to be immutable. This way we can't accIdentally add items
/*******************/
var UnitTestFramework;
(function (UnitTestFramework) {
    //method to build up the list of data
    function BuildArray(howManyItems) {
        //declare the array which we will populate
        var lst = new Array();
        //loop through each of the items to add an object into the list
        for (var i = 0; i < howManyItems; i++) {
            //we will also test sub list's. so we will build a new number array insIde this object
            var SubList;
            //depending on which item we are up on we will populate the sub list differently
            if (i === 0) {
                SubList = null;
            }
            else if (i === 1) {
                SubList = [];
            }
            else {
                SubList = [i, (i + 100)];
            }
            //finally push the object to the array
            lst.push({
                Id: i,
                Txt: i.toString(),
                IsActive: (i === 1 ? true : false),
                GroupByKey: (i < 3 ? 'test' : 'test1'),
                GroupByKey2: (i < 2 ? 'z1' : 'z2'),
                CreatedDate: (i === 1 ? UnitTestFramework._FirstIndexDate : UnitTestFramework._DateOfTest),
                lst: SubList
            });
        }
        //return the list now
        return lst;
    }
    UnitTestFramework.BuildArray = BuildArray;
    //method to build up the "ThenBy" & "ThenByDesc" for the sort tests
    function BuildSortOrderArray() {
        //array to test off of
        var ArrayToTest = new Array();
        //now go add items
        ArrayToTest.push({ Id: 1, Txt: 'abc', Txt2: 'abc' });
        ArrayToTest.push({ Id: 2, Txt: 'abc', Txt2: 'zzz' });
        ArrayToTest.push({ Id: 4, Txt: 'zzz', Txt2: 'zzz' });
        ArrayToTest.push({ Id: 3, Txt: 'bcd', Txt2: 'bcd' });
        //return the array to test
        return ArrayToTest;
    }
    UnitTestFramework.BuildSortOrderArray = BuildSortOrderArray;
    //default items to build
    UnitTestFramework._DefaultItemsToBuild = 5;
    //store the date to set so we can compare it
    UnitTestFramework._DateOfTest = Object.freeze(new Date());
    //holds the index == 1 date
    UnitTestFramework._FirstIndexDate = Object.freeze(new Date('12/1/1980'));
    //holds the build _Array so we don't have to keep building it each method
    UnitTestFramework._MutableArrayTest = BuildArray(UnitTestFramework._DefaultItemsToBuild);
    //holds a readonly array
    UnitTestFramework._ReadonlyArrayTest = Object.freeze(BuildArray(UnitTestFramework._DefaultItemsToBuild));
    //holds the DefaultIfEmpty object if the result is null
    UnitTestFramework._DefaultIfEmpty = Object.freeze({
        Id: -9999,
        Txt: '-9999',
        IsActive: false,
        GroupByKey: '',
        GroupByKey2: '',
        CreatedDate: UnitTestFramework._DateOfTest,
        lst: null
    });
    //sort order array
    UnitTestFramework._SortOrderArray = BuildSortOrderArray();
    function BuildBuildTeams() {
        return [
            { TeamId: 1, TeamDescription: "Mets", SportId: 1 },
            { TeamId: 2, TeamDescription: "Yankees", SportId: 1 },
            { TeamId: 3, TeamDescription: "Rangers", SportId: 2 },
            { TeamId: 4, TeamDescription: "Knicks", SportId: 3 },
            { TeamId: 5, TeamDescription: "Jets", SportId: 4 },
            { TeamId: 6, TeamDescription: "Metro Starts", SportId: 9 },
        ];
    }
    UnitTestFramework.BuildBuildTeams = BuildBuildTeams;
    function BuildSports() {
        return [
            { SportId: 1, SportDescription: "Baseball" },
            { SportId: 2, SportDescription: "Hockey" },
            { SportId: 3, SportDescription: "Basketball" },
            { SportId: 10, SportDescription: "Paintball" },
        ];
    }
    UnitTestFramework.BuildSports = BuildSports;
    //#endregion
})(UnitTestFramework || (UnitTestFramework = {}));
//# sourceMappingURL=unittestframework.js.map