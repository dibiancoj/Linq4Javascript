using System.Web;
using System.Web.Optimization;

namespace Linq4Javascript
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js", "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/Linq4Javscript").Include("~/Scripts/JLinq.js", "~/Scripts/JLinqWebWorker.js"));

            bundles.Add(new ScriptBundle("~/bundles/AsyncTester").Include("~/Scripts/ConfigForWorkingAsync.js"));

            bundles.Add(new ScriptBundle("~/bundles/AsyncUnitTests").Include(
                "~/Scripts/qunit.js", 
                "~/Scripts/UnitTestFramework.js",
                "~/Scripts/UnitTestsAsync.js"));

            bundles.Add(new ScriptBundle("~/bundles/Linq4JavscriptMainUnitTests").Include(
                "~/Scripts/qunit.js",
                "~/Scripts/UnitTestFramework.js",
                "~/Scripts/UnitTestsRegular.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap.css", "~/Content/site.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
