using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using DotNetCoreInventoryDashboard.repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Data;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/stock/")]
    public class StockController(ILogger<StockController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        IConfiguration configuration) : ControllerBase
    {
        private readonly ILogger<StockController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly IConfiguration _configuration = configuration;

        [HttpGet("GetAll")]
        public JsonResult GetStock()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select  productId ,productName , (SUM(purchaseQty)-SUM(saleQty)) as stockQty \r\nfrom Stock group by productId, productName order by productName";
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
        [HttpGet("lastSalePurchase")]
        public JsonResult GetLastSalePurchase()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select  id, date, name, amount, type\r\nfrom\r\n(select purchaseId as id, purchaseDate as date, supplierName as name, purchaseAmount as amount, type\r\n\tfrom SalePurchaseDetailView\r\n\twhere type='purchase'\r\n\tunion\r\n\tselect saleId as id, saleDate as date, customerName as name, saleAmount as amount, type\r\n\tfrom SalePurchaseDetailView\r\n\twhere type='sale'\r\n) alias\r\n";
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

        [HttpGet("monthWiseTotalSale")]
        public JsonResult GetMonthWiseTotalSale()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select  month(date) as months,sum(amount) as totalAmount\r\nfrom\r\n(select purchaseId as id, purchaseDate as date, supplierName as name, purchaseAmount as amount, type\r\n\tfrom SalePurchaseDetailView\r\n\twhere type='purchase'\r\n\tunion\r\n\tselect saleId as id, saleDate as date, customerName as name, saleAmount as amount, type\r\n\tfrom SalePurchaseDetailView\r\n\twhere type='sale'\r\n) alias\r\nwhere type='sale'\r\ngroup by date\r\norder by date;";
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
        [HttpGet("monthWiseTotalPurchase")]
        public JsonResult GetMonthWiseTotalPurchase()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select  month(date) as months,sum(amount) as totalAmount\r\nfrom\r\n(select purchaseId as id, purchaseDate as date, supplierName as name, purchaseAmount as amount, type\r\n\tfrom SalePurchaseDetailView\r\n\twhere type='purchase'\r\n\tunion\r\n\tselect saleId as id, saleDate as date, customerName as name, saleAmount as amount, type\r\n\tfrom SalePurchaseDetailView\r\n\twhere type='sale'\r\n) alias\r\nwhere type='purchase'\r\ngroup by date\r\norder by date;";
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
    }
}
