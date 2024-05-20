using System.Data;
using AspNetCore.Reporting;
using DotNetCoreInventoryDashboard.dtos.Department;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using DotNetCoreInventoryDashboard.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;


namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/department/")]
    public class DepartmentController(
        ILogger<DepartmentController> logger,
        models.DotNetCoreInventoryDashboardDB employeeContextDB,
        IDepartmentRepository departmentRepository,
        IConfiguration configuration,
        IWebHostEnvironment webHostEnvironment) : ControllerBase
    {
        private readonly ILogger<DepartmentController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _emoloyeeContextDB = employeeContextDB;
        private readonly IDepartmentRepository _departmentRepository = departmentRepository;
        private readonly IConfiguration _configuration = configuration;
        private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;

        [HttpGet("GetAll")]
        public JsonResult GetAllDepartment()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select *from dbo.Departments";
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
            var departments = await _departmentRepository.GetAllAsync();
            var departmentDto = departments.Select(d => d.ToDepartmentDto());

            return Ok(departmentDto);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var department = await _departmentRepository.GetByIdAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            return Ok(department.ToDepartmentDto());
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> CreateDepartment(
            [FromBody] CreateUpdateDepartmentDto createUpdateDepartmentDto)
        {
            // _Logger.LogInformation("body======"+createUpdateDepartmentDto);
            var departmentItem = createUpdateDepartmentDto.ToDepartmentCreateUpdateDto();
            // _Logger.LogInformation("hi======"+departmentItem);

            await _departmentRepository.CreateAsync(departmentItem);
            return CreatedAtAction(nameof(GetById), new { id = departmentItem.DepartmentId },
                departmentItem.ToDepartmentDto());
        }

        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateDepartment([FromRoute] int id,
            [FromBody] CreateUpdateDepartmentDto createUpdateDepartmentDto)
        {
            // _Logger.LogInformation("value of id= "+createUpdateDepartmentDto);

            var department = await _departmentRepository.UpdateAsync(id, createUpdateDepartmentDto);
            if (department == null)
            {
                return NotFound();
            }

            return Ok(department.ToDepartmentDto());
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteDepartmentItem([FromRoute] int id)
        {
            var department = await _departmentRepository.DeleteAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            return NoContent();
        }
        [HttpGet("list_of_department")]
        public async Task<FileContentResult> DownloadDepartmentReport()
        {
            string mimeType = "application/pdf";

            string reportPath = $"{_webHostEnvironment.ContentRootPath}\\Reports\\rpDepartment.rdlc";
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "SELECT [DepartmentId],[DepartmentName],[CreateAt]" +
                "FROM [DotNetCoreInventoryDashboardDB].[dbo].[Departments]";
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
            localReport.AddDataSource("dsDepartment", table);

            var res = localReport.Execute(RenderType.Pdf, 1, null, mimeType);

            return File(res.MainStream, mimeType);
        }
    }
}