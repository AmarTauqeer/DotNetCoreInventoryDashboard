using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DotNetCoreInventoryDashboard.models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }
        [Required]
        public string EmployeeName { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = "test@gmail.com";
        [Required]
        public string Phone { get; set; } = "+4368864133067";
        public string Address { get; set; } = "address";
        public string PostalCode { get; set; } = "6020";
        public string City { get; set; } = "Innsbruck";
        public string Country { get; set; } = "Austria";
        public DateTime DOB { get; set; } = DateTime.Now;
        public DateTime CreateAt { get; set; } = DateTime.Now;

        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }
    }
}