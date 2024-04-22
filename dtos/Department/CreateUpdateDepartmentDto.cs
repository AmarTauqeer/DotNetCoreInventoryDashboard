using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotNetCoreInventoryDashboard.dtos.Department
{
    public class CreateUpdateDepartmentDto
    {
        public DateTime CreateAt { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
    }
}