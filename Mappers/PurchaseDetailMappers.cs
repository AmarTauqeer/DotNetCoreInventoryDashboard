using DotNetCoreInventoryDashboard.dtos.PurchaseDetail;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class PurchaseDetailMappers
    {
        public static PurchaseDetailDto ToPurchaseDetailDto(this PurchaseDetail purchaseDetail)
        {
            return new PurchaseDetailDto
            {
                PurchaseDetailId=purchaseDetail.PurchaseDetailId,
                PurchaseMasterId = purchaseDetail.PurchaseMasterId,
                ProductId = purchaseDetail.ProductId,
                Qty = purchaseDetail.Qty,
                Rate = purchaseDetail.Rate,
                AmountPerProduct = purchaseDetail.AmountPerProduct,
            };

        }

        public static PurchaseDetail ToPurchaseDetailCreateUpdateDto(this CreateUpdatePurchaseDetailDto createUpdatePurchaseDetailDto, int purchaseMasterId)
        {
            return new PurchaseDetail
            {
                PurchaseMasterId = purchaseMasterId,
                ProductId = createUpdatePurchaseDetailDto.ProductId,
                Qty = createUpdatePurchaseDetailDto.Qty,
                Rate = createUpdatePurchaseDetailDto.Rate,
                AmountPerProduct = createUpdatePurchaseDetailDto.AmountPerProduct,
            };
        }
    }
}
