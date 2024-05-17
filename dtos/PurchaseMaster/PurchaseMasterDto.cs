using DotNetCoreInventoryDashboard.dtos.PurchaseDetail;

namespace DotNetCoreInventoryDashboard.dtos.PurchaseMaster
{
    public class PurchaseMasterDto
    {
        public int PurchaseMasterId { get; set; }
        public int PurchaseAmount { get; set; }
        public int? SupplierId { get; set; }

        public DateTime CreateAt { get; set; }
        public List<PurchaseDetailDto>? PurchaseDetails { get; set; }
    }
}
