using System.ComponentModel.DataAnnotations;

namespace DotNetCoreInventoryDashboard.dtos.SaleDetail
{
    public class SaleDetailDto
    {
        public int SaleDetailId { get; set; }
        public int Qty { get; set; }
        public int Rate { get; set; }
        public int AmountPerProduct { get; set; }
        public int? ProductId { get; set; }

        public int? SaleMasterId { get; set; }
    }
}
