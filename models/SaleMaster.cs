using System.ComponentModel.DataAnnotations;

namespace DotNetCoreInventoryDashboard.models
{
    public class SaleMaster
    {
        [Key]
        public int SaleMasterId { get; set; }
        public int SaleAmount { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }
    }
}
