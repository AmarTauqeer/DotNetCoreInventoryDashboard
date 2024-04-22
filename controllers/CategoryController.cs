﻿using Microsoft.AspNetCore.Mvc;
using System.Data;
using DotNetCoreInventoryDashboard.dtos.Category;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using DotNetCoreInventoryDashboard.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using DotNetCoreInventoryDashboard.repository;


namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/category/")]
    public class CategoryController(ILogger<CategoryController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        ICategory categoryRepository,
        IConfiguration configuration) : ControllerBase
    {
        private readonly ILogger<CategoryController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly ICategory _categoryRepository = categoryRepository;
        private readonly IConfiguration _configuration = configuration;


        [HttpGet("GetAll")]
        public JsonResult GetAllCategory()
        {
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            string query = "select *from dbo.Categories";
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
            var categories = await _categoryRepository.GetAllAsync();
            var categoryDto = categories.Select(d => d.ToCategoryDto());

            return Ok(categoryDto);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category.ToCategoryDto());
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> CreateCategory(
            [FromBody] CreateUpdateCategoryDto createUpdateCategoryDto)
        {
            // _Logger.LogInformation("body======"+createUpdateDepartmentDto);
            var categoryItem = createUpdateCategoryDto.ToCategoryCreateUpdateDto();
            // _Logger.LogInformation("hi======"+departmentItem);

            await _categoryRepository.CreateAsync(categoryItem);
            return CreatedAtAction(nameof(GetById), new { id = categoryItem.CategoryId },
                categoryItem.ToCategoryDto());
        }

        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> UpdateCategory([FromRoute] int id,
            [FromBody] CreateUpdateCategoryDto createUpdateCategoryDto)
        {
            // _Logger.LogInformation("value of id= "+createUpdateDepartmentDto);

            var category = await _categoryRepository.UpdateAsync(id, createUpdateCategoryDto);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category.ToCategoryDto());
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteCategoryItem([FromRoute] int id)
        {
            var category = await _categoryRepository.DeleteAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}