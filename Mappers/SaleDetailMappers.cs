using DotNetCoreInventoryDashboard.dtos.SaleDetail;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class SaleDetailMappers
    {
        public static SaleDetailDto ToSaleDetailDto(this SaleDetail saleDetail)
        {
            return new SaleDetailDto
            {

                SaleMasterId = saleDetail.SaleMasterId,
                ProductId= saleDetail.ProductId,
                Qty = saleDetail.Qty,
                Rate = saleDetail.Rate,
                AmountPerProduct = saleDetail.AmountPerProduct,
            };

        }

        public static SaleDetail ToSaleDetailCreateUpdateDto(this CreateUpdateSaleDetailDto createUpdateSaleDetailDto, int saleMasterId)
        {
            return new SaleDetail
            {
                SaleMasterId = saleMasterId,
                ProductId = createUpdateSaleDetailDto.ProductId,
                Qty = createUpdateSaleDetailDto.Qty,
                Rate = createUpdateSaleDetailDto.Rate,
                AmountPerProduct = createUpdateSaleDetailDto.AmountPerProduct,
            };
        }
    }
}
