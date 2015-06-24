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
            //todo: remove when we merge the branches. this is only so we go directly to the async page
            //return RedirectToAction("AsyncWorkingEnvironment");

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
