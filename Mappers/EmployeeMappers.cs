using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DotNetCoreInventoryDashboard.models;
using DotNetCoreInventoryDashboard.dtos.Employee;

namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class EmployeeMappers
    {
        public static EmployeeDto ToEmployeeDto(this Employee employee)
        {
            return new EmployeeDto
            {
                EmployeeId = employee.EmployeeId,
                EmployeeName = employee.EmployeeName,
                DepartmentId = employee.DepartmentId,
                Email = employee.Email,
                Phone = employee.Phone,
                Address = employee.Address,
                City = employee.City,
                Country = employee.Country,
                PostalCode = employee.PostalCode,
                DOB = employee.DOB,
                CreateAt = employee.CreateAt,
            };
        }

        public static Employee ToEmployeeCreateUpdateDto(this CreateUpdateEmployeeDto createUpdateEmployeeDto, int departmentId)
        {
            return new Employee
            {

                EmployeeName = createUpdateEmployeeDto.EmployeeName,
                DepartmentId = departmentId,
                Email = createUpdateEmployeeDto.Email,
                Phone = createUpdateEmployeeDto.Phone,
                Address = createUpdateEmployeeDto.Address,
                City = createUpdateEmployeeDto.City,
                Country = createUpdateEmployeeDto.Country,
                PostalCode = createUpdateEmployeeDto.PostalCode,
                DOB = createUpdateEmployeeDto.DOB,
                CreateAt = createUpdateEmployeeDto.CreateAt,
            };
        }
    }
}