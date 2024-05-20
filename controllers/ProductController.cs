using DotNetCoreInventoryDashboard.interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using DotNetCoreInventoryDashboard.dtos.Category;
using DotNetCoreInventoryDashboard.dtos.Product;
using DotNetCoreInventoryDashboard.Mappers;
using DotNetCoreInventoryDashboard.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using DotNetCoreInventoryDashboard.repository;
using AspNetCore.Reporting;
using DotNetCoreInventoryDashboard.HelperMethods;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/product/")]
    public class ProductController(ILogger<ProductController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        IProduct productRepository,
        IConfiguration configuration,
        IWebHostEnvironment webHostEnvironment) : ControllerBase
    {

        private readonly ILogger<ProductController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly IProduct _productRepository = productRepository;
        private readonly IConfiguration _configuration = configuration;
        private readonly IWebHostEnvironment _webHostEnvironment=webHostEnvironment;

        [HttpGet, Authorize]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productRepository.GetAllAsync();
            var productDto = products.Select(d => d.ToProductDto());

            return Ok(productDto);

        }
        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product.ToProductDto());
        }
        [HttpPost("{categoryId}"), Authorize]
        public async Task<IActionResult> CreateProduct([FromRoute] int categoryId, [FromBody] CreateUpdateProductDto createUpdateProductDto)
        {

            var product = createUpdateProductDto.ToProductCreateUpdateDto(categoryId);

            await _productRepository.CreateAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.ProductId }, product.ToProductDto());
        }
        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] CreateUpdateProductDto createUpdateProductDto)
        {

            var product = await _productRepository.UpdateAsync(id, createUpdateProductDto);
            if (product == null)
            {
                return NotFound();

            }
            return Ok(product.ToProductDto());

        }
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteProductItem([FromRoute] int id)
        {
            var product = await _productRepository.DeleteAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("list_of_product")]
        public async Task<FileContentResult> DownloadProductReport()
        {
            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpProduct.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT products.ProductId, products.Name,products.Description,products.PurchaseRate ,products.SaleRate ,products.CreateAt," +
                "categories.Name as category  FROM [DotNetCoreInventoryDashboardDB].[dbo].[Products] as products," +
                "[DotNetCoreInventoryDashboardDB].[dbo].[Categories] as categories where products.CategoryId = categories.CategoryId";
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
            localReport.AddDataSource("dsProduct", table);

            var res = localReport.Execute(RenderType.Pdf, 1, null, mimeType);

            return File(res.MainStream, mimeType);
        }

    }
}
