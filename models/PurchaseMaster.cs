using System.ComponentModel.DataAnnotations;

namespace DotNetCoreInventoryDashboard.models
{
    public class PurchaseMaster
    {
        [Key]
        public int PurchaseMasterId { get; set; }
        public int PurchaseAmount { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        public int? SupplierId { get; set; }
        public Supplier? Supplier { get; set; }

        public List<PurchaseDetail> PurchaseDetails { get; set; } = new List<PurchaseDetail>();
    }
}
