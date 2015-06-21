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
            return View();
        }

        [HttpGet]
        public ActionResult PerformanceUnitTests()
        {
            return View();
        }

        [HttpGet]
        public ActionResult AsyncTester()
        {
            return View();
        }

    }
}
