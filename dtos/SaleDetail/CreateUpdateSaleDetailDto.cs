namespace DotNetCoreInventoryDashboard.dtos.SaleDetail
{
    public class CreateUpdateSaleDetailDto
    {
        
        public int Qty { get; set; }
        public int Rate { get; set; }
        public int AmountPerProduct { get; set; }

        public int? ProductId { get; set; }
        public int? SaleMasterId { get; set; }
    }
}
