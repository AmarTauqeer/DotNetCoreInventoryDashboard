namespace DotNetCoreInventoryDashboard.dtos.PurchaseDetail
{
    public class CreateUpdatePurchaseDetailDto
    {
        public int Qty { get; set; }
        public int Rate { get; set; }
        public int AmountPerProduct { get; set; }

        public int? ProductId { get; set; }
        public int? PurchaseMasterId { get; set; }
    }
}
