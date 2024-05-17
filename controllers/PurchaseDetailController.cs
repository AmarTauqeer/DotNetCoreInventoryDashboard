using DotNetCoreInventoryDashboard.interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using DotNetCoreInventoryDashboard.dtos.PurchaseDetail;
using DotNetCoreInventoryDashboard.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using AspNetCore.Reporting;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/purchaseDetail/")]
    public class PurchaseDetailController(ILogger<PurchaseDetailController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        IPurchaseDetail purchaseDetailRepository,
        IConfiguration configuration,
        IWebHostEnvironment webHostEnvironment) : ControllerBase
    {
        private readonly ILogger<PurchaseDetailController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly IPurchaseDetail _purchaseDetailRepository = purchaseDetailRepository;
        private readonly IConfiguration _configuration = configuration;
        private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;

        [HttpGet, Authorize]
        public async Task<IActionResult> GetAll()
        {
            var purchaseDetail = await _purchaseDetailRepository.GetAllAsync();
            var purchaseDetailDto = purchaseDetail.Select(d => d.ToPurchaseDetailDto());

            return Ok(purchaseDetailDto);

        }
        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var purchaseDetail = await _purchaseDetailRepository.GetByIdAsync(id);

            if (purchaseDetail == null)
            {
                return NotFound();
            }

            return Ok(purchaseDetail.ToPurchaseDetailDto());
        }
        [HttpPost("{purchaseMasterId}"), Authorize]
        public async Task<IActionResult> CreatePurchaseDetail([FromRoute] int purchaseMasterId, [FromBody] CreateUpdatePurchaseDetailDto createUpdatePurchaseDetailDto)
        {

            var purchaseDetail = createUpdatePurchaseDetailDto.ToPurchaseDetailCreateUpdateDto(purchaseMasterId);

            await _purchaseDetailRepository.CreateAsync(purchaseDetail);
            return CreatedAtAction(nameof(GetById), new { id = purchaseDetail.PurchaseMasterId }, purchaseDetail.ToPurchaseDetailDto());
        }
        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdatePurchaseDetail([FromRoute] int id, [FromBody] CreateUpdatePurchaseDetailDto createUpdatePurchaseDetailDto)
        {

            var purchaseDetail = await _purchaseDetailRepository.UpdateAsync(id, createUpdatePurchaseDetailDto);
            if (purchaseDetail == null)
            {
                return NotFound();

            }
            return Ok(purchaseDetail.ToPurchaseDetailDto());

        }
        [HttpDelete("{purchaseMasterId}"), Authorize]
        public async Task<IActionResult> DeletePurchaseDetailItem([FromRoute] int purchaseMasterId)
        {
            var saleDetail = await _purchaseDetailRepository.DeleteAsync(purchaseMasterId);
            if (saleDetail == null)
            {
                return NotFound();
            }

            return NoContent();
        }
        [HttpGet("purchase_details/{sdate}/{edate}")]
        public async Task<FileContentResult> DownloadPurchaseDetailReport([FromRoute] DateTime sdate, DateTime edate)
        {

            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpPurchaseDetail.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT [date],[amount],[supplierName],[qty],[rate],[amountPerProduct],[productName],[categoryName],[id]" +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[PurchaseDetailView] where date between @sdate and @edate";
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
            localReport.AddDataSource("dsPurchaseDetail", table);
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("sdate", sdate.ToString("dd/MM/yyyy"));
            parameters.Add("edate", edate.ToString("dd/MM/yyyy"));

            var res = localReport.Execute(RenderType.Pdf, 1, parameters, mimeType);

            return File(res.MainStream, mimeType);
        }
        [HttpGet("purchase_details_supplier/{sdate}/{edate}/{supplierName}")]
        public async Task<FileContentResult> DownloadReportSupplier([FromRoute] DateTime sdate, DateTime edate, string supplierName)
        {
            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpPurchaseDetailSupplier.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT [date],[amount],[supplierName],[qty],[rate],[amountPerProduct],[productName],[categoryName],[id]" +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[PurchaseDetailView] where supplierName=@supplierName and date between @sdate and @edate";
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
                    myCommand.Parameters.AddWithValue("@supplierName", supplierName);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }

            var localReport = new LocalReport(reportPath);
            localReport.AddDataSource("dsPurchaseDetailSupplier", table);
            Dictionary<string, string> parametersCustomer = new Dictionary<string, string>();
            parametersCustomer.Add("sdate", sdate.ToString("dd/MM/yyyy"));
            parametersCustomer.Add("edate", edate.ToString("dd/MM/yyyy"));
            parametersCustomer.Add("suppName", supplierName);

            var res = localReport.Execute(RenderType.Pdf, 1, parametersCustomer, mimeType);

            return File(res.MainStream, mimeType);
        }
        [HttpGet("purchase_details_product/{sdate}/{edate}/{productName}")]
        public async Task<FileContentResult> DownloadReportProduct([FromRoute] DateTime sdate, DateTime edate, string productName)
        {
            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpPurchaseDetailProduct.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT [date],[amount],[supplierName],[qty],[rate],[amountPerProduct],[productName],[categoryName],[id]" +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[PurchaseDetailView] where productName=@productName and date between @sdate and @edate";
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
            localReport.AddDataSource("dsPurchaseDetailProduct", table);
            Dictionary<string, string> parametersProduct = new Dictionary<string, string>();
            parametersProduct.Add("sdate", sdate.ToString("dd/MM/yyyy"));
            parametersProduct.Add("edate", edate.ToString("dd/MM/yyyy"));
            parametersProduct.Add("prodName", productName);

            var resProduct = localReport.Execute(RenderType.Pdf, 1, parametersProduct, mimeType);

            return File(resProduct.MainStream, mimeType);
        }
    }
}
