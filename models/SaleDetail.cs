using System.ComponentModel.DataAnnotations;

namespace DotNetCoreInventoryDashboard.models
{
    public class SaleDetail
    {
        [Key]
        public int SaleDetailId { get; set; }
        [Required]
        public int Qty { get; set; }
        [Required]
        public int Rate { get; set; }
        public int AmountPerProduct { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }

        public int? SaleMasterId { get; set; }
        public SaleMaster? SaleMaster { get; set; }
    }
}
