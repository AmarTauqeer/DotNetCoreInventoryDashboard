using DotNetCoreInventoryDashboard.dtos.Product;

namespace DotNetCoreInventoryDashboard.dtos.Category
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }

        public string Name { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; }
        public List<ProductDto>? Products { get; set; }
    }
}
