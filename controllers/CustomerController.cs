
using AspNetCore.Reporting;
using DotNetCoreInventoryDashboard.dtos.Customer;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using DotNetCoreInventoryDashboard.models;
using DotNetCoreInventoryDashboard.repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
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
        IConfiguration configuration,
        IWebHostEnvironment webHostEnvironment) : ControllerBase
    {
        private readonly ILogger<CustomerController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly ICustomer _customerRepository = customerRepository;
        private readonly IConfiguration _configuration = configuration;
        private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;


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
        [HttpGet("list_of_customers")]
        public async Task<FileContentResult> DownloadReport()
        {
            //var byteRes = new byte[] { };
            //string path = _webHostEnvironment.ContentRootPath + "\\Reports\\rpProduct.rdlc";
            //byteRes = _productRepository.CreateReportFile(path);

            //return File(byteRes,
            //    System.Net.Mime.MediaTypeNames.Application.Octet,
            //    "ProductList.pdf");

            string format = "PDF";
            string extension = "pdf";
            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpCustomer.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT customers.Name, customers.Phone, customers.Email, customers.Address, customers.City, customers.Country " +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[Customers] as customers";
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

            var localReport = new LocalReport(reportPath);
            localReport.AddDataSource("dsCustomer", table);

            var res = localReport.Execute(RenderType.Pdf, 1, null, mimeType);

            return File(res.MainStream, mimeType);
        }
    }
}
