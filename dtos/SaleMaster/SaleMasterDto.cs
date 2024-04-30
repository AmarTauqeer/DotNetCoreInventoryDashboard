using DotNetCoreInventoryDashboard.dtos.SaleDetail;
namespace DotNetCoreInventoryDashboard.dtos.SaleMaster
{
    public class SaleMasterDto
    {
        public int SaleMasterId { get; set; }
        public int SaleAmount { get; set; }
        public int? CustomerId { get; set; }

        public DateTime CreateAt { get; set; }
        public List<SaleDetailDto>? SaleDetails { get; set; }
    }
}
