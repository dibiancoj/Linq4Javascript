using Linq4Javascript.TestOnDotNetSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Linq4Javascript.Controllers
{
    public class HomeController : Controller
    {

        [HttpGet]
        public ActionResult Index()
        {
            //var regularJoin = Team.BuildTeamsLazy().Join(Sport.BuildSportsLazy(), x => x.SportId, y => y.SportId, (t, s) => new JoinResult { TeamDescription = t.TeamDescription, SportDescription = s.SportDescription }).ToArray();

            //var groupJoin = Sport.BuildSportsLazy().GroupJoin(Team.BuildTeamsLazy(), x => x.SportId, y => y.SportId, (s, t) => new LeftJoinResult { SportDescription = s.SportDescription, Teams = t }).ToArray();
            //var groupJoin2 = Team.BuildTeamsLazy().GroupJoin(Sport.BuildSportsLazy(), x => x.SportId, y => y.SportId, (t, s) => new { Txt = t.TeamDescription, Values = s }).ToArray();


            //var groupby = Team.BuildTeamsLazy().GroupBy(x => x.SportId).ToArray();

            //var z = new List<int> { };

            //var zz = z.DefaultIfEmpty();

            //var lst = new List<Team>();

            //if (true == true)
            //{
            //    lst.Add(new Team { TeamId = 100, SportId = 100 });
            //    lst.Add(new Team { TeamId = 200, SportId = 200 });
            //}

            //foreach (var t in lst.DefaultIfEmpty(new Team { SportId = 0, TeamDescription = "N/A", TeamId = 0 }))
            //{
            //    string s = t.SportId.ToString();
            //}

            return View();
        }

        [HttpGet]
        public ActionResult AsyncUnitTests()
        {
            return View();
        }

        [HttpGet]
        public ActionResult AsyncWorkingEnvironment()
        {
            return View();
        }

    }
}
