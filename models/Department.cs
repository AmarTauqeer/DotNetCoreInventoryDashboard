using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DotNetCoreInventoryDashboard.models
{
    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }
        [Required]
        public string DepartmentName { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public List<Employee> Employees { get; set; } = new List<Employee>();
    }
}