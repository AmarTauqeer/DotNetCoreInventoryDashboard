using AspNetCore.Reporting;
using DotNetCoreInventoryDashboard.dtos.Customer;
using DotNetCoreInventoryDashboard.dtos.Supplier;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using DotNetCoreInventoryDashboard.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/supplier/")]
    public class SupplierController(ILogger<SupplierController> logger,
       models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
       ISupplier supplierRepository,
       IConfiguration configuration,
       IWebHostEnvironment webHostEnvironment) : ControllerBase
    {
        private readonly ILogger<SupplierController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly ISupplier _supplierRepository = supplierRepository;
        private readonly IConfiguration _configuration = configuration;
        private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;


        [HttpGet("GetAll")]
        public JsonResult GetAllSupplier()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select *from dbo.Suppliers";
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
            var suppliers = await _supplierRepository.GetAllAsync();
            var supplierDto = suppliers.Select(d => d.ToSupplierDto());

            return Ok(supplierDto);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var supplier = await _supplierRepository.GetByIdAsync(id);

            if (supplier == null)
            {
                return NotFound();
            }

            return Ok(supplier.ToSupplierDto());
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> CreateSupplier(
            [FromBody] CreateUpdateSupplierDto createUpdateSupplierDto)
        {
            // _Logger.LogInformation("body======"+createUpdateDepartmentDto);
            var supplierItem = createUpdateSupplierDto.ToSupplierCreateUpdateDto();
            // _Logger.LogInformation("hi======"+departmentItem);

            await _supplierRepository.CreateAsync(supplierItem);
            return CreatedAtAction(nameof(GetById), new { id = supplierItem.SupplierId },
                supplierItem.ToSupplierDto());
        }

        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateSupplier([FromRoute] int id,
            [FromBody] CreateUpdateSupplierDto createUpdateSupplierDto)
        {
            // _Logger.LogInformation("value of id= "+createUpdateDepartmentDto);

            var supplier = await _supplierRepository.UpdateAsync(id, createUpdateSupplierDto);
            if (supplier == null)
            {
                return NotFound();
            }

            return Ok(supplier.ToSupplierDto());
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteSupplierItem([FromRoute] int id)
        {
            var supplier = await _supplierRepository.DeleteAsync(id);
            if (supplier == null)
            {
                return NotFound();
            }

            return NoContent();
        }
        [HttpGet("list_of_suppliers")]
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

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpSupplier.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT customers.Name, customers.Phone, customers.Email, customers.Address, customers.City, customers.Country " +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[Suppliers] as customers";
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
            localReport.AddDataSource("dsSupplier", table);

            var res = localReport.Execute(RenderType.Pdf, 1, null, mimeType);

            return File(res.MainStream, mimeType);
        }
    }
    }
