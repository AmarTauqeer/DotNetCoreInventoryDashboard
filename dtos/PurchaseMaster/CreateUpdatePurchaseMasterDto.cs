namespace DotNetCoreInventoryDashboard.dtos.PurchaseMaster
{
    public class CreateUpdatePurchaseMasterDto
    {
        public int PurchaseAmount { get; set; }
        public int? SupplierId { get; set; }

        public DateTime CreateAt { get; set; }
    }
}
