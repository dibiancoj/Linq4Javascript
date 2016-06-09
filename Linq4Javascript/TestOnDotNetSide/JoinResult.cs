using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Linq4Javascript.TestOnDotNetSide
{
    public class JoinResult
    {
        public string TeamDescription { get; set; }
        public string SportDescription { get; set; }
    }

    public class LeftJoinResult
    {
        public string SportDescription { get; set; }
        public IEnumerable<Team> Teams { get; set; }
    }
}