//#region Configuration

/****** Notes ******/
//Every object is going to be immutable. This way we can't accIdentally add items

/*******************/

module UnitTestFramework {

    //holds the interface with the object type that is in the list that we will be querying
    export interface ITestObject {
        Id: number;
        Txt: string;
        IsActive: boolean;
        GroupByKey: string;
        GroupByKey2: string;
        CreatedDate: Date;

        lst: Array<number>;
    }

    //holds the interface for a simple object
    export interface IObject {
        Id: number;
        Txt: string;
        Txt2: string;
    }

    //method to build up the list of data
    export function BuildArray(howManyItems): Array<ITestObject> {

        //declare the array which we will populate
        var lst: Array<ITestObject> = new Array<ITestObject>();

        //loop through each of the items to add an object into the list
        for (var i = 0; i < howManyItems; i++) {

            //we will also test sub list's. so we will build a new number array insIde this object
            var SubList: Array<number>;

            //depending on which item we are up on we will populate the sub list differently
            if (i === 0) {
                SubList = null;
            } else if (i === 1) {
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

                lst: SubList
            });
        }

        //return the list now
        return lst;
    }

    //method to build up the "ThenBy" & "ThenByDesc" for the sort tests
    export function BuildSortOrderArray(): Array<IObject> {

        //array to test off of
        var ArrayToTest: Array<IObject> = new Array<IObject>();

        //now go add items
        ArrayToTest.push({ Id: 1, Txt: 'abc', Txt2: 'abc' });
        ArrayToTest.push({ Id: 2, Txt: 'abc', Txt2: 'zzz' });
        ArrayToTest.push({ Id: 4, Txt: 'zzz', Txt2: 'zzz' });
        ArrayToTest.push({ Id: 3, Txt: 'bcd', Txt2: 'bcd' });

        //return the array to test
        return ArrayToTest;
    }

    //default items to build
    export var _DefaultItemsToBuild: number = 5;

    //store the date to set so we can compare it
    export var _DateOfTest = Object.freeze(new Date());

    //holds the index == 1 date
    export var _FirstIndexDate = Object.freeze(new Date('12/1/1980'));

    //holds the build _Array so we don't have to keep building it each method
    export var _Array: Array<ITestObject> = Object.freeze(BuildArray(_DefaultItemsToBuild));

    //sort order array
    export var _SortOrderArray: Array<IObject> = Object.freeze(BuildSortOrderArray());

    //#endregion

}
