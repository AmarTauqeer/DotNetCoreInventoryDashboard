using DotNetCoreInventoryDashboard.interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using DotNetCoreInventoryDashboard.dtos.SaleDetail;
using DotNetCoreInventoryDashboard.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using AspNetCore.Reporting;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/saleDetail/")]
    public class SaleDetailController(ILogger<SaleDetailController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        ISaleDetail saleDetailRepository,
        IConfiguration configuration,
       IWebHostEnvironment webHostEnvironment) : ControllerBase
    {
        private readonly ILogger<SaleDetailController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly ISaleDetail _saleDetailRepository = saleDetailRepository;
        private readonly IConfiguration _configuration = configuration;
        private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;

        [HttpGet, Authorize]
        public async Task<IActionResult> GetAll()
        {
            var saleDetail = await _saleDetailRepository.GetAllAsync();
            var saleDetailDto = saleDetail.Select(d => d.ToSaleDetailDto());

            return Ok(saleDetailDto);

        }
        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var saleDetail = await _saleDetailRepository.GetByIdAsync(id);

            if (saleDetail == null)
            {
                return NotFound();
            }

            return Ok(saleDetail.ToSaleDetailDto());
        }
        [HttpPost("{saleMasterId}"), Authorize]
        public async Task<IActionResult> CreateSaleDetail([FromRoute] int saleMasterId, [FromBody] CreateUpdateSaleDetailDto createUpdateSaleDetailDto)
        {

            var saleDetail = createUpdateSaleDetailDto.ToSaleDetailCreateUpdateDto(saleMasterId);

            await _saleDetailRepository.CreateAsync(saleDetail);
            return CreatedAtAction(nameof(GetById), new { id = saleDetail.SaleMasterId }, saleDetail.ToSaleDetailDto());
        }
        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateSaleDetail([FromRoute] int id, [FromBody] CreateUpdateSaleDetailDto createUpdateSaleDetailDto)
        {

            var saleDetail = await _saleDetailRepository.UpdateAsync(id, createUpdateSaleDetailDto);
            if (saleDetail == null)
            {
                return NotFound();

            }
            return Ok(saleDetail.ToSaleDetailDto());

        }
        [HttpDelete("{saleMasterId}"), Authorize]
        public async Task<IActionResult> DeleteSaleDetailItem([FromRoute] int saleMasterId)
        {
            var saleDetail = await _saleDetailRepository.DeleteAsync(saleMasterId);
            if (saleDetail == null)
            {
                return NotFound();
            }

            return NoContent();
        }
        [HttpGet("sale_details/{sdate}/{edate}")]
        public async Task<FileContentResult> DownloadReport([FromRoute] DateTime sdate, DateTime edate)
        {
            //var byteRes = new byte[] { };
            //string path = _webHostEnvironment.ContentRootPath + "\\Reports\\rpProduct.rdlc";
            //byteRes = _productRepository.CreateReportFile(path);

            //return File(byteRes,
            //    System.Net.Mime.MediaTypeNames.Application.Octet,
            //    "ProductList.pdf");

            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpSaleDetail.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT [date],[amount],[customerName],[qty],[rate],[amountPerProduct],[productName],[categoryName],[id]" +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[SaleDetailView] where date between @sdate and @edate";
            DataTable table = new DataTable();

            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.Clear();
                    myCommand.Parameters.AddWithValue("@sdate", sdate);
                    myCommand.Parameters.AddWithValue("@edate", edate);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }

            var localReport = new LocalReport(reportPath);
            localReport.AddDataSource("dsSaleDetail", table);
            Dictionary<string,string> parameters= new Dictionary<string,string>();
            parameters.Add("sdate", sdate.ToString("dd/MM/yyyy"));
            parameters.Add("edate", edate.ToString("dd/MM/yyyy"));

            var res = localReport.Execute(RenderType.Pdf, 1, parameters, mimeType);

            return File(res.MainStream, mimeType);
        }
        [HttpGet("sale_details_customer/{sdate}/{edate}/{customerName}")]
        public async Task<FileContentResult> DownloadReportCustomer([FromRoute] DateTime sdate, DateTime edate, string customerName)
        {

            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpSaleDetailCustomer.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT [date],[amount],[customerName],[qty],[rate],[amountPerProduct],[productName],[categoryName],[id]" +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[SaleDetailView] where customerName=@customerName and date between @sdate and @edate";
            DataTable table = new DataTable();

            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.Clear();
                    myCommand.Parameters.AddWithValue("@sdate", sdate);
                    myCommand.Parameters.AddWithValue("@edate", edate);
                    myCommand.Parameters.AddWithValue("@customerName", customerName);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }

            var localReport = new LocalReport(reportPath);
            localReport.AddDataSource("dsSaleDetailCustomer", table);
            Dictionary<string, string> parametersCustomer = new Dictionary<string, string>();
            parametersCustomer.Add("sdate", sdate.ToString("dd/MM/yyyy"));
            parametersCustomer.Add("edate", edate.ToString("dd/MM/yyyy"));
            parametersCustomer.Add("custName", customerName);

            var resCustomer = localReport.Execute(RenderType.Pdf, 1, parametersCustomer, mimeType);

            return File(resCustomer.MainStream, mimeType);
        }
        [HttpGet("sale_details_product/{sdate}/{edate}/{productName}")]
        public async Task<FileContentResult> DownloadReportProduct([FromRoute] DateTime sdate, DateTime edate, string productName)
        {

            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpSaleDetailProduct.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT [date],[amount],[customerName],[qty],[rate],[amountPerProduct],[productName],[categoryName],[id]" +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[SaleDetailView] where productName=@productName and date between @sdate and @edate";
            DataTable table = new DataTable();

            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.Clear();
                    myCommand.Parameters.AddWithValue("@sdate", sdate);
                    myCommand.Parameters.AddWithValue("@edate", edate);
                    myCommand.Parameters.AddWithValue("@productName", productName);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }

            var localReport = new LocalReport(reportPath);
            localReport.AddDataSource("dsSaleDetailProduct", table);
            Dictionary<string, string> parametersProduct = new Dictionary<string, string>();
            parametersProduct.Add("sdate", sdate.ToString("dd/MM/yyyy"));
            parametersProduct.Add("edate", edate.ToString("dd/MM/yyyy"));
            parametersProduct.Add("prodName", productName);

            var resProduct = localReport.Execute(RenderType.Pdf, 1, parametersProduct, mimeType);

            return File(resProduct.MainStream, mimeType);
        }
    }
}
