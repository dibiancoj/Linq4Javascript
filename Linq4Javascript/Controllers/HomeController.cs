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
