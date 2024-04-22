using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DotNetCoreInventoryDashboard.dtos.Department;
using DotNetCoreInventoryDashboard.models;
using DotNetCoreInventoryDashboard.dtos.Employee;

namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class DepartmentMappers
    {
        public static DepartmentDto ToDepartmentDto(this Department department)
        {
            return new DepartmentDto
            {
                CreateAt = department.CreateAt,
                DepartmentId = department.DepartmentId,
                DepartmentName = department.DepartmentName,
                Employees = department.Employees.Select(e => e.ToEmployeeDto()).ToList()
            };
        }

        public static Department ToDepartmentCreateUpdateDto(this CreateUpdateDepartmentDto createUpdateDepartmentDto)
        {
            return new Department
            {
                CreateAt = createUpdateDepartmentDto.CreateAt,
                DepartmentName = createUpdateDepartmentDto.DepartmentName,
            };
        }

    }
}