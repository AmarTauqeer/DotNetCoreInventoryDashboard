using DotNetCoreInventoryDashboard.dtos.PurchaseMaster;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class PurchaseMasterMappers
    {
        public static PurchaseMasterDto ToPurchaseMasterDto(this PurchaseMaster purchaseMaster)
        {
            return new PurchaseMasterDto
            {
                CreateAt = purchaseMaster.CreateAt,
                PurchaseMasterId = purchaseMaster.PurchaseMasterId,
                PurchaseAmount = purchaseMaster.PurchaseAmount,
                SupplierId = purchaseMaster.SupplierId,
                PurchaseDetails = purchaseMaster.PurchaseDetails.Select(e => e.ToPurchaseDetailDto()).ToList()
            };

        }

        public static PurchaseMaster ToPurchaseMasterCreateUpdateDto(this CreateUpdatePurchaseMasterDto createUpdatePurchaseMasterDto)
        {
            return new PurchaseMaster
            {
                CreateAt = createUpdatePurchaseMasterDto.CreateAt,
                PurchaseAmount = createUpdatePurchaseMasterDto.PurchaseAmount,
                SupplierId = createUpdatePurchaseMasterDto.SupplierId,
            };
        }
    }
}
