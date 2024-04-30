using System.ComponentModel.DataAnnotations;

namespace DotNetCoreInventoryDashboard.models
{
    public class PurchaseDetail
    {
        [Key]
        public int PurchaseDetailId { get; set; }

        [Required]
        public int Qty { get; set; }
        [Required]
        public int Rate { get; set; }
        public int AmountPerProduct { get; set; }


        
        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        
        public int? PurchaseMasterId { get; set; }
        public PurchaseMaster? PurchaseMaster { get; set; }
    }
}
