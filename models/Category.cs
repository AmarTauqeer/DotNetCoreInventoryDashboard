using System.ComponentModel.DataAnnotations;

namespace DotNetCoreInventoryDashboard.models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public int MyProperty { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
