using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Linq4Javascript.TestOnDotNetSide
{

    [DebuggerDisplay("Team = {TeamDescription}")]
    public class Team
    {
        public int TeamId { get; set; }
        public string TeamDescription { get; set; }
        public int SportId { get; set; }

        public static IEnumerable<Team> BuildTeamsLazy()
        {
            yield return new Team { TeamId = 1, TeamDescription = "Mets", SportId = 1 };
            yield return new Team { TeamId = 2, TeamDescription = "Yankees", SportId = 1 };
            yield return new Team { TeamId = 3, TeamDescription = "Rangers", SportId = 2 };
            yield return new Team { TeamId = 4, TeamDescription = "Knicks", SportId = 3 };
            yield return new Team { TeamId = 5, TeamDescription = "Jets", SportId = 4 };
            yield return new Team { TeamId = 6, TeamDescription = "Metro Starts", SportId = 9 };
        }
    }
}