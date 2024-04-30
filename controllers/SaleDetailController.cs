using DotNetCoreInventoryDashboard.dtos.SaleDetail;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotNetCoreInventoryDashboard.controllers
{
    [ApiController]
    [Route("api/saleDetail/")]
    public class SaleDetailController(ILogger<SaleDetailController> logger,
        models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB,
        ISaleDetail saleDetailRepository,
        IConfiguration configuration) : ControllerBase
    {
        private readonly ILogger<SaleDetailController> _Logger = logger;
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        private readonly ISaleDetail _saleDetailRepository = saleDetailRepository;
        private readonly IConfiguration _configuration = configuration;

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
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteSaleDetailItem([FromRoute] int id)
        {
            var saleDetail = await _saleDetailRepository.DeleteAsync(id);
            if (saleDetail == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
