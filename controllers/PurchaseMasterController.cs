using DotNetCoreInventoryDashboard.dtos.PurchaseMaster;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/purchaseMaster/")]
    public class PurchaseMasterController(ILogger<PurchaseMasterController> logger,
         models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
         IPurchaseMaster purchaseMasterRepository,
         IConfiguration configuration) : ControllerBase
    {
        private readonly ILogger<PurchaseMasterController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly IPurchaseMaster _purchaseMasterRepository = purchaseMasterRepository;
        private readonly IConfiguration _configuration = configuration;


        [HttpGet("GetAll")]
        public JsonResult GetAllSaleMaster()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select *from dbo.PurchaseMasters";
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
            var purchaseMasters = await _purchaseMasterRepository.GetAllAsync();
            var purchaseMasterDto = purchaseMasters.Select(d => d.ToPurchaseMasterDto());

            return Ok(purchaseMasterDto);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var purchaseMaster = await _purchaseMasterRepository.GetByIdAsync(id);

            if (purchaseMaster == null)
            {
                return NotFound();
            }

            return Ok(purchaseMaster.ToPurchaseMasterDto());
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> CreatePurchaseMaster(
            [FromBody] CreateUpdatePurchaseMasterDto createUpdatePurchaseMasterDto)
        {
            // _Logger.LogInformation("body======"+createUpdateDepartmentDto);
            var purchaseMasterItem = createUpdatePurchaseMasterDto.ToPurchaseMasterCreateUpdateDto();
            // _Logger.LogInformation("hi======"+departmentItem);

            await _purchaseMasterRepository.CreateAsync(purchaseMasterItem);
            return CreatedAtAction(nameof(GetById), new { id = purchaseMasterItem.PurchaseMasterId },
                purchaseMasterItem.ToPurchaseMasterDto());
        }

        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdatePurchaseMaster([FromRoute] int id,
            [FromBody] CreateUpdatePurchaseMasterDto createUpdatePurchaseMasterDto)
        {
            // _Logger.LogInformation("value of id= "+createUpdateDepartmentDto);

            var purchaseMaster = await _purchaseMasterRepository.UpdateAsync(id, createUpdatePurchaseMasterDto);
            if (purchaseMaster == null)
            {
                return NotFound();
            }

            return Ok(purchaseMaster.ToPurchaseMasterDto());
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeletePurchaseMasterItem([FromRoute] int id)
        {
            var purchaseMaster = await _purchaseMasterRepository.DeleteAsync(id);
            if (purchaseMaster == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
