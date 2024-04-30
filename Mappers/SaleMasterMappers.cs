using DotNetCoreInventoryDashboard.dtos.SaleMaster;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class SaleMasterMappers
    {
        public static SaleMasterDto ToSaleMasterDto(this SaleMaster saleMaster)
        {
            return new SaleMasterDto
            {
                CreateAt = saleMaster.CreateAt,
                SaleMasterId = saleMaster.SaleMasterId,
                SaleAmount = saleMaster.SaleAmount,
                CustomerId=saleMaster.CustomerId,
                SaleDetails = saleMaster.SaleDetails.Select(e => e.ToSaleDetailDto()).ToList()
            };

        }

        public static SaleMaster ToSaleMasterCreateUpdateDto(this CreateUpdateSaleMasterDto createUpdateSaleMasterDto)
        {
            return new SaleMaster
            {
                CreateAt = createUpdateSaleMasterDto.CreateAt,
                SaleAmount = createUpdateSaleMasterDto.SaleAmount,
                CustomerId = createUpdateSaleMasterDto.CustomerId,
            };
        }
    }
}
