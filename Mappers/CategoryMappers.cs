using DotNetCoreInventoryDashboard.dtos.Category;
using DotNetCoreInventoryDashboard.models;
namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class CategoryMappers
    {
        public static CategoryDto ToCategoryDto(this Category category)
        {
            return new CategoryDto
            {
                CreateAt = category.CreateAt,
                CategoryId = category.CategoryId,
                Name = category.Name,
                Products = category.Products.Select(e => e.ToProductDto()).ToList()
            };

        }

        public static Category ToCategoryCreateUpdateDto(this CreateUpdateCategoryDto createUpdateCategoryDto)
        {
            return new Category
            {
                CreateAt = createUpdateCategoryDto.CreateAt,
                Name = createUpdateCategoryDto.Name,
            };
        }
    }
}
