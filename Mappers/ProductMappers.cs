using DotNetCoreInventoryDashboard.models;
using DotNetCoreInventoryDashboard.dtos.Product;
namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class ProductMappers
    {
        public static ProductDto ToProductDto(this Product product)
        {
            return new ProductDto
            {
                CreateAt = product.CreateAt,
                ProductId = product.ProductId,
                Name = product.Name,
                CategoryId= product.CategoryId,
                PurchaseRate = product.PurchaseRate,
                SaleRate = product.SaleRate,
                ImagePath = product.ImagePath,
                Description = product.Description,
            };

        }

        public static Product ToProductCreateUpdateDto(this CreateUpdateProductDto createUpdateProductDto, int categoryId)
        {
            return new Product
            {
                CreateAt = createUpdateProductDto.CreateAt,
                Name = createUpdateProductDto.Name,
                CategoryId= categoryId,
                PurchaseRate=createUpdateProductDto.PurchaseRate,
                SaleRate=createUpdateProductDto.SaleRate,
                ImagePath=createUpdateProductDto.ImagePath,
                Description = createUpdateProductDto.Description,
            };
        }
    }
}
