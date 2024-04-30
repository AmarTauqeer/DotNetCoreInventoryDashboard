using DotNetCoreInventoryDashboard.dtos.SaleMaster;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/saleMaster/")]
    public class SaleMasterController(ILogger<SaleMasterController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        ISaleMaster saleMasterRepository,
        IConfiguration configuration) : ControllerBase
    {
        private readonly ILogger<SaleMasterController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly ISaleMaster _saleMasterRepository = saleMasterRepository;
        private readonly IConfiguration _configuration = configuration;


        [HttpGet("GetAll")]
        public JsonResult GetAllSaleMaster()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select *from dbo.SaleMasters";
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
            var saleMasters = await _saleMasterRepository.GetAllAsync();
            var saleMasterDto = saleMasters.Select(d => d.ToSaleMasterDto());

            return Ok(saleMasterDto);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var saleMaster = await _saleMasterRepository.GetByIdAsync(id);

            if (saleMaster == null)
            {
                return NotFound();
            }

            return Ok(saleMaster.ToSaleMasterDto());
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> CreateSaleMaster(
            [FromBody] CreateUpdateSaleMasterDto createUpdateSaleMasterDto)
        {
            // _Logger.LogInformation("body======"+createUpdateDepartmentDto);
            var saleMasterItem = createUpdateSaleMasterDto.ToSaleMasterCreateUpdateDto();
            // _Logger.LogInformation("hi======"+departmentItem);

            await _saleMasterRepository.CreateAsync(saleMasterItem);
            return CreatedAtAction(nameof(GetById), new { id = saleMasterItem.SaleMasterId },
                saleMasterItem.ToSaleMasterDto());
        }

        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateSaleMaster([FromRoute] int id,
            [FromBody] CreateUpdateSaleMasterDto createUpdateSaleMasterDto)
        {
            // _Logger.LogInformation("value of id= "+createUpdateDepartmentDto);

            var saleMaster = await _saleMasterRepository.UpdateAsync(id, createUpdateSaleMasterDto);
            if (saleMaster == null)
            {
                return NotFound();
            }

            return Ok(saleMaster.ToSaleMasterDto());
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteSaleMasterItem([FromRoute] int id)
        {
            var saleMaster = await _saleMasterRepository.DeleteAsync(id);
            if (saleMaster == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
