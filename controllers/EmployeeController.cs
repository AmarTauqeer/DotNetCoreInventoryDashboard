using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DotNetCoreInventoryDashboard.dtos.Employee;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using DotNetCoreInventoryDashboard.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController(IEmployeeRepository employeeRepository) : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository = employeeRepository;

        [HttpGet, Authorize]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeRepository.GetAllAsync();
            var employeeDto = employees.Select(d => d.ToEmployeeDto());

            return Ok(employeeDto);

        }

        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee.ToEmployeeDto());
        }
        [HttpPost("{deptId}"), Authorize]
        public async Task<IActionResult> CreateEmployee([FromRoute] int deptId, [FromBody] CreateUpdateEmployeeDto createUpdateEmployeeDto)
        {

            var employee = createUpdateEmployeeDto.ToEmployeeCreateUpdateDto(deptId);

            await _employeeRepository.CreateAsync(employee);
            return CreatedAtAction(nameof(GetById), new { id = employee.EmployeeId }, employee.ToEmployeeDto());
        }
        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateEmployee([FromRoute] int id, [FromBody] CreateUpdateEmployeeDto createUpdateEmployeeDto)
        {

            var employee = await _employeeRepository.UpdateAsync(id, createUpdateEmployeeDto);
            if (employee == null)
            {
                return NotFound();

            }
            return Ok(employee.ToEmployeeDto());

        }
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteEmployeeItem([FromRoute] int id)
        {
            var employee = await _employeeRepository.DeleteAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}