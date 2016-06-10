using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Linq4Javascript.TestOnDotNetSide
{

    [DebuggerDisplay("Sport = {SportDescription}")]
    public class Sport
    {
        public int SportId { get; set; }
        public string SportDescription { get; set; }

        public static IEnumerable<Sport> BuildSportsLazy()
        {
            yield return new Sport { SportId = 1, SportDescription = "Baseball" };
            yield return new Sport { SportId = 2, SportDescription = "Hockey" };
            yield return new Sport { SportId = 3, SportDescription = "Basketball" };
            yield return new Sport { SportId = 10, SportDescription = "Paintball" };
        }

    }
}