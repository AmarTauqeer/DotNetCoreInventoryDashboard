using System.ComponentModel.DataAnnotations;

namespace DotNetCoreInventoryDashboard.models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        public int PurchaseRate { get; set; }
        public int SaleRate { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; } = DateTime.Now;

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
