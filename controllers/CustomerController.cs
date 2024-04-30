
using DotNetCoreInventoryDashboard.dtos.Customer;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using DotNetCoreInventoryDashboard.repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;


namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/customer/")]
    public class CustomerController(ILogger<CustomerController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        ICustomer customerRepository,
        IConfiguration configuration) : ControllerBase
    {
        private readonly ILogger<CustomerController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly ICustomer _customerRepository = customerRepository;
        private readonly IConfiguration _configuration = configuration;


        [HttpGet("GetAll")]
        public JsonResult GetAllCustomer()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select *from dbo.Customers";
            DataTable table = new DataTable();

            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpGet, Authorize]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _customerRepository.GetAllAsync();
            var customerDto = customers.Select(d => d.ToCustomerDto());

            return Ok(customerDto);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer.ToCustomerDto());
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> CreateCustomer(
            [FromBody] CreateUpdateCustomerDto createUpdateCustomerDto)
        {
            // _Logger.LogInformation("body======"+createUpdateDepartmentDto);
            var customerItem = createUpdateCustomerDto.ToCustomerCreateUpdateDto();
            // _Logger.LogInformation("hi======"+departmentItem);

            await _customerRepository.CreateAsync(customerItem);
            return CreatedAtAction(nameof(GetById), new { id = customerItem.CustomerId },
                customerItem.ToCustomerDto());
        }

        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateCustomer([FromRoute] int id,
            [FromBody] CreateUpdateCustomerDto createUpdateCustomerDto)
        {
            // _Logger.LogInformation("value of id= "+createUpdateDepartmentDto);

            var customer = await _customerRepository.UpdateAsync(id, createUpdateCustomerDto);
            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer.ToCustomerDto());
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteCustomerItem([FromRoute] int id)
        {
            var customer = await _customerRepository.DeleteAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
