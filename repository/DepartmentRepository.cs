using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DotNetCoreInventoryDashboard.dtos.Department;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using DotNetCoreInventoryDashboard.Mappers;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class DepartmentRepository(models.DotNetCoreInventoryDashboardDB employeeContextDB) : IDepartmentRepository
    {
        private readonly models.DotNetCoreInventoryDashboardDB _employeeContextDB = employeeContextDB;

        public async Task<Department> CreateAsync(Department department)
        {
            await _employeeContextDB.Departments.AddAsync(department);
            await _employeeContextDB.SaveChangesAsync();
            return department;
        }

        public async Task<Department?> DeleteAsync(int id)
        {
            var department = await _employeeContextDB.Departments.FirstOrDefaultAsync(x => x.DepartmentId == id);
            if (department == null)
            {
                return null;
            }
            _employeeContextDB.Remove(department);
            await _employeeContextDB.SaveChangesAsync();
            return department;
        }

        public async Task<List<Department>> GetAllAsync()
        {
            return await _employeeContextDB.Departments.Include(d => d.Employees).ToListAsync();
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            return await _employeeContextDB.Departments.Include(d => d.Employees).FirstOrDefaultAsync(i => i.DepartmentId == id);
        }

        public async Task<Department?> UpdateAsync(int id, CreateUpdateDepartmentDto updateDepartmentDto)
        {
            var department = await _employeeContextDB.Departments.FirstOrDefaultAsync(x => x.DepartmentId == id);
            if (department == null)
            {
                return null;
            }
            department.DepartmentId = id;
            department.DepartmentName = updateDepartmentDto.DepartmentName;
            department.CreateAt = updateDepartmentDto.CreateAt;

            await _employeeContextDB.SaveChangesAsync();
            return department;
        }
    }
}